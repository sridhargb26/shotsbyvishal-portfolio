export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-6 md:px-10 lg:px-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-bone/20">
          © {new Date().getFullYear()} Vishal Dey
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/shotsbyvishal/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-bone/20 transition-colors hover:text-gold"
          >
            Instagram
          </a>
          <a
            href="https://www.behance.net/shotsbyvishal"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-bone/20 transition-colors hover:text-gold"
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  );
}
