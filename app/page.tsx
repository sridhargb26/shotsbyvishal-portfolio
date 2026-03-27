"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const featuredWork = [
  {
    id: 1,
    title: "NISCHITHA",
    category: "Portrait",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    title: "Street Style",
    category: "Street",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "In Solitude",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "WAVES",
    category: "Fashion",
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    title: "MIRA",
    category: "B&W",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    span: "col-span-1 row-span-1",
  },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80')",
            animation: "zoomSlow 20s ease infinite alternate",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/30 to-ink" />

        {/* Vertical tag */}
        <div className="absolute top-40 right-14 writing-vertical text-gold text-xs tracking-widest uppercase hidden md:block" style={{writingMode:'vertical-rl'}}>
          Based in India · Est. 2019
        </div>

        <div className="relative z-10 px-8 md:px-16 pb-20 w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-sans"
          >
            Editorial · Portrait · Street
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-[clamp(4rem,12vw,11rem)] leading-none text-bone mb-6"
          >
            SHOTS BY
            <br />
            <span className="text-gold">VISHAL</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex gap-6 items-center"
          >
            <Link
              href="/gallery"
              className="bg-gold text-ink px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-bone transition-colors duration-300"
            >
              View Gallery
            </Link>
            <Link
              href="/about"
              className="border border-bone/40 text-bone px-8 py-3 font-sans text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300"
            >
              About Me
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bone/40">
          <span className="text-[10px] tracking-widest uppercase font-sans">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-bone/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── FEATURED WORK ── */}
      <section className="px-6 md:px-14 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-2">Selected Work</p>
            <h2 className="font-display text-5xl md:text-7xl text-bone">FEATURED</h2>
          </div>
          <Link
            href="/gallery"
            className="text-muted hover:text-gold font-sans text-xs tracking-widest uppercase transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[250px]">
          {featuredWork.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden group cursor-pointer ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-gold text-[10px] tracking-widest uppercase font-sans mb-1">{item.category}</p>
                <p className="text-bone font-display text-2xl">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PUBLICATIONS ── */}
      <section className="px-6 md:px-14 py-16 border-t border-bone/10">
        <p className="text-muted text-xs tracking-[0.3em] uppercase font-sans mb-8 text-center">As featured in</p>
        <div className="flex flex-wrap justify-center gap-12 items-center">
          {["Elléments Magazine", "7HuesMag", "Mob Journal", "SoleDXB"].map((pub) => (
            <span key={pub} className="font-serif italic text-bone/30 text-lg hover:text-gold transition-colors duration-300 cursor-default">
              {pub}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-14 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Let&apos;s Work Together</p>
          <h2 className="font-display text-5xl md:text-8xl text-bone mb-8">
            HAVE A PROJECT<br />IN MIND?
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-transparent border border-gold text-gold px-12 py-4 font-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all duration-300"
          >
            Get In Touch
          </Link>
        </motion.div>
      </section>

      <style jsx global>{`
        @keyframes zoomSlow {
          from { transform: scale(1); }
          to { transform: scale(1.06); }
        }
      `}</style>
    </>
  );
}
