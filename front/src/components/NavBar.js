import React from 'react';

export default function NavBar({ items, active, onSelect, activeColor }) {
  return (
    <nav className="navbar" aria-label="Navegacao do perfil">
      {items.map((item, index) => {
        const isActive = active === index;

        return (
          <button
            key={item.label}
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={isActive ? { color: activeColor } : undefined}
            onClick={() => onSelect(index)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
