import React from 'react';

export default function QRCode({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 116 116">
      <rect width="116" height="116" fill="white"/>
      <g fill="#1a1a1a">
        <rect x="4" y="4" width="40" height="40" rx="4"/><rect x="8" y="8" width="32" height="32" rx="2" fill="white"/><rect x="12" y="12" width="22" height="22" rx="1"/>
        <rect x="72" y="4" width="40" height="40" rx="4"/><rect x="76" y="8" width="32" height="32" rx="2" fill="white"/><rect x="80" y="12" width="22" height="22" rx="1"/>
        <rect x="4" y="72" width="40" height="40" rx="4"/><rect x="8" y="76" width="32" height="32" rx="2" fill="white"/><rect x="12" y="80" width="22" height="22" rx="1"/>
        <rect x="48" y="4" width="6" height="6"/><rect x="56" y="4" width="6" height="6"/><rect x="64" y="4" width="6" height="6"/>
        <rect x="48" y="12" width="6" height="6"/><rect x="64" y="12" width="6" height="6"/>
        <rect x="48" y="20" width="6" height="6"/><rect x="56" y="20" width="6" height="6"/>
        <rect x="48" y="48" width="6" height="6"/><rect x="56" y="48" width="6" height="6"/><rect x="64" y="48" width="6" height="6"/>
        <rect x="48" y="56" width="6" height="6"/><rect x="64" y="56" width="6" height="6"/>
        <rect x="56" y="64" width="6" height="6"/>
        <rect x="72" y="48" width="6" height="6"/><rect x="80" y="56" width="6" height="6"/><rect x="88" y="48" width="6" height="6"/>
        <rect x="72" y="64" width="6" height="6"/><rect x="88" y="64" width="6" height="6"/><rect x="96" y="56" width="6" height="6"/>
        <rect x="72" y="72" width="6" height="6"/><rect x="80" y="72" width="6" height="6"/>
        <rect x="48" y="72" width="6" height="6"/><rect x="56" y="80" width="6" height="6"/><rect x="48" y="88" width="6" height="6"/>
        <rect x="64" y="80" width="6" height="6"/><rect x="72" y="80" width="6" height="6"/>
        <rect x="88" y="80" width="6" height="6"/><rect x="96" y="72" width="6" height="6"/><rect x="104" y="80" width="6" height="6"/>
        <rect x="96" y="88" width="6" height="6"/><rect x="104" y="96" width="6" height="6"/>
      </g>
    </svg>
  );
}
