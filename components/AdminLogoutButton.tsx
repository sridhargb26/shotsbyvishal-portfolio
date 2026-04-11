"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => logout()}
      className="text-bone/50 text-xs tracking-widest uppercase hover:text-bone transition-colors"
    >
      Log out
    </button>
  );
}
