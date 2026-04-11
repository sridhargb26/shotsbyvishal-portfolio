import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!verifyAdminSession(cookies().get(COOKIE_NAME)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <header className="flex flex-wrap gap-6 items-center justify-between mb-10 pb-6 border-b border-bone/10">
        <nav className="flex flex-wrap gap-6 text-[11px] tracking-[0.25em] uppercase font-body">
          <Link href="/admin" className="text-gold">
            Dashboard
          </Link>
          <Link href="/admin/albums" className="text-bone/60 hover:text-bone">
            Albums
          </Link>
          <Link href="/" className="text-bone/40 hover:text-bone">
            View site
          </Link>
        </nav>
        <AdminLogoutButton />
      </header>
      {children}
    </div>
  );
}
