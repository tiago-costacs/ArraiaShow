import React, { useMemo } from 'react';
import { BA, BL, BM } from '../constants.js';
import { formatCurrency } from '../utils.js';

export default function VendaScreen({ participants, products, cart, setCart, selectedParticipantId, setSelectedParticipantId, status, setStatus, onConfirmSale, loading }) {
  const activeProducts = products.filter((product) => Number(product.estoque || 0) > 0);

  const addProduct = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.produto_id === product.id);
      if (existing) {
        if (existing.quantidade >= Number(product.estoque || 0)) {
          setStatus(`Estoque maximo de ${product.nome} atingido.`);
          return current;
        }
        return current.map((item) => item.produto_id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...current, { produto_id: product.id, nome: product.nome, preco: product.preco, estoque: product.estoque, quantidade: 1 }];
    });
    setStatus(`${product.nome} adicionado ao pedido.`);
  };

  const changeQuantity = (produtoId, delta) => {
    setCart((current) => current.map((item) => {
      if (item.produto_id !== produtoId) return item;
      return { ...item, quantidade: Math.max(1, Math.min(Number(item.estoque || 1), item.quantidade + delta)) };
    }));
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.preco || 0) * Number(item.quantidade || 0), 0), [cart]);

  const submit = () => {
    if (!selectedParticipantId) return setStatus('Selecione um participante antes de confirmar a venda.');
    if (cart.length === 0) return setStatus('Adicione ao menos um produto ao pedido.');
    onConfirmSale({ usuario_id: selectedParticipantId, itens: cart.map((item) => ({ produto_id: item.produto_id, quantidade: item.quantidade })) });
  };

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Participante</p>
        <div className="field">
          <label>Selecione o cliente</label>
          <select value={selectedParticipantId || ''} onChange={(e) => setSelectedParticipantId(Number(e.target.value))}>
            <option value="">Escolha um participante</option>
            {participants.map((participant) => <option key={participant.id} value={participant.id}>{participant.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <p className="card-title">Cardapio ativo</p>
        {activeProducts.length === 0 ? (
          <div className="empty-state">Nenhum item com estoque para venda.</div>
        ) : activeProducts.map((product) => (
          <div key={product.id} className="item-row">
            <div className="item-info">
              <div className="item-name">{product.nome}</div>
              <div className="item-meta">{formatCurrency(product.preco)} - estoque {product.estoque}</div>
            </div>
            <button className="btn" type="button" style={{ width: 'auto', padding: '8px 14px', background: BL, color: BM, fontSize: 12 }} onClick={() => addProduct(product)}>
              Adicionar
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Pedido atual</p>
        {cart.length === 0 ? (
          <div className="empty-state">Nenhum item selecionado.</div>
        ) : cart.map((item) => (
          <div key={item.produto_id} className="row">
            <div>
              <div className="row-label">{item.nome} x {item.quantidade}</div>
              <div style={{ fontSize: 11, color: '#777' }}>{formatCurrency(item.preco)} cada - max. {item.estoque}</div>
            </div>
            <div className="qty-ctrl">
              <button className="qty-btn" type="button" onClick={() => changeQuantity(item.produto_id, -1)}>-</button>
              <div className="qty-num">{item.quantidade}</div>
              <button className="qty-btn" type="button" onClick={() => changeQuantity(item.produto_id, 1)}>+</button>
              <button className="chip" type="button" onClick={() => setCart((current) => current.filter((cartItem) => cartItem.produto_id !== item.produto_id))}>Remover</button>
            </div>
          </div>
        ))}
        <div className="row" style={{ borderTop: '2px solid #f0eeea' }}>
          <span style={{ fontWeight: 800 }}>Total</span>
          <span className="row-value">{formatCurrency(total)}</span>
        </div>
      </div>

      <button className="btn" type="button" style={{ background: BA, color: '#fff' }} onClick={submit} disabled={loading}>
        {loading ? 'Registrando venda...' : 'Registrar venda'}
      </button>
      <button className="btn btn-secondary" type="button" onClick={() => setCart([])} style={{ marginTop: 8 }}>Limpar pedido</button>
      {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
    </div>
  );
}
