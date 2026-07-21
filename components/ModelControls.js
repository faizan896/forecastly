"use client";
import { pc } from "@/lib/format";

/** Right-rail Markly "Model Controls" — scenario buttons + the key levers, grouped. */
export default function ModelControls({ state, setAsm, scen, setScen, learnOn, setLearnOn }) {
  const a = state.asm;
  const upd = (patch) => setAsm({ ...a, ...patch });
  const updScen = (key, v) => {
    const arr = [...a[key]]; arr[scen] = v; upd({ [key]: arr });
  };
  const Num = ({ label, value, onChange, step = 1, pctv }) => (
    <>
      <label className="smallcaps">{label}</label>
      <input
        type="number"
        step={step}
        value={pctv ? +(value * 100).toFixed(2) : +(+value).toFixed(2)}
        onChange={(e) => onChange(pctv ? (+e.target.value || 0) / 100 : +e.target.value || 0)}
      />
    </>
  );
  return (
    <div className="card controls-card">
      <h2 className="serif">Model Controls</h2>
      <div className="scen-row">
        {["Base", "Bull", "Bear"].map((n, i) => (
          <button key={n} className={scen === i ? "on" : ""} onClick={() => setScen(i)}>{n}</button>
        ))}
      </div>
      <div className="smallcaps" style={{ marginTop: 14 }}>Scenario levers — editing the {["Base", "Bull", "Bear"][scen]} case</div>
      <Num label="Revenue growth (%)" pctv value={a.growth[scen]} step={0.5} onChange={(v) => updScen("growth", v)} />
      <Num label="Gross margin (%)" pctv value={a.gm[scen]} step={0.5} onChange={(v) => updScen("gm", v)} />
      <Num label="Operating costs % of revenue" pctv value={a.sgaPct[scen]} step={0.5} onChange={(v) => updScen("sgaPct", v)} />
      <div className="smallcaps" style={{ marginTop: 18 }}>Valuation</div>
      <Num label="Beta" value={a.beta} step={0.05} onChange={(v) => upd({ beta: v })} />
      <Num label="Terminal growth (%)" pctv value={a.tg} step={0.25} onChange={(v) => upd({ tg: v })} />
      <Num label="Exit EV/EBITDA (x)" value={a.exitMult} step={0.5} onChange={(v) => upd({ exitMult: v })} />
      <div className="smallcaps" style={{ marginTop: 18 }}>Deals</div>
      <Num label="M&A offer premium (%)" pctv value={a.prem} step={1} onChange={(v) => upd({ prem: v })} />
      <Num label="M&A % paid in stock" pctv value={a.pctStock} step={5} onChange={(v) => upd({ pctStock: v })} />
      <Num label="LBO entry multiple (x)" value={a.lboEntry} step={0.5} onChange={(v) => upd({ lboEntry: v })} />
      <Num label="LBO leverage (x EBITDA)" value={a.lboLev} step={0.5} onChange={(v) => upd({ lboLev: v })} />
      <Num label="Capital raise amount ($M)" value={a.raiseAmt} step={100} onChange={(v) => upd({ raiseAmt: v })} />
      <button className="btn ghost" onClick={() => setLearnOn(!learnOn)}>
        {learnOn ? "Hide" : "Show"} learning notes
      </button>
      <div className="suggest" style={{ marginTop: 12 }}>
        WACC right now: <b>{pc(a.rf + a.beta * a.erp, 2)}</b> cost of equity blended with after-tax debt.
        Every edit re-runs all seven analyses instantly.
      </div>
    </div>
  );
}
