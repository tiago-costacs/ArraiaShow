import React from 'react';
import Stat from '../components/Stat.js';
import { ORG_COLOR, TAXA_ORGANIZADOR } from '../constants.js';
import { barracaMetrics, formatCurrency } from '../utils.js';

export default function FinanceiroScreen({ barracas, orders, products }) {
  const rows = barracas.map((barraca) => ({ barraca, ...barracaMetrics(barraca, orders, products) }));
  const sortedRows = [...rows].sort((a, b) => b.receita - a.receita);
  const totalRevenue = rows.reduce((sum, row) => sum + row.receita, 0);
  const lucro = totalRevenue * TAXA_ORGANIZADOR;
  const repasse = totalRevenue - lucro;
  const ticketMedio = orders.length ? totalRevenue / orders.length : 0;
  const totalsByStatus = orders.reduce((acc, order) => {
    acc[order.status || 'pendente'] = (acc[order.status || 'pendente'] || 0) + Number(order.total || 0);
    return acc;
  }, {});

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <Stat label="Total recebido" value={formatCurrency(totalRevenue)} sub="em pedidos" />
        <Stat label="Lucro estimado" value={formatCurrency(lucro)} sub="taxa operacional" tone="#15956d" />
        <Stat label="Repasse total" value={formatCurrency(repasse)} sub="barraquinhas" tone="#2563eb" />
        <Stat label="Ticket medio" value={formatCurrency(ticketMedio)} sub="por pedido" tone="#BA7517" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <p className="card-title">Status financeiro</p>
          {Object.keys(totalsByStatus).length === 0 ? (
            <div className="empty-state">Sem movimentacao financeira para exibir.</div>
          ) : Object.entries(totalsByStatus).map(([status, total]) => (
            <div key={status} className="status-row">
              <span className={`sdot ${status === 'pago' ? 'sdot-ok' : 'sdot-warn'}`} />
              <span className="status-name">{status}</span>
              <span className="status-val">{formatCurrency(total)}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <p className="card-title">Resumo de repasses</p>
          {rows.length === 0 ? (
            <div className="empty-state">Nenhuma barraca cadastrada.</div>
          ) : (
            <div className="finance-summary">
              <div className="finance-line">
                <span>Taxa operacional</span>
                <strong>{Math.round(TAXA_ORGANIZADOR * 100)}%</strong>
              </div>
              <div className="finance-line">
                <span>Fica com a organizacao</span>
                <strong>{formatCurrency(lucro)}</strong>
              </div>
              <div className="finance-line">
                <span>Total para repassar</span>
                <strong>{formatCurrency(repasse)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <p className="card-title">Repasse detalhado por barraca</p>
        {sortedRows.length === 0 ? (
          <div className="empty-state">Nenhuma barraca cadastrada.</div>
        ) : sortedRows.map((row) => {
          const percent = totalRevenue ? Math.round((row.receita / totalRevenue) * 100) : 0;
          return (
            <div key={row.barraca.id} className="settlement-row">
              <div className="settlement-main">
                <div className="settlement-name">{row.barraca.nome}</div>
                <div className="settlement-meta">
                  Receita {formatCurrency(row.receita)} - Taxa {formatCurrency(row.lucro)}
                </div>
                <div className="settlement-bar">
                  <span style={{ width: `${Math.min(100, percent)}%` }} />
                </div>
              </div>
              <div className="settlement-value">
                <span>Repasse</span>
                <strong>{formatCurrency(row.repasse)}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="card-title">Ultimas entradas</p>
        {orders.length === 0 ? (
          <div className="empty-state">Nenhum pedido financeiro encontrado.</div>
        ) : orders.slice(0, 8).map((order) => (
          <div key={order.id} className="report-card">
            <div className="report-icon" style={{ background: '#fff7ed', color: ORG_COLOR }}>R$</div>
            <div className="report-info">
              <div className="report-name">Pedido #{order.id}</div>
              <div className="report-desc">{order.usuario_nome || 'Participante'} - {new Date(order.criado_em).toLocaleString('pt-BR')}</div>
            </div>
            <div className="money-value">{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
