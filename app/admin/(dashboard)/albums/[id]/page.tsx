import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createSupabaseAnon } from "@/lib/supabase/server";
import {
  uploadPhotosAction,
  deletePhotoFormAction,
  setFeaturedFormAction,
} from "@/app/admin/(dashboard)/actions";
import { mediaUrlFromStoragePath } from "@/lib/media-url";

export default async function AdminAlbumDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseAnon();
  if (!supabase) notFound();

  const { data: album, error: e1 } = await supabase
    .from("portfolio_albums")
    .select("id, title, category, slug")
    .eq("id", params.id)
    .single();

  if (e1 || !album) notFound();

  const { data: photos } = await supabase
    .from("portfolio_photos")
    .select("id, title, public_url, storage_path, featured, sort_order")
    .eq("album_id", params.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-2">
        <Link href="/admin/albums" className="hover:text-bone">
          Albums
        </Link>{" "}
        / {album.category}
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-2">{album.title}</h1>
      <p className="text-bone/45 text-sm mb-10">Slug: {album.slug}</p>

      <section className="mb-12 border border-bone/10 p-6">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          Upload photos
        </h2>
        <form action={uploadPhotosAction} className="flex flex-col gap-4 max-w-md">
          <input type="hidden" name="albumId" value={album.id} />
          <input
            type="file"
            name="files"
            multiple
            accept="image/*"
            required
            className="text-sm text-bone/80 file:mr-4 file:border file:border-bone/30 file:bg-transparent file:px-3 file:py-2 file:text-bone"
          />
          <button
            type="submit"
            className="self-start border border-gold text-gold px-6 py-2 text-[11px] tracking-widest uppercase hover:bg-gold hover:text-ink transition-colors"
          >
            Upload
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          Photos ({photos?.length ?? 0})
        </h2>
        {!photos?.length ? (
          <p className="text-bone/40 text-sm">No photos in this album yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {photos.map((p) => (
              <li
                key={p.id}
                className="border border-bone/10 p-3 flex flex-col gap-3"
              >
                <div className="relative aspect-[4/5] w-full bg-bone/5">
                  <Image
                    src={
                      p.storage_path
                        ? mediaUrlFromStoragePath(p.storage_path)
                        : p.public_url
                    }
                    alt={p.title || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="text-sm text-bone/70 truncate">{p.title}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {p.featured ? (
                    <span className="text-[10px] tracking-widest uppercase text-gold">
                      Featured
                    </span>
                  ) : null}
                  {!p.featured ? (
                    <form action={setFeaturedFormAction}>
                      <input type="hidden" name="photoId" value={p.id} />
                      <input type="hidden" name="albumId" value={album.id} />
                      <input type="hidden" name="featured" value="true" />
                      <button
                        type="submit"
                        className="text-[10px] tracking-widest uppercase text-bone/50 hover:text-gold"
                      >
                        Feature on home
                      </button>
                    </form>
                  ) : (
                    <form action={setFeaturedFormAction}>
                      <input type="hidden" name="photoId" value={p.id} />
                      <input type="hidden" name="albumId" value={album.id} />
                      <input type="hidden" name="featured" value="false" />
                      <button
                        type="submit"
                        className="text-[10px] tracking-widest uppercase text-bone/50 hover:text-bone"
                      >
                        Remove from home
                      </button>
                    </form>
                  )}
                  <form action={deletePhotoFormAction} className="ml-auto">
                    <input type="hidden" name="photoId" value={p.id} />
                    <input type="hidden" name="albumId" value={album.id} />
                    <button
                      type="submit"
                      className="text-[10px] tracking-widest uppercase text-red-400/70 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
