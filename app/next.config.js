/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [''],
  },
  env: {
    WS_GAME_SERVICE_URL: 'ws://localhost:3009'
  }
}

module.exports = nextConfig
