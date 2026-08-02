// Strapi 5.51's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const SITE_SETTING_UID = "api::site-setting.site-setting";
const STATIC_PAGE_UID = "api::static-page.static-page";
const OPERATION_CATEGORY_UID = "api::operation-category.operation-category";
const OPERATION_UID = "api::operation.operation";

async function upsertCollection(strapi, uid, uniqueField, data, populate) {
  const existing = await strapi.documents(uid).findFirst({
    filters: { [uniqueField]: data[uniqueField] },
    status: "draft",
  });

  if (existing) {
    return strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
      populate,
    });
  }

  return strapi.documents(uid).create({ data, populate, status: "draft" });
}

async function upsertSiteSettings(strapi, siteSettings) {
  const data = {
    ...siteSettings,
    siteUrl: process.env.SITE_URL ?? "http://localhost:3000",
  };
  const existing = await strapi.documents(SITE_SETTING_UID).findFirst();

  if (existing) {
    return strapi.documents(SITE_SETTING_UID).update({
      documentId: existing.documentId,
      data,
    });
  }

  return strapi.documents(SITE_SETTING_UID).create({ data });
}

async function run() {
  const {
    operationCategories,
    operations,
    seedSources,
    seedVersion,
    siteSettings,
    staticPages,
  } = await import("../seed/v1/data.mjs");
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    await upsertSiteSettings(strapi, siteSettings);

    const categoryDocumentIds = new Map();

    for (const category of operationCategories) {
      const result = await upsertCollection(
        strapi,
        OPERATION_CATEGORY_UID,
        "key",
        category,
      );
      categoryDocumentIds.set(category.key, result.documentId);
    }

    for (const page of staticPages) {
      await upsertCollection(strapi, STATIC_PAGE_UID, "pageKey", page);
    }

    for (const { categoryKeys, ...operation } of operations) {
      const categories = categoryKeys.map((key) => {
        const documentId = categoryDocumentIds.get(key);

        if (!documentId) {
          throw new Error(`Seed category is missing: ${key}`);
        }

        return documentId;
      });

      await upsertCollection(
        strapi,
        OPERATION_UID,
        "canonicalPath",
        {
          ...operation,
          categories: { set: categories },
        },
        { categories: true },
      );
    }

    strapi.log.info(
      `Seed v${seedVersion} complete: ${staticPages.length} static pages, ${operations.length} operations, ${operationCategories.length} categories.`,
    );
    strapi.log.info(`Seed sources: ${seedSources.join("; ")}`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
