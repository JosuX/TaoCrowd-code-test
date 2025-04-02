import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images2.imgbox.com"
      }
    ]
  }
};

export default nextConfig;
