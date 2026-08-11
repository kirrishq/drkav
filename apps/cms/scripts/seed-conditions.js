'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const { compileStrapi, createStrapi } = require('@strapi/strapi');
const UID = 'api::condition-article.condition-article';
const sourceUrl = 'https://drkav.ru/pacientam/pro-bolezni.html';

function decode(value) { return value.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#(?:x[\da-f]+|\d+);/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function paragraph(text) { return { type: 'paragraph', children: [{ type: 'text', text }] }; }
function heading(text) { return { type: 'heading', level: 2, children: [{ type: 'text', text }] }; }

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decode(match[2]) : '';
}

function limitSeoText(value, limit) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}…`;
}

function getOriginalSeo(html, fallbackTitle, fallbackDescription) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find((match) => getAttribute(match[0], 'name').toLowerCase() === 'description');
  return {
    metaTitle: limitSeoText(titleMatch ? decode(titleMatch[1]) : fallbackTitle, 160),
    metaDescription: descriptionTag ? getAttribute(descriptionTag[0], 'content') : fallbackDescription,
  };
}

function getArticleContent(html) {
  const start = html.search(/<div[^>]+class="[^"]*content-left_blog[^"]*"/i);
  if (start < 0) return html;

  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let match;

  while ((match = tags.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return html.slice(start, tags.lastIndex);
  }

  return html.slice(start);
}

function extractBlocks(html) {
  const fragment = getArticleContent(html);
  const matches = [...fragment.matchAll(/<(h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)];
  const ignored = new Set(['читать', 'записаться на консультацию', 'консультация', 'отзывы пациентов']);
  const seen = new Set();
  return matches.map((match) => ({ tag: match[1].toLowerCase(), text: decode(match[2]) })).filter(({ text }) => text.length > 30 && !ignored.has(text.toLowerCase()) && !seen.has(text) && seen.add(text)).map(({ tag, text }) => tag.startsWith('h') ? heading(text) : paragraph(text));
}

async function run() {
  const listingResponse = await fetch(sourceUrl);
  if (!listingResponse.ok) throw new Error(`Unable to load conditions index: ${listingResponse.status}`);
  const listingHtml = await listingResponse.text();
  const entries = [...listingHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<a href="([^"]+)/g)].map((match, sortOrder) => ({ title: decode(match[1]), source: new URL(match[2], sourceUrl).toString(), sortOrder }));
  if (entries.length === 0) throw new Error('No condition articles found on the source page.');
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  try {
    for (const entry of entries) {
      const slug = new URL(entry.source).pathname.split('/').pop().replace(/\.html$/, '');
      const existing = await strapi.documents(UID).findFirst({ filters: { slug }, status: 'published' });
      const articleResponse = await fetch(entry.source);
      if (!articleResponse.ok) throw new Error(`Unable to load ${entry.source}: ${articleResponse.status}`);
      const html = await articleResponse.text();
      const blocks = extractBlocks(html);
      const content = blocks.length > 0 ? blocks : [paragraph('Материал перенесён с исходного сайта.')];
      const excerpt = content.find((block) => block.type === 'paragraph')?.children[0].text ?? entry.title;
      const fallbackDescription = `${excerpt} Подробная информация для пациентов.`.slice(0, 190);
      const seo = getOriginalSeo(html, entry.title, fallbackDescription);
      const data = { title: entry.title, slug, canonicalPath: `/pacientam/pro-bolezni/${slug}`, excerpt, readingTimeMinutes: Math.max(1, Math.ceil(content.map((block) => block.children[0].text).join(' ').split(/\s+/).length / 180)), sortOrder: entry.sortOrder, isFeatured: false, contentSections: [{ __component: 'blog.rich-text-section', sectionKey: 'content', body: content }], seo: { ...seo, canonicalPath: `/pacientam/pro-bolezni/${slug}`, noIndex: false } };
      const result = existing ? await strapi.documents(UID).update({ documentId: existing.documentId, data, status: 'draft' }) : await strapi.documents(UID).create({ data, status: 'draft' });
      await strapi.documents(UID).publish({ documentId: result.documentId });
    }
    strapi.log.info(`Conditions seed complete: ${entries.length} articles.`);
  } finally { await strapi.destroy(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
