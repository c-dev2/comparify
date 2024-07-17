/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/search', // Redirect default page to /search
            permanent: true,
          },
        ];
      },
};

export default nextConfig;
