import React from 'react';
import { ROLE_META, ROLES } from '../constants.js';

export default function UserRow({
  user,
  adminUser,
  isEditing,
  editando,
  onEdit,
  onDelete,
  onSaveRole,
  onSaveEvent,
  loading,
  eventos,
}) {
  const meta = ROLE_META[user.tipo] || ROLE_META.participante;
  const isMe = user.id === adminUser?.id;

  return (
    <div className="user-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div className="avatar role-avatar" style={{ background: `color-mix(in srgb, ${meta.color} 14%, white)`, color: meta.color }}>
          {meta.short}
        </div>
        <div className="user-info">
          <div className="user-name">{user.nome || 'Sem nome'} {isMe && <span style={{ color: 'var(--muted)', fontSize: 11 }}>(voce)</span>}</div>
          <div className="user-meta">{user.email}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge ${meta.badge}`}>{meta.label}</span>
          {!isMe && (
            <>
              <button type="button" className="chip permission-chip" onClick={() => onEdit(isEditing ? null : { id: user.id, tipo: user.tipo, evento_id: user.evento_id || '' })}>
                {isEditing ? 'Fechar' : 'Alterar permissao'}
              </button>
              <button
                type="button"
                className="chip"
                onClick={() => onDelete(user.id)}
                style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="inline-editor">
          <div className="inline-editor-title">Edite as configuracoes de {user.nome || user.email}</div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Evento</label>
            <select
              value={editando.evento_id || ''}
              onChange={(e) => onEdit((prev) => ({ ...prev, evento_id: e.target.value }))}
            >
              <option value="">Sem evento</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nome}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onSaveEvent(user.id, editando.evento_id)}
            disabled={loading || editando.evento_id === user.evento_id}
            style={{ marginBottom: 12 }}
          >
            {loading ? 'Salvando evento...' : 'Salvar evento'}
          </button>
          <div className="inline-editor-title">Escolha a nova permissao de {user.nome || user.email}</div>
          {ROLES.map((role) => {
            const roleMeta = ROLE_META[role];
            const isCurrent = user.tipo === role;
            return (
              <button
                key={role}
                type="button"
                disabled={loading || isCurrent}
                onClick={() => onSaveRole(user.id, role)}
                className="role-option"
                style={{
                  borderColor: isCurrent ? roleMeta.color : 'var(--line)',
                  color: isCurrent ? roleMeta.color : 'var(--text)',
                  background: isCurrent ? `color-mix(in srgb, ${roleMeta.color} 10%, white)` : '#fff',
                }}
              >
                <span>{roleMeta.label}</span>
                {isCurrent && <small>Atual</small>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
