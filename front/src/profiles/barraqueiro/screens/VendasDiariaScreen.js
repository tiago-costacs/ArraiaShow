import React, { useMemo } from 'react';
import { BA, BL, BM } from '../constants.js';
import { formatCurrency } from '../utils.js';

export default function VendasDiariaScreen({ orders }) {
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total || 0), 0), [orders]);
  const totalItems = useMemo(() => orders.reduce((sum, order) => sum + (order.itens || []).reduce((sub, item) => sub + Number(item.quantidade || 0), 0), 0), [orders]);
  const topProducts = useMemo(() => {
    const counts = {};
    orders.forEach((order) => (order.itens || []).forEach((item) => {
      counts[item.produto_nome] = (counts[item.produto_nome] || 0) + Number(item.quantidade || 0);
    }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [orders]);

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <div className="stat-card"><p className="stat-label">Total arrecadado</p><div className="stat-value">{formatCurrency(totalRevenue)}</div><div className="stat-sub">{orders.length} vendas</div></div>
        <div className="stat-card"><p className="stat-label">Itens vendidos</p><div className="stat-value">{totalItems}</div><div className="stat-sub">em todas as vendas</div></div>
        <div className="stat-card"><p className="stat-label">Pedidos</p><div className="stat-value">{orders.length}</div><div className="stat-sub">desde o inicio</div></div>
      </div>
      <div className="card">
        <p className="card-title">Produtos mais vendidos</p>
        {topProducts.length === 0 ? (
          <div className="empty-state">Ainda nao ha vendas registradas.</div>
        ) : topProducts.map(([name, count]) => (
          <div key={name} className="bar-row">
            <span className="bar-label">{name}</span>
            <div className="bar-bg"><div className="bar-fill" style={{ width: `${Math.min(100, count * 4)}%`, background: BA }} /></div>
            <span className="bar-val">{count} un.</span>
          </div>
        ))}
      </div>
      <div className="card">
        <p className="card-title">Ultimas vendas</p>
        {orders.length === 0 ? (
          <div className="empty-state">Nenhuma venda encontrada.</div>
        ) : orders.slice(0, 5).map((order) => (
          <div key={order.id} className="item-row">
            <div className="avatar" style={{ background: BL, color: BM, fontSize: 10, fontWeight: 800 }}>{new Date(order.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="item-info"><div className="item-name">{order.usuario_nome}</div><div className="item-meta">{order.itens?.length || 0} item(s)</div></div>
            <div className="money-value">{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
