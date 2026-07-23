"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => { if (typeof console !== "undefined") console.error(error); }, [error]);
  return (
    <div className="err-box" role="alert">
      <h2 className="serif">Something broke on this page</h2>
      <p>It's not you — an unexpected error slipped through. You can retry, or head back to search.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn ghost" style={{ width: "auto", padding: "12px 26px" }} onClick={() => reset()}>Try again</button>
        <Link className="btn ghost" style={{ width: "auto", padding: "12px 26px" }} href="/">← Back to search</Link>
      </div>
    </div>
  );
}
