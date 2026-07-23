import ModelClient from "./ModelClient";

const BASE = "https://financialmodelingprep.com/stable";
const clean = (s) => decodeURIComponent(s || "").toUpperCase().replace(/[^A-Z0-9.\-]/g, "").slice(0, 10);

export async function generateMetadata({ params }) {
  const sym = clean(params.symbol);
  let name = sym;
  try {
    const key = process.env.FMP_API_KEY;
    if (key && sym) {
      const r = await fetch(`${BASE}/profile?symbol=${sym}&apikey=${key}`, { next: { revalidate: 86400 } });
      if (r.ok) {
        const j = await r.json();
        name = (Array.isArray(j) ? j[0] : j)?.companyName || sym;
      }
    }
  } catch { /* fall back to ticker */ }

  const title = `${name} (${sym}) valuation — Vexa`;
  const description = `A full intrinsic-value model of ${name} (${sym}) — DCF, scenarios, sensitivity, M&A and LBO — built from real financials. Free on Vexa.`;
  return {
    title,
    description,
    alternates: { canonical: `/model/${sym}` },
    openGraph: { title, description, type: "website", siteName: "Vexa" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function Page() {
  return <ModelClient />;
}
