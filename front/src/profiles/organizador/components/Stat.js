import React from 'react';
import { ORG_COLOR } from '../constants.js';

export default function Stat({ label, value, sub, tone = ORG_COLOR }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${tone}` }}>
      <p className="stat-label">{label}</p>
      <div className="stat-value" style={{ color: tone }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
