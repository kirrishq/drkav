'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const BLOG_CATEGORY_UID = 'api::blog-category.blog-category';
const BLOG_ARTICLE_UID = 'api::blog-article.blog-article';
const OPERATION_UID = 'api::operation.operation';

async function upsert(strapi, uid, field, data) {
  const existing = await strapi.documents(uid).findFirst({ filters: { [field]: data[field] }, status: 'draft' });
  const result = existing
    ? await strapi.documents(uid).update({ documentId: existing.documentId, data, status: 'draft' })
    : await strapi.documents(uid).create({ data, status: 'draft' });

  await strapi.documents(uid).publish({ documentId: result.documentId });
  return result;
}

async function run() {
  const { blogArticles, blogCategories } = await import('../seed/v1/blog.mjs');
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    const categoryIds = new Map();
    for (const category of blogCategories) {
      const result = await upsert(strapi, BLOG_CATEGORY_UID, 'key', category);
      categoryIds.set(category.key, result.documentId);
    }

    const articleIds = new Map();
    for (const { categoryKeys, relatedArticleSlugs, relatedOperationPaths, ...article } of blogArticles) {
      void relatedArticleSlugs;
      void relatedOperationPaths;
      const categories = categoryKeys.map((key) => categoryIds.get(key));
      if (categories.some((documentId) => !documentId)) throw new Error('Blog seed category is missing.');
      const result = await upsert(strapi, BLOG_ARTICLE_UID, 'slug', { ...article, categories: { set: categories } });
      articleIds.set(article.slug, result.documentId);
    }

    for (const article of blogArticles) {
      const documentId = articleIds.get(article.slug);
      const relatedArticles = article.relatedArticleSlugs.map((slug) => articleIds.get(slug));
      const operations = await Promise.all(article.relatedOperationPaths.map((canonicalPath) => strapi.documents(OPERATION_UID).findFirst({ filters: { canonicalPath }, status: 'draft' })));
      if (!documentId || relatedArticles.some((relatedId) => !relatedId) || operations.some((operation) => !operation)) throw new Error('Blog seed relation is missing.');
      await strapi.documents(BLOG_ARTICLE_UID).update({ documentId, data: { relatedArticles: { set: relatedArticles }, relatedOperations: { set: operations.map((operation) => operation.documentId) } }, status: 'draft' });
      await strapi.documents(BLOG_ARTICLE_UID).publish({ documentId });
    }

    strapi.log.info(`Blog seed complete: ${blogArticles.length} articles, ${blogCategories.length} categories.`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
