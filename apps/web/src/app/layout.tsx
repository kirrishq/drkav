import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { ContactFab, ConsultationProvider } from "@drkav/ui";

import "@/app/globals.css";
import { RevealObserver } from "@/components/reveal/reveal-observer";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { createContactActions } from "@/components/site-header/contact-actions";
import { CookieConsent } from "@/components/cookie-consent/cookie-consent";
import { MarketingAttribution } from "@/components/marketing-attribution/marketing-attribution";
import { NavigationScrollRestoration } from "@/components/navigation-scroll-restoration/navigation-scroll-restoration";
import { YandexMetrika } from "@/components/yandex-metrika/yandex-metrika";
import { getSiteUrl } from "@/content/seo";
import { getSiteNavigation } from "@/content/site-navigation";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Пластический хирург Артём Коробов — DrKAV",
  description: "Официальный сайт пластического хирурга Артёма Владимировича Коробова: операции, цены, результаты, статьи, отзывы и запись на консультацию в Москве.",
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

const smartCaptchaSiteKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY?.trim();

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteNavigation = await getSiteNavigation();

  return (
    <html data-scroll-behavior="smooth" lang="ru" suppressHydrationWarning>
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        {smartCaptchaSiteKey ? (
          <Script
            src="https://smartcaptcha.cloud.yandex.ru/captcha.js"
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body className={GeistSans.variable}>
        <YandexMetrika />
        <MarketingAttribution />
        <NavigationScrollRestoration />
        <CookieConsent />
        <ConsultationProvider captchaSiteKey={smartCaptchaSiteKey} submitUrl="/api/forms/consultation">
          <RevealObserver>
            {children}
            <ContactFab actions={createContactActions(siteNavigation.contact)} />
            <SiteFooter navigation={siteNavigation} />
          </RevealObserver>
        </ConsultationProvider>
      </body>
    </html>
  );
}
