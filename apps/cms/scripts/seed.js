// Strapi 5.51's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const SITE_SETTING_UID = "api::site-setting.site-setting";
const STATIC_PAGE_UID = "api::static-page.static-page";
const SHARED_SECTION_UID = "api::shared-section.shared-section";
const OPERATION_CATEGORY_UID = "api::operation-category.operation-category";
const OPERATION_UID = "api::operation.operation";
const PRICE_ITEM_UID = "api::price-item.price-item";
const PRICE_SECTION_UID = "api::price-section.price-section";
const PROMOTION_UID = "api::promotion.promotion";
const ABOUT_PAGE_UID = "api::about-page.about-page";

async function upsertCollection(strapi, uid, uniqueField, data, populate) {
  const existing = await strapi.documents(uid).findFirst({
    filters: { [uniqueField]: data[uniqueField] },
    status: "draft",
  });

  const result = existing
    ? await strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
      populate,
      status: "draft",
    })
    : await strapi.documents(uid).create({ data, populate, status: "draft" });

  await strapi.documents(uid).publish({ documentId: result.documentId });
  return result;
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
    sharedSections,
    staticPages,
  } = await import("../seed/v1/data.mjs");
  const { priceItems, priceSections } = await import("../seed/v1/price-catalog.mjs");
  const { promotions } = await import("../seed/v1/promotions.mjs");
  const { aboutPage } = await import("../seed/v1/about-page.mjs");
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    await upsertSiteSettings(strapi, siteSettings);

    const categoryDocumentIds = new Map();

    const sharedSectionDocumentIds = new Map();

    for (const section of sharedSections) {
      const result = await upsertCollection(
        strapi,
        SHARED_SECTION_UID,
        "sectionKey",
        section,
      );
      sharedSectionDocumentIds.set(section.sectionKey, result.documentId);
    }

    for (const category of operationCategories) {
      const result = await upsertCollection(
        strapi,
        OPERATION_CATEGORY_UID,
        "key",
        category,
      );
      categoryDocumentIds.set(category.key, result.documentId);
    }

    const priceItemDocumentIds = new Map();

    for (const [index, item] of priceItems.entries()) {
      const result = await upsertCollection(
        strapi,
        PRICE_ITEM_UID,
        "key",
        { ...item, sortOrder: index },
      );
      priceItemDocumentIds.set(item.key, result.documentId);
    }

    for (const section of priceSections) {
      const entryIds = section.entries.map((entry) => {
        const documentId = priceItemDocumentIds.get(entry.key);

        if (!documentId) {
          throw new Error(`Seed price item is missing: ${entry.key}`);
        }

        return documentId;
      });

      const sectionData = Object.fromEntries(
        Object.entries(section).filter(([key]) => key !== "entries"),
      );
      await upsertCollection(
        strapi,
        PRICE_SECTION_UID,
        "sectionKey",
        { ...sectionData, entries: { set: entryIds } },
        { entries: true },
      );
    }

    for (const promotion of promotions) {
      await upsertCollection(strapi, PROMOTION_UID, "key", promotion);
    }

    await upsertCollection(strapi, ABOUT_PAGE_UID, "pageKey", aboutPage);

    for (const page of staticPages) {
      const { sharedSectionKeys, ...pageData } = page;
      const sharedSectionIds = (sharedSectionKeys ?? []).map((key) => {
        const documentId = sharedSectionDocumentIds.get(key);

        if (!documentId) {
          throw new Error(`Seed shared section is missing: ${key}`);
        }

        return documentId;
      });

      await upsertCollection(
        strapi,
        STATIC_PAGE_UID,
        "pageKey",
        sharedSectionKeys
          ? { ...pageData, sharedSections: { set: sharedSectionIds } }
          : pageData,
      );
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
      `Seed v${seedVersion} complete: ${staticPages.length} static pages, ${operations.length} operations, ${operationCategories.length} categories, ${priceSections.length} price sections, ${priceItems.length} price items, ${promotions.length} promotions.`,
    );
    strapi.log.info(`Seed sources: ${seedSources.join("; ")}`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  if (error?.details) {
    console.error(JSON.stringify(error.details, null, 2));
  }
  process.exitCode = 1;
});
