import React from 'react';
import { ADM_COLOR } from '../constants.js';

export default function StatCard({ label, value, sub, tone = ADM_COLOR }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${tone}` }}>
      <p className="stat-label">{label}</p>
      <div className="stat-value" style={{ color: tone }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
