/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    // Allow images from public folder
    unoptimized: false,
    remotePatterns: [],
  },
  // Allow self-signed certificates in server-side requests for staging
  webpack: (config, { isServer }) => {
    if (isServer) {
      // For server-side requests, we'll handle SSL in axios config
    }
    return config;
  },
};

export default nextConfig;
