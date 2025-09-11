/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable checks to get the build working
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Production settings from your CJS file
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || '',
  },
  reactStrictMode: true,
  images: {
    domains: ['secure.its.yale.edu'],
  },
};

export default nextConfig;