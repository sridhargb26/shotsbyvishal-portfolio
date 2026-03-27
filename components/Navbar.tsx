"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        padding:"28px clamp(24px,5vw,56px)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        transition:"all 0.5s",
        background: scrolled ? "rgba(10,10,10,0.93)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(240,235,226,0.06)" : "none",
      }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <div style={{ display:"flex", flexDirection:"column", lineHeight:1, gap:"3px" }}>
            <span className="font-display" style={{ fontSize:"20px", letterSpacing:"0.12em", color:"var(--bone)" }}>SHOTS BY</span>
            <span className="font-serif-custom" style={{ fontSize:"11px", letterSpacing:"0.4em", color:"var(--gold)", fontStyle:"italic" }}>VISHAL</span>
          </div>
        </Link>

        <ul style={{ display:"flex", gap:"36px", listStyle:"none", margin:0, padding:0, alignItems:"center" }}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`nav-link${pathname === l.href ? " active" : ""}`}>{l.label}</Link>
            </li>
          ))}
          <li>
            <a href="https://www.instagram.com/shotsbyvishal/" target="_blank" rel="noopener noreferrer" className="nav-instagram">@sbv</a>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(10,10,10,0.98)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"32px" }}>
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}>
                <Link href={l.href} onClick={() => setMenuOpen(false)}
                  className="font-display" style={{ fontSize:"3.5rem", letterSpacing:"0.1em", color: pathname === l.href ? "var(--gold)" : "rgba(240,235,226,0.6)", textDecoration:"none" }}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
