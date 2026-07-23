"use client";
import { useEffect, useRef, useState } from "react";
import { runAll } from "./engine";

/**
 * Runs runAll() in a Web Worker (off the main thread) so editing assumptions stays
 * buttery-smooth even though each recompute rebuilds the model dozens of times.
 * Latest-wins on concurrent edits. Falls back to synchronous compute if Workers
 * are unavailable or error out.
 */
export function useRunAll(state, scen) {
  const [R, setR] = useState(null);
  const workerRef = useRef(null);
  const okRef = useRef(false);
  const reqRef = useRef(0);
  const lastRef = useRef({ state: null, scen: 0 });

  useEffect(() => {
    if (typeof window === "undefined" || typeof Worker === "undefined") return;
    let w;
    try {
      w = new Worker(new URL("./engine.worker.js", import.meta.url));
      w.onmessage = (e) => {
        const d = e.data;
        if (d && d.id === reqRef.current && d.R) setR(d.R);
      };
      w.onerror = () => {
        okRef.current = false;
        const { state: s, scen: sc } = lastRef.current;
        if (s) { try { setR(runAll(s, sc)); } catch {} }
      };
      workerRef.current = w;
      okRef.current = true;
    } catch {
      okRef.current = false;
    }
    return () => { try { w && w.terminate(); } catch {} workerRef.current = null; okRef.current = false; };
  }, []);

  useEffect(() => {
    if (!state) { setR(null); return; }
    lastRef.current = { state, scen };
    const id = ++reqRef.current;
    if (okRef.current && workerRef.current) {
      workerRef.current.postMessage({ id, state, scen });
    } else {
      try { setR(runAll(state, scen)); } catch { setR(null); }
    }
  }, [state, scen]);

  return R;
}
