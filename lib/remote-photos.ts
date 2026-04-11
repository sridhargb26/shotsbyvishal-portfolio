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

function isPhotoCategory(s: unknown): s is PhotoCategory {
  return typeof s === "string" && CATEGORIES.includes(s as PhotoCategory);
}

function normalizePhoto(raw: unknown): Photo | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const _id = typeof o._id === "string" ? o._id : null;
  const title = typeof o.title === "string" ? o.title : "Untitled";
  const imageUrl = typeof o.imageUrl === "string" ? o.imageUrl : null;
  if (!_id || !imageUrl) return null;
  const category = isPhotoCategory(o.category) ? o.category : "Editorial";
  const featured = Boolean(o.featured);
  const order = typeof o.order === "number" ? o.order : Number(o.order) || 999;
  const width = typeof o.width === "number" ? o.width : Number(o.width) || 1600;
  const height = typeof o.height === "number" ? o.height : Number(o.height) || 1200;
  const description =
    typeof o.description === "string" ? o.description : undefined;

  return {
    _id,
    title,
    category,
    featured,
    order,
    imageUrl,
    width,
    height,
    description,
  };
}

/**
 * Load photos from a public HTTPS JSON URL (array of Photo-shaped objects).
 * Host the file on R2, S3, GitHub raw, Gist, etc. Update the file to change the site without redeploying.
 */
export async function fetchPhotosFromRemoteJson(): Promise<Photo[]> {
  const url = process.env.PHOTOS_JSON_URL?.trim();
  if (!url) return [];

  const seconds =
    Number(process.env.CONTENT_REVALIDATE_SECONDS ?? "") || 120;

  const res = await fetch(url, {
    next: { revalidate: seconds },
  });

  if (!res.ok) {
    throw new Error(`PHOTOS_JSON_URL fetch failed: ${res.status}`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("PHOTOS_JSON_URL must return a JSON array");
  }

  const photos: Photo[] = [];
  for (const item of data) {
    const p = normalizePhoto(item);
    if (p) photos.push(p);
  }
  return photos;
}

export function isRemoteJsonConfigured(): boolean {
  return Boolean(process.env.PHOTOS_JSON_URL?.trim());
}
