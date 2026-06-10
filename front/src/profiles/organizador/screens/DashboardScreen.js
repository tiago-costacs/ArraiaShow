import React from 'react';
import Stat from '../components/Stat.js';
import { ORG_COLOR, TAXA_ORGANIZADOR } from '../constants.js';
import { barracaMetrics, formatCurrency, formatDate, getInitials } from '../utils.js';

export default function DashboardScreen({ event, users, barracas, orders, products }) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lucroOrganizador = totalRevenue * TAXA_ORGANIZADOR;
  const repasseTotal = totalRevenue - lucroOrganizador;
  const participantes = users.filter((user) => user.tipo === 'participante').length;
  const topBarracas = barracas
    .map((barraca) => ({ barraca, ...barracaMetrics(barraca, orders, products) }))
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 4);

  return (
    <div className="screen-body">
      <div className="hero-card org-hero">
        <div>
          <div className="eyebrow">Evento em operacao</div>
          <h2>{event?.nome || 'Arraia Show'}</h2>
          <p>{event ? `Data do evento: ${formatDate(event.data_evento)}` : 'Cadastre um evento para acompanhar a operacao completa.'}</p>
        </div>
        <span className={`badge ${event?.ativo ? 'badge-ok' : 'badge-warn'}`}>{event?.ativo ? 'Ativo' : 'Aguardando'}</span>
      </div>

      <div className="stats-grid">
        <Stat label="Faturamento" value={formatCurrency(totalRevenue)} sub={`${orders.length} pedidos`} />
        <Stat label="Lucro estimado" value={formatCurrency(lucroOrganizador)} sub={`${Math.round(TAXA_ORGANIZADOR * 100)}% taxa operacional`} tone="#15956d" />
        <Stat label="Repasse" value={formatCurrency(repasseTotal)} sub="para barraquinhas" tone="#2563eb" />
        <Stat label="Participantes" value={participantes} sub={`${barracas.length} barracas`} tone="#BA7517" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <p className="card-title">Barracas em destaque</p>
          {topBarracas.length === 0 || topBarracas.every((item) => item.receita === 0) ? (
            <div className="empty-state">Nenhuma venda registrada ainda.</div>
          ) : topBarracas.map((item) => (
            <div key={item.barraca.id} className="bar-row">
              <span className="bar-label">{item.barraca.nome}</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${Math.min(100, (item.receita / Math.max(topBarracas[0].receita, 1)) * 100)}%`, background: ORG_COLOR }} />
              </div>
              <span className="bar-val">{formatCurrency(item.receita)}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <p className="card-title">Alertas da operacao</p>
          <div className="alert-row">
            <span className={`alert-dot ${products.some((p) => Number(p.estoque || 0) <= 5) ? 'sdot-warn' : 'sdot-ok'}`} />
            <div className="alert-text">{products.filter((p) => Number(p.estoque || 0) <= 5).length} produto(s) com estoque critico.</div>
          </div>
          <div className="alert-row">
            <span className={`alert-dot ${barracas.some((b) => !b.responsavel_id) ? 'sdot-warn' : 'sdot-ok'}`} />
            <div className="alert-text">{barracas.filter((b) => !b.responsavel_id).length} barraca(s) sem responsavel.</div>
          </div>
          <div className="alert-row">
            <span className={`alert-dot ${orders.length ? 'sdot-ok' : 'sdot-warn'}`} />
            <div className="alert-text">{orders.length ? 'Pedidos sincronizados com o financeiro.' : 'Aguardando as primeiras vendas.'}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="card-title">Pedidos recentes</p>
        {orders.length === 0 ? (
          <div className="empty-state">Os pedidos aparecerao aqui conforme as vendas forem acontecendo.</div>
        ) : orders.slice(0, 6).map((order) => (
          <div key={order.id} className="item-row">
            <div className="avatar" style={{ background: '#fff7ed', color: ORG_COLOR }}>{getInitials(order.usuario_nome)}</div>
            <div className="item-info">
              <div className="item-name">{order.usuario_nome || `Pedido #${order.id}`}</div>
              <div className="item-meta">{new Date(order.criado_em).toLocaleString('pt-BR')} - {order.itens?.length || 0} item(s)</div>
            </div>
            <div className="money-value">{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
