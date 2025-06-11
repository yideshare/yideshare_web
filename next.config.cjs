/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || '',
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Configure image domains if you're using next/image
  images: {
    domains: ['secure.its.yale.edu'],
  },
};

module.exports = nextConfig; 