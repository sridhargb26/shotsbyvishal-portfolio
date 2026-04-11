"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowLeft } from "lucide-react";
import type { Album, Photo } from "@/content/types";

type View = "albums" | "photos";

export default function GalleryClient({ albums }: { albums: Album[] }) {
  const [view, setView] = useState<View>("albums");
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openAlbum = (album: Album) => {
    setActiveAlbum(album);
    setView("photos");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeAlbum = () => {
    setView("albums");
    setActiveAlbum(null);
  };

  const openLightbox = (photo: Photo, idx: number) => {
    setSelected(photo);
    setLightboxIdx(idx);
  };

  const closeLightbox = () => setSelected(null);

  const photos = activeAlbum?.photos ?? [];

  const lightboxNext = useCallback(() => {
    const next = (lightboxIdx + 1) % photos.length;
    setLightboxIdx(next);
    setSelected(photos[next]);
  }, [lightboxIdx, photos]);

  const lightboxPrev = useCallback(() => {
    const prev = (lightboxIdx - 1 + photos.length) % photos.length;
    setLightboxIdx(prev);
    setSelected(photos[prev]);
  }, [lightboxIdx, photos]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, lightboxNext, lightboxPrev]);

  // Lock scroll in lightbox
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [selected]);

  return (
    <div className="px-6 pb-24 pt-24 md:px-10 lg:px-14">

      {/* ── ALBUM GRID ── */}
      <AnimatePresence mode="wait">
        {view === "albums" && (
          <motion.div
            key="albums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="mb-12 md:mb-16">
              <p className="font-body mb-2 text-[9px] uppercase tracking-[0.35em] text-muted">
                Photography
              </p>
              <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none text-bone">
                Work
              </h1>
            </div>

            {/* Albums — two-column on mobile, three on desktop */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
              {albums.map((album, i) => (
                <motion.button
                  key={album._id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  onClick={() => openAlbum(album)}
                  className="group relative cursor-pointer overflow-hidden text-left"
                >
                  {/* Cover image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                    <Image
                      src={album.coverUrl}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {/* Gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070707]/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Label */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-display text-[clamp(1rem,2.5vw,1.4rem)] leading-none text-bone transition-colors group-hover:text-gold">
                      {album.title.toUpperCase()}
                    </span>
                    <span className="font-body text-[9px] tabular-nums tracking-widest text-muted">
                      {album.photoCount}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── PHOTO GRID (inside album) ── */}
        {view === "photos" && activeAlbum && (
          <motion.div
            key="photos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="mb-10 flex items-start justify-between md:mb-12">
              <div>
                <button
                  type="button"
                  onClick={closeAlbum}
                  className="mb-4 flex items-center gap-2 font-body text-[9px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-bone"
                >
                  <ArrowLeft size={12} strokeWidth={1.5} />
                  All Work
                </button>
                <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none text-bone">
                  {activeAlbum.title.toUpperCase()}
                </h1>
                <p className="mt-2 font-body text-[9px] uppercase tracking-[0.3em] text-muted">
                  {activeAlbum.photoCount} {activeAlbum.photoCount === 1 ? "photo" : "photos"}
                </p>
              </div>
            </div>

            {/* Masonry */}
            <div className="columns-1 gap-1.5 space-y-1.5 sm:columns-2 lg:columns-3">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  className="group relative cursor-pointer overflow-hidden break-inside-avoid bg-ink-soft"
                  onClick={() => openLightbox(photo, i)}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    width={800}
                    height={600}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#070707]/70 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                    <div className="p-4 pb-5">
                      <p className="font-serif-custom text-sm italic text-bone/80">{photo.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#070707]/97 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              className="absolute right-5 top-5 p-2 text-bone/40 transition-colors hover:text-bone md:right-8 md:top-8"
              onClick={closeLightbox}
            >
              <X size={20} strokeWidth={1} />
            </button>

            {/* Prev */}
            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 font-body text-[11px] uppercase tracking-[0.2em] text-bone/30 transition-colors hover:text-bone md:left-8"
              >
                ←
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selected._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex max-h-[90vh] max-w-5xl flex-col items-center gap-3 px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                width={1400}
                height={1000}
                className="max-h-[82vh] w-auto object-contain"
              />
              <div className="flex w-full items-center justify-between">
                <p className="font-serif-custom text-sm italic text-bone/50">{selected.title}</p>
                <p className="font-body text-[9px] tabular-nums tracking-widest text-muted">
                  {lightboxIdx + 1} / {photos.length}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 font-body text-[11px] uppercase tracking-[0.2em] text-bone/30 transition-colors hover:text-bone md:right-8"
              >
                →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
