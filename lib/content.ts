import { photos as staticPhotos } from "@/content/photos";
import { siteSettings } from "@/content/site";
import type { Album, Photo, Slide } from "@/content/types";
import {
  fetchCloudinaryPhotos,
  isCloudinaryConfigured,
} from "@/lib/cloudinary-photos";
import {
  fetchPhotosFromRemoteJson,
  isRemoteJsonConfigured,
} from "@/lib/remote-photos";
import { fetchPhotosFromSupabase, fetchHomepageSlides } from "@/lib/supabase-photos";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export function getSiteSettings() {
  return siteSettings;
}

type ContentMode = "static" | "json" | "cloudinary" | "supabase";

function contentMode(): ContentMode {
  const src = process.env.CONTENT_SOURCE?.toLowerCase().trim();
  if (src === "json") return "json";
  if (src === "supabase") return "supabase";
  if (src === "cloudinary") return "cloudinary";
  return "static";
}

async function loadAllPhotos(): Promise<Photo[]> {
  const mode = contentMode();

  if (mode === "json" && isRemoteJsonConfigured()) {
    try {
      const remote = await fetchPhotosFromRemoteJson();
      return remote.length > 0 ? remote : staticPhotos;
    } catch {
      return staticPhotos;
    }
  }

  if (mode === "supabase" && isSupabaseConfigured()) {
    try {
      const remote = await fetchPhotosFromSupabase();
      return remote.length > 0 ? remote : staticPhotos;
    } catch {
      return staticPhotos;
    }
  }

  if (mode === "cloudinary" && isCloudinaryConfigured()) {
    try {
      const remote = await fetchCloudinaryPhotos();
      return remote.length > 0 ? remote : staticPhotos;
    } catch {
      return staticPhotos;
    }
  }

  return staticPhotos;
}

export async function getPhotos(category?: string): Promise<Photo[]> {
  const allPhotos = await loadAllPhotos();
  const filter =
    category && category !== "All"
      ? (p: Photo) => p.category === category
      : () => true;
  return [...allPhotos].filter(filter).sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a._id.localeCompare(b._id);
  });
}

export async function getFeaturedPhotos(): Promise<Photo[]> {
  const allPhotos = await loadAllPhotos();
  const featured = [...allPhotos]
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 8);
  // Fallback: if nothing is marked featured, use the first 8 photos
  if (featured.length === 0) {
    return [...allPhotos].sort((a, b) => a.order - b.order).slice(0, 8);
  }
  return featured;
}

export async function getAlbums(): Promise<Album[]> {
  const allPhotos = await loadAllPhotos();

  // Group by category
  const map = new Map<string, Photo[]>();
  for (const photo of allPhotos) {
    const key = photo.category;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(photo);
  }

  const albums: Album[] = [];
  map.forEach((photos, category) => {
    const sorted = photos.sort((a, b) => a.order - b.order);
    albums.push({
      _id: category.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      title: category,
      category: category as Album["category"],
      coverUrl: sorted[0].imageUrl,
      photoCount: sorted.length,
      photos: sorted,
    });
  });

  // Sort albums by total photo count descending (most work first)
  return albums.sort((a, b) => b.photoCount - a.photoCount);
}

/**
 * Returns homepage slides from Supabase `homepage_slides` table.
 * Falls back to featured photos (as photo slides) if Supabase is not
 * configured or the table is empty.
 */
export async function getHomepageSlides(): Promise<Slide[]> {
  if (isSupabaseConfigured()) {
    try {
      const slides = await fetchHomepageSlides();
      if (slides.length > 0) return slides;
    } catch {
      // fall through to photo fallback
    }
  }

  // Fallback: convert featured photos → slides
  const photos = await getFeaturedPhotos();
  return photos.map((p) => ({
    id: p._id,
    sortOrder: p.order,
    mediaType: "photo" as const,
    url: p.imageUrl,
    caption: p.title,
    active: true,
  }));
}
