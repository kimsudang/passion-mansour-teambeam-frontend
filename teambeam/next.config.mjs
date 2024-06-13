/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST,
	NEXT_PUBLIC_DECODING: process.env.NEXT_PUBLIC_DECODING,
  },
};

export default nextConfig;
