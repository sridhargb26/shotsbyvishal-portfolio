import { v2 as cloudinary } from "cloudinary";
import type { Photo, PhotoCategory } from "@/content/types";

const CATEGORIES: PhotoCategory[] = [
  "Portrait",
  "Street",
  "Editorial",
  "B&W",
  "Fashion",
  "Landscape",
  "Events",
];

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function normalizeCategory(raw: string | undefined): PhotoCategory {
  if (!raw) return "Editorial";
  const t = raw.trim();
  return CATEGORIES.includes(t as PhotoCategory) ? (t as PhotoCategory) : "Editorial";
}

function readContextCustom(resource: {
  context?: { custom?: Record<string, string> };
}): Record<string, string> {
  return resource.context?.custom ?? {};
}

/**
 * Loads images from Cloudinary folder `shotsbyvishal` (see search expression).
 * Per-asset metadata (set in Cloudinary Media Library → image → Metadata / Structured metadata):
 * - category: Portrait | Street | Editorial | B&W | Fashion | Landscape | Events
 * - title: display title (optional; falls back to filename)
 * - featured: "true" to include on homepage grid
 * - order: "0", "1", … for homepage order among featured
 */
export async function fetchCloudinaryPhotos(): Promise<Photo[]> {
  if (!isCloudinaryConfigured()) return [];

  configureCloudinary();

  const result = await cloudinary.search
    .expression("folder:shotsbyvishal/*")
    .sort_by("created_at", "desc")
    .with_field("context")
    .max_results(200)
    .execute();

  const resources = (result.resources ?? []) as Array<{
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
    context?: { custom?: Record<string, string> };
  }>;

  return resources.map((r) => {
    const custom = readContextCustom(r);
    const title =
      custom.title?.trim() ||
      r.public_id.split("/").pop()?.replace(/_/g, " ") ||
      "Untitled";
    const featured = custom.featured === "true" || custom.featured === "1";
    const order = Number.parseInt(custom.order ?? "999", 10);
    const orderSafe = Number.isFinite(order) ? order : 999;

    return {
      _id: r.public_id,
      title,
      category: normalizeCategory(custom.category),
      featured,
      order: orderSafe,
      imageUrl: r.secure_url,
      width: r.width ?? 1600,
      height: r.height ?? 1200,
      description: custom.description,
    } satisfies Photo;
  });
}
