"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/** Count-up animated number. `format` receives the interpolating value. */
export function AnimatedNumber({ value, format, duration = 650 }) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (typeof value !== "number" || isNaN(value)) { setV(value); return; }
    const start = performance.now();
    const a = typeof from.current === "number" ? from.current : value;
    const b = value;
    if (Math.abs(b - a) < 1e-9) { setV(b); from.current = b; return; }
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setV(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(v)}</>;
}

const coarse = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/** Subtle 3D tilt toward the cursor (max ~4°). No-op on touch / reduced motion. */
export function Tilt({ children, className, style, max = 4, onClick }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 16, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 16, mass: 0.4 });
  const off = reduce || coarse();
  const onMove = (e) => {
    if (off) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2); rx.set(-py * max * 2);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div
      className={className} onClick={onClick}
      onMouseMove={onMove} onMouseLeave={reset}
      style={{ rotateX: off ? 0 : srx, rotateY: off ? 0 : sry, transformPerspective: 900, transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </motion.div>
  );
}

/** Magnetic attraction toward the cursor for small interactive elements. */
export function Magnetic({ children, className, strength = 0.32, onClick, as = "span" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.3 });
  const off = reduce || coarse();
  const onMove = (e) => {
    if (off) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  const Comp = motion[as] || motion.span;
  return (
    <Comp
      className={className} onClick={onClick}
      onMouseMove={onMove} onMouseLeave={reset}
      style={{ x: off ? 0 : sx, y: off ? 0 : sy, display: "inline-flex" }}
    >
      {children}
    </Comp>
  );
}
