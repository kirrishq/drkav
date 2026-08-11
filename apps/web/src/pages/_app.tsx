import type { AppProps } from "next/app";

import "@/app/globals.css";
import { RevealObserver } from "@/components/reveal/reveal-observer";

export default function PagesApp({ Component, pageProps }: AppProps) {
  return (
    <RevealObserver>
      <Component {...pageProps} />
    </RevealObserver>
  );
}
