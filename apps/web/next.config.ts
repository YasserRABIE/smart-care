import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.resolve(dirname, '../..')

const nextConfig: NextConfig = {
  // Self-contained server bundle for the production Docker image (apps/web/Dockerfile).
  output: 'standalone',
  // 'use cache' + cacheTag in lib/data; Payload hooks call revalidateTag (Phase 3).
  cacheComponents: true,
  transpilePackages: ['@smart-care/shared'],
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
