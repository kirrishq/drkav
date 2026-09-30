// Strapi 5.51's ESM entry uses a Node-incompatible lodash/fp directory import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const STATIC_PAGE_UID = "api::static-page.static-page";
const OPERATION_UID = "api::operation.operation";

const staticPageHeadings = [
  ["about-media", "Доктор Коробов в СМИ и специальных проектах"],
  ["about-school", "Не Школа — обучение пластических хирургов"],
  ["about-book", "Книга доктора Коробова А.В."],
  ["tests", "Список анализов перед операцией"],
];

async function updatePublishedDocument(strapi, uid, filters, heading) {
  const records = await strapi.documents(uid).findMany({ filters, status: "draft" });
  if (records.length !== 1) {
    throw new Error(`Expected one ${uid} record, found ${records.length}.`);
  }

  const record = await strapi.documents(uid).update({
    documentId: records[0].documentId,
    data: { heading },
    status: "draft",
  });

  await strapi.documents(uid).publish({ documentId: record.documentId });
  return record.documentId;
}

async function run() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    for (const [pageKey, heading] of staticPageHeadings) {
      await updatePublishedDocument(strapi, STATIC_PAGE_UID, { pageKey }, heading);
      strapi.log.info(`Aligned ${pageKey}: ${heading}`);
    }

    await updatePublishedDocument(
      strapi,
      OPERATION_UID,
      { canonicalPath: "/operaczii/plastika-grudi/uvelichenie-grudi" },
      "Увеличение груди",
    );
    strapi.log.info("Aligned breast augmentation heading.");
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
