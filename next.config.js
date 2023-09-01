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
    }
}

module.exports = nextConfig
