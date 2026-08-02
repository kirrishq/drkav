import "server-only";

import { cache } from "react";

import { createContentRepository } from "./content-repository";

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

const loadCmsOperation = cache((path: CmsMigratedOperationPath) =>
  createContentRepository().getOperationByPath(path),
);

export function getCmsOperationByPath(path: CmsMigratedOperationPath) {
  return loadCmsOperation(path);
}
