import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.2.213'],
  images: { unoptimized: true }
};

export default withMDX(config);
