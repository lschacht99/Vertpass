/** @type {import('next').NextConfig} */

// When NEXT_STATIC_EXPORT=true (used by the GitHub Pages workflow), build a
// fully static site. The dynamic /api/ask route is skipped in that mode and
// the Ask AI tab falls back to the client-side engine. For a Node/Vercel
// deployment, leave it unset to keep the live API route.
const isExport = process.env.NEXT_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? {
        output: "export",
        basePath: basePath || undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
