import type { Photo, PhotoCategory } from "@/content/types";
import { mediaUrlFromStoragePath } from "@/lib/media-url";
import { createSupabaseAnon } from "@/lib/supabase/server";

const CATEGORIES: PhotoCategory[] = [
  "Portrait",
  "Street",
  "Editorial",
  "B&W",
  "Fashion",
  "Landscape",
  "Events",
];

function normalizeCategory(raw: string): PhotoCategory {
  const t = raw.trim();
  return CATEGORIES.includes(t as PhotoCategory)
    ? (t as PhotoCategory)
    : "Editorial";
}

export async function fetchPhotosFromSupabase(): Promise<Photo[]> {
  const supabase = createSupabaseAnon();
  if (!supabase) return [];

  const { data: photos, error: e1 } = await supabase
    .from("portfolio_photos")
    .select(
      "id, title, public_url, storage_path, width, height, sort_order, featured, album_id"
    )
    .order("sort_order", { ascending: true });

  if (e1 || !photos?.length) {
    return [];
  }

  const albumIds = Array.from(
    new Set(photos.map((p) => p.album_id as string))
  );
  const { data: albums, error: e2 } = await supabase
    .from("portfolio_albums")
    .select("id, category")
    .in("id", albumIds);

  if (e2 || !albums?.length) {
    return [];
  }

  const catByAlbum = new Map(albums.map((a) => [a.id, a.category as string]));

  const out: Photo[] = [];
  for (const row of photos as Array<{
    id: string;
    title: string | null;
    public_url: string;
    storage_path: string;
    width: number | null;
    height: number | null;
    sort_order: number | null;
    featured: boolean | null;
    album_id: string;
  }>) {
    const cat = catByAlbum.get(row.album_id) ?? "Editorial";
    const imageUrl = row.storage_path
      ? mediaUrlFromStoragePath(row.storage_path)
      : row.public_url;
    out.push({
      _id: row.id,
      title: row.title?.trim() || "Untitled",
      category: normalizeCategory(cat),
      featured: Boolean(row.featured),
      order: row.sort_order ?? 0,
      imageUrl,
      width: row.width ?? 1600,
      height: row.height ?? 1200,
    });
  }

  return out.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a._id.localeCompare(b._id);
  });
}
