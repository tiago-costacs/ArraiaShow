import React from 'react';
import { ORG_COLOR } from '../constants.js';

export default function EventoCard({
  evento,
  user,
  isAssigned,
  editingId,
  draftEvent,
  menuOpenId,
  loading,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleStatus,
  onDeleteEvent,
  onClaimEvent,
  onToggleMenu,
}) {
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
              {evento.organizador_id ? (isAssigned ? 'Seu evento' : 'Organizador atribuído') : 'Sem organizador'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
          {!isAssigned && !evento.organizador_id && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onClaimEvent(evento.id)}
              disabled={loading}
              style={{ minHeight: 34, padding: '8px 12px', fontSize: 13, borderRadius: 10, background: '#2563eb', color: '#fff', border: 'none' }}
            >
              Assumir
            </button>
          )}
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onSaveEdit(evento.id)}
                disabled={loading}
                style={{ minHeight: 34, padding: '8px 12px', fontSize: 13, borderRadius: 10, background: ORG_COLOR, color: '#fff', border: 'none' }}
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
              value={draftEvent.nome}
              onChange={(e) => onStartEdit({ ...draftEvent, nome: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Data</label>
              <input
                type="date"
                value={draftEvent.data_evento}
                onChange={(e) => onStartEdit({ ...draftEvent, data_evento: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Horário</label>
              <input
                value={draftEvent.horario}
                onChange={(e) => onStartEdit({ ...draftEvent, horario: e.target.value })}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="field">
            <label>Endereço</label>
            <input
              value={draftEvent.endereco}
              onChange={(e) => onStartEdit({ ...draftEvent, endereco: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label>Descrição</label>
            <input
              value={draftEvent.descricao}
              onChange={(e) => onStartEdit({ ...draftEvent, descricao: e.target.value })}
              autoComplete="off"
            />
          </div>
        </div>
      ) : evento.descricao ? (
        <p style={{ marginTop: 12, color: '#4b5563', fontSize: 13 }}>{evento.descricao}</p>
      ) : null}
    </div>
  );
}
