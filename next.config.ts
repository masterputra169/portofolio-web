import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_SHA: (process.env.GITHUB_SHA ?? process.env.CF_PAGES_COMMIT_SHA ?? 'local').slice(0, 7),
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
}

export default nextConfig
