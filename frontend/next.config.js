/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      ...(process.env.NEXT_PUBLIC_BACKEND_HOST
        ? [{
            protocol: 'https',
            hostname: process.env.NEXT_PUBLIC_BACKEND_HOST,
            pathname: '/uploads/**',
          }]
        : []),
    ],
  },
}

module.exports = nextConfig
