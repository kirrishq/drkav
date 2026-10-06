import type { NextConfig } from "next";

import { siteRedirects } from "./src/content/site-redirects";

const isDevelopment = process.env.NODE_ENV !== "production";
const developmentCmsImageSources = isDevelopment
  ? " http://localhost:1337 http://127.0.0.1:1337"
  : "";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://mc.yandex.ru https://smartcaptcha.cloud.yandex.ru`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https:${developmentCmsImageSources}`,
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https://mc.yandex.ru wss://mc.yandex.ru https://smartcaptcha.cloud.yandex.ru",
  "frame-src 'self' https://yandex.ru https://*.yandex.ru",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Yandex Webvisor renders the site in a controlled frame for session playback.
  "frame-ancestors 'self' https://metrika.yandex.ru https://metrika.yandex.by https://metrica.yandex.com https://metrica.yandex.com.tr https://webvisor.com https://*.webvisor.com",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  ...(process.env.SITE_URL?.startsWith("https://") && !isDevelopment
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const cmsImageRemotePatterns = (() => {
  const cmsUrl = process.env.STRAPI_API_URL;

  if (!cmsUrl) {
    return [];
  }

  try {
    const parsedUrl = new URL(cmsUrl);

    return [{
      hostname: parsedUrl.hostname,
      pathname: "/**",
      port: parsedUrl.port || undefined,
      protocol: parsedUrl.protocol.replace(":", "") as "http" | "https",
    }];
  } catch {
    return [];
  }
})();

const s3ImageRemotePatterns = [{
  hostname: "s3.ru1.storage.beget.cloud",
  pathname: "/**",
  protocol: "https" as const,
}];

const nextConfig: NextConfig = {
  headers: async () => [{ source: "/(.*)", headers: securityHeaders }],
  images: {
    remotePatterns: [
      ...cmsImageRemotePatterns,
      ...s3ImageRemotePatterns,
    ],
  },
  transpilePackages: ["@drkav/ui", "@drkav/content-contracts"],
  redirects: async () => [
    ...siteRedirects,
    { source: "/oferta.html", destination: "/oferta", permanent: true },
  ],
};

export default nextConfig;
