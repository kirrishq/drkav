import type { Metadata } from "next";
import { GeistMono, GeistSans } from "geist/font";
import { ConsultationProvider } from "@drkav/ui";

import "@/app/globals.css";
import { RevealObserver } from "@/components/reveal/reveal-observer";
import { SiteFooter } from "@/components/site-footer/site-footer";

export const metadata: Metadata = {
  title: "drkav.ru — редизайн",
  description: "Frontend-first редизайн сайта drkav.ru",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ConsultationProvider>
          <RevealObserver>
            {children}
            <SiteFooter />
          </RevealObserver>
        </ConsultationProvider>
      </body>
    </html>
  );
}
