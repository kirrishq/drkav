import type { NextConfig } from "next";

import { siteRedirects } from "./src/content/site-redirects";

const isDevelopment = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://mc.yandex.ru https://smartcaptcha.cloud.yandex.ru`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https://mc.yandex.ru https://smartcaptcha.cloud.yandex.ru",
  "frame-src 'self' https://yandex.ru https://*.yandex.ru",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  ...(process.env.SITE_URL?.startsWith("https://") && !isDevelopment
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  headers: async () => [{ source: "/(.*)", headers: securityHeaders }],
  transpilePackages: ["@drkav/ui", "@drkav/content-contracts"],
  redirects: async () => [
    ...siteRedirects,
    { source: "/oferta.html", destination: "/oferta", permanent: true },
  ],
};

export default nextConfig;
