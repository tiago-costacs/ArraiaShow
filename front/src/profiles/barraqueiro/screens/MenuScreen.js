import React from 'react';
import { BA, BL, BM } from '../constants.js';
import { formatCurrency } from '../utils.js';

export default function MenuScreen({ products, newProduct, setNewProduct, addProduct, loading, status }) {
  const ativos = products.filter((product) => Number(product.estoque || 0) > 0).length;

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Cardapio</p>
          <h2>{products.length} item(ns)</h2>
        </div>
        <span className="badge badge-ok">{ativos} ativos</span>
      </div>

      <div className="menu-grid">
        {products.length === 0 ? (
          <div className="card"><div className="empty-state">Nenhum produto cadastrado ainda.</div></div>
        ) : products.map((product) => {
          const estoque = Number(product.estoque || 0);
          return (
            <div key={product.id} className={`menu-card ${estoque <= 0 ? 'is-off' : ''}`}>
              <div className="menu-thumb" style={{ background: estoque > 0 ? BL : '#fee2e2', color: estoque > 0 ? BM : '#991b1b' }}>{product.nome?.slice(0, 1).toUpperCase() || 'P'}</div>
              <div className="menu-info">
                <div className="menu-name">{product.nome}</div>
                <div className="menu-price">{formatCurrency(product.preco)}</div>
                <div className="menu-meta">Estoque {estoque}</div>
              </div>
              <span className={`badge ${estoque > 0 ? 'badge-ok' : 'badge-warn'}`}>{estoque > 0 ? 'Ativo' : 'Esgotado'}</span>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="card-title">Adicionar produto</p>
        <div className="field">
          <label>Nome do produto</label>
          <input value={newProduct.nome} onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })} placeholder="Ex: Quentao" />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Preco (R$)</label>
            <input value={newProduct.preco} onChange={(e) => setNewProduct({ ...newProduct, preco: e.target.value })} type="number" placeholder="10,00" />
          </div>
          <div className="field">
            <label>Estoque inicial</label>
            <input value={newProduct.estoque} onChange={(e) => setNewProduct({ ...newProduct, estoque: e.target.value })} type="number" placeholder="10" />
          </div>
        </div>
        <button className="btn" type="button" style={{ background: BA, color: '#fff' }} onClick={addProduct} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar produto'}
        </button>
        {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
      </div>
    </div>
  );
}
