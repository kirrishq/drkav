import Head from "next/head";

import { CmsUnavailableFallback } from "@/components/content-page/cms-unavailable-fallback";

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
      <CmsUnavailableFallback retry={retry} />
    </>
  );
}
