import React from 'react';
import { BA, BM } from '../constants.js';
import { formatCurrency } from '../utils.js';

export default function EstoqueScreen({ products, onUpdateStock, loading, status }) {
  const total = products.reduce((sum, product) => sum + Number(product.estoque || 0), 0);
  const criticos = products.filter((product) => Number(product.estoque || 0) > 0 && Number(product.estoque || 0) <= 5).length;
  const esgotados = products.filter((product) => Number(product.estoque || 0) <= 0).length;

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <div className="stat-card"><p className="stat-label">Unidades</p><div className="stat-value" style={{ color: BM }}>{total}</div><div className="stat-sub">em estoque</div></div>
        <div className="stat-card"><p className="stat-label">Criticos</p><div className="stat-value" style={{ color: '#BA7517' }}>{criticos}</div><div className="stat-sub">ate 5 unidades</div></div>
        <div className="stat-card"><p className="stat-label">Esgotados</p><div className="stat-value" style={{ color: '#b42318' }}>{esgotados}</div><div className="stat-sub">fora da venda</div></div>
      </div>

      <div className="card">
        <p className="card-title">Controle de estoque</p>
        {products.length === 0 ? (
          <div className="empty-state">Cadastre produtos no cardapio para controlar estoque.</div>
        ) : products.map((product) => {
          const estoque = Number(product.estoque || 0);
          const percent = Math.min(100, (estoque / 30) * 100);
          return (
            <div key={product.id} className="stock-row">
              <div className="stock-main">
                <div className="item-name">{product.nome}</div>
                <div className="item-meta">{formatCurrency(product.preco)} - {estoque > 0 ? 'aparece para venda' : 'oculto nas vendas'}</div>
                <div className="bar-bg" style={{ marginTop: 8 }}>
                  <div className="bar-fill" style={{ width: `${percent}%`, background: estoque <= 0 ? '#b42318' : estoque <= 5 ? '#BA7517' : BA }} />
                </div>
              </div>
              <div className="stock-actions">
                <button className="qty-btn" type="button" disabled={loading} onClick={() => onUpdateStock(product, Math.max(0, estoque - 1))}>-</button>
                <div className="qty-num">{estoque}</div>
                <button className="qty-btn" type="button" disabled={loading} onClick={() => onUpdateStock(product, estoque + 1)}>+</button>
                {estoque > 0 ? (
                  <button className="chip" type="button" disabled={loading} onClick={() => onUpdateStock(product, 0)}>Esgotar</button>
                ) : (
                  <button className="chip active" type="button" disabled={loading} onClick={() => onUpdateStock(product, 10)}>Reativar</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
    </div>
  );
}
