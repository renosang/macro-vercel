// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
  // nếu có cấu hình images hoặc khác, copy y nguyên
  // images: { remotePatterns: [...] },
};

module.exports = nextConfig;