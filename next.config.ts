/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // simplest version:
    domains: ['img.clerk.com'],

    // or, if you prefer remotePatterns:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'img.clerk.com',
    //   },
    // ],
  },
};

module.exports = nextConfig;
