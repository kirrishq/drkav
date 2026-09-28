import type { Metadata } from "next";
import Script from "next/script";
import { GeistMono, GeistSans } from "geist/font";
import { ContactFab, ConsultationProvider } from "@drkav/ui";

import "@/app/globals.css";
import { RevealObserver } from "@/components/reveal/reveal-observer";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { contactActions } from "@/components/site-header/contact-actions";

export const metadata: Metadata = {
  title: "drkav.ru — редизайн",
  description: "Frontend-first редизайн сайта drkav.ru",
};

const themeBootstrapScript = `(() => {
  try {
    const storedTheme = window.localStorage.getItem("drkav-theme");
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    const root = document.documentElement;
    root.dataset.theme = theme;

    if (window.localStorage.getItem("drkav-low-vision") === "true") {
      root.dataset.vision = "low-vision";
    }

    const storedVisionSettings = window.localStorage.getItem("drkav-low-vision-settings");

    if (storedVisionSettings) {
      try {
        const settings = JSON.parse(storedVisionSettings);

        if (settings && typeof settings === "object") {
          if (["standard", "large", "extra-large"].includes(settings.fontSize)) {
            root.dataset.visionFontSize = settings.fontSize;
          }
          if (["black-on-white", "white-on-black", "yellow-on-black"].includes(settings.palette)) {
            root.dataset.visionPalette = settings.palette;
          }
          if (["standard", "large"].includes(settings.lineHeight)) {
            root.dataset.visionLineHeight = settings.lineHeight;
          }
          if (["standard", "large"].includes(settings.letterSpacing)) {
            root.dataset.visionLetterSpacing = settings.letterSpacing;
          }
        }
      } catch {}
    }
  } catch {}
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ConsultationProvider submitUrl="/api/forms/consultation">
          <RevealObserver>
            {children}
            <ContactFab actions={contactActions} />
            <SiteFooter />
          </RevealObserver>
        </ConsultationProvider>
      </body>
    </html>
  );
}
