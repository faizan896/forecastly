"use client";
import { useEffect } from "react";

/**
 * Buttery smooth scrolling via Lenis — smooths the native window scroll
 * (no wrapper transform, so position:fixed hero stays intact).
 * Fully disabled for prefers-reduced-motion. Exposes window.__lenis for anchor jumps.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis, raf, alive = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      window.__lenis = lenis;
      const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      if (lenis) lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}

/** Smooth-scroll to a selector, using Lenis when available. */
export function scrollToSel(sel) {
  if (typeof window === "undefined") return;
  if (window.__lenis) window.__lenis.scrollTo(sel, { offset: 0, duration: 1.1 });
  else document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
}
