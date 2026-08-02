"use client";

import { OperationErrorFallback } from "@/components/operation-content/operation-error-fallback";

type OperationErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OperationError({ reset }: OperationErrorProps) {
  return <OperationErrorFallback retry={reset} />;
}
