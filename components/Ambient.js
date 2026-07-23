"use client";
import { useEffect, useState } from "react";

/**
 * Barely-there ambient motion for the cream sheet: two slow gradient blobs
 * and a few drifting particles. Sits behind content (z-index 0 in .sheet-wrap).
 * Disabled for prefers-reduced-motion.
 */
export default function Ambient() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOn(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  if (!on) return null;
  const dots = [
    { l: "12%", t: "18%", d: "0s", s: 3 }, { l: "82%", t: "26%", d: "-6s", s: 2 },
    { l: "24%", t: "62%", d: "-3s", s: 2 }, { l: "68%", t: "72%", d: "-9s", s: 3 },
    { l: "46%", t: "40%", d: "-12s", s: 2 }, { l: "90%", t: "84%", d: "-4s", s: 2 },
  ];
  return (
    <div className="ambient" aria-hidden="true">
      <span className="amb-blob amb-blob-1" />
      <span className="amb-blob amb-blob-2" />
      {dots.map((p, i) => (
        <span key={i} className="amb-dot" style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: p.d }} />
      ))}
    </div>
  );
}
