/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Allow Unsplash (including any query params like ?w=800&q=80)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        // IMPORTANT: do NOT put search: '' here
        // omitting the search key allows any query string
      },
    ],
  },

  poweredByHeader: false,
};

module.exports = nextConfig;