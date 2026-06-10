import React from 'react';

export default function Phone({
  color,
  textColor,
  children,
  title,
  subtitle,
  onBack,
  topContent
}) {
  return (
    <div className="phone">
      <div
        className="statusbar"
        style={{
          background: color,
          color: textColor
        }}
      >
        <span>9:41</span>
        <span>● ● ●</span>
      </div>

      <div
        className="topbar"
        style={{ background: color }}
      >
        {onBack ? (
          <button
            className="back-btn"
            type="button"
            onClick={onBack}
            style={{ color: textColor }}
            aria-label="Voltar"
          >
            ←
          </button>
        ) : (
          <div style={{ width: 38 }} />
        )}

        <div className="topbar-heading">
          <div
            className="topbar-title"
            style={{ color: textColor }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              className="topbar-subtitle"
              style={{ color: textColor }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ width: 38 }} />
      </div>

      {topContent}   {/* ← aqui: logo abaixo da topbar, ANTES do conteúdo */}

      {children}     {/* ← conteúdo das telas vem depois */}
    </div>
  );
}