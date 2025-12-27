import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Uncomment and adjust if your repo is not at root (e.g., username.github.io/repo-name)
  // basePath: '/belajar-konsep-dengan-visualisasi',
  // assetPrefix: '/belajar-konsep-dengan-visualisasi/',
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
