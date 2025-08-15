/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
fixes    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Add runtime configuration
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig;