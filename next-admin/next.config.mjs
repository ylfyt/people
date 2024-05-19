const basePath = process.env.ADMIN_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "export",
    distDir: "./dist",
    trailingSlash: true,
    basePath: basePath
};

export default nextConfig;
