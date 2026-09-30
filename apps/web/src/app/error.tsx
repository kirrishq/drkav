"use client";

import { CmsUnavailableFallback } from "@/components/content-page/cms-unavailable-fallback";

export default function GlobalErrorFallback({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <CmsUnavailableFallback retry={reset} />;
}
