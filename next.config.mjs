/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // experimental: {
    //   appDir: true, // Only if using the App Router
    // },
      images: {
          domains: ['cdn.sanity.io'], // Add this
        },
};

export default nextConfig;
