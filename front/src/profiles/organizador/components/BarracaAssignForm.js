import React from 'react';
import { ORG_COLOR } from '../constants.js';
import { formatCurrency } from '../utils.js';

export default function BarracaAssignForm({
  barraca,
  barraqueiros,
  selectedResponsavel,
  loading,
  onChangeResponsavel,
  onSave,
  onCancel,
}) {
  return (
    <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
      <div className="field">
        <label>Responsável</label>
        <select value={selectedResponsavel} onChange={(e) => onChangeResponsavel(e.target.value)}>
          <option value="">Selecionar barraqueiro...</option>
          {barraqueiros.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>{usuario.nome} ({usuario.email})</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
          style={{ minHeight: 34, padding: '8px 12px', fontSize: 13, borderRadius: 10, background: '#9ca3af', color: '#fff', border: 'none' }}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => onSave(barraca.id)}
          disabled={loading}
          style={{ minHeight: 34, padding: '8px 12px', fontSize: 13, borderRadius: 10, background: ORG_COLOR, color: '#fff', border: 'none' }}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
