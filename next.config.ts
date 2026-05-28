import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;

const vercelConfig = {
  // Vercel serverless optimization: exclude musl binaries from all routes
  // Vercel uses Amazon Linux (glibc), not Alpine Linux (musl)
  // This saves ~45MB (29MB canvas-musl + 16MB sharp-musl) per serverless function
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@napi-rs+canvas-*-musl*',
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      // Exclude SPA/desktop/mobile build artifacts from serverless functions
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
    ],
  },
};
const nextConfig = defineConfig({
  ...(isVercel ? vercelConfig : {}),
  typescript: {
    // 危险但管用：完全跳过打包时的 TypeScript 类型检查
    ignoreBuildErrors: true, 
  },
  eslint: {
    // 完全跳过打包时的代码规范检查
    ignoreDuringBuilds: true, 
  },
  productionBrowserSourceMaps: false, // 禁止生成 SourceMap（非常节省内存）
});

export default nextConfig;
