import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging.talkify.pro",
      },
      {
        protocol: "https",
        hostname: "posminion.sgp1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname:  "placehold.co" ,
      },
    ],
  },
};

export default nextConfig;
