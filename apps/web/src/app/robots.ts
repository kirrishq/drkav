import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/content/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/design-system/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
