"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";
import { createSupabaseService } from "@/lib/supabase/server";
import { uniqueSlug } from "@/lib/slug";
import {
  assertAtLeastOneVisibility,
  parseAlbumVisibilityFromForm,
} from "@/lib/album-visibility";
import type { PhotoCategory } from "@/content/types";

const CATEGORY_OPTIONS: PhotoCategory[] = [
  "Portrait",
  "Street",
  "Editorial",
  "B&W",
  "Fashion",
  "Landscape",
  "Events",
];

function assertAdmin() {
  if (!verifyAdminSession(cookies().get(COOKIE_NAME)?.value)) {
    throw new Error("Unauthorized");
  }
}

function assertCategory(c: string): PhotoCategory {
  const t = c.trim();
  if (!CATEGORY_OPTIONS.includes(t as PhotoCategory)) {
    throw new Error("Invalid category");
  }
  return t as PhotoCategory;
}

export async function createAlbumAction(formData: FormData) {
  assertAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const category = assertCategory(String(formData.get("category") ?? ""));
  if (!title) throw new Error("Title is required");

  const vis = parseAlbumVisibilityFromForm(formData);
  assertAtLeastOneVisibility(vis);

  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const slug = uniqueSlug(title);
  const { error } = await supabase.from("portfolio_albums").insert({
    title,
    slug,
    category,
    ...vis,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/albums");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function updateAlbumVisibilityAction(formData: FormData) {
  assertAdmin();
  const albumId = String(formData.get("albumId") ?? "").trim();
  if (!albumId) throw new Error("Missing album");

  const vis = parseAlbumVisibilityFromForm(formData);
  assertAtLeastOneVisibility(vis);

  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("portfolio_albums")
    .update(vis)
    .eq("id", albumId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/albums");
  revalidatePath(`/admin/albums/${albumId}`);
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deleteAlbumAction(albumId: string) {
  assertAdmin();
  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: photos } = await supabase
    .from("portfolio_photos")
    .select("storage_path")
    .eq("album_id", albumId);

  const paths = photos?.map((p) => p.storage_path).filter(Boolean) ?? [];
  if (paths.length) {
    await supabase.storage.from("portfolio").remove(paths);
  }

  const { error } = await supabase
    .from("portfolio_albums")
    .delete()
    .eq("id", albumId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/albums");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function uploadPhotosAction(formData: FormData) {
  assertAdmin();
  const albumId = String(formData.get("albumId") ?? "").trim();
  const files = formData.getAll("files") as File[];
  if (!albumId || files.length === 0) throw new Error("Album and files required");

  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { count } = await supabase
    .from("portfolio_photos")
    .select("*", { count: "exact", head: true })
    .eq("album_id", albumId);

  let sortBase = count ?? 0;

  for (const file of files) {
    if (!file.size || !file.type.startsWith("image/")) continue;

    const buf = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "image.jpg";
    const path = `${albumId}/${randomBytes(6).toString("hex")}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from("portfolio")
      .upload(path, buf, { contentType: file.type || "image/jpeg", upsert: false });

    if (upErr) throw new Error(upErr.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio").getPublicUrl(path);

    const title = safeName.replace(/\.[^.]+$/, "") || "Photo";

    const { error: insErr } = await supabase.from("portfolio_photos").insert({
      album_id: albumId,
      title,
      storage_path: path,
      public_url: publicUrl,
      sort_order: sortBase++,
    });

    if (insErr) throw new Error(insErr.message);
  }

  revalidatePath(`/admin/albums/${albumId}`);
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deletePhotoAction(photoId: string, albumId: string) {
  assertAdmin();
  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: row } = await supabase
    .from("portfolio_photos")
    .select("storage_path")
    .eq("id", photoId)
    .single();

  if (row?.storage_path) {
    await supabase.storage.from("portfolio").remove([row.storage_path]);
  }

  const { error } = await supabase.from("portfolio_photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/albums/${albumId}`);
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function setPhotoFeaturedAction(
  photoId: string,
  albumId: string,
  featured: boolean
) {
  assertAdmin();
  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("portfolio_photos")
    .update({ featured })
    .eq("id", photoId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/albums/${albumId}`);
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deletePhotoFormAction(formData: FormData) {
  const photoId = String(formData.get("photoId") ?? "").trim();
  const albumId = String(formData.get("albumId") ?? "").trim();
  if (!photoId || !albumId) throw new Error("Missing fields");
  await deletePhotoAction(photoId, albumId);
}

export async function setFeaturedFormAction(formData: FormData) {
  const photoId = String(formData.get("photoId") ?? "").trim();
  const albumId = String(formData.get("albumId") ?? "").trim();
  const featured = formData.get("featured") === "true";
  if (!photoId || !albumId) throw new Error("Missing fields");
  await setPhotoFeaturedAction(photoId, albumId, featured);
}

export async function deleteAlbumFormAction(formData: FormData) {
  const albumId = String(formData.get("albumId") ?? "").trim();
  if (!albumId) throw new Error("Missing album");
  await deleteAlbumAction(albumId);
}

// ── HOMEPAGE SLIDES ──────────────────────────────────────────────────────────

export async function uploadSlideAction(formData: FormData) {
  assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) throw new Error("File required");

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) throw new Error("Only images and videos are supported");

  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "slide";
  const path = `homepage/${randomBytes(6).toString("hex")}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("portfolio")
    .upload(path, buf, { contentType: file.type, upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(path);

  // Get current max sort_order
  const { data: existing } = await supabase
    .from("homepage_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const caption = String(formData.get("caption") ?? "").trim() || null;

  const { error: insErr } = await supabase.from("homepage_slides").insert({
    storage_path: path,
    public_url: publicUrl,
    media_type: isVideo ? "video" : "photo",
    caption,
    sort_order: nextOrder,
    active: true,
  });
  if (insErr) throw new Error(insErr.message);

  revalidatePath("/admin/slides");
  revalidatePath("/");
}

export async function updateSlideAction(formData: FormData) {
  assertAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const active = formData.get("active") === "true";
  const sortOrder = parseInt(String(formData.get("sort_order") ?? "0"), 10);

  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("homepage_slides")
    .update({ caption, active, sort_order: sortOrder })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/slides");
  revalidatePath("/");
}

export async function deleteSlideAction(formData: FormData) {
  assertAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");

  const supabase = createSupabaseService();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: row } = await supabase
    .from("homepage_slides")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (row?.storage_path) {
    await supabase.storage.from("portfolio").remove([row.storage_path]);
  }

  const { error } = await supabase.from("homepage_slides").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/slides");
  revalidatePath("/");
}
