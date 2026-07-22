"use client";

/**
 * Cinematic brutalist-facade backdrop, hand-built in SVG to echo the reference
 * building photo (warm tan concrete, angled recessed windows). Fully self-contained —
 * no image file, loads instantly, colour-matched to the app palette.
 */
export default function HeroBackdrop() {
  return (
    <svg
      className="hero-facade"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* facet light gradients */}
        <linearGradient id="fLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8bb92" />
          <stop offset="1" stopColor="#b79366" />
        </linearGradient>
        <linearGradient id="fMid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b18d61" />
          <stop offset="1" stopColor="#8a6b45" />
        </linearGradient>
        <linearGradient id="fShadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7d5f3e" />
          <stop offset="1" stopColor="#5b432b" />
        </linearGradient>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2c1c" />
          <stop offset="0.5" stopColor="#241a10" />
          <stop offset="1" stopColor="#171009" />
        </linearGradient>

        {/* one faceted window unit — a recessed leaning diamond framed by angled concrete */}
        <pattern id="facade" x="0" y="0" width="200" height="250" patternUnits="userSpaceOnUse">
          <rect width="200" height="250" fill="#a07d52" />
          {/* surrounding concrete facets (catch light top-left, shadow bottom-right) */}
          <polygon points="0,0 200,0 200,40 0,90" fill="url(#fLight)" />
          <polygon points="0,90 200,40 200,120 0,170" fill="url(#fMid)" />
          <polygon points="0,170 200,120 200,210 0,250" fill="url(#fShadow)" />
          <polygon points="0,210 200,210 200,250 0,250" fill="#4d3925" />
          {/* recessed window: dark frame + glass, leaning like the reference */}
          <polygon points="62,60 150,44 156,150 74,168" fill="#2c2013" />
          <polygon points="70,68 146,54 151,142 80,158" fill="url(#win)" />
          {/* faint reflection streak on the glass */}
          <polygon points="86,74 104,71 128,146 110,150" fill="#5a4a33" opacity="0.35" />
        </pattern>

        {/* film grain */}
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        {/* warm top light + bottom fade so headline text stays readable */}
        <radialGradient id="glow" cx="0.5" cy="0.16" r="0.9">
          <stop offset="0" stopColor="#e9cfa4" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#e9cfa4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1b13" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#2a1b13" stopOpacity="0.35" />
          <stop offset="1" stopColor="#241610" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <rect width="1600" height="1000" fill="url(#facade)" />
      <rect width="1600" height="1000" fill="url(#glow)" />
      <rect width="1600" height="1000" fill="url(#veil)" />
      <rect width="1600" height="1000" filter="url(#grain)" opacity="0.12" />
    </svg>
  );
}
