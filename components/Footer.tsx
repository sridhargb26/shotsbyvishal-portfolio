import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 px-8 md:px-14 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display text-xl tracking-widest text-bone/40">SHOTSBYVISHAL</span>
        <p className="font-sans text-xs text-muted tracking-widest">
          © {new Date().getFullYear()} Vishal Dey. All rights reserved.
        </p>
        <a
          href="https://www.instagram.com/shotsbyvishal/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-bone/40 hover:text-gold transition-colors font-sans text-xs tracking-widest uppercase"
        >
          <Instagram size={14} />
          @shotsbyvishal
        </a>
      </div>
    </footer>
  );
}
