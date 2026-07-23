"use client";
import { useEffect, useRef } from "react";

/**
 * Soft spotlight that trails the cursor. Native cursor stays visible.
 * Auto-off on touch devices and for prefers-reduced-motion. Purely decorative.
 */
export default function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = "1"; };
    const hide = () => { el.style.opacity = "0"; };
    const loop = () => {
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
