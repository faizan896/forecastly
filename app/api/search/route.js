import { NextResponse } from "next/server";

const BASE = "https://financialmodelingprep.com/stable";

export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);
  const key = process.env.FMP_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing FMP_API_KEY" }, { status: 500 });
  try {
    const [bySym, byName] = await Promise.all([
      fetch(`${BASE}/search-symbol?query=${encodeURIComponent(q)}&limit=6&apikey=${key}`, { next: { revalidate: 3600 } }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${BASE}/search-name?query=${encodeURIComponent(q)}&limit=6&apikey=${key}`, { next: { revalidate: 3600 } }).then((r) => (r.ok ? r.json() : [])),
    ]);
    const seen = new Set();
    const merged = [...(Array.isArray(bySym) ? bySym : []), ...(Array.isArray(byName) ? byName : [])].filter((r) => {
      if (!r.symbol || seen.has(r.symbol)) return false;
      seen.add(r.symbol);
      return true;
    }).slice(0, 8);
    return NextResponse.json(merged);
  } catch (e) {
    return NextResponse.json({ error: "Search failed — try again." }, { status: 502 });
  }
}
