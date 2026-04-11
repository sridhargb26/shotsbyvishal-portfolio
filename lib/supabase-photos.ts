import type { Photo, PhotoCategory, Slide } from "@/content/types";
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

/** Which album visibility flag must be true for a photo to appear. */
export type SupabasePhotoScope = "gallery" | "commercial" | "editorial";

function albumMatchesScope(
  album: {
    show_in_gallery?: boolean | null;
    show_in_commercial?: boolean | null;
    show_in_editorial?: boolean | null;
  },
  scope: SupabasePhotoScope
): boolean {
  const g = album.show_in_gallery !== false;
  const c = album.show_in_commercial === true;
  const e = album.show_in_editorial === true;
  switch (scope) {
    case "gallery":
      return g;
    case "commercial":
      return c;
    case "editorial":
      return e;
    default:
      return g;
  }
}

export async function fetchPhotosFromSupabase(
  scope: SupabasePhotoScope = "gallery"
): Promise<Photo[]> {
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
    .select(
      "id, category, show_in_gallery, show_in_commercial, show_in_editorial"
    )
    .in("id", albumIds);

  if (e2 || !albums?.length) {
    return [];
  }

  const albumById = new Map(
    albums.map((a) => [
      a.id,
      a as {
        id: string;
        category: string;
        show_in_gallery?: boolean | null;
        show_in_commercial?: boolean | null;
        show_in_editorial?: boolean | null;
      },
    ])
  );

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
    const album = albumById.get(row.album_id);
    if (!album || !albumMatchesScope(album, scope)) continue;

    const cat = album.category ?? "Editorial";
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

export async function fetchHomepageSlides(): Promise<Slide[]> {
  const supabase = createSupabaseAnon();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("homepage_slides")
    .select("id, sort_order, media_type, public_url, storage_path, caption, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];

  return data.map((row) => ({
    id: row.id,
    sortOrder: row.sort_order,
    mediaType: row.media_type as "photo" | "video",
    url: row.storage_path
      ? mediaUrlFromStoragePath(row.storage_path)
      : row.public_url,
    caption: row.caption ?? undefined,
    active: row.active,
  }));
}
