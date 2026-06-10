import React from 'react';
import { TAXA_ORGANIZADOR } from '../constants.js';
import { formatDate } from '../utils.js';

export default function ConfigScreen({ event, products }) {
  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Configuracoes do evento</p>
        <div className="row"><span className="row-label">Nome</span><span className="row-value">{event?.nome || 'Nao configurado'}</span></div>
        <div className="row"><span className="row-label">Data</span><span className="row-value">{formatDate(event?.data_evento)}</span></div>
        <div className="row"><span className="row-label">Status</span><span className="row-value">{event?.ativo ? 'Ativo' : 'Inativo'}</span></div>
        <div className="row"><span className="row-label">Taxa operacional</span><span className="row-value">{Math.round(TAXA_ORGANIZADOR * 100)}%</span></div>
      </div>

      <div className="card">
        <p className="card-title">Preferencias operacionais</p>
        {[
          ['Permitir novos cadastros', true],
          ['Mostrar vendas em tempo real', true],
          ['Alertar estoque critico', products.some((product) => Number(product.estoque || 0) <= 5)],
          ['Separar repasse por barraca', true],
        ].map(([label, checked]) => (
          <div key={label} className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-name">{label}</div>
              <div className="toggle-sub">Configuracao visual do painel</div>
            </div>
            <label className="tog">
              <input type="checkbox" defaultChecked={checked} />
              <span className="tog-sl" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
