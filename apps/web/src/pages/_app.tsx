import type { AppProps } from "next/app";
import { ConsultationProvider } from "@drkav/ui";

import "@/app/globals.css";
import { RevealObserver } from "@/components/reveal/reveal-observer";

export default function PagesApp({ Component, pageProps }: AppProps) {
  return (
    <ConsultationProvider submitUrl="/api/forms/consultation">
      <RevealObserver>
        <Component {...pageProps} />
      </RevealObserver>
    </ConsultationProvider>
  );
}
