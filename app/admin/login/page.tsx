"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Portfolio</p>
      <h1 className="font-display text-4xl md:text-5xl mb-10">Admin</h1>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <label className="text-[11px] tracking-widest uppercase text-bone/50">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full bg-transparent border border-bone/20 px-4 py-3 text-bone focus:border-gold outline-none"
          />
        </label>
        {error && (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="border border-gold text-gold py-3 text-xs tracking-[0.25em] uppercase hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
        >
          {pending ? "…" : "Sign in"}
        </button>
      </form>
      <Link
        href="/"
        className="mt-12 text-bone/40 text-sm hover:text-bone transition-colors"
      >
        ← Back to site
      </Link>
    </div>
  );
}
