import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "host.docker.internal", "192.168.0.44"],
};

export default nextConfig;
