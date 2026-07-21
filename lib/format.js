export const fm = (v, d = 1) =>
  v == null || isNaN(v)
    ? "—"
    : v < 0
    ? "(" + Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) + ")"
    : v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export const f0 = (v) => fm(v, 0);
export const pc = (v, d = 1) => (v == null || isNaN(v) ? "—" : (v * 100).toFixed(d) + "%");
export const px = (v, cur = "$") => (v == null || isNaN(v) ? "—" : cur + fm(v, 2));
export const mx = (v) => (v == null || isNaN(v) ? "—" : v.toFixed(1) + "x");
export const big = (v) => {
  if (v == null || isNaN(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e6) return (v / 1e6).toFixed(2) + "T";
  if (a >= 1e3) return (v / 1e3).toFixed(2) + "B";
  return v.toFixed(0) + "M";
};
export const CUR = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", INR: "₹", PKR: "Rs ", CNY: "¥", KRW: "₩", CAD: "C$", AUD: "A$", CHF: "Fr ", HKD: "HK$" };
export const curSym = (c) => CUR[c] || (c ? c + " " : "$");
