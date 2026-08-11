'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CASE_UID = 'api::before-after-case.before-after-case';
const OPERATION_UID = 'api::operation.operation';
const imagePaths = {
  beforeImagePath: '/images/before-after/placeholder-before.png',
  afterImagePath: '/images/before-after/placeholder-after.png',
};

const cases = [
  ['uvelichenie-grudi', 'Увеличение груди', '/operaczii/plastika-grudi/uvelichenie-grudi'],
  ['podtyazhka-grudi', 'Подтяжка груди', '/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov'],
  ['abdominoplastika', 'Абдоминопластика', '/operaczii/abdominoplastika'],
  ['diastaz-bez-shramov', 'Диастаз без шрамов', '/operaczii/diastaz-myshc-zhivota'],
  ['liposkulptura', 'Липоскульптура', '/operaczii/liposkulptura'],
  ['lipofiling-yagodic', 'Липофилинг ягодиц', '/operaczii/lipofiling/lipofiling-yagodic'],
  ['podtyazhka-beder', 'Подтяжка бёдер', '/operaczii/liposkulptura/podtyazhka-beder'],
  ['podtyazhka-ruk', 'Подтяжка рук', '/operaczii/liposkulptura/podtyazhka-ruk'],
  ['ginekomastiya', 'Лечение гинекомастии', '/operaczii/muzhskaya-plastika/ginekomastiya'],
  ['asimmetriya-grudi', 'Коррекция асимметрии груди', '/operaczii/plastika-grudi/asimmetriya-grudi'],
  ['udalenie-implantov', 'Удаление имплантов груди', '/operaczii/plastika-grudi/udalenie-implantov-grudi'],
  ['rekonstrukciya-grudi', 'Реконструкция груди', '/operaczii/plastika-grudi/rekonstrukciya-grudi'],
  ['ultrazvukovaya-liposakciya', 'Ультразвуковая липосакция', '/operaczii/liposkulptura/ultrazvukovaya-liposakciya'],
  ['rf-lifting-tela', 'RF-лифтинг тела', '/operaczii/rf-lifting/rf-lifting-tela'],
  ['prorisovka-pressa', 'Прорисовка пресса', '/operaczii/muzhskaya-plastika/prorisovka-pressa'],
];

async function run() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    for (const [sortOrder, [slug, title, canonicalPath]] of cases.entries()) {
      const operation = await strapi.documents(OPERATION_UID).findFirst({
        filters: { canonicalPath },
        status: 'draft',
      });
      if (!operation) throw new Error(`Operation ${canonicalPath} is missing.`);

      const data = {
        ...imagePaths,
        title,
        slug,
        sortOrder,
        operation: { set: [operation.documentId] },
      };
      const existing = await strapi.documents(CASE_UID).findFirst({ filters: { slug }, status: 'draft' });
      const result = existing
        ? await strapi.documents(CASE_UID).update({ documentId: existing.documentId, data, status: 'draft' })
        : await strapi.documents(CASE_UID).create({ data, status: 'draft' });
      await strapi.documents(CASE_UID).publish({ documentId: result.documentId });
    }
    strapi.log.info(`Before/after seed complete: ${cases.length} cases.`);
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
