/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
];

try {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (u) {
    const hostname = new URL(u).hostname;
    remotePatterns.push({
      protocol: "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    });
  }
} catch {
  // ignore invalid URL at build time
}

const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";

const nextConfig = {
  images: {
    // Serve remote URLs as-is (no /_next/image?url=... proxy). Use sharp uploads or CDN if you need resizing.
    unoptimized: true,
    remotePatterns,
  },
  async rewrites() {
    if (!supabaseBase) return [];
    return [
      {
        source: "/media/:path*",
        destination: `${supabaseBase}/storage/v1/object/public/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
