import React, { useState, useRef, useEffect } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const QUICK = [
  { label: '08:00', h: 8, m: 0 },
  { label: '12:00', h: 12, m: 0 },
  { label: '18:00', h: 18, m: 0 },
];

export default function TimePicker({ value, onChange, accentColor = '#534AB7' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hourColRef = useRef(null);
  const minColRef = useRef(null);

  const parts = value ? value.split(':').map(Number) : [null, null];
  const selH = parts[0] ?? null;
  const selM = parts[1] ?? null;

  const display =
    selH !== null && selM !== null ? `${pad(selH)}:${pad(selM)}` : '--:--';
  const isPlaceholder = selH === null;

  function emit(h, m) {
    const rh = h !== null ? h : selH ?? 0;
    const rm = m !== null ? m : selM ?? 0;
    onChange(`${pad(rh)}:${pad(rm)}`);
  }

  function selectHour(h) {
    emit(h, null);
    if (hourColRef.current) hourColRef.current.scrollTop = h * 40;
  }

  function selectMin(m) {
    emit(null, m);
    if (minColRef.current) minColRef.current.scrollTop = (m / 5) * 40;
  }

  function setQuick(h, m) {
    onChange(`${pad(h)}:${pad(m)}`);
    if (hourColRef.current) hourColRef.current.scrollTop = h * 40;
    if (minColRef.current) minColRef.current.scrollTop = (m / 5) * 40;
  }

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (selH !== null && hourColRef.current)
      hourColRef.current.scrollTop = selH * 40;
    if (selM !== null && minColRef.current)
      minColRef.current.scrollTop = (selM / 5) * 40;
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          height: 40,
          padding: '0 14px',
          background: '#fff',
          border: `0.5px solid ${open ? accentColor : '#d1d5db'}`,
          borderRadius: 8,
          cursor: 'pointer',
          boxShadow: open ? `0 0 0 3px ${accentColor}26` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 15" />
        </svg>

        <span
          style={{
            flex: 1,
            textAlign: 'left',
            fontSize: 15,
            color: isPlaceholder ? '#9ca3af' : '#111827',
          }}
        >
          {display}
        </span>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 999,
            width: '100%',
            minWidth: 220,
            background: '#fff',
            border: '0.5px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '0.5px solid #e5e7eb' }}>
            {['hora', 'minuto'].map((label, i) => (
              <span
                key={label}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#9ca3af',
                  borderRight: i === 0 ? '0.5px solid #e5e7eb' : 'none',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex' }}>
            <div
              ref={hourColRef}
              style={{
                flex: 1,
                height: 200,
                overflowY: 'auto',
                scrollSnapType: 'y mandatory',
                borderRight: '0.5px solid #e5e7eb',
                scrollbarWidth: 'none',
              }}
            >
              {HOURS.map((h) => (
                <div
                  key={h}
                  onClick={() => selectHour(h)}
                  style={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: selH === h ? 500 : 400,
                    color: selH === h ? accentColor : '#6b7280',
                    background: selH === h ? `${accentColor}18` : 'transparent',
                    cursor: 'pointer',
                    scrollSnapAlign: 'start',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  {pad(h)}
                </div>
              ))}
            </div>

            <div
              ref={minColRef}
              style={{
                flex: 1,
                height: 200,
                overflowY: 'auto',
                scrollSnapType: 'y mandatory',
                scrollbarWidth: 'none',
              }}
            >
              {MINUTES.map((m) => (
                <div
                  key={m}
                  onClick={() => selectMin(m)}
                  style={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: selM === m ? 500 : 400,
                    color: selM === m ? accentColor : '#6b7280',
                    background: selM === m ? `${accentColor}18` : 'transparent',
                    cursor: 'pointer',
                    scrollSnapAlign: 'start',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  {pad(m)}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderTop: '0.5px solid #e5e7eb',
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              {QUICK.map(({ label, h, m }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setQuick(h, m)}
                  style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    border: '0.5px solid #d1d5db',
                    borderRadius: 8,
                    background: '#f9fafb',
                    color: '#6b7280',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 16px',
                background: accentColor,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
