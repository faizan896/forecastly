/**
 * Typed contract for the Vexa valuation engine.
 *
 * The engine itself is authored in pure, well-tested JS (see engine.test.js); these
 * interfaces document its public shapes so new TypeScript modules — and editor
 * tooling — get full type-safety when consuming state and results. This is the
 * foundation for an incremental migration of the codebase to TypeScript.
 */

/** Historical financials (all monetary values in millions of the reporting currency). */
export interface Hist {
  years: string[];
  rev: number[]; cogs: number[]; sga: number[]; da: number[];
  intExp: number[]; intInc: number[]; tax: number[]; shares: number[];
  cash: number[]; ar: number[]; inv: number[]; oca: number[]; ppe: number[]; olta: number[];
  ap: number[]; accr: number[]; ocl: number[]; debt: number[]; oltl: number[]; eq: number[];
  sbc: number[]; capex: number[]; div: number[]; bb: number[];
  price: number; currency: string; name: string; symbol: string;
  range?: string; sector?: string; image?: string; exchange?: string;
}

/** Company context for the overview panel. */
export interface Co {
  description: string; sector: string; industry: string; ceo: string;
  employees: string | number; exchange: string; country: string; website: string;
  marketCap: number; ipoDate: string;
}

/** Model assumptions. Scenario levers (growth/gm/sgaPct) are [base, bull, bear]. */
export interface Assumptions {
  growth: [number, number, number];
  gm: [number, number, number];
  sgaPct: [number, number, number];
  daPct: number; capexPct: number; taxRate: number;
  arPct: number; invPct: number; ocaPct: number; apPct: number; accrPct: number; oclPct: number;
  sbcPct: number; divG: number; buyback: number; debtRate: number; cashRate: number;
  rf: number; beta: number; erp: number; kd: number; tg: number; exitMult: number;
  raiseAmt: number; eqDisc: number; newDebtRate: number;
  acqNI: number; acqSh: number; acqPx: number; prem: number; pctStock: number;
  acqDebtRate: number; syn: number; lboEntry: number; lboExit: number; lboLev: number;
  lboRate: number; lboFees: number;
}

export interface State { hist: Hist; asm: Assumptions; co: Co; }

/** DCF output block. */
export interface Dcf {
  ke: number; kdAT: number; E: number; D: number; we: number; wd: number; wacc: number;
  pvF: number; tv: number; pvTV: number; ev: number; netDebt: number; eqV: number;
  perShare: number; upside: number; tvExit: number; perShareExit: number; tvPct: number;
}

export interface ModelResult { f: Record<string, number[]>; dcf: Dcf; }

export interface ReverseDcf {
  impliedGrowth: number; histG: number | null; baseG: number; capped?: "low" | "high";
}

/** Everything runAll() returns for the dashboard. */
export interface RunAllResult {
  base: ModelResult;
  scenarios: ModelResult[];
  sensTg: { rows: number[]; cols: number[]; grid: (number | null)[][] };
  sensExit: { rows: number[]; cols: number[]; grid: (number | null)[][] };
  tornado: { base: number; items: { label: string; low: number; high: number }[] };
  cap: Record<string, number>;
  ma: Record<string, unknown>;
  lbo: Record<string, unknown>;
  reverse: ReverseDcf | null;
}

export type ScenarioIndex = 0 | 1 | 2;
