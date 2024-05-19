/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "export",
    distDir: "./dist",
    trailingSlash: true,
    basePath: "/admin"
};

export default nextConfig;
