"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    let raf: number;
    let current = { x: ring.x, y: ring.y };
    const animate = () => {
      current.x += (pos.x - current.x) * 0.12;
      current.y += (pos.y - current.y) * 0.12;
      setRing({ x: current.x, y: current.y });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999] w-3 h-3 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className="fixed pointer-events-none z-[9998] w-10 h-10 border border-gold/40 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: ring.x, top: ring.y }}
      />
    </>
  );
}
