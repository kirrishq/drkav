import "server-only";

import { cache } from "react";

import { createContentRepository } from "./content-repository";
import { logCmsError } from "./cms-logging";

export const cmsMigratedOperationPaths = [
  "/operaczii/abdominoplastika",
  "/operaczii/diastaz-myshc-zhivota",
  "/operaczii/intimnaya-plastika",
  "/operaczii/lipofiling",
  "/operaczii/lipofiling/lipofiling-grudi",
  "/operaczii/lipofiling/lipofiling-yagodic",
  "/operaczii/liposakcziya/liposakcziya-ruk",
  "/operaczii/liposakcziya/liposakcziya-spiny",
  "/operaczii/liposakcziya/liposakcziya-vdovego-gorbika",
  "/operaczii/liposkulptura",
  "/operaczii/liposkulptura/podtyazhka-beder",
  "/operaczii/liposkulptura/podtyazhka-ruk",
  "/operaczii/liposkulptura/podtyazhka-yagodic",
  "/operaczii/liposkulptura/ultrazvukovaya-liposakciya",
  "/operaczii/muzhskaya-plastika",
  "/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin",
  "/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk",
  "/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin",
  "/operaczii/muzhskaya-plastika/ginekomastiya",
  "/operaczii/muzhskaya-plastika/lechenie-ginekompastii",
  "/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder",
  "/operaczii/muzhskaya-plastika/prorisovka-pressa",
  "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya",
  "/operaczii/plasticheskaya-hirurgiya-posle-rodov",
  "/operaczii/plastika-grudi",
  "/operaczii/plastika-grudi/asimmetriya-grudi",
  "/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov",
  "/operaczii/plastika-grudi/rekonstrukciya-grudi",
  "/operaczii/plastika-grudi/udalenie-implantov-grudi",
  "/operaczii/plastika-grudi/umenshenie-grudi",
  "/operaczii/plastika-grudi/uvelichenie-grudi",
  "/operaczii/rf-lifting",
  "/operaczii/rf-lifting/rf-lifting-morpheus-8",
  "/operaczii/rf-lifting/rf-lifting-shei-i-dekolte",
  "/operaczii/rf-lifting/rf-lifting-tela",
  "/operaczii/rf-lifting/rf-lifting-zhivota",
] as const;

export type CmsMigratedOperationPath =
  (typeof cmsMigratedOperationPaths)[number];

export function isCmsMigratedOperationPath(
  path: string,
): path is CmsMigratedOperationPath {
  return cmsMigratedOperationPaths.some((candidate) => candidate === path);
}

const loadCmsOperation = cache(async (path: CmsMigratedOperationPath) => {
  try {
    return await createContentRepository().getOperationByPath(path);
  } catch (error) {
    logCmsError("cms_fetch_or_revalidation_failed", error, path);
    throw error;
  }
});

export function getCmsOperationByPath(path: CmsMigratedOperationPath) {
  return loadCmsOperation(path);
}
