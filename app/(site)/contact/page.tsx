"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg"
      >
        <h1 className="font-display mb-2 text-[clamp(2.5rem,7vw,5rem)] leading-none text-bone">
          CONTACT
        </h1>
        <p className="mb-10 font-sans text-sm font-light text-bone/40">
          Available for editorial, portrait &amp; brand work.
        </p>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="font-serif-custom text-2xl italic text-bone/60">
              Message sent — I&apos;ll be in touch soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", label: "Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "subject", label: "Subject", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <input
                  type={field.type}
                  required
                  value={form[field.name as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  placeholder={field.label}
                  className="form-input"
                />
              </div>
            ))}

            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message"
              className="form-input resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="font-body text-[11px] uppercase tracking-[0.25em] text-bone/50 transition-colors hover:text-gold disabled:opacity-40"
              >
                {status === "sending" ? "Sending…" : "Send →"}
              </button>
              {status === "error" && (
                <p className="font-body text-[11px] text-red-400/70">
                  Something went wrong.
                </p>
              )}
            </div>
          </form>
        )}

        {/* Direct contact */}
        <div className="mt-14 space-y-2 border-t border-[var(--border)] pt-8">
          <a
            href="mailto:vishal@shotsbyvishal.com"
            className="block font-body text-[11px] uppercase tracking-[0.25em] text-bone/30 transition-colors hover:text-gold"
          >
            vishal@shotsbyvishal.com
          </a>
          <a
            href="https://www.instagram.com/shotsbyvishal/"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-body text-[11px] uppercase tracking-[0.25em] text-bone/30 transition-colors hover:text-gold"
          >
            @shotsbyvishal ↗
          </a>
        </div>
      </motion.div>
    </div>
  );
}
