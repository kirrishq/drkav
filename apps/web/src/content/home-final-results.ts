import "server-only";

import type {
  FinalResult,
  OperationCatalogGroup,
} from "@drkav/content-contracts";

import { logCmsError } from "./cms-logging";
import { createContentRepository } from "./content-repository";

export type HomeFinalResultsContent = {
  groups: readonly OperationCatalogGroup[];
  results: readonly FinalResult[];
};

const emptyContent: HomeFinalResultsContent = {
  groups: [],
  results: [],
};

export async function getHomeFinalResults(): Promise<HomeFinalResultsContent> {
  try {
    const repository = createContentRepository();
    const [groups, results] = await Promise.all([
      repository.getOperationCatalog(),
      repository.getFinalResults(),
    ]);

    return { groups, results };
  } catch (error) {
    logCmsError("cms_cold_request_failed", error, "/");
    return emptyContent;
  }
}
