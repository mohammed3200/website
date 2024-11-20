import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"], // Add your desired hostname here
  },
};

export default withNextIntl(nextConfig);
