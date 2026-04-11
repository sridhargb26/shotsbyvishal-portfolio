"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { useEffect } from "react";

/**
 * On the home route the page is a fixed full-screen slideshow.
 * - We add `home-page` to <body> so CSS can set overflow:hidden.
 * - We suppress <main> and <Footer> so they don't create scroll height.
 *
 * On all other routes we render normally with a page-enter animation.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (isHome) {
      document.body.classList.add("home-page");
    } else {
      document.body.classList.remove("home-page");
    }
    return () => document.body.classList.remove("home-page");
  }, [isHome]);

  if (isHome) {
    // Home: render children directly (the fixed slideshow), no wrapper, no footer
    return <>{children}</>;
  }

  return (
    <>
      <main key={pathname} className="page-enter min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
