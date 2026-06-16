import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? "/en" : undefined,
  assetPrefix: isGithubPages ? "/en/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
