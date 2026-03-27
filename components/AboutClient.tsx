"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink } from "lucide-react";
import { PortableText } from "next-sanity";

const fallbackSettings = {
  name: "Vishal Dey",
  heroCategories: "Editorial · Portrait · Street",
  email: "vishal@shotsbyvishal.com",
  instagram: "https://www.instagram.com/shotsbyvishal/",
  behance: "https://www.behance.net/shotsbyvishal",
  profileImage: null,
  stats: [
    { value: "5+", label: "Years Shooting" },
    { value: "4+", label: "Publications" },
    { value: "∞", label: "Stories Told" },
  ],
  publications: [
    { name: "Elléments Magazine", issue: "WAVES Editorial", url: "" },
    { name: "7HuesMag", issue: "In Solitude", url: "" },
    { name: "Mob Journal", issue: "NISCHITHA · THE ART OF BEING", url: "" },
    { name: "SoleDXB", issue: "Street Style Coverage", url: "" },
  ],
  bio: null,
};

export default function AboutClient({ settings }: { settings: any }) {
  const s = { ...fallbackSettings, ...settings };
  const profileImg = s.profileImage?.asset?.url || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80";

  return (
    <div className="pt-28 pb-24 px-6 md:px-14">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-20">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">The Photographer</p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-none text-bone">{s.name?.toUpperCase()}</h1>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-[3/4] overflow-hidden">
          <Image src={profileImg} alt={s.name} fill className="object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col justify-center gap-8">
          <div className="font-sans font-light text-bone/70 leading-relaxed text-base space-y-4">
            {s.bio ? (
              <PortableText value={s.bio} />
            ) : (
              <>
                <p>I&apos;m {s.name} — a photographer with an eye for the quiet, the raw, and the cinematic. My work spans editorial portraiture, street photography, and fashion, always searching for the moment where light and emotion collide.</p>
                <p>Having been published in magazines like <em className="text-bone italic">Elléments</em> and <em className="text-bone italic">7HuesMag</em>, I bring a magazine-level sensibility to every frame — whether in a studio or on the streets of a city.</p>
                <p>Photography, for me, is less about the camera and more about presence — being in the right place, at the right moment, with the right intention.</p>
              </>
            )}
          </div>

          <div className="flex gap-10 py-8 border-t border-b border-bone/10">
            {s.stats?.map((stat: any) => (
              <div key={stat.label}>
                <p className="font-display text-4xl text-gold">{stat.value}</p>
                <p className="font-sans text-xs text-muted uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link href="/gallery" className="bg-gold text-ink px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-bone transition-colors">
              See My Work
            </Link>
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-bone/20 text-bone/60 px-6 py-3 font-sans text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">
                <Instagram size={14} /> Instagram
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Publications */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-8">Publications & Features</p>
        <div className="grid md:grid-cols-2 gap-px bg-bone/10">
          {s.publications?.map((pub: any, i: number) => (
            <div key={i} className="bg-ink p-8 flex justify-between items-center group hover:bg-bone/5 transition-colors">
              <div>
                <p className="font-serif italic text-bone text-xl mb-1">{pub.name}</p>
                <p className="font-sans text-xs text-muted tracking-widest">{pub.issue}</p>
              </div>
              {pub.url ? (
                <a href={pub.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} className="text-muted group-hover:text-gold transition-colors" />
                </a>
              ) : (
                <ExternalLink size={14} className="text-muted/30" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
