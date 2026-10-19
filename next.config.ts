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
  async redirects() {
    return [
      {
        // 旧 /gacha ページはXでシェアされている可能性があるため、独立版の人生ガチャへ転送する
        source: '/gacha',
        destination: 'https://jinsei-gacha.vercel.app',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
