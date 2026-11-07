import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.platform !== "win32" ? { output: "standalone" } : {}),
  reactStrictMode: true,
  transpilePackages: ["@workspace/ui", "@workspace/contracts"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

export default nextConfig;

