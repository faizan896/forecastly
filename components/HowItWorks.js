"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const STEPS = [
  { n: 1, t: "Search a company", d: "Type a name or ticker. Vexa pulls its last three years of financials from official filings." },
  { n: 2, t: "Answer four questions", d: "About growth, profit, risk and the long run. Each one already has a sensible answer filled in, so you can just adjust it." },
  { n: 3, t: "Read your model", d: "You get the full valuation with charts. Change any number and everything updates." },
];

function Step({ s }) {
  return (
    <div className="step3">
      <div className="n">{s.n}</div>
      <div><b>{s.t}</b><br />{s.d}</div>
    </div>
  );
}

/** One tasteful pinned moment: steps reveal in sequence as you scroll. Static on mobile / reduced-motion. */
export default function HowItWorks() {
  const reduce = useReducedMotion();
  const [pin, setPin] = useState(false);
  useEffect(() => {
    setPin(!reduce && typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches);
  }, [reduce]);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const o0 = useTransform(scrollYProgress, [0.00, 0.12], [0.28, 1]);
  const y0 = useTransform(scrollYProgress, [0.00, 0.12], [34, 0]);
  const o1 = useTransform(scrollYProgress, [0.28, 0.44], [0.28, 1]);
  const y1 = useTransform(scrollYProgress, [0.28, 0.44], [34, 0]);
  const o2 = useTransform(scrollYProgress, [0.56, 0.72], [0.28, 1]);
  const y2 = useTransform(scrollYProgress, [0.56, 0.72], [34, 0]);
  const barW = useTransform(scrollYProgress, [0.02, 0.78], ["0%", "100%"]);
  const ops = [o0, o1, o2], ys = [y0, y1, y2];

  if (!pin) {
    return (
      <section className="lp-band alt reveal" id="how">
        <div className="lp-band-inner">
          <div className="smallcaps center">How it works</div>
          <h2 className="serif center lp-h2">Three steps to a full model.</h2>
          <div className="steps3 lp-steps">{STEPS.map((s) => <Step key={s.n} s={s} />)}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="lp-band alt how-pin" id="how" ref={ref}>
      <div className="how-sticky">
        <div className="lp-band-inner">
          <div className="smallcaps center">How it works</div>
          <h2 className="serif center lp-h2">Three steps to a full model.</h2>
          <div className="how-pin-grid">
            <div className="how-rail"><motion.span className="how-rail-fill" style={{ width: barW }} /></div>
            <div className="steps3 lp-steps how-pin-steps">
              {STEPS.map((s, k) => (
                <motion.div key={s.n} style={{ opacity: ops[k], y: ys[k] }}>
                  <Step s={s} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
