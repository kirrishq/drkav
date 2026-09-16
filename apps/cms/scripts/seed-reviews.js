'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

const REVIEW_UID = 'api::review.review';
const OPERATION_UID = 'api::operation.operation';
const PRODOCTOROV_URL = 'https://prodoctorov.ru/moskva/vrach/158087-korobov/';
const ORIGINAL_REVIEWS_PATH = path.resolve(__dirname, '../../web/src/content/home-reviews.ts');

const operationPaths = {
  'original-review-1': '/operaczii/abdominoplastika',
  'original-review-5': '/operaczii/abdominoplastika',
  'original-review-6': '/operaczii/plastika-grudi/uvelichenie-grudi',
  'original-review-7': '/operaczii/plasticheskaya-hirurgiya-posle-rodov',
  'original-review-8': '/operaczii/abdominoplastika',
  'original-review-10': '/operaczii/plasticheskaya-hirurgiya-posle-rodov',
  'original-review-12': '/operaczii/abdominoplastika',
};

const prodoctorovReviews = Array.from({ length: 8 }, (_, index) => ({
  externalUrl: PRODOCTOROV_URL,
  imageAlt: `Скриншот отзыва ${index + 1} на ПроДокторов`,
  imageUrl: `https://drkav.ru/images/prodoc${index + 1}.jpg`,
  kind: 'prodoctorov',
  slug: `prodoctorov-review-${index + 1}`,
  source: 'ПроДокторов',
  text: 'Скриншот отзыва пациента на ПроДокторов.',
  title: `Отзыв на ПроДокторов ${index + 1}`,
}));

const socialReviewFiles = [
  '101676157_257256882299294_3723142783974396547_n.jpg',
  '102727432_145815330369405_5283603530059386896_n.jpg',
  '102959044_675358029677547_1757292279960366923_n.jpg',
  '103398591_3067137030044370_5125421890850735363_n.jpg',
  '103337472_244860940147315_6214002263933925924_n.jpg',
  '104298253_2608283896156121_6119960969613755911_n.jpg',
  '105187796_291558881890845_3130977271858264007_n.jpg',
  '106917423_172782384249621_8499684212371178036_n.jpg',
  '106031073_313135419721911_2250733988015445061_n.jpg',
];

const socialReviews = socialReviewFiles.map((fileName, index) => ({
  imageAlt: `Скриншот отзыва ${index + 1} из социальных сетей`,
  imageUrl: `https://drkav.ru/images/${fileName}`,
  kind: 'social',
  slug: `social-review-${index + 1}`,
  source: 'Социальные сети',
  text: 'Скриншот отзыва пациента из социальных сетей.',
  title: `Отзыв из социальных сетей ${index + 1}`,
}));

function loadCurrentReviews() {
  const source = fs.readFileSync(ORIGINAL_REVIEWS_PATH, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: ORIGINAL_REVIEWS_PATH,
  }).outputText;
  const moduleExports = { exports: {} };
  new Function('runtimeModule', 'exports', compiled)(moduleExports, moduleExports.exports);
  return moduleExports.exports.homeReviews.map((review, index) => ({
    imageAlt: review.imageAlt,
    imageUrl: review.imageSrc,
    kind: 'patient',
    operationPath: operationPaths[review.id],
    slug: review.id,
    sortOrder: index,
    source: review.source,
    text: review.text,
    title: review.label,
  }));
}

async function run() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    const currentReviews = loadCurrentReviews();
    const reviews = [
      ...currentReviews,
      ...prodoctorovReviews.map((review, index) => ({ ...review, sortOrder: currentReviews.length + index })),
      ...socialReviews.map((review, index) => ({ ...review, sortOrder: currentReviews.length + prodoctorovReviews.length + index })),
    ];
    const operations = new Map();

    for (const review of reviews) {
      let operation;

      if (review.operationPath) {
        if (!operations.has(review.operationPath)) {
          const found = await strapi.documents(OPERATION_UID).findFirst({
            filters: { canonicalPath: review.operationPath },
            status: 'draft',
          });

          if (!found) {
            throw new Error(`Operation ${review.operationPath} is missing.`);
          }

          operations.set(review.operationPath, found);
        }

        operation = operations.get(review.operationPath);
      }

      const data = {
        externalUrl: review.externalUrl,
        imageAlt: review.imageAlt,
        imageUrl: review.imageUrl,
        kind: review.kind,
        operation: operation ? { set: [operation.documentId] } : undefined,
        slug: review.slug,
        sortOrder: review.sortOrder,
        source: review.source,
        text: review.text,
        title: review.title,
      };
      const existing = await strapi.documents(REVIEW_UID).findFirst({
        filters: { slug: review.slug },
        status: 'draft',
      });
      const result = existing
        ? await strapi.documents(REVIEW_UID).update({ documentId: existing.documentId, data, status: 'draft' })
        : await strapi.documents(REVIEW_UID).create({ data, status: 'draft' });

      await strapi.documents(REVIEW_UID).publish({ documentId: result.documentId });
    }

    strapi.log.info(`Review seed complete: ${reviews.length} records.`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
