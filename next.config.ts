import type { NextConfig } from "next";

// Config for GitHub Pages 
const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, 
  }, 
  assetPrefix: isProd ? "/CipherApp" : "",
  basePath: isProd ? "/CipherApp" : "",
  output: "export",
};

export default nextConfig;
