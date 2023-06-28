/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [''],
  },
  webpack: (config, { }) => { return config },
  env: { GAME_SERVICE_URL: 'ws://localhost:3009' },
}

module.exports = nextConfig
