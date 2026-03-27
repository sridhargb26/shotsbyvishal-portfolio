"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram } from "lucide-react";

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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-ink/90 backdrop-blur-md border-b border-bone/10" : ""
        }`}
      >
        <div className="flex items-center justify-between px-8 md:px-14 py-6">
          <Link href="/" className="font-display text-2xl tracking-wider text-bone hover:text-gold transition-colors">
            SBV
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                    pathname === l.href ? "text-gold" : "text-bone/60 hover:text-bone"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.instagram.com/shotsbyvishal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/60 hover:text-gold transition-colors"
              >
                <Instagram size={16} />
              </a>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-bone"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center gap-10"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-display text-5xl transition-colors ${
                    pathname === l.href ? "text-gold" : "text-bone/60 hover:text-bone"
                  }`}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <a
              href="https://www.instagram.com/shotsbyvishal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone/40 hover:text-gold transition-colors mt-4"
            >
              <Instagram size={22} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
