/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  basePath: isProd ? '/sistema' : '',
  assetPrefix: isProd ? '/sistema/' : undefined, // barra no final ajuda com assets
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true } // útil p/ static export em hospedagem tipo KingHost
};

module.exports = nextConfig;
