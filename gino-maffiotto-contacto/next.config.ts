import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel maneja Next.js nativamente, no necesitamos output: "standalone" */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permite imágenes desde el dominio de LinkedIn si las usamos en el futuro
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.licdn.com" },
    ],
  },
};

export default nextConfig;
