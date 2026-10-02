import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Treat Prisma as a server-only package so Next.js doesn't bundle or
  // pre-render it at build time — avoids the "did not initialize yet" error
  // when no native query-engine binary is available in the build environment.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
