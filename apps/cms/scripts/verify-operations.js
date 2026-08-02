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
const DATA_DIRECTORY = path.resolve(__dirname, "../src/seed-data/operations");
const MIGRATED_PATHS_FILE = path.resolve(
  __dirname,
  "../../web/src/content/cms-migrated-operations.ts",
);

function uniqueDocuments(documents) {
  return [...new Map(documents.map((document) => [document.documentId, document])).values()];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(values, label) {
  assert(new Set(values).size === values.length, `Duplicate ${label}.`);
}

async function loadJson(filename) {
  return JSON.parse(await fs.readFile(path.join(DATA_DIRECTORY, filename), "utf8"));
}

function operationPopulate() {
  return {
    categories: true,
    contentSections: { populate: "*" },
    prices: true,
    seo: true,
  };
}

async function run() {
  const catalog = await loadJson("catalog.json");
  const snapshots = await Promise.all(catalog.operationFiles.map(loadJson));
  const expectedByPath = new Map(
    snapshots.map((snapshot) => [snapshot.canonicalPath, snapshot]),
  );
  const expectedPublished = snapshots
    .filter((snapshot) => snapshot.publicationEligibility.eligible)
    .map((snapshot) => snapshot.canonicalPath)
    .sort();
  const migratedSource = await fs.readFile(MIGRATED_PATHS_FILE, "utf8");
  const configuredMigrated = [
    ...migratedSource.matchAll(/"(\/operaczii\/[^"\n]+)"/g),
  ].map((match) => match[1]);
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  try {
    const draftOperations = uniqueDocuments(
      await strapi.documents(OPERATION_UID).findMany({
        status: "draft",
        populate: operationPopulate(),
      }),
    );
    const publishedOperations = uniqueDocuments(
      await strapi.documents(OPERATION_UID).findMany({
        status: "published",
        populate: operationPopulate(),
      }),
    );
    const draftCategories = uniqueDocuments(
      await strapi.documents(OPERATION_CATEGORY_UID).findMany({ status: "draft" }),
    );
    const publishedCategories = uniqueDocuments(
      await strapi.documents(OPERATION_CATEGORY_UID).findMany({ status: "published" }),
    );
    const draftPrices = uniqueDocuments(
      await strapi.documents(PRICE_ITEM_UID).findMany({ status: "draft" }),
    );
    const publishedPrices = uniqueDocuments(
      await strapi.documents(PRICE_ITEM_UID).findMany({ status: "published" }),
    );

    assert(draftOperations.length === 37, `Expected 37 operations, received ${draftOperations.length}.`);
    assert(publishedOperations.length === 36, `Expected 36 published operations, received ${publishedOperations.length}.`);
    assert(draftCategories.length === 13, `Expected 13 categories, received ${draftCategories.length}.`);
    assert(publishedCategories.length === 13, `Expected 13 published categories, received ${publishedCategories.length}.`);
    assert(draftPrices.length === 42, `Expected 42 prices, received ${draftPrices.length}.`);
    assert(publishedPrices.length === 42, `Expected 42 published prices, received ${publishedPrices.length}.`);
    assertUnique(draftOperations.map((operation) => operation.canonicalPath), "operation canonical path");
    assertUnique(draftCategories.map((category) => category.key), "category key");
    assertUnique(draftPrices.map((price) => price.key), "price key");
    assert(
      JSON.stringify([...configuredMigrated].sort()) === JSON.stringify(expectedPublished),
      "cmsMigratedOperationPaths does not exactly match eligible published snapshots.",
    );

    const publishedIds = new Set(publishedOperations.map((operation) => operation.documentId));
    const draftOnly = draftOperations.filter((operation) => !publishedIds.has(operation.documentId));
    assert(draftOnly.length === 1, `Expected one draft-only operation, received ${draftOnly.length}.`);
    assert(
      draftOnly[0].canonicalPath === "/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz",
      "Unexpected operation is draft-only.",
    );

    let blockCount = 0;
    let relationCount = 0;
    for (const operation of draftOperations) {
      const expected = expectedByPath.get(operation.canonicalPath);
      assert(expected, `Unexpected operation ${operation.canonicalPath}.`);
      assertUnique((operation.categories ?? []).map((category) => category.key), `${operation.canonicalPath} category relation`);
      assertUnique((operation.prices ?? []).map((price) => price.key), `${operation.canonicalPath} price relation`);
      assert(
        JSON.stringify((operation.categories ?? []).map((category) => category.key)) ===
          JSON.stringify(expected.categoryKeys),
        `${operation.canonicalPath} category order differs from snapshot.`,
      );
      assert(
        JSON.stringify((operation.prices ?? []).map((price) => price.key)) ===
          JSON.stringify(expected.priceKeys),
        `${operation.canonicalPath} price order differs from snapshot.`,
      );
      if (operation.canonicalPath !== "/operaczii/plastika-grudi/uvelichenie-grudi") {
        assert(
          JSON.stringify((operation.contentSections ?? []).map((section) => section.sectionKey)) ===
            JSON.stringify(expected.contentSections.map((section) => section.sectionKey)),
          `${operation.canonicalPath} content section order differs from snapshot.`,
        );
      }
      if (publishedIds.has(operation.documentId)) {
        assert(operation.contentStatus === "ready", `${operation.canonicalPath} is published without ready status.`);
        assert(operation.seo, `${operation.canonicalPath} is published without SEO.`);
        assert((operation.contentSections ?? []).length > 0, `${operation.canonicalPath} is published without content.`);
      } else {
        assert(operation.contentStatus === "partial", `${operation.canonicalPath} draft must be partial.`);
      }
      blockCount += (operation.contentSections ?? []).length;
      relationCount += (operation.prices ?? []).length;
    }

    for (const price of draftPrices) {
      assert(price.priceLabel, `Price ${price.key} has no exact priceLabel.`);
      assert(price.isActive === true, `Price ${price.key} is inactive.`);
    }

    const augmentation = draftOperations.filter(
      (operation) => operation.canonicalPath === "/operaczii/plastika-grudi/uvelichenie-grudi",
    );
    assert(augmentation.length === 1, "Breast augmentation canonical is duplicated.");
    assert(publishedIds.has(augmentation[0].documentId), "Breast augmentation is not published.");

    strapi.log.info(
      `OPERATIONS_VERIFY_RESULT ${JSON.stringify({
        operations: draftOperations.length,
        published: publishedOperations.length,
        draftOnly: draftOnly.length,
        categories: draftCategories.length,
        prices: draftPrices.length,
        blocks: blockCount,
        priceRelations: relationCount,
        migratedPaths: configuredMigrated.length,
        augmentationDocuments: augmentation.length,
      })}`,
    );
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
