import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nos.wjv-1.neo.id",
        pathname: "/**",
      },
    ],
  }, output: "standalone",
};

export default nextConfig;
