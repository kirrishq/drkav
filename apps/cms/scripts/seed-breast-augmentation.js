// Strapi 5.51's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const OPERATION_CATEGORY_UID = "api::operation-category.operation-category";
const OPERATION_UID = "api::operation.operation";
const PRICE_ITEM_UID = "api::price-item.price-item";
const TARGET_PATH = "/operaczii/plastika-grudi/uvelichenie-grudi";
const TARGET_CATEGORY_KEY = "breast";
const LEGACY_SEED_HEADING = "Увеличение груди";
const LEGACY_SEED_HERO_DESCRIPTION =
  "Увеличить грудь по выгодной цене в Москве. Увеличение груди профессиональным пластическим хирургом Артемом Коробовым. Звоните!";

function isBlank(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function uniqueDocuments(documents) {
  return [...new Map(documents.map((document) => [document.documentId, document])).values()];
}

function withoutComponentIds(value) {
  if (Array.isArray(value)) {
    return value.map(withoutComponentIds);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key, child]) =>
            key !== "id" && child !== null && child !== undefined,
        )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, withoutComponentIds(child)]),
    );
  }

  return value;
}

function hasSameContent(left, right) {
  return (
    JSON.stringify(withoutComponentIds(left)) ===
    JSON.stringify(withoutComponentIds(right))
  );
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

function validatePrice(price, label) {
  const numericFields = ["amount", "minAmount", "maxAmount"];

  if (
    price.currency !== "RUB" ||
    !["fixed", "from", "range", "on-request", "included"].includes(
      price.priceType,
    )
  ) {
    throw new Error(`${label} has an unsupported price type or currency.`);
  }

  for (const field of numericFields) {
    const value = price[field];

    if (!isBlank(value) && (!Number.isInteger(value) || value <= 0)) {
      throw new Error(`${label}.${field} must be a positive integer when present.`);
    }
  }

  if (
    (price.priceType === "fixed" || price.priceType === "from") &&
    (isBlank(price.amount) || !isBlank(price.minAmount) || !isBlank(price.maxAmount))
  ) {
    throw new Error(`${label} has inconsistent fixed/from amounts.`);
  }

  if (
    price.priceType === "range" &&
    (isBlank(price.minAmount) ||
      isBlank(price.maxAmount) ||
      !isBlank(price.amount) ||
      price.minAmount > price.maxAmount)
  ) {
    throw new Error(`${label} has an inconsistent range.`);
  }

  if (
    (price.priceType === "on-request" || price.priceType === "included") &&
    numericFields.some((field) => !isBlank(price[field]))
  ) {
    throw new Error(`${label} must not contain numeric amounts.`);
  }
}

function mergePriceFields(price, source, seedOwned) {
  const updates = {};
  const fields = [
    "internalName",
    "publicName",
    "priceType",
    "amount",
    "minAmount",
    "maxAmount",
    "currency",
    "unitLabel",
    "description",
    "note",
    "isActive",
    "validFrom",
    "validUntil",
  ];

  for (const field of fields) {
    const sourceValue = source[field] ?? null;

    if (seedOwned) {
      if ((price[field] ?? null) !== sourceValue) {
        updates[field] = sourceValue;
      }
    } else if (isBlank(price[field]) && !isBlank(source[field])) {
      updates[field] = source[field];
    }
  }

  return updates;
}

async function ensurePrice(strapi, source) {
  validatePrice(source, `seed price ${source.key}`);

  const candidates = uniqueDocuments(
    await strapi.documents(PRICE_ITEM_UID).findMany({
      filters: { key: source.key },
      status: "draft",
    }),
  );

  if (candidates.length > 1) {
    throw new Error(`Several price records use key ${source.key}.`);
  }

  if (candidates.length === 0) {
    const created = await strapi.documents(PRICE_ITEM_UID).create({
      data: source,
      status: "draft",
    });
    await strapi.documents(PRICE_ITEM_UID).publish({
      documentId: created.documentId,
    });
    return { document: created, result: "created and published" };
  }

  let price = candidates[0];

  if (price.key !== source.key) {
    throw new Error(`The matching price has a conflicting key: ${source.key}.`);
  }

  const editedInAdmin = await wasEditedInAdmin(
    strapi,
    PRICE_ITEM_UID,
    price.id,
  );
  const updates = editedInAdmin
    ? {}
    : mergePriceFields(price, source, true);

  if (Object.keys(updates).length > 0) {
    price = await strapi.documents(PRICE_ITEM_UID).update({
      documentId: price.documentId,
      data: updates,
      status: "draft",
    });
  }

  const published = await findPublished(
    strapi,
    PRICE_ITEM_UID,
    price.documentId,
  );

  if (editedInAdmin) {
    if (published) {
      validatePrice(published, `published price ${source.key}`);
    }
    return {
      document: price,
      result: published
        ? "preserved editor values"
        : "preserved unpublished editor draft",
    };
  }

  validatePrice(price, `seed-owned price ${source.key}`);

  if (!published || Object.keys(updates).length > 0) {
    await strapi.documents(PRICE_ITEM_UID).publish({
      documentId: price.documentId,
    });
    return {
      document: price,
      result: published
        ? "updated seed-owned published record"
        : "reused seed draft and published",
    };
  }

  return { document: price, result: "reused published record" };
}

function mergeSection(existing, source, seedOwned) {
  if (!seedOwned) {
    return existing;
  }

  if (existing.__component !== source.__component) {
    throw new Error(
      `Section ${source.sectionKey} uses ${existing.__component}, expected ${source.__component}.`,
    );
  }

  return { id: existing.id, ...source };
}

function mergeContentSections(existingSections, sourceSections, seedOwned) {
  const existing = Array.isArray(existingSections) ? existingSections : [];
  const seenKeys = new Set();

  for (const section of existing) {
    if (typeof section.sectionKey !== "string" || section.sectionKey.length === 0) {
      throw new Error("Every existing operation section must have a sectionKey.");
    }

    if (seenKeys.has(section.sectionKey)) {
      throw new Error(`Duplicate operation sectionKey: ${section.sectionKey}.`);
    }

    seenKeys.add(section.sectionKey);
  }

  const sourceByKey = new Map(
    sourceSections.map((section) => [section.sectionKey, section]),
  );
  const merged = existing.map((section) => {
    const source = sourceByKey.get(section.sectionKey);
    return source ? mergeSection(section, source, seedOwned) : section;
  });

  for (const source of sourceSections) {
    if (!seenKeys.has(source.sectionKey)) {
      merged.push(source);
    }
  }

  return merged;
}

function operationPopulate() {
  return {
    categories: true,
    contentSections: { populate: "*" },
    heroImage: true,
    prices: true,
    primaryAction: true,
    secondaryAction: true,
    seo: { populate: { shareImage: true } },
  };
}

async function findTargetOperation(strapi, operationSource) {
  const candidates = uniqueDocuments(
    await strapi.documents(OPERATION_UID).findMany({
      filters: { canonicalPath: operationSource.canonicalPath },
      populate: operationPopulate(),
      status: "draft",
    }),
  );

  if (candidates.length > 1) {
    throw new Error("Several operation records match breast augmentation; review them manually.");
  }

  if (candidates.length === 0) {
    throw new Error(
      "Breast augmentation operation does not exist. Run the base CMS seed first; this focused seed never creates a duplicate operation.",
    );
  }

  return candidates[0];
}

function isSeedOwnedOperation(operation, source, categoryDocumentId, editedInAdmin) {
  const categoryIds = (operation.categories ?? []).map(
    (category) => category.documentId,
  );

  return (
    !editedInAdmin &&
    operation.internalName === source.internalName &&
    operation.slug === source.slug &&
    operation.canonicalPath === source.canonicalPath &&
    (operation.heading === LEGACY_SEED_HEADING ||
      operation.heading === source.heading) &&
    (operation.heroDescription === LEGACY_SEED_HERO_DESCRIPTION ||
      operation.heroDescription === source.heroDescription) &&
    !operation.heroImage &&
    !operation.primaryAction &&
    !operation.secondaryAction &&
    categoryIds.includes(categoryDocumentId)
  );
}

function mergeOperationFields(operation, source, seedOwned) {
  const updates = {};

  if (!seedOwned) {
    return updates;
  }

  const fields = [
    "internalName",
    "slug",
    "canonicalPath",
    "heading",
    "heroDescription",
    "contentStatus",
  ];

  for (const field of fields) {
    if (operation[field] !== source[field]) {
      updates[field] = source[field];
    }
  }

  if (!hasSameContent(operation.seo, source.seo)) {
    updates.seo = source.seo;
  }

  return updates;
}

async function ensureOperation(
  strapi,
  operationSource,
  sourceSections,
  categoryDocumentId,
  priceDocumentIds,
) {
  const populate = operationPopulate();
  let operation = await findTargetOperation(strapi, operationSource);

  if (operation.slug !== operationSource.slug) {
    throw new Error("The matching operation has a conflicting slug.");
  }

  const editedInAdmin = await wasEditedInAdmin(
    strapi,
    OPERATION_UID,
    operation.id,
  );
  const seedOwned = isSeedOwnedOperation(
    operation,
    operationSource,
    categoryDocumentId,
    editedInAdmin,
  );
  const updates = editedInAdmin
    ? {}
    : mergeOperationFields(operation, operationSource, seedOwned);
  const contentSections = mergeContentSections(
    operation.contentSections,
    sourceSections,
    seedOwned,
  );

  if (!hasSameContent(operation.contentSections ?? [], contentSections)) {
    updates.contentSections = contentSections;
  }

  const categoryIds = (operation.categories ?? []).map(
    (category) => category.documentId,
  );

  if (!categoryIds.includes(categoryDocumentId)) {
    updates.categories = { set: [...categoryIds, categoryDocumentId] };
  }

  const existingPriceIds = (operation.prices ?? []).map(
    (price) => price.documentId,
  );
  const desiredPriceIds = seedOwned
    ? [
        ...priceDocumentIds,
        ...existingPriceIds.filter(
          (documentId) => !priceDocumentIds.includes(documentId),
        ),
      ]
    : [
        ...existingPriceIds,
        ...priceDocumentIds.filter(
          (documentId) => !existingPriceIds.includes(documentId),
        ),
      ];

  if (JSON.stringify(existingPriceIds) !== JSON.stringify(desiredPriceIds)) {
    updates.prices = { set: desiredPriceIds };
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

  if (editedInAdmin) {
    return {
      document: operation,
      result: published
        ? "preserved editor draft without publishing"
        : "preserved unpublished editor draft",
    };
  }

  if (!seedOwned) {
    return {
      document: operation,
      result: "preserved non-seed operation without publishing",
    };
  }

  if (!published || Object.keys(updates).length > 0) {
    await strapi.documents(OPERATION_UID).publish({
      documentId: operation.documentId,
    });
    return {
      document: operation,
      result: published
        ? "updated seed-owned published record"
        : "reused seed draft and published",
    };
  }

  return { document: operation, result: "reused published record" };
}

async function run() {
  const { operationCategories, operations } = await import("../seed/v1/data.mjs");
  const {
    breastAugmentationContentSections,
    breastAugmentationPrices,
  } = await import("../seed/v1/breast-augmentation.mjs");
  const categorySource = operationCategories.find(
    (category) => category.key === TARGET_CATEGORY_KEY,
  );
  const baseOperationSource = operations.find(
    (operation) => operation.canonicalPath === TARGET_PATH,
  );

  if (!categorySource || !baseOperationSource) {
    throw new Error("Breast augmentation seed source is incomplete.");
  }

  const operationSource = {
    ...baseOperationSource,
    contentStatus: "ready",
  };
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    const category = await ensureCategory(strapi, categorySource);
    const prices = [];

    for (const priceSource of breastAugmentationPrices) {
      prices.push(await ensurePrice(strapi, priceSource));
    }

    const operation = await ensureOperation(
      strapi,
      operationSource,
      breastAugmentationContentSections,
      category.document.documentId,
      prices.map(({ document }) => document.documentId),
    );

    strapi.log.info(`Breast category: ${category.result}.`);
    strapi.log.info(`Breast augmentation: ${operation.result}.`);
    for (const price of prices) {
      strapi.log.info(`Price ${price.document.key}: ${price.result}.`);
    }
  } finally {
    // Strapi 5.51.1 schedules document events after transaction commit without
    // exposing a drain promise. Let those local events finish before destroy()
    // removes the global Strapi instance used by output sanitization.
    await new Promise((resolve) => setTimeout(resolve, 500));
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
