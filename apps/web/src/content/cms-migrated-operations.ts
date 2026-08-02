import "server-only";

import { cache } from "react";

import { createContentRepository } from "./content-repository";
import { logCmsError } from "./cms-logging";

export const cmsMigratedOperationPaths = [
  "/operaczii/plastika-grudi/uvelichenie-grudi",
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
