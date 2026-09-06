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

const themeBootstrapScript = `(() => {
  try {
    const theme = window.localStorage.getItem("drkav-theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch {}
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
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
