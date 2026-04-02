import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sclvslmyidxlalrgukzx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'v1.screenshot.11ty.dev',
      },
      {
        protocol: 'https',
        hostname: 'image.thum.io',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },
};

export default nextConfig;
