/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin explicitly — this repo lives inside /home/capybara, which also has
  // its own pnpm-lock.yaml one level up, so Turbopack's root inference
  // picks the wrong directory and warns on every `next dev`/`next build`.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
