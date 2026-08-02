import "server-only";

import { getCmsErrorCode } from "./cms-errors";

type CmsLogEvent =
  | "cms_cold_request_failed"
  | "cms_fetch_or_revalidation_failed"
  | "cms_metadata_fallback_rendered";

export function logCmsError(
  event: CmsLogEvent,
  error: unknown,
  routePath: string,
): void {
  console.error("[cms]", {
    code: getCmsErrorCode(error),
    event,
    routePath,
  });
}
