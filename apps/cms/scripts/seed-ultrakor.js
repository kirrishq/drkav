// Strapi's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const ULTRAKOR_OPERATION_UID = "api::ultrakor-operation.ultrakor-operation";

async function upsertUltrakorOperation(strapi, source) {
  const existing = await strapi.documents(ULTRAKOR_OPERATION_UID).findFirst({
    filters: { canonicalPath: source.canonicalPath },
    status: "draft",
  });
  const result = existing
    ? await strapi.documents(ULTRAKOR_OPERATION_UID).update({
      documentId: existing.documentId,
      data: source,
      status: "draft",
    })
    : await strapi.documents(ULTRAKOR_OPERATION_UID).create({
      data: source,
      status: "draft",
    });

  await strapi.documents(ULTRAKOR_OPERATION_UID).publish({
    documentId: result.documentId,
  });
}

async function run() {
  const { ultrakorOperations } = await import("../seed/v1/ultrakor-operations.mjs");
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    for (const operation of ultrakorOperations) {
      await upsertUltrakorOperation(strapi, operation);
    }

    strapi.log.info(`Ultrakor seed complete: ${ultrakorOperations.length} operations.`);
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
