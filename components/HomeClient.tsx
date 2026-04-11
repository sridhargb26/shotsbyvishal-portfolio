"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Slide, SiteSettings } from "@/content/types";

export default function HomeClient({
  settings,
  slides,
}: {
  settings: SiteSettings;
  slides: Slide[];
}) {
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const slide = slides[current];
  const isVideo = slide?.mediaType === "video";

  // Auto-advance: photos after 5 s, videos advance when they end (via onEnded)
  useEffect(() => {
    if (slides.length <= 1 || isVideo) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, slides.length, isVideo]);

  // When slide changes to a video, play it
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current, isVideo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (!slides.length) {
    return (
      <div className="fixed inset-0 flex flex-col items-start justify-end bg-ink px-6 pb-12 md:px-10 md:pb-14">
        <p className="font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-none tracking-[0.06em] text-bone/90">
          VISHAL DEY
        </p>
        <p className="font-serif-custom mt-1 text-sm italic tracking-[0.18em] text-gold/60">
          {settings.heroCategories || "Editorial · Portrait · Street"}
        </p>
        <Link
          href="/gallery"
          className="mt-6 font-body text-[9px] uppercase tracking-[0.35em] text-bone/30 transition-colors hover:text-bone/70"
        >
          View Work
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">

      {/* ── SLIDES ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isVideo ? 0.5 : 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={slide.url}
              autoPlay
              muted
              playsInline
              loop={slides.length === 1}
              onEnded={slides.length > 1 ? next : undefined}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={slide.url}
              alt={slide.caption ?? ""}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Edge vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,7,7,0.55)_100%)]" />
          {/* Bottom fade */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#070707]/85 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── NAME (top-left) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute left-6 top-[4.5rem] z-10 md:left-10 md:top-20"
      >
        <p className="font-display text-[clamp(1.5rem,3.5vw,2.4rem)] leading-none tracking-[0.06em] text-bone/90">
          VISHAL DEY
        </p>
        <p className="font-serif-custom mt-1 text-[clamp(0.65rem,1.4vw,0.85rem)] italic tracking-[0.18em] text-gold/65">
          {settings.heroCategories || "Editorial · Portrait · Street"}
        </p>
      </motion.div>

      {/* ── CAPTION (bottom-left) ── */}
      <AnimatePresence mode="wait">
        {slide.caption && (
          <motion.div
            key={`cap-${slide.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute bottom-10 left-6 z-10 md:bottom-12 md:left-10"
          >
            <p className="font-serif-custom text-sm italic text-bone/50 md:text-[15px]">
              {slide.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COUNTER + ARROWS (bottom-right) ── */}
      {ready && slides.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-10 right-6 z-10 flex items-center gap-4 md:bottom-12 md:right-10"
        >
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            className="font-body text-[10px] tracking-[0.2em] text-bone/30 transition-colors hover:text-bone/70"
          >
            ←
          </button>
          <span className="font-body text-[10px] tabular-nums tracking-[0.2em] text-bone/30">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            className="font-body text-[10px] tracking-[0.2em] text-bone/30 transition-colors hover:text-bone/70"
          >
            →
          </button>
        </motion.div>
      )}

      {/* ── VIEW WORK (bottom-centre) ── */}
      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 md:bottom-12"
        >
          <Link
            href="/gallery"
            className="font-body text-[9px] uppercase tracking-[0.35em] text-bone/30 transition-colors hover:text-bone/70"
          >
            View Work
          </Link>
        </motion.div>
      )}

      {/* ── MEDIA TYPE INDICATOR (top-right, shows video icon) ── */}
      {isVideo && (
        <div className="absolute right-6 top-[4.5rem] z-10 md:right-10 md:top-20">
          <span className="font-body text-[8px] uppercase tracking-[0.3em] text-bone/25">
            ▶ Video
          </span>
        </div>
      )}

      {/* ── PROGRESS DOTS (mobile) ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-6 z-10 flex gap-1.5 md:hidden">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-px transition-all duration-300 ${
                i === current ? "w-6 bg-gold/70" : "w-3 bg-bone/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
