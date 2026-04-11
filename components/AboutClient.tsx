"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/content/types";

export default function AboutClient({ settings }: { settings: SiteSettings }) {
  const s = settings;

  return (
    <div className="px-6 pb-24 pt-24 md:px-10 lg:px-14">

      {/* Name heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-16 md:mb-20"
      >
        <h1 className="font-display text-[clamp(2.75rem,9vw,7.5rem)] leading-none text-bone">
          {s.name?.toUpperCase()}
        </h1>
        <p className="font-serif-custom mt-3 text-base italic text-gold/70 md:text-lg">
          {s.tagline || "Editorial · Portrait · Street"}
        </p>
      </motion.div>

      {/* Two-column: portrait + bio */}
      <div className="grid items-start gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative aspect-[3/4] overflow-hidden"
        >
          <Image src={s.profileImageUrl} alt={s.name} fill className="object-cover" priority />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#070707] to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="flex flex-col gap-8 pt-2"
        >
          <div className="space-y-5 font-sans text-[15px] font-light leading-[1.85] text-bone/60">
            {s.bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Publications — clean list */}
          {s.publications?.length > 0 && (
            <div className="border-t border-[var(--border)] pt-8">
              <p className="mb-5 font-body text-[9px] uppercase tracking-[0.35em] text-muted">
                Publications
              </p>
              <ul className="space-y-3">
                {s.publications.map((pub, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-4">
                    <span className="font-serif-custom text-base italic text-bone/70">{pub.name}</span>
                    {pub.issue && (
                      <span className="font-body text-[10px] tracking-widest text-muted shrink-0">{pub.issue}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Link href="/gallery" className="view-more-link">
              View Work
            </Link>
            {s.instagram && (
              <a
                href={s.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[10px] uppercase tracking-[0.3em] text-bone/35 transition-colors hover:text-gold"
              >
                Instagram ↗
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
