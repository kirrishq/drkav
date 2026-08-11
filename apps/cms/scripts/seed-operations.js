// Strapi 5.51's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("node:fs/promises");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("node:path");

const OPERATION_CATEGORY_UID = "api::operation-category.operation-category";
const OPERATION_UID = "api::operation.operation";
const PRICE_ITEM_UID = "api::price-item.price-item";
const AUGMENTATION_PATH = "/operaczii/plastika-grudi/uvelichenie-grudi";
const DATA_DIRECTORY = path.resolve(__dirname, "../src/seed-data/operations");

function uniqueDocuments(documents) {
  return [...new Map(documents.map((document) => [document.documentId, document])).values()];
}

async function loadJson(filename) {
  return JSON.parse(await fs.readFile(path.join(DATA_DIRECTORY, filename), "utf8"));
}

function validateUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

function validatePrice(price) {
  const amounts = [price.amount, price.minAmount, price.maxAmount];
  if (!price.key || !price.publicName || !price.priceLabel || price.currency !== "RUB") {
    throw new Error(`Price ${price.key ?? "<missing>"} has incomplete required source data.`);
  }
  if (amounts.some((value) => value !== undefined && (!Number.isInteger(value) || value <= 0))) {
    throw new Error(`Price ${price.key} contains a non-positive or non-integer amount.`);
  }
  if (
    ((price.priceType === "fixed" || price.priceType === "from") &&
      (price.amount === undefined || price.minAmount !== undefined || price.maxAmount !== undefined)) ||
    (price.priceType === "range" &&
      (price.amount !== undefined || price.minAmount === undefined || price.maxAmount === undefined || price.minAmount > price.maxAmount)) ||
    (price.priceType === "on-request" && amounts.some((value) => value !== undefined))
  ) {
    throw new Error(`Price ${price.key} has inconsistent structured amounts.`);
  }
}

function validateSnapshot(catalog, operations) {
  if (operations.length !== 37) {
    throw new Error(`Expected 37 operation snapshots, received ${operations.length}.`);
  }
  validateUnique(operations.map((operation) => operation.canonicalPath), "canonical path");
  validateUnique(catalog.categories.map((category) => category.key), "category key");
  validateUnique(catalog.prices.map((price) => price.key), "price key");
  const categoryKeys = new Set(catalog.categories.map((category) => category.key));
  const priceKeys = new Set(catalog.prices.map((price) => price.key));
  for (const price of catalog.prices) {
    validatePrice(price);
  }
  for (const operation of operations) {
    validateUnique(operation.contentSections.map((section) => section.sectionKey), `${operation.canonicalPath} sectionKey`);
    validateUnique(operation.contentSections.map((section) => section.anchor).filter(Boolean), `${operation.canonicalPath} anchor`);
    for (const key of operation.categoryKeys) {
      if (!categoryKeys.has(key)) throw new Error(`${operation.canonicalPath} references missing category ${key}.`);
    }
    for (const key of operation.priceKeys) {
      if (!priceKeys.has(key)) throw new Error(`${operation.canonicalPath} references missing price ${key}.`);
    }
    if (operation.publicationEligibility.eligible && (!operation.seo || operation.contentSections.length === 0)) {
      throw new Error(`${operation.canonicalPath} is eligible without SEO or content sections.`);
    }
  }
}

async function findOneBy(strapi, uid, field, value, populate) {
  const matches = uniqueDocuments(await strapi.documents(uid).findMany({
    filters: { [field]: value },
    populate,
    status: "draft",
  }));
  if (matches.length > 1) {
    throw new Error(`Several ${uid} documents match ${field}=${value}.`);
  }
  return matches[0] ?? null;
}

async function publishIfNeeded(strapi, uid, documentId) {
  await strapi.documents(uid).publish({ documentId });
}

async function upsertCategory(strapi, source) {
  const existing = await findOneBy(strapi, OPERATION_CATEGORY_UID, "key", source.key);
  const data = {
    name: source.name,
    key: source.key,
    description: source.description ?? null,
    hasLandingPage: source.hasLandingPage,
    landingPageKey: source.landingPageKey ?? null,
    showInCatalog: source.showInCatalog ?? false,
    catalogOrder: source.catalogOrder ?? null,
  };
  const document = existing
    ? await strapi.documents(OPERATION_CATEGORY_UID).update({ documentId: existing.documentId, data, status: "draft" })
    : await strapi.documents(OPERATION_CATEGORY_UID).create({ data, status: "draft" });
  await publishIfNeeded(strapi, OPERATION_CATEGORY_UID, document.documentId);
  return { document, created: !existing };
}

async function upsertPrice(strapi, source) {
  const existing = await findOneBy(strapi, PRICE_ITEM_UID, "key", source.key);
  const data = {
    internalName: source.internalName,
    key: source.key,
    publicName: source.publicName,
    priceType: source.priceType,
    priceLabel: source.priceLabel,
    amount: source.amount ?? null,
    minAmount: source.minAmount ?? null,
    maxAmount: source.maxAmount ?? null,
    currency: source.currency,
    unitLabel: source.unitLabel ?? null,
    description: source.description ?? null,
    note: source.note ?? null,
    isActive: source.isActive,
    validFrom: source.validFrom ?? null,
    validUntil: source.validUntil ?? null,
  };
  const document = existing
    ? await strapi.documents(PRICE_ITEM_UID).update({ documentId: existing.documentId, data, status: "draft" })
    : await strapi.documents(PRICE_ITEM_UID).create({ data, status: "draft" });
  await publishIfNeeded(strapi, PRICE_ITEM_UID, document.documentId);
  return { document, created: !existing };
}

function operationPopulate() {
  return {
    categories: true,
    contentSections: { populate: "*" },
    prices: true,
    seo: true,
  };
}

async function upsertOperation(strapi, source, categoryIds, priceIds) {
  const existing = await findOneBy(
    strapi,
    OPERATION_UID,
    "canonicalPath",
    source.canonicalPath,
    operationPopulate(),
  );
  const preserveAugmentationContent =
    source.canonicalPath === AUGMENTATION_PATH &&
    existing?.contentStatus === "ready" &&
    Array.isArray(existing.contentSections) &&
    existing.contentSections.length > 0;
  const data = {
    internalName: source.name,
    slug: source.slug,
    canonicalPath: source.canonicalPath,
    catalogOrder: source.number,
    heading: source.name,
    categories: { set: source.categoryKeys.map((key) => categoryIds.get(key)) },
    prices: { set: source.priceKeys.map((key) => priceIds.get(key)) },
    contentStatus: source.publicationEligibility.eligible ? "ready" : "partial",
  };
  if (!preserveAugmentationContent) {
    data.heroDescription = source.heroDescription ?? null;
    data.primaryAction = source.primaryAction ?? null;
    data.secondaryAction = source.secondaryAction ?? null;
    data.contentSections = source.contentSections;
    if (source.seo) data.seo = source.seo;
  }
  const document = existing
    ? await strapi.documents(OPERATION_UID).update({
        documentId: existing.documentId,
        data,
        populate: operationPopulate(),
        status: "draft",
      })
    : await strapi.documents(OPERATION_UID).create({
        data,
        populate: operationPopulate(),
        status: "draft",
      });
  if (source.publicationEligibility.eligible) {
    await publishIfNeeded(strapi, OPERATION_UID, document.documentId);
  } else {
    const published = await strapi.documents(OPERATION_UID).findOne({
      documentId: document.documentId,
      status: "published",
    });
    if (published) await strapi.documents(OPERATION_UID).unpublish({ documentId: document.documentId });
  }
  return {
    document,
    created: !existing,
    preservedAugmentationContent: preserveAugmentationContent,
  };
}

async function databaseSummary(strapi) {
  const draftOperations = uniqueDocuments(await strapi.documents(OPERATION_UID).findMany({ status: "draft" }));
  const publishedOperations = uniqueDocuments(await strapi.documents(OPERATION_UID).findMany({ status: "published" }));
  const categories = uniqueDocuments(await strapi.documents(OPERATION_CATEGORY_UID).findMany({ status: "draft" }));
  const prices = uniqueDocuments(await strapi.documents(PRICE_ITEM_UID).findMany({ status: "draft" }));
  validateUnique(draftOperations.map((operation) => operation.canonicalPath), "database operation canonical");
  validateUnique(categories.map((category) => category.key), "database category key");
  validateUnique(prices.map((price) => price.key), "database price key");
  const publishedIds = new Set(publishedOperations.map((operation) => operation.documentId));
  return {
    operations: draftOperations.length,
    published: publishedOperations.length,
    draftOnly: draftOperations.filter((operation) => !publishedIds.has(operation.documentId)).length,
    categories: categories.length,
    prices: prices.length,
  };
}

async function run() {
  const catalog = await loadJson("catalog.json");
  const operations = await Promise.all(catalog.operationFiles.map(loadJson));
  validateSnapshot(catalog, operations);
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  const result = {
    snapshotVersion: catalog.snapshotVersion,
    categories: { created: 0, reused: 0 },
    prices: { created: 0, reused: 0 },
    operations: { created: 0, updated: 0, published: 0, draft: 0, failed: 0 },
    failures: [],
  };
  try {
    const categoryIds = new Map();
    for (const categorySource of catalog.categories) {
      const category = await upsertCategory(strapi, categorySource);
      categoryIds.set(categorySource.key, category.document.documentId);
      result.categories[category.created ? "created" : "reused"] += 1;
    }
    const priceIds = new Map();
    for (const priceSource of catalog.prices) {
      const price = await upsertPrice(strapi, priceSource);
      priceIds.set(priceSource.key, price.document.documentId);
      result.prices[price.created ? "created" : "reused"] += 1;
    }
    const operationIds = new Map();
    for (const source of operations) {
      try {
        const operation = await upsertOperation(strapi, source, categoryIds, priceIds);
        operationIds.set(source.canonicalPath, operation.document.documentId);
        result.operations[operation.created ? "created" : "updated"] += 1;
        result.operations[source.publicationEligibility.eligible ? "published" : "draft"] += 1;
        strapi.log.info(
          `${source.canonicalPath}: ${source.publicationEligibility.eligible ? "published" : "draft"}` +
            (operation.preservedAugmentationContent ? "; preserved existing augmentation content" : ""),
        );
      } catch (error) {
        result.operations.failed += 1;
        result.failures.push({ canonicalPath: source.canonicalPath, message: error.message });
        strapi.log.error(`${source.canonicalPath}: ${error.message}`);
      }
    }
    for (const categorySource of catalog.categories) {
      if (!categorySource.featuredOperationPath) continue;

      const featuredOperationId = operationIds.get(
        categorySource.featuredOperationPath,
      );

      if (!featuredOperationId) {
        throw new Error(
          `Category ${categorySource.key} references missing featured operation ${categorySource.featuredOperationPath}.`,
        );
      }

      await strapi.documents(OPERATION_CATEGORY_UID).update({
        documentId: categoryIds.get(categorySource.key),
        data: { featuredOperation: featuredOperationId },
        status: "draft",
      });
      await publishIfNeeded(
        strapi,
        OPERATION_CATEGORY_UID,
        categoryIds.get(categorySource.key),
      );
    }
    result.database = await databaseSummary(strapi);
    strapi.log.info(`OPERATIONS_SEED_RESULT ${JSON.stringify(result)}`);
    if (result.operations.failed > 0) process.exitCode = 1;
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
