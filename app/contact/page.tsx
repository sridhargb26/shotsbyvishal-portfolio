"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, Send } from "lucide-react";

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
    <div className="pt-28 pb-24 px-6 md:px-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">Get In Touch</p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-none text-bone">CONTACT</h1>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Left — info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-between"
        >
          <div className="space-y-6">
            <p className="font-sans font-light text-bone/70 leading-relaxed text-base max-w-sm">
              Available for editorial shoots, portrait sessions, event coverage, and brand collaborations. 
              Let&apos;s create something unforgettable.
            </p>
            <div className="space-y-4 pt-4">
              <a
                href="mailto:vishal@shotsbyvishal.com"
                className="flex items-center gap-4 text-bone/60 hover:text-gold transition-colors font-sans text-sm"
              >
                <Mail size={16} className="text-gold" />
                vishal@shotsbyvishal.com
              </a>
              <a
                href="https://www.instagram.com/shotsbyvishal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-bone/60 hover:text-gold transition-colors font-sans text-sm"
              >
                <Instagram size={16} className="text-gold" />
                @shotsbyvishal
              </a>
            </div>
          </div>

          <div className="mt-12 p-8 border border-bone/10">
            <p className="text-gold text-xs tracking-widest uppercase font-sans mb-2">Response time</p>
            <p className="font-display text-3xl text-bone">Within 24 hours</p>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", label: "Your Name", type: "text" },
              { name: "email", label: "Email Address", type: "email" },
              { name: "subject", label: "Subject", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required
                  value={form[field.name as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full bg-transparent border border-bone/20 text-bone font-sans text-sm px-5 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-muted/40"
                  placeholder={field.label}
                />
              </div>
            ))}

            <div>
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border border-bone/20 text-bone font-sans text-sm px-5 py-3 focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-muted/40"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-3 bg-gold text-ink py-4 font-sans text-xs tracking-widest uppercase hover:bg-bone transition-colors disabled:opacity-60"
            >
              <Send size={14} />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "sent" && (
              <p className="text-center font-sans text-xs text-gold tracking-widest">
                ✓ Message sent! I&apos;ll get back to you shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-center font-sans text-xs text-red-400 tracking-widest">
                Something went wrong. Please email me directly.
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
