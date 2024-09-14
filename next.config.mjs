// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
      API_URL: process.env.API_URL || 'http://localhost:8080/api/v1',
    },
  };
  
  export default nextConfig;