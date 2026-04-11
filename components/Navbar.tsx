"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/gallery", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-7 md:px-10 md:py-8"
        style={{
          // On the home slideshow the bg is the photo itself — keep nav transparent.
          // On inner pages add a very light ink wash so text stays readable.
          background: isHome ? "transparent" : "linear-gradient(to bottom, rgba(7,7,7,0.7) 0%, transparent 100%)",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="no-underline"
          onClick={() => setMenuOpen(false)}
        >
          <span className="font-display text-[17px] tracking-[0.16em] text-bone transition-opacity hover:opacity-70 md:text-[18px]">
            SHOTSBYVISHAL
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex lg:gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`nav-link${l.href !== "/" && pathname.startsWith(l.href) ? " active" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger — bare lines, no border */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 flex-col items-end justify-center gap-[5px] md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            className={`block h-px bg-bone transition-all duration-300 ${menuOpen ? "w-6 translate-y-[7px] rotate-45" : "w-6"}`}
          />
          <span
            className={`block h-px bg-bone transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-4"}`}
          />
          <span
            className={`block h-px bg-bone transition-all duration-300 ${menuOpen ? "w-6 -translate-y-[7px] -rotate-45" : "w-6"}`}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-end bg-ink/97 px-8 pb-16 pt-28 md:hidden"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display block py-3 text-[2.75rem] leading-none tracking-[0.08em] no-underline transition-colors"
                  style={{
                    color: l.href !== "/" && pathname.startsWith(l.href) ? "var(--gold)" : "color-mix(in srgb, var(--bone) 55%, transparent)",
                  }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <a
              href="https://www.instagram.com/shotsbyvishal/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 font-body text-[10px] uppercase tracking-[0.3em] text-bone/30 transition-colors hover:text-gold"
            >
              @shotsbyvishal
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
