import { photos as staticPhotos } from "@/content/photos";
import { siteSettings } from "@/content/site";
import type { Photo } from "@/content/types";
import {
  fetchCloudinaryPhotos,
  isCloudinaryConfigured,
} from "@/lib/cloudinary-photos";

export function getSiteSettings() {
  return siteSettings;
}

function useCloudinaryLibrary(): boolean {
  return process.env.CONTENT_SOURCE === "cloudinary";
}

async function loadAllPhotos(): Promise<Photo[]> {
  if (!useCloudinaryLibrary() || !isCloudinaryConfigured()) {
    return staticPhotos;
  }
  try {
    const remote = await fetchCloudinaryPhotos();
    return remote.length > 0 ? remote : staticPhotos;
  } catch {
    return staticPhotos;
  }
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
  return [...allPhotos]
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);
}
