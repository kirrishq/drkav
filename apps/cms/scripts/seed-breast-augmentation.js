// Strapi 5.51's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const OPERATION_CATEGORY_UID = "api::operation-category.operation-category";
const OPERATION_UID = "api::operation.operation";
const TARGET_PATH = "/operaczii/plastika-grudi/uvelichenie-grudi";
const TARGET_CATEGORY_KEY = "breast";
const LEGACY_SEED_HEADING = "Увеличение груди";
const LEGACY_SEED_HERO_DESCRIPTION =
  "Увеличить грудь по выгодной цене в Москве. Увеличение груди профессиональным пластическим хирургом Артемом Коробовым. Звоните!";

function isBlank(value) {
  return value === null || value === undefined || value === "";
}

function uniqueDocuments(documents) {
  return [...new Map(documents.map((document) => [document.documentId, document])).values()];
}

async function wasEditedInAdmin(strapi, uid, id) {
  const record = await strapi.db.query(uid).findOne({
    where: { id },
    populate: ["createdBy", "updatedBy"],
  });

  return Boolean(record?.createdBy || record?.updatedBy);
}

async function findPublished(strapi, uid, documentId, populate) {
  return strapi.documents(uid).findOne({
    documentId,
    populate,
    status: "published",
  });
}

async function ensureCategory(strapi, categorySource) {
  const candidates = uniqueDocuments(
    await strapi.documents(OPERATION_CATEGORY_UID).findMany({
      filters: {
        $or: [
          { key: TARGET_CATEGORY_KEY },
          { name: categorySource.name },
          { name: "Грудь" },
        ],
      },
      status: "draft",
    }),
  );

  if (candidates.length > 1) {
    throw new Error("Several category records match the breast category; review them manually.");
  }

  if (candidates.length === 0) {
    const created = await strapi.documents(OPERATION_CATEGORY_UID).create({
      data: categorySource,
      status: "draft",
    });
    await strapi.documents(OPERATION_CATEGORY_UID).publish({
      documentId: created.documentId,
    });
    return { document: created, result: "created and published" };
  }

  let category = candidates[0];
  const editedInAdmin = await wasEditedInAdmin(
    strapi,
    OPERATION_CATEGORY_UID,
    category.id,
  );
  const knownSeedDraft =
    !editedInAdmin &&
    (category.name === "Грудь" || category.name === categorySource.name) &&
    isBlank(category.description) &&
    category.hasLandingPage === false &&
    isBlank(category.landingPageKey);
  const updates = {};

  if (isBlank(category.key)) {
    updates.key = categorySource.key;
  } else if (category.key !== categorySource.key) {
    throw new Error("The matching breast category has a conflicting non-empty key.");
  }

  if (isBlank(category.name)) {
    updates.name = categorySource.name;
  } else if (category.name === "Грудь" && knownSeedDraft) {
    updates.name = categorySource.name;
  }

  if (category.hasLandingPage === null || category.hasLandingPage === undefined) {
    updates.hasLandingPage = categorySource.hasLandingPage;
  }

  if (Object.keys(updates).length > 0) {
    category = await strapi.documents(OPERATION_CATEGORY_UID).update({
      documentId: category.documentId,
      data: updates,
      status: "draft",
    });
  }

  const published = await findPublished(
    strapi,
    OPERATION_CATEGORY_UID,
    category.documentId,
  );

  if (!published) {
    if (!knownSeedDraft) {
      throw new Error(
        "The breast category is an unpublished editor draft; review and publish it manually.",
      );
    }

    await strapi.documents(OPERATION_CATEGORY_UID).publish({
      documentId: category.documentId,
    });
    return { document: category, result: "reused seed draft and published" };
  }

  return { document: category, result: "reused published record" };
}

function mergeMissingOperationFields(operation, source, allowSeedMigration) {
  const updates = {};

  for (const field of [
    "internalName",
    "slug",
    "canonicalPath",
    "heading",
    "heroDescription",
    "contentStatus",
  ]) {
    if (isBlank(operation[field]) && !isBlank(source[field])) {
      updates[field] = source[field];
    }
  }

  if (
    allowSeedMigration &&
    operation.heading === LEGACY_SEED_HEADING &&
    source.heading !== LEGACY_SEED_HEADING
  ) {
    updates.heading = source.heading;
  }

  if (
    allowSeedMigration &&
    operation.heroDescription === LEGACY_SEED_HERO_DESCRIPTION &&
    source.heroDescription !== LEGACY_SEED_HERO_DESCRIPTION
  ) {
    updates.heroDescription = source.heroDescription;
  }

  if (!operation.seo) {
    updates.seo = source.seo;
  } else {
    const seo = { ...operation.seo };
    let seoChanged = false;

    for (const field of [
      "metaTitle",
      "metaDescription",
      "canonicalPath",
      "noIndex",
    ]) {
      if (isBlank(seo[field]) && !isBlank(source.seo[field])) {
        seo[field] = source.seo[field];
        seoChanged = true;
      }
    }

    if (seoChanged) {
      updates.seo = seo;
    }
  }

  return updates;
}

function isKnownSeedOperation(operation, source, categoryDocumentId) {
  const categoryIds = (operation.categories ?? []).map(
    (category) => category.documentId,
  );

  return (
    operation.internalName === source.internalName &&
    operation.slug === source.slug &&
    operation.canonicalPath === source.canonicalPath &&
    (operation.heading === LEGACY_SEED_HEADING ||
      operation.heading === source.heading) &&
    (operation.heroDescription === LEGACY_SEED_HERO_DESCRIPTION ||
      operation.heroDescription === source.heroDescription) &&
    operation.seo?.metaTitle === source.seo.metaTitle &&
    operation.seo?.metaDescription === source.seo.metaDescription &&
    operation.seo?.canonicalPath === source.seo.canonicalPath &&
    operation.seo?.noIndex === source.seo.noIndex &&
    operation.contentStatus === source.contentStatus &&
    !operation.heroImage &&
    !operation.primaryAction &&
    !operation.secondaryAction &&
    categoryIds.length === 1 &&
    categoryIds[0] === categoryDocumentId
  );
}

async function ensureOperation(strapi, operationSource, categoryDocumentId) {
  const populate = {
    categories: true,
    heroImage: true,
    primaryAction: true,
    secondaryAction: true,
    seo: { populate: { shareImage: true } },
  };
  const candidates = uniqueDocuments(
    await strapi.documents(OPERATION_UID).findMany({
      filters: {
        $or: [
          { canonicalPath: operationSource.canonicalPath },
          { slug: operationSource.slug },
          { internalName: operationSource.internalName },
          { heading: operationSource.heading },
        ],
      },
      populate,
      status: "draft",
    }),
  );

  if (candidates.length > 1) {
    throw new Error("Several operation records match breast augmentation; review them manually.");
  }

  if (candidates.length === 0) {
    const created = await strapi.documents(OPERATION_UID).create({
      data: {
        ...operationSource,
        categories: { set: [categoryDocumentId] },
      },
      populate,
      status: "draft",
    });
    await strapi.documents(OPERATION_UID).publish({
      documentId: created.documentId,
    });
    return { result: "created and published" };
  }

  let operation = candidates[0];

  if (
    !isBlank(operation.canonicalPath) &&
    operation.canonicalPath !== operationSource.canonicalPath
  ) {
    throw new Error("The matching operation has a conflicting canonicalPath.");
  }

  if (!isBlank(operation.slug) && operation.slug !== operationSource.slug) {
    throw new Error("The matching operation has a conflicting slug.");
  }

  const editedInAdmin = await wasEditedInAdmin(
    strapi,
    OPERATION_UID,
    operation.id,
  );
  const allowSeedMigration =
    !editedInAdmin &&
    isKnownSeedOperation(operation, operationSource, categoryDocumentId);
  const updates = mergeMissingOperationFields(
    operation,
    operationSource,
    allowSeedMigration,
  );
  const seedMigrationChanged =
    updates.heading !== undefined || updates.heroDescription !== undefined;
  const categoryIds = (operation.categories ?? []).map(
    (category) => category.documentId,
  );

  if (!categoryIds.includes(categoryDocumentId)) {
    updates.categories = { set: [...categoryIds, categoryDocumentId] };
  }

  if (Object.keys(updates).length > 0) {
    operation = await strapi.documents(OPERATION_UID).update({
      documentId: operation.documentId,
      data: updates,
      populate,
      status: "draft",
    });
  }

  const published = await findPublished(
    strapi,
    OPERATION_UID,
    operation.documentId,
    populate,
  );

  if (!published) {
    const hasDifferences =
      operation.internalName !== operationSource.internalName ||
      operation.slug !== operationSource.slug ||
      operation.canonicalPath !== operationSource.canonicalPath ||
      operation.heading !== operationSource.heading ||
      operation.heroDescription !== operationSource.heroDescription ||
      operation.seo?.metaTitle !== operationSource.seo.metaTitle ||
      operation.seo?.metaDescription !== operationSource.seo.metaDescription;

    if (editedInAdmin || hasDifferences) {
      return { result: "preserved unpublished editor draft" };
    }

    await strapi.documents(OPERATION_UID).publish({
      documentId: operation.documentId,
    });
    return { result: "reused seed draft and published" };
  }

  if (seedMigrationChanged && allowSeedMigration) {
    await strapi.documents(OPERATION_UID).publish({
      documentId: operation.documentId,
    });
    return { result: "updated seed-owned published record" };
  }

  return { result: "reused published record" };
}

async function run() {
  const { operationCategories, operations } = await import("../seed/v1/data.mjs");
  const categorySource = operationCategories.find(
    (category) => category.key === TARGET_CATEGORY_KEY,
  );
  const operationSource = operations.find(
    (operation) => operation.canonicalPath === TARGET_PATH,
  );

  if (!categorySource || !operationSource) {
    throw new Error("Breast augmentation seed source is incomplete.");
  }

  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    const category = await ensureCategory(strapi, categorySource);
    const operation = await ensureOperation(
      strapi,
      operationSource,
      category.document.documentId,
    );

    strapi.log.info(`Breast category: ${category.result}.`);
    strapi.log.info(`Breast augmentation: ${operation.result}.`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
