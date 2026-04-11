import Link from "next/link";
import { createSupabaseAnon } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseAnon();
  let albumCount = 0;
  let photoCount = 0;

  if (supabase) {
    const { count: a } = await supabase
      .from("portfolio_albums")
      .select("*", { count: "exact", head: true });
    const { count: p } = await supabase
      .from("portfolio_photos")
      .select("*", { count: "exact", head: true });
    albumCount = a ?? 0;
    photoCount = p ?? 0;
  }

  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl mb-4">Dashboard</h1>
      <p className="text-bone/50 text-sm max-w-lg mb-10">
        Create albums by category, upload images, and mark photos as featured for the
        homepage. Set{" "}
        <code className="text-gold/90">CONTENT_SOURCE=supabase</code> on your host so
        the gallery uses this library.
      </p>

      {!supabase && (
        <div className="border border-gold/30 bg-gold/5 p-4 mb-8 text-sm text-bone/80">
          <p className="font-display text-lg text-bone mb-2">Supabase not configured</p>
          Add <code className="text-gold">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="text-gold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code className="text-gold">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code className="text-gold">.env.local</code>. Run SQL in{" "}
          <code className="text-gold">supabase/schema.sql</code>, create a public bucket
          named <code className="text-gold">portfolio</code>, then restart the dev server.
        </div>
      )}

      <div className="flex flex-wrap gap-10 mb-12">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-bone/35 mb-1">Albums</p>
          <p className="font-display text-5xl text-gold">{albumCount}</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-bone/35 mb-1">Photos</p>
          <p className="font-display text-5xl text-bone">{photoCount}</p>
        </div>
      </div>

      <Link
        href="/admin/albums"
        className="inline-block border border-gold text-gold px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-gold hover:text-ink transition-colors"
      >
        Manage albums
      </Link>
    </div>
  );
}
