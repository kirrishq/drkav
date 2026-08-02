import type { NextConfig } from "next";

import { siteRedirects } from "./src/content/site-redirects";

const nextConfig: NextConfig = {
  transpilePackages: ["@drkav/ui", "@drkav/content-contracts"],
  redirects: async () => [...siteRedirects],
};

export default nextConfig;
