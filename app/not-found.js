import Link from "next/link";

export const metadata = { title: "Not found — Vexa" };

export default function NotFound() {
  return (
    <div className="err-box">
      <h2 className="serif">Page not found</h2>
      <p>That page doesn&apos;t exist. Try searching a company instead.</p>
      <Link className="btn ghost" style={{ width: "auto", padding: "12px 26px" }} href="/">← Back to Vexa</Link>
    </div>
  );
}
