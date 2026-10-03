'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const PLACEHOLDER_IMAGE_PATH = '/images/before-after/placeholder-after.png';
const CONTENT_TYPES = [
  'api::before-after-case.before-after-case',
  'api::final-result.final-result',
];

async function run() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    let removed = 0;

    for (const uid of CONTENT_TYPES) {
      const entries = await strapi.documents(uid).findMany({
        filters: { imagePath: { $eq: PLACEHOLDER_IMAGE_PATH } },
        status: 'draft',
      });

      for (const entry of entries) {
        await strapi.documents(uid).delete({ documentId: entry.documentId });
        removed += 1;
      }
    }

    strapi.log.info(`Placeholder result records removed: ${removed}.`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
