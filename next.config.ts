import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "aiinterviewhub.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
      },
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
      },
      {
        protocol: "https",
        hostname: "www.board.com",
      },
      {
        protocol: "https",
        hostname: "cdn.comparitech.com",
      },
      {
        protocol: "https",
        hostname: "sp-ao.shortpixel.ai",
      },
      {
        protocol: "https",
        hostname: "www.programminginpython.com",
      },
      {
        protocol: "https",
        hostname: "uiworkshop.com",
      },
      {
        protocol: "https",
        hostname: "www.researchgate.net",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
