import React from 'react';
import UserRow from './UserRow.js';
import { ROLE_META, ROLES } from '../constants.js';

export default function UserList({
  users,
  busca,
  filtro,
  adminUser,
  editando,
  loading,
  eventos,
  onBuscaChange,
  onFiltroChange,
  onEditUser,
  onDeleteUser,
  onSaveRole,
  onSaveEvent,
}) {
  const filtered = users.filter((userItem) => {
    const search = busca.toLowerCase();
    const matchBusca = !search || userItem.nome?.toLowerCase().includes(search) || userItem.email?.toLowerCase().includes(search);
    const matchFiltro = filtro === 'todos' || userItem.tipo === filtro;
    return matchBusca && matchFiltro;
  });

  return (
    <>
      <div className="card">
        <div className="field" style={{ marginBottom: 0 }}>
          <input placeholder="Buscar por nome ou e-mail..." value={busca} onChange={(e) => onBuscaChange(e.target.value)} />
        </div>
        <div className="chips" style={{ marginTop: 10, marginBottom: 0 }}>
          {['todos', ...ROLES].map((role) => (
            <button key={role} type="button" className={`chip ${filtro === role ? 'active' : ''}`} onClick={() => onFiltroChange(role)}>
              {role === 'todos' ? 'Todos' : ROLE_META[role].label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-title">{filtered.length} usuario(s)</p>
        {filtered.length === 0 ? (
          <div className="empty-state">Nenhum usuario encontrado.</div>
        ) : (
          filtered.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              adminUser={adminUser}
              isEditing={editando?.id === user.id}
              editando={editando}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              onSaveRole={onSaveRole}
              onSaveEvent={onSaveEvent}
              loading={loading}
              eventos={eventos}
            />
          ))
        )}
      </div>
    </>
  );
}
