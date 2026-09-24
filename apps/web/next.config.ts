import type { NextConfig } from "next";

import { siteRedirects } from "./src/content/site-redirects";

const nextConfig: NextConfig = {
  transpilePackages: ["@drkav/ui", "@drkav/content-contracts"],
  redirects: async () => [
    ...siteRedirects,
    { source: "/oferta.html", destination: "/oferta", permanent: true },
  ],
};

export default nextConfig;
