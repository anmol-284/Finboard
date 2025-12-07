/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Optimize production builds
  swcMinify: true,
};

module.exports = nextConfig;
