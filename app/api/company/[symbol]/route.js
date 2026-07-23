import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/ratelimit";

const BASE = "https://financialmodelingprep.com/stable";
// tickers are short and alphanumeric (plus . and - for class/preferred shares)
const VALID_SYMBOL = /^[A-Z0-9.\-]{1,10}$/;

export async function GET(req, { params }) {
  if (!(await checkRateLimit(`company:${clientIp(req)}`, { limit: 30, windowMs: 10_000 })).ok)
    return NextResponse.json({ error: "Too many requests — slow down a moment." }, { status: 429 });
  const symbol = decodeURIComponent(params.symbol || "").toUpperCase().trim();
  if (!VALID_SYMBOL.test(symbol))
    return NextResponse.json({ error: "That doesn't look like a valid ticker." }, { status: 400 });
  const key = process.env.FMP_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing FMP_API_KEY" }, { status: 500 });

  const get = async (path) => {
    const r = await fetch(`${BASE}/${path}${path.includes("?") ? "&" : "?"}apikey=${key}`, { next: { revalidate: 3600 } });
    if (r.status === 402 || r.status === 403) throw { code: "PLAN" };
    if (!r.ok) throw { code: "HTTP", status: r.status };
    return r.json();
  };

  try {
    const [profileArr, income, balance, cashflow] = await Promise.all([
      get(`profile?symbol=${symbol}`),
      get(`income-statement?symbol=${symbol}&limit=3`),
      get(`balance-sheet-statement?symbol=${symbol}&limit=3`),
      get(`cash-flow-statement?symbol=${symbol}&limit=3`),
    ]);
    const profile = Array.isArray(profileArr) ? profileArr[0] : profileArr;
    if (!profile || !Array.isArray(income) || income.length === 0 ||
        !Array.isArray(balance) || balance.length === 0 || !Array.isArray(cashflow) || cashflow.length === 0) {
      return NextResponse.json(
        { error: "No financial data available for this company on the current data plan. Try a US-listed ticker — most global giants have a US listing or ADR (e.g. TM for Toyota, BABA for Alibaba)." },
        { status: 404 }
      );
    }
    // API returns newest-first; engine expects oldest-first
    const asc = (a) => [...a].reverse();
    return NextResponse.json({ profile, income: asc(income), balance: asc(balance), cashflow: asc(cashflow) });
  } catch (e) {
    if (e?.code === "PLAN")
      return NextResponse.json(
        { error: "This ticker isn't covered by the free data plan (usually non-US listings). Try the company's US ticker or ADR instead — e.g. TM for Toyota, SONY for Sony, SAP for SAP." },
        { status: 402 }
      );
    return NextResponse.json({ error: "Could not load company data. Check the ticker and try again." }, { status: 502 });
  }
}
