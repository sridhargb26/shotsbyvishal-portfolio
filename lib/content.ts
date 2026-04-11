import { photos as staticPhotos } from "@/content/photos";
import { siteSettings } from "@/content/site";
import type { Photo } from "@/content/types";
import {
  fetchCloudinaryPhotos,
  isCloudinaryConfigured,
} from "@/lib/cloudinary-photos";
import {
  fetchPhotosFromRemoteJson,
  isRemoteJsonConfigured,
} from "@/lib/remote-photos";
import { fetchPhotosFromSupabase } from "@/lib/supabase-photos";
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
  return [...allPhotos]
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);
}
