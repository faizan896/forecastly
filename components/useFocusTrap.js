"use client";
import { useEffect } from "react";

const SEL = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal behaviour: moves focus into the dialog on open, restores it to
 * the trigger on close, traps Tab within the dialog, and closes on Escape.
 */
export function useFocusTrap(ref, onClose) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement;
    const focusables = () => [...node.querySelectorAll(SEL)].filter((el) => el.offsetParent !== null);
    (focusables()[0] || node).focus();

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose?.(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [ref, onClose]);
}
