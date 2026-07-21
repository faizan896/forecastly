"use client";

export const Card = ({ title, right, children, className = "" }) => (
  <div className={"card " + className}>
    {(title || right) && (
      <div className="card-head">
        {title && <h2 className="serif">{title}</h2>}
        {right && <div className="smallcaps">{right}</div>}
      </div>
    )}
    {children}
  </div>
);

export const Learn = ({ children }) => <div className="learn">📘 {children}</div>;

export const Sec = ({ children }) => (
  <tr className="section"><td colSpan={99}>{children}</td></tr>
);

export const Row = ({ label, vals, bold, cls = [], first }) => (
  <tr className={bold ? "bold" : ""}>
    <td>{label}</td>
    {vals.map((v, i) => (
      <td key={i} className={cls[i] || ""}>{v}</td>
    ))}
  </tr>
);
