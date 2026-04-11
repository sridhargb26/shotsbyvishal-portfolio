import Link from "next/link";
import { createSupabaseAnon } from "@/lib/supabase/server";
import { createAlbumAction, deleteAlbumFormAction } from "@/app/admin/(dashboard)/actions";

const CATEGORIES = [
  "Portrait",
  "Street",
  "Editorial",
  "B&W",
  "Fashion",
  "Landscape",
  "Events",
] as const;

export default async function AdminAlbumsPage() {
  const supabase = createSupabaseAnon();
  const albums = supabase
    ? (
        await supabase
          .from("portfolio_albums")
          .select("id, title, slug, category, created_at")
          .order("created_at", { ascending: false })
      ).data
    : null;

  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl mb-8">Albums</h1>

      <section className="mb-14 border border-bone/10 p-6">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          New album
        </h2>
        <form action={createAlbumAction} className="flex flex-col gap-4 max-w-md">
          <label className="text-sm text-bone/70">
            Title
            <input
              name="title"
              required
              className="mt-1 block w-full bg-transparent border border-bone/20 px-3 py-2 text-bone"
            />
          </label>
          <label className="text-sm text-bone/70">
            Category
            <select
              name="category"
              required
              className="mt-1 block w-full bg-ink border border-bone/20 px-3 py-2 text-bone"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="self-start border border-gold text-gold px-6 py-2 text-[11px] tracking-widest uppercase hover:bg-gold hover:text-ink transition-colors"
          >
            Create album
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          Your albums
        </h2>
        {!albums?.length ? (
          <p className="text-bone/40 text-sm">No albums yet.</p>
        ) : (
          <ul className="space-y-3">
            {albums.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 border border-bone/10 px-4 py-3"
              >
                <div>
                  <Link
                    href={`/admin/albums/${a.id}`}
                    className="font-display text-xl text-bone hover:text-gold transition-colors"
                  >
                    {a.title}
                  </Link>
                  <p className="text-xs text-bone/45 mt-1">
                    {a.category} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/albums/${a.id}`}
                    className="text-[11px] tracking-widest uppercase text-gold"
                  >
                    Open
                  </Link>
                  <form action={deleteAlbumFormAction}>
                    <input type="hidden" name="albumId" value={a.id} />
                    <button
                      type="submit"
                      className="text-[11px] tracking-widest uppercase text-red-400/80 hover:text-red-400"
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
