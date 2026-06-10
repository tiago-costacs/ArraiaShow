import React from 'react';
import { ORG_COLOR } from '../constants.js';
import { barracaMetrics, formatCurrency } from '../utils.js';

export default function RelatoriosScreen({ orders, users, barracas, products }) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const rows = barracas.map((barraca) => ({ barraca, ...barracaMetrics(barraca, orders, products) }));
  const totalTaxa = rows.reduce((sum, row) => sum + row.lucro, 0);
  const totalRepasse = rows.reduce((sum, row) => sum + row.repasse, 0);
  const top = [...rows].sort((a, b) => b.receita - a.receita)[0];

  const reports = [
    { name: 'Resumo financeiro', desc: `${orders.length} pedidos processados`, value: formatCurrency(totalRevenue) },
    { name: 'Taxa operacional', desc: 'Valor estimado para a organizacao', value: formatCurrency(totalTaxa) },
    { name: 'Repasse previsto', desc: 'Total destinado as barraquinhas', value: formatCurrency(totalRepasse) },
    { name: 'Destaque da festa', desc: `${barracas.length} pontos cadastrados`, value: top ? top.barraca.nome : 'Sem vendas' },
    { name: 'Estoque e cardapio', desc: `${products.length} produtos cadastrados`, value: `${products.filter((p) => Number(p.estoque || 0) <= 5).length} criticos` },
    { name: 'Usuarios por permissao', desc: `${users.length} usuarios no sistema`, value: 'Atualizado' },
  ];

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Relatorios rapidos</p>
        {reports.map((report) => (
          <div key={report.name} className="report-card">
            <div className="report-icon" style={{ background: '#fff7ed', color: ORG_COLOR }}>R</div>
            <div className="report-info">
              <div className="report-name">{report.name}</div>
              <div className="report-desc">{report.desc}</div>
            </div>
            <div className="report-arrow">{report.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Fechamento por barraca</p>
        {rows.length === 0 ? (
          <div className="empty-state">Sem dados de repasse para exibir.</div>
        ) : rows.map((row) => (
          <div key={row.barraca.id} className="report-breakdown">
            <div>
              <strong>{row.barraca.nome}</strong>
              <span>{row.relatedOrders.length} pedido(s) - {row.itensVendidos} item(ns)</span>
            </div>
            <div>
              <span>Receita</span>
              <strong>{formatCurrency(row.receita)}</strong>
            </div>
            <div>
              <span>Taxa</span>
              <strong>{formatCurrency(row.lucro)}</strong>
            </div>
            <div>
              <span>Repasse</span>
              <strong>{formatCurrency(row.repasse)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Saude do evento</p>
        <div className="status-row"><span className="sdot sdot-ok" /><span className="status-name">Pedidos sincronizados</span><span className="status-val">{orders.length}</span></div>
        <div className="status-row"><span className="sdot sdot-ok" /><span className="status-name">Barracas cadastradas</span><span className="status-val">{barracas.length}</span></div>
        <div className="status-row"><span className="sdot sdot-warn" /><span className="status-name">Produtos criticos</span><span className="status-val">{products.filter((product) => Number(product.estoque || 0) <= 5).length}</span></div>
      </div>
    </div>
  );
}
