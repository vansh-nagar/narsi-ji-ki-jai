import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // allow all Cloudinary images
      },
    ],
  },
    typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
