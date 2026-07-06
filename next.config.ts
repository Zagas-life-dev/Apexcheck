import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Packages that must stay external to the server bundle (native/dynamic requires).
  serverExternalPackages: ["mongoose", "mongodb-memory-server", "@react-pdf/renderer"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
