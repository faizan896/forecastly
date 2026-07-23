"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Georgia, 'Times New Roman', serif", background: "#14100c", color: "#ece3d6", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px" }}>
        <div style={{ maxWidth: 460 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Vexa hit an unexpected error</h2>
          <p style={{ color: "#a6988a", marginBottom: 20, lineHeight: 1.6 }}>The app failed to load. Please reload — if it keeps happening, try again shortly.</p>
          <button onClick={() => reset()} style={{ background: "#e6c48f", color: "#1a120c", border: "none", borderRadius: 8, padding: "12px 26px", fontSize: 15, cursor: "pointer" }}>Reload</button>
        </div>
      </body>
    </html>
  );
}
