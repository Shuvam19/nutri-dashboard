import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfmake"],
  allowedDevOrigins: ['192.168.1.107'],
}

export default nextConfig;
