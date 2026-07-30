import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@drkav/ui", "@drkav/content-contracts"],
};

export default nextConfig;
