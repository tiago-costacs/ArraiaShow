import React from 'react';
import BarracaAssignForm from './BarracaAssignForm.js';
import { ORG_COLOR } from '../constants.js';
import { formatCurrency } from '../utils.js';

export default function BarracaCard({
  barraca,
  owner,
  metrics,
  barraqueiros,
  assignBarracaId,
  selectedResponsavel,
  menuOpenId,
  loading,
  onStartAssign,
  onCancelAssign,
  onSaveResponsavel,
  onDeleteBarraca,
  onToggleMenu,
  onChangeResponsavel,
}) {
  const isAssigning = assignBarracaId === barraca.id;

  return (
    <div className="barraca-card">
      <div className="barraca-header">
        <div className="barraca-icon" style={{ background: '#fff7ed', color: ORG_COLOR }}>Ar</div>
        <div className="barraca-info">
          <div className="barraca-name">{barraca.nome}</div>
          <div className="barraca-owner">{owner ? owner.nome : 'Responsavel nao vinculado'}</div>
        </div>
        <span className={`badge ${metrics.esgotados ? 'badge-warn' : 'badge-ok'}`}>{metrics.esgotados ? 'Atencao' : 'Ativa'}</span>
      </div>
      <div className="barraca-stats">
        <div className="bstat"><p className="bstat-label">Vendas</p><div className="bstat-val">{metrics.relatedOrders.length}</div></div>
        <div className="bstat"><p className="bstat-label">Receita</p><div className="bstat-val">{formatCurrency(metrics.receita)}</div></div>
        <div className="bstat"><p className="bstat-label">Lucro org.</p><div className="bstat-val">{formatCurrency(metrics.lucro)}</div></div>
        <div className="bstat"><p className="bstat-label">Repasse</p><div className="bstat-val">{formatCurrency(metrics.repasse)}</div></div>
        <div className="bstat"><p className="bstat-label">Itens vendidos</p><div className="bstat-val">{metrics.itensVendidos}</div></div>
        <div className="bstat"><p className="bstat-label">Estoque critico</p><div className="bstat-val">{metrics.estoqueBaixo + metrics.esgotados}</div></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <button
            type="button"
            className="action-menu-trigger"
            onClick={() => onToggleMenu(barraca.id)}
            aria-expanded={menuOpenId === barraca.id}
            aria-haspopup="true"
            style={{ border: 'none', background: 'transparent', padding: 0 }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>⋮</span>
          </button>
          {menuOpenId === barraca.id && (
            <div className="action-menu-dropdown" style={{ minWidth: 180 }}>
              <button
                type="button"
                className="action-menu-item"
                onClick={() => onStartAssign(barraca)}
              >
                Atribuir responsável
              </button>
              <button
                type="button"
                className="action-menu-item danger"
                onClick={() => onDeleteBarraca(barraca.id)}
                disabled={loading}
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
      {isAssigning && (
        <BarracaAssignForm
          barraca={barraca}
          barraqueiros={barraqueiros}
          selectedResponsavel={selectedResponsavel}
          loading={loading}
          onChangeResponsavel={onChangeResponsavel}
          onSave={onSaveResponsavel}
          onCancel={onCancelAssign}
        />
      )}
    </div>
  );
}
