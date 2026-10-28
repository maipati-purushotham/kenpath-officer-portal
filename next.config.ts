import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // <-- ఈ లైన్ యాడ్ చేయండి
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
