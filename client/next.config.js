/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React Strict Mode for better debugging
  images: {
    domains: ["localhost"], // Allows images from backend (e.g., http://localhost:5000/uploads)
  },
  trailingSlash: false, // Ensures URLs don't end with a slash
};

module.exports = nextConfig;