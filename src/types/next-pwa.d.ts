declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
  }

  function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export = withPWA;
}
