import Image from "next/image";
import { createSupabaseAnon } from "@/lib/supabase/server";
import { mediaUrlFromStoragePath } from "@/lib/media-url";
import {
  uploadSlideAction,
  updateSlideAction,
  deleteSlideAction,
} from "@/app/admin/(dashboard)/actions";

export default async function AdminSlidesPage() {
  const supabase = createSupabaseAnon();
  const slides = supabase
    ? (
        await supabase
          .from("homepage_slides")
          .select("id, sort_order, media_type, public_url, storage_path, caption, active")
          .order("sort_order", { ascending: true })
      ).data
    : null;

  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl mb-2">Homepage Slides</h1>
      <p className="text-bone/40 text-sm mb-10">
        These appear on the home page slideshow in order. Supports photos and short videos.
        Videos auto-advance when they finish playing.
      </p>

      {/* ── UPLOAD ── */}
      <section className="mb-14 border border-bone/10 p-6 max-w-lg">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          Add slide
        </h2>
        <form action={uploadSlideAction} className="flex flex-col gap-4">
          <label className="text-sm text-bone/70">
            File (photo or short video)
            <input
              name="file"
              type="file"
              required
              accept="image/*,video/*"
              className="mt-1 block w-full text-sm text-bone/80 file:mr-4 file:border file:border-bone/30 file:bg-transparent file:px-3 file:py-2 file:text-bone"
            />
          </label>
          <label className="text-sm text-bone/70">
            Caption (optional)
            <input
              name="caption"
              type="text"
              placeholder="e.g. NISCHITHA · Portrait"
              className="mt-1 block w-full bg-transparent border border-bone/20 px-3 py-2 text-bone text-sm"
            />
          </label>
          <button
            type="submit"
            className="self-start border border-gold text-gold px-6 py-2 text-[11px] tracking-widest uppercase hover:bg-gold hover:text-ink transition-colors"
          >
            Upload
          </button>
        </form>
      </section>

      {/* ── SLIDE LIST ── */}
      <section>
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          Current slides ({slides?.length ?? 0})
        </h2>

        {!supabase && (
          <div className="border border-bone/10 p-6 text-sm text-bone/40">
            Supabase is not configured. Run migration{" "}
            <code className="text-gold">003_homepage_slides.sql</code> and set env vars to manage slides.
          </div>
        )}

        {supabase && !slides?.length && (
          <p className="text-bone/40 text-sm">No slides yet. Upload one above.</p>
        )}

        {slides && slides.length > 0 && (
          <ul className="space-y-4">
            {slides.map((s) => {
              const url = s.storage_path
                ? mediaUrlFromStoragePath(s.storage_path)
                : s.public_url;

              return (
                <li
                  key={s.id}
                  className={`flex flex-col gap-4 border p-4 sm:flex-row sm:items-start ${
                    s.active ? "border-bone/10" : "border-bone/5 opacity-50"
                  }`}
                >
                  {/* Preview */}
                  <div className="relative h-28 w-44 shrink-0 overflow-hidden bg-bone/5">
                    {s.media_type === "video" ? (
                      <video
                        src={url}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={s.caption ?? ""}
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    )}
                    <span className="absolute bottom-1 left-1 rounded bg-ink/70 px-1.5 py-0.5 font-body text-[8px] uppercase tracking-widest text-bone/60">
                      {s.media_type === "video" ? "▶ video" : "photo"}
                    </span>
                  </div>

                  {/* Edit form */}
                  <form action={updateSlideAction} className="flex flex-1 flex-col gap-3">
                    <input type="hidden" name="id" value={s.id} />

                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-[10px] uppercase tracking-widest text-bone/40">
                        Order
                        <input
                          name="sort_order"
                          type="number"
                          defaultValue={s.sort_order}
                          className="ml-2 w-14 bg-transparent border-b border-bone/20 px-1 py-0.5 text-sm text-bone"
                        />
                      </label>

                      <label className="flex items-center gap-2 text-sm text-bone/70 cursor-pointer">
                        <input
                          type="checkbox"
                          name="active"
                          value="true"
                          defaultChecked={s.active}
                          className="accent-gold"
                        />
                        Active
                      </label>
                    </div>

                    <input
                      name="caption"
                      type="text"
                      defaultValue={s.caption ?? ""}
                      placeholder="Caption (optional)"
                      className="bg-transparent border-b border-bone/15 px-0 py-1 text-sm text-bone placeholder:text-bone/25 focus:outline-none focus:border-bone/40"
                    />

                    <button
                      type="submit"
                      className="self-start text-[10px] tracking-widest uppercase text-gold hover:opacity-70 transition-opacity"
                    >
                      Save
                    </button>
                  </form>

                  {/* Delete */}
                  <form action={deleteSlideAction} className="shrink-0">
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="text-[10px] tracking-widest uppercase text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
