'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const { compileStrapi, createStrapi } = require('@strapi/strapi');
const UID = 'api::condition-article.condition-article';
const sourceUrl = 'https://drkav.ru/pacientam/pro-bolezni.html';
const sourceOrigin = new URL(sourceUrl).origin;

function decode(value) { return value.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#(?:x[\da-f]+|\d+);/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function decodeInline(value) { return value.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#(?:x[\da-f]+|\d+);/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' '); }
function inlineChildren(markup) {
  const children = [];
  const linkPattern = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let cursor = 0;
  let match;

  const addText = (value) => {
    const text = decodeInline(value);
    if (text.trim()) children.push({ type: 'text', text });
  };

  while ((match = linkPattern.exec(markup))) {
    addText(markup.slice(cursor, match.index));
    const url = getAttribute(match[0], 'href');
    const text = decode(match[1]);
    if (url && text) {
      children.push({ type: 'link', url: toLocalHref(url), children: [{ type: 'text', text }] });
    } else {
      addText(match[1]);
    }
    cursor = linkPattern.lastIndex;
  }

  addText(markup.slice(cursor));
  return children.length > 0 ? children : [{ type: 'text', text: decode(markup) }];
}

function paragraph(markup) { return { type: 'paragraph', children: inlineChildren(markup) }; }
function heading(tag, markup) { return { type: 'heading', level: tag === 'h3' ? 3 : 2, children: inlineChildren(markup) }; }
function list(tag, markup) {
  const children = [...markup.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => ({ type: 'list-item', children: inlineChildren(match[1]) }));
  return { type: 'list', format: tag === 'ol' ? 'ordered' : 'unordered', children };
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decode(match[2]) : '';
}

function toLocalHref(value) {
  if (value.startsWith('#')) return value;

  let url;
  try {
    url = new URL(value, sourceUrl);
  } catch {
    return value;
  }

  if (url.origin !== sourceOrigin) return value;

  const path = url.pathname.replace(/\/$/, '') || '/';
  const exactMappings = {
    '/akcii.html': '/akcii',
    '/ceny.html': '/operaczii',
    '/kontakty.html': '/kontakty',
    '/konsultacii/konsultaciya-po-ankete.html': '/konsultaciya',
    '/konsultacii/ochnaya-konsultaciya-v-klinike.html': '/konsultaciya',
    '/konsultacii/onlayn-konsultaciya.html': '/konsultaciya',
    '/obo-mne/book.html': '/obo-mne/book',
    '/obo-mne/neschool.html': '/obo-mne/neshkola',
    '/obo-mne/obrazovanie.html': '/obo-mne/diplomy-i-licenzii',
    '/obo-mne/otzyvy.html': '/pacientam/otzyvy',
    '/obo-mne/publikacii.html': '/obo-mne/publikacii',
    '/obo-mne/sertifikaty.html': '/obo-mne/diplomy-i-licenzii',
    '/obo-mne/specializaciya.html': '/obo-mne',
    '/obo-mne/vystupleniya.html': '/obo-mne/vystupleniya',
    '/oferta.html': '/oferta',
    '/pacientam/bezopasnost.html': '/pacientam/bezopasnost',
    '/pacientam/do-i-posle.html': '/pacientam/do-i-posle',
    '/pacientam/kak-vsyo-budet.html': '/pacientam/kak-vse-budet',
    '/pacientam/lichnyy-assistent.html': '/pacientam/lichnyy-assistent',
    '/pacientam/metodika.html': '/pacientam',
    '/pacientam/poluchenie-nalogovogo-vycheta-za-lechenie-pri-plasticheskoy-operacii.html': '/pacientam',
    '/pacientam/pro-bolezni.html': '/pacientam/pro-bolezni',
    '/pacientam/spisok-analizov.html': '/pacientam/spisok-analizov',
    '/pacientam/vopros-otvet.html': '/pacientam/vopros-otvet',
    '/smi/smi.html': '/obo-mne/smi',
  };

  let localPath = exactMappings[path];
  if (!localPath && path.startsWith('/ceny/')) localPath = `/operaczii/${path.slice('/ceny/'.length).replace(/\.html$/, '')}`;
  if (!localPath && path.startsWith('/pacientam/pro-bolezni/')) localPath = path.replace(/\.html$/, '');
  if (!localPath) localPath = path.replace(/\.html$/, '');

  return `${localPath}${url.search}${url.hash}`;
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

function getArticleIntro(html) {
  const start = html.search(/<div[^>]+class="[^"]*header-blog[^\"]*"/i);
  const end = html.search(/<div[^>]+class="[^"]*blog-section[^\"]*"/i);
  if (start < 0 || end < 0 || end <= start) return [];

  return [...html.slice(start, end).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => paragraph(match[1]));
}

function extractBlocks(html) {
  const fragment = getArticleContent(html);
  const matches = [...fragment.matchAll(/<(h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi)];
  const ignored = new Set(['читать', 'записаться на консультацию', 'консультация', 'отзывы пациентов']);

  return matches.flatMap((match) => {
    const tag = match[1].toLowerCase();
    if (tag === 'ul' || tag === 'ol') {
      const block = list(tag, match[2]);
      return block.children.length > 0 ? [block] : [];
    }

    const text = decode(match[2]);
    if (!text || ignored.has(text.toLowerCase())) return [];
    return [tag.startsWith('h') ? heading(tag, match[2]) : paragraph(match[2])];
  });
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
      const intro = getArticleIntro(html);
      const blocks = extractBlocks(html);
      const content = blocks.length > 0 ? blocks : intro;
      const introText = intro
        .map((block) => block.children.map((child) => child.type === 'link' ? child.children.map((item) => item.text).join('') : child.text).join(''))
        .join('\n\n');
      const excerpt = introText || content.find((block) => block.type === 'paragraph')?.children[0].text || entry.title;
      const fallbackDescription = `${excerpt} Подробная информация для пациентов.`.slice(0, 190);
      const seo = getOriginalSeo(html, entry.title, fallbackDescription);
      const allText = [...intro, ...content]
        .flatMap((block) => block.children.map((child) => child.type === 'link' ? child.children.map((item) => item.text).join('') : child.text))
        .join(' ');
      const data = { title: entry.title, slug, excerpt, isFeatured: false, contentSections: [{ __component: 'blog.rich-text-section', sectionKey: 'content', body: content }], seo: { ...seo, canonicalPath: `/pacientam/pro-bolezni/${slug}`, noIndex: false } };
      const result = existing ? await strapi.documents(UID).update({ documentId: existing.documentId, data, status: 'draft' }) : await strapi.documents(UID).create({ data, status: 'draft' });
      await strapi.documents(UID).publish({ documentId: result.documentId });
    }
    strapi.log.info(`Conditions seed complete: ${entries.length} articles.`);
  } finally { await strapi.destroy(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
