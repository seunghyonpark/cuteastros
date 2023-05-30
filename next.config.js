/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nft-cdn.alchemy.com', 'ipfs.io', 'ipfs-2.thirdwebcdn.com'],
  },
}

module.exports = nextConfig
