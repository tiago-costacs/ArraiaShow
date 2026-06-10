import React from 'react';
import { ADM_COLOR } from '../constants.js';

export default function EventoCard({
  evento,
  organizadores,
  editingId,
  draft,
  menuOpenId,
  loading,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleStatus,
  onDeleteEvent,
  onToggleMenu,
}) {
  const assignedOrganizer = organizadores.find((org) => Number(org.id) === Number(evento.organizador_id));
  const isEditing = editingId === evento.id;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{evento.nome}</div>
          <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>
            {evento.data_evento} • {evento.horario}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: evento.ativo ? '#d1fae5' : '#fee2e2', color: evento.ativo ? '#166534' : '#991b1b' }}>
              {evento.ativo ? 'Ativo' : 'Inativo'}
            </span>
            <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>
              {assignedOrganizer ? assignedOrganizer.nome : 'Sem organizador'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onSaveEdit(evento.id)}
                disabled={loading}
                style={{ minHeight: 34, padding: '8px 12px', fontSize: 13, borderRadius: 10, background: ADM_COLOR, color: '#fff', border: 'none' }}
              >
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
                disabled={loading}
                style={{ minHeight: 34, padding: '8px 12px', fontSize: 13, borderRadius: 10, background: '#9ca3af', color: '#fff', border: 'none' }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                className="action-menu-trigger"
                onClick={() => onToggleMenu(evento.id)}
                aria-expanded={menuOpenId === evento.id}
                aria-haspopup="true"
                style={{ border: 'none', background: 'transparent', padding: 0 }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>⋮</span>
              </button>
              {menuOpenId === evento.id && (
                <div className="action-menu-dropdown" style={{ minWidth: 180 }}>
                  <button
                    type="button"
                    className="action-menu-item"
                    onClick={() => { onStartEdit(evento); onToggleMenu(null); }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="action-menu-item toggle"
                    onClick={() => { onToggleStatus(evento.id, evento.ativo); onToggleMenu(null); }}
                  >
                    {evento.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    type="button"
                    className="action-menu-item danger"
                    onClick={() => { onDeleteEvent(evento.id); onToggleMenu(null); }}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
          <div className="field">
            <label>Nome do evento</label>
            <input
              value={draft.nome}
              onChange={(e) => onStartEdit({ ...draft, nome: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Data</label>
              <input
                type="date"
                value={draft.data_evento}
                onChange={(e) => onStartEdit({ ...draft, data_evento: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Horário</label>
              <input
                value={draft.horario}
                onChange={(e) => onStartEdit({ ...draft, horario: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="field">
            <label>Endereço</label>
            <input
              value={draft.endereco}
              onChange={(e) => onStartEdit({ ...draft, endereco: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label>Organizador responsável</label>
            <select
              value={draft.organizador_id}
              onChange={(e) => onStartEdit({ ...draft, organizador_id: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14 }}
            >
              <option value="">Nenhum organizador</option>
              {organizadores.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.nome} ({org.email})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Descrição</label>
            <input
              value={draft.descricao}
              onChange={(e) => onStartEdit({ ...draft, descricao: e.target.value })}
              autoComplete="off"
            />
          </div>
        </div>
      ) : (
        evento.descricao && (
          <p style={{ marginTop: 12, color: '#4b5563', fontSize: 13 }}>{evento.descricao}</p>
        )
      )}
    </div>
  );
}
