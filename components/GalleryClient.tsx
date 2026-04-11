"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

const categories = ["All", "Portrait", "Street", "Editorial", "B&W", "Fashion", "Landscape", "Events"];

interface GalleryPhoto {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export default function GalleryClient({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const photos = initialPhotos;
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  const filtered = active === "All" ? photos : photos.filter((p) => p.category === active);

  return (
    <div className="pt-28 pb-24 px-6 md:px-14">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">The Work</p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-none text-bone mb-10">GALLERY</h1>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`font-sans text-[11px] tracking-[0.2em] uppercase px-5 py-2 border transition-all duration-300 ${
                active === cat ? "border-gold bg-gold text-ink" : "border-bone/20 text-bone/50 hover:border-bone/50 hover:text-bone"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        <AnimatePresence>
          {filtered.map((photo, i) => (
            <motion.div key={photo._id} layout
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: i * 0.04 }}
              className="relative break-inside-avoid overflow-hidden group cursor-pointer"
              onClick={() => setSelected(photo)}>
              <Image src={photo.imageUrl} alt={photo.title} width={800} height={600}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all duration-500 flex items-center justify-center">
                <ZoomIn className="text-bone opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={28} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-gold text-[10px] tracking-widest uppercase font-sans">{photo.category}</p>
                <p className="text-bone font-display text-xl">{photo.title}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="font-display text-3xl text-bone/20">No photos in this category yet</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelected(null)}>
            <button className="absolute top-8 right-8 text-bone/60 hover:text-gold transition-colors" onClick={() => setSelected(null)}>
              <X size={28} />
            </button>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <Image src={selected.imageUrl} alt={selected.title} width={1200} height={900}
                className="object-contain max-h-[80vh] w-full" />
              <div className="mt-4 text-center">
                <p className="text-gold text-[10px] tracking-widest uppercase font-sans">{selected.category}</p>
                <p className="text-bone font-display text-2xl">{selected.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
