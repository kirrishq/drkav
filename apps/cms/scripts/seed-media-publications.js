'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const UID = 'api::media-publication.media-publication';
const sourceUrl = 'https://drkav.ru/smi/smi.html';
const sourceOrigin = new URL(sourceUrl).origin;

const SEO_BY_PATH = {
  '/smi/neschool.html': {
    metaTitle: 'Открытие «Не Школы» — публикация',
    metaDescription: 'Публикация об открытии «Не Школы» доктора Артёма Коробова: детали проекта, цели обучения и контекст материала в СМИ.',
  },
  '/smi/rbg.html': {
    metaTitle: 'Артём Коробов в RBG — о пластической хирургии',
    metaDescription: 'Материал RBG «О магии пластической хирургии»: интервью/статья с Артёмом Коробовым и ключевые тезисы выпуска.',
  },
  '/smi/book.html': {
    metaTitle: '«Боль двенадцати женщин» — публикация о книге',
    metaDescription: 'Публикация о книге Артёма Коробова «Боль двенадцати женщин»: о чём роман, для кого и где узнать подробности.',
  },
  '/smi/kak-navyki-ekstrennoy-hirurgii-pomogayut-pri-reshenii-zadach-v-plastike-opyt-doktora-korobova.html': {
    metaTitle: 'Экстренная хирургия и пластика — статья',
    metaDescription: 'Статья о том, как навыки экстренной хирургии помогают в пластике: опыт доктора Коробова, подход к решениям и практические выводы.',
  },
  '/smi/hirurg-nomer-odin.html': {
    metaTitle: '«Хирург номер один» — материал о докторе',
    metaDescription: 'Публикация «Хирург номер один» о докторе Коробове: о профессиональном пути, принципах работы и взгляде на пластическую хирургию.',
  },
};

const LOCAL_MEDIA_IMAGES = {
  "/images/0X3A9325-1_1.webp": "/images/media-publications/book.webp",
  "/images/1714801045_korobkov1_1.webp": "/images/media-publications/neschool.webp",
  "/images/Screensh.png": "/images/media-publications/rbg.png",
  "/images/Korobov.jpg": "/images/media-publications/hirurg-nomer-odin.jpg",
  "/images/metro_spb.svg": "/images/media-publications/metro.svg",
  "/images/medium_logo.svg": "/images/media-publications/medium.svg",
  "/images/rbk_logo.svg": "/images/media-publications/rbc.svg",
  "/images/theprson_logo.webp": "/images/media-publications/the-person.webp",
  "/images/bigstars_logo.png": "/images/media-publications/big-stars.png",
  "/images/voice-mag.svg": "/images/media-publications/voice.svg",
  "/images/logo-dark.090d38c.svg": "/images/media-publications/drkav.svg",
  "/images/search_logo.png": "/images/media-publications/vc.png",
  "/images/москва-nes.png": "/images/media-publications/mockva.png",
  "/images/logo_1.png": "/images/media-publications/monavista.png",
  "/images/logo-black.png": "/images/media-publications/vista.png",
  "/images/logo-bussnes.png": "/images/media-publications/business-post.png",
};

function decode(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(?:x[\da-f]+|\d+);/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeInline(value) {
  return decode(value).replace(/\s+/g, ' ');
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decode(match[2]) : '';
}

function inlineChildren(markup) {
  const children = [];
  const linkPattern = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let cursor = 0;
  let match;

  const addText = (value) => {
    const text = decodeInline(value);
    if (text) children.push({ type: 'text', text });
  };

  while ((match = linkPattern.exec(markup))) {
    addText(markup.slice(cursor, match.index));
    const url = getAttribute(match[0], 'href');
    const text = decodeInline(match[1]);
    if (url && text) {
      children.push({ type: 'link', url, children: [{ type: 'text', text }] });
    } else {
      addText(match[1]);
    }
    cursor = linkPattern.lastIndex;
  }

  addText(markup.slice(cursor));
  return children.length > 0 ? children : [{ type: 'text', text: decodeInline(markup) }];
}

function mapLocalLinks(children, pageUrl) {
  return children.map((child) => child.type === 'link'
    ? { ...child, url: toLocalHref(child.url, pageUrl) }
    : child);
}

function paragraph(markup, pageUrl) {
  return { type: 'paragraph', children: mapLocalLinks(inlineChildren(markup), pageUrl) };
}

function heading(markup, pageUrl) {
  return { type: 'heading', level: 2, children: mapLocalLinks(inlineChildren(markup), pageUrl) };
}

function list(items, pageUrl) {
  return {
    type: 'list',
    format: 'unordered',
    children: items.map((item) => ({
      type: 'list-item',
      children: mapLocalLinks(inlineChildren(item), pageUrl),
    })),
  };
}

function toLocalHref(value, pageUrl) {
  let url;
  try {
    url = new URL(value, pageUrl);
  } catch {
    return value;
  }

  if (url.origin !== sourceOrigin) return value;
  const path = url.pathname.replace(/\/$/, '') || '/';
  if (path.startsWith('/smi/')) {
    const file = path.split('/').pop().replace(/\.html$/, '');
    return `/obo-mne/smi/${file}${url.search}${url.hash}`;
  }

  const mappings = {
    '/obo-mne/neschool.html': '/obo-mne/neshkola',
    '/obo-mne/book.html': '/obo-mne/book',
    '/obo-mne/publikacii.html': '/obo-mne/publikacii',
    '/ceny.html': '/operaczii',
    '/kontakty.html': '/kontakty',
  };
  return `${mappings[path] ?? path.replace(/\.html$/, '')}${url.search}${url.hash}`;
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

function extractBlocks(html, pageUrl) {
  const fragment = getArticleContent(html);
  const matches = [...fragment.matchAll(/<(h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi)];
  const rawBlocks = matches.flatMap((match) => {
    const tag = match[1].toLowerCase();
    if (tag === 'ul' || tag === 'ol') {
      const items = [...match[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((item) => item[1]);
      return items.length > 0 ? [{ kind: 'list', items }] : [];
    }

    const text = decode(match[2]);
    if (!text || text.toLowerCase() === 'ссылка на источник') return [];
    if (tag.startsWith('h') || /^\s*<(strong|b)\b[\s\S]*<\/(strong|b)>\s*$/i.test(match[2])) {
      return [{ kind: 'heading', markup: match[2] }];
    }
    return [{ kind: 'paragraph', markup: match[2] }];
  });

  const blocks = [];
  let bulletItems = [];
  const flushBullets = () => {
    if (bulletItems.length > 0) blocks.push(list(bulletItems, pageUrl));
    bulletItems = [];
  };

  for (const block of rawBlocks) {
    if (block.kind === 'paragraph' && /^\s*[•●▪]\s*/.test(decode(block.markup))) {
      bulletItems.push(block.markup.replace(/^\s*[•●▪]\s*/, ''));
      continue;
    }
    flushBullets();
    if (block.kind === 'list') blocks.push(list(block.items, pageUrl));
    if (block.kind === 'heading') blocks.push(heading(block.markup, pageUrl));
    if (block.kind === 'paragraph') {
      blocks.push(paragraph(block.markup, pageUrl));
    }
  }
  flushBullets();
  return blocks;
}

function getText(blocks) {
  const getNodeText = (node) => {
    if (node?.children) return node.children.map(getNodeText).join(' ');
    return node?.text ?? '';
  };

  return blocks
    .map(getNodeText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value, index) {
  const transliteration = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  const result = value.toLowerCase().split('').map((char) => transliteration[char] ?? char).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `${result || 'publication'}-${index + 1}`;
}

function extractCardMeta(card, pageUrl, index) {
  const openingTag = card.match(/^<a\b[^>]*>/i)?.[0] ?? '';
  const rawHref = getAttribute(openingTag, 'href');
  const url = new URL(rawHref, pageUrl);
  const imageTag = card.match(/<img\b[^>]*>/i)?.[0] ?? '';
  const headingMatch = card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
  const titleMatch = card.match(/class="title-small"[^>]*>([\s\S]*?)<\/div>/i);
  const sourceMatch = card.match(/<p\b[^>]*class="paragraph-342"[^>]*>([\s\S]*?)<\/p>/i);
  const dateMatch = card.match(/class="paragraph-detials-small"[^>]*>([\s\S]*?)<\/p>/i);
  const title = decode((headingMatch ?? titleMatch)?.[1] ?? url.hostname);
  const isInternal = url.origin === sourceOrigin && url.pathname.startsWith('/smi/');
  const sourceName = decode(
    sourceMatch?.[1] ??
      (isInternal
        ? card.includes('profile-block')
          ? titleMatch?.[1] ?? 'DrKAV'
          : 'DrKAV'
        : url.hostname.replace(/^www\./, '')),
  );
  const sourceDateLabel = decode(dateMatch?.[1] ?? '') || null;
  let imagePath = null;
  const rawImage = getAttribute(imageTag, 'src');
  if (rawImage) {
    try {
      imagePath = LOCAL_MEDIA_IMAGES[decodeURIComponent(new URL(rawImage, pageUrl).pathname)] ?? null;
    } catch {
      imagePath = null;
    }
  }

  return {
    title,
    sourceUrl: url.toString(),
    sourceName,
    sourceDateLabel,
    isInternal,
    layoutVariant: index < 4 ? 'primary' : 'featured',
    imagePath,
    imageAlt: imagePath ? title : null,
  };
}

async function fetchInternalPublication(card, index) {
  const meta = extractCardMeta(card, sourceUrl, index);
  const response = await fetch(meta.sourceUrl);
  if (!response.ok) throw new Error(`Unable to load ${meta.sourceUrl}: ${response.status}`);
  const html = await response.text();
  const blocks = extractBlocks(html, meta.sourceUrl);
  const text = getText(blocks);
  const pathname = new URL(meta.sourceUrl).pathname;
  const slug = pathname.split('/').pop().replace(/\.html$/, '');
  const seo = SEO_BY_PATH[pathname];
  if (!seo) throw new Error(`Missing SEO source for ${pathname}`);

  return {
    ...meta,
    slug,
    canonicalPath: `/obo-mne/smi/${slug}`,
    excerpt: text.slice(0, 900),
    readingTimeMinutes: Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 180)),
    seo: { ...seo, canonicalPath: `/obo-mne/smi/${slug}`, noIndex: false },
    contentSections: [{ __component: 'blog.rich-text-section', sectionKey: 'content', body: blocks }],
    externalUrl: null,
    isExternal: false,
  };
}

async function run() {
  const listingResponse = await fetch(sourceUrl);
  if (!listingResponse.ok) throw new Error(`Unable to load ${sourceUrl}: ${listingResponse.status}`);
  const listingHtml = await listingResponse.text();
  const cards = [...listingHtml.matchAll(/<a\b[^>]*class="[^"]*(?:blog-item|featured-item)[^"]*"[^>]*>[\s\S]*?<\/a>/gi)]
    .map((match) => match[0]);
  if (cards.length === 0) throw new Error('No media publication cards found.');

  const publications = [];
  for (const [index, card] of cards.entries()) {
    const meta = extractCardMeta(card, sourceUrl, index);
    if (meta.isInternal) {
      publications.push({ ...(await fetchInternalPublication(card, index)), sortOrder: index });
      continue;
    }

    publications.push({
      ...meta,
      slug: slugify(meta.title, index),
      canonicalPath: null,
      excerpt: `Публикация на сайте ${meta.sourceName}.`,
      readingTimeMinutes: null,
      seo: null,
      contentSections: [],
      externalUrl: meta.sourceUrl,
      isExternal: true,
      layoutVariant: meta.layoutVariant,
      imagePath: meta.imagePath,
      imageAlt: meta.imageAlt,
      sortOrder: index,
    });
  }

  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  try {
    for (const publication of publications) {
      const existing = await strapi.documents(UID).findFirst({ filters: { sourceUrl: publication.sourceUrl }, status: 'draft' });
      const data = {
        title: publication.title,
        slug: publication.slug,
        canonicalPath: publication.canonicalPath,
        excerpt: publication.excerpt,
        sourceName: publication.sourceName,
        sourceDateLabel: publication.sourceDateLabel,
        sourceUrl: publication.sourceUrl,
        externalUrl: publication.externalUrl,
        isExternal: publication.isExternal,
        layoutVariant: publication.layoutVariant,
        imagePath: publication.imagePath,
        imageAlt: publication.imageAlt,
        sortOrder: publication.sortOrder,
        readingTimeMinutes: publication.readingTimeMinutes,
        seo: publication.seo,
        contentSections: publication.contentSections,
      };
      const result = existing
        ? await strapi.documents(UID).update({ documentId: existing.documentId, data, status: 'draft' })
        : await strapi.documents(UID).create({ data, status: 'draft' });
      await strapi.documents(UID).publish({ documentId: result.documentId });
    }
    strapi.log.info(`Media publications seed complete: ${publications.length} records, ${publications.filter((item) => !item.isExternal).length} internal articles.`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
