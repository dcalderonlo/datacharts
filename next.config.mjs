/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    resolveConditions: ['worker', 'browser', 'import', 'require', 'default'],
  },
};

export default nextConfig;
