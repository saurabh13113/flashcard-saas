import bundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: [
            "@clerk/nextjs",
            "@mui/material",
            "firebase"
        ]
    }
}


const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

const config = withBundleAnalyzer(nextConfig)

export default config
