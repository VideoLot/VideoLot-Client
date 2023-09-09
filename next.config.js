const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');
const { CopyPrisma } = require('./copy-prisma');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    distDir: 'build',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/api/content/**'
            }
        ]
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
          config.plugins = [...config.plugins, new CopyPrisma()];
        }
    
        return config;
    }
}

module.exports = nextConfig;
