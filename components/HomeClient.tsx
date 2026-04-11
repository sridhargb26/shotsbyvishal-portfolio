"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { Photo, SiteSettings } from "@/content/types";

export default function HomeClient({
  settings,
  featured,
}: {
  settings: SiteSettings;
  featured: Photo[];
}) {
  const photos = featured;
  const publications = settings.publications;
  const heroImage = settings.heroImageUrl;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <>
      {/* ── HERO ── */}
      <section ref={heroRef} style={{ height:"100vh", position:"relative", overflow:"hidden", display:"flex", alignItems:"flex-end" }}>
        <motion.div style={{ position:"absolute", inset:0, y: heroY }}>
          <div className="hero-bg" style={{ position:"absolute", inset:0, backgroundImage:`url('${heroImage}')`, backgroundSize:"cover", backgroundPosition:"center" }} />
        </motion.div>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(10,10,10,0.65) 0%, transparent 55%)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.2) 45%, transparent 100%)" }} />

        {/* Ghost number */}
        <div className="font-display" style={{ position:"absolute", top:"120px", left:"56px", fontSize:"clamp(100px,18vw,200px)", color:"rgba(184,150,90,0.05)", lineHeight:1, pointerEvents:"none", userSelect:"none" }}>01</div>

        {/* Vertical tag */}
        <motion.div style={{ opacity: heroOpacity, position:"absolute", top:"50%", right:"48px", transform:"translateY(-50%)", writingMode:"vertical-rl", fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"0.3em", color:"var(--gold)", textTransform:"uppercase" }}>
          Based in India · Est. 2019
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position:"relative", zIndex:10, padding:"0 clamp(24px,5vw,56px) 80px", width:"100%" }}>
          <motion.p initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:1, delay:0.2 }}
            className="gold-line font-body" style={{ fontSize:"11px", letterSpacing:"0.35em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"20px" }}>
            {settings.heroCategories || "Editorial · Portrait · Street"}
          </motion.p>
          <motion.h1 initial={{ opacity:0, y:60 }} animate={{ opacity:1, y:0 }} transition={{ duration:1.3, delay:0.3, ease:[0.25,0.46,0.45,0.94] }}
            className="font-display" style={{ fontSize:"clamp(4.5rem,14vw,13rem)", lineHeight:0.88, color:"var(--bone)", marginBottom:"44px" }}>
            SHOTS<br />
            <span style={{ WebkitTextStroke:"1px var(--gold)", WebkitTextFillColor:"transparent" }}>BY</span><br />
            VISHAL
          </motion.h1>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.6 }}
            style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
            <Link href="/gallery" className="btn-gold">View Gallery</Link>
            <Link href="/about" className="btn-outline">About Me</Link>
          </motion.div>
        </motion.div>

        <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
          <span className="font-body" style={{ fontSize:"9px", letterSpacing:"0.3em", color:"rgba(240,235,226,0.3)", textTransform:"uppercase" }}>Scroll</span>
          <div className="scroll-indicator" style={{ width:"1px", height:"44px", background:"linear-gradient(to bottom, rgba(184,150,90,0.5), transparent)" }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"14px 0", overflow:"hidden", background:"rgba(184,150,90,0.02)" }}>
        <div className="marquee-track" style={{ display:"flex", gap:"0", whiteSpace:"nowrap", width:"max-content" }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="font-serif-custom" style={{ fontSize:"13px", letterSpacing:"0.18em", color:"rgba(184,150,90,0.5)", fontStyle:"italic", padding:"0 32px" }}>
              Portrait&nbsp;·&nbsp;Editorial&nbsp;·&nbsp;Street&nbsp;·&nbsp;Fashion&nbsp;·&nbsp;B&W&nbsp;·&nbsp;Landscape
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED WORK ── */}
      <section style={{ padding:"clamp(60px,10vw,120px) clamp(24px,5vw,72px)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"56px" }}>
          <div>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="gold-line font-body" style={{ fontSize:"10px", letterSpacing:"0.35em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"12px" }}>
              Selected Work
            </motion.p>
            <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="font-display" style={{ fontSize:"clamp(3rem,8vw,7rem)", color:"var(--bone)", lineHeight:0.9 }}>
              FEATURED
            </motion.h2>
          </div>
          <Link href="/gallery" className="view-all-link">View All →</Link>
        </div>

        {/* Asymmetric editorial grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:"10px" }}>
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.8 }} viewport={{ once:true }}
            className="photo-card" style={{ gridColumn:"1/6", gridRow:"1/3", aspectRatio:"3/4" }}>
            <Image src={photos[0]?.imageUrl} alt={photos[0]?.title} fill style={{ objectFit:"cover" }} />
            <div className="card-overlay" />
            <div className="card-info">
              <p className="font-body" style={{ fontSize:"9px", letterSpacing:"0.3em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"4px" }}>{photos[0]?.category}</p>
              <p className="font-display" style={{ fontSize:"26px", color:"var(--bone)" }}>{photos[0]?.title}</p>
            </div>
          </motion.div>

          {[1,2,3,4].map((i) => (
            <motion.div key={i} initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:i*0.08 }} viewport={{ once:true }}
              className="photo-card" style={{ gridColumn: i<=2 ? `${4+i*2}/${6+i*2}` : i===3 ? "6/9" : "9/13", gridRow: i<=2 ? "1" : "2", aspectRatio: i===4 ? "16/9" : "1" }}>
              <Image src={photos[i]?.imageUrl} alt={photos[i]?.title} fill style={{ objectFit:"cover" }} />
              <div className="card-overlay" />
              <div className="card-info">
                <p className="font-body" style={{ fontSize:"9px", letterSpacing:"0.3em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"4px" }}>{photos[i]?.category}</p>
                <p className="font-display" style={{ fontSize:"20px", color:"var(--bone)" }}>{photos[i]?.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section style={{ padding:"clamp(60px,8vw,100px) clamp(24px,5vw,72px)", borderTop:"1px solid var(--border)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center" }}>
        <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} transition={{ duration:0.9 }} viewport={{ once:true }}>
          <p className="gold-line font-body" style={{ fontSize:"10px", letterSpacing:"0.35em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"20px" }}>The Photographer</p>
          <h2 className="font-serif-custom" style={{ fontSize:"clamp(2rem,4.5vw,4rem)", fontWeight:300, lineHeight:1.15, color:"var(--bone)", marginBottom:"24px", fontStyle:"italic" }}>
            Capturing the quiet,<br />the raw & the cinematic
          </h2>
          <p className="font-body" style={{ fontSize:"14px", lineHeight:1.9, color:"rgba(240,235,226,0.5)", fontWeight:200, marginBottom:"32px" }}>
            Published in Elléments Magazine, 7HuesMag, and Mob Journal — Vishal brings an editorial eye to every frame, from intimate portraits to electric street moments.
          </p>
          <Link href="/about" className="view-more-link">Read More</Link>
        </motion.div>
        <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} transition={{ duration:0.9 }} viewport={{ once:true }} className="stat-grid">
          {[{v:"5+",l:"Years"},{v:"4+",l:"Publications"},{v:"∞",l:"Stories"},{v:"100%",l:"Passion"}].map((s) => (
            <div key={s.l} className="stat-cell">
              <p className="font-display" style={{ fontSize:"3rem", color:"var(--gold)", marginBottom:"8px" }}>{s.v}</p>
              <p className="font-body" style={{ fontSize:"10px", letterSpacing:"0.25em", color:"var(--muted)", textTransform:"uppercase" }}>{s.l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PUBLICATIONS ── */}
      <section style={{ padding:"0 clamp(24px,5vw,72px) clamp(60px,8vw,100px)" }}>
        <p className="font-body" style={{ fontSize:"10px", letterSpacing:"0.35em", color:"var(--muted)", textTransform:"uppercase", marginBottom:"40px", textAlign:"center" }}>As Featured In</p>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"clamp(24px,5vw,56px)", alignItems:"center" }}>
          {publications.map((pub) => (
            <span key={pub.name} className="pub-name" style={{ fontSize:"clamp(1.1rem,2.5vw,1.8rem)" }}>{pub.name}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:"relative", padding:"clamp(80px,12vw,160px) clamp(24px,5vw,72px)", textAlign:"center", overflow:"hidden", borderTop:"1px solid var(--border)" }}>
        <div className="font-display" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"clamp(80px,22vw,260px)", color:"rgba(184,150,90,0.04)", lineHeight:1, pointerEvents:"none", whiteSpace:"nowrap" }}>CONTACT</div>
        <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.9 }} viewport={{ once:true }} style={{ position:"relative", zIndex:2 }}>
          <p className="gold-line font-body" style={{ fontSize:"10px", letterSpacing:"0.35em", color:"var(--gold)", textTransform:"uppercase", marginBottom:"24px", display:"inline-block" }}>Let's Work Together</p>
          <h2 className="font-serif-custom" style={{ fontSize:"clamp(2.5rem,7vw,6rem)", fontWeight:300, color:"var(--bone)", lineHeight:1.1, marginBottom:"48px", fontStyle:"italic" }}>
            Have a project<br />in mind?
          </h2>
          <Link href="/contact" className="btn-gold-outline">Get In Touch</Link>
        </motion.div>
      </section>
    </>
  );
}
