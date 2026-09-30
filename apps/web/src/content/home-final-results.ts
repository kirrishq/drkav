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
    const [groups, results, beforeAfterCases] = await Promise.all([
      repository.getOperationCatalog(),
      repository.getFinalResults(),
      repository.getBeforeAfterCases(),
    ]);

    if (results.length > 0 || beforeAfterCases.length === 0) {
      return { groups, results };
    }

    const derivedResults = beforeAfterCases.flatMap((item) => {
      const group = groups.find((candidate) =>
        candidate.operations.some((operation) => operation.canonicalPath === item.operation.canonicalPath),
      );

      if (!group) {
        return [];
      }

      return [{
        categoryKey: group.key,
        image: item.image,
        operation: item.operation,
        slug: item.slug,
        title: item.title,
      }];
    });

    return { groups, results: derivedResults };
  } catch (error) {
    logCmsError("cms_cold_request_failed", error, "/");
    return emptyContent;
  }
}
