import Head from "next/head";

import { OperationErrorFallback } from "@/components/operation-content/operation-error-fallback";

export default function ServerErrorPage() {
  function retry() {
    window.location.reload();
  }

  return (
    <>
      <Head>
        <title>Информация временно недоступна</title>
        <meta content="noindex, nofollow" name="robots" />
      </Head>
      <OperationErrorFallback retry={retry} />
    </>
  );
}
