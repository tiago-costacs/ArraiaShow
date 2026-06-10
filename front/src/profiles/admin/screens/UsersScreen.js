import React, { useEffect, useState } from 'react';
import { get, put, del } from '../../../utils/api.js';
import StatCard from '../components/StatCard.js';
import UserList from '../components/UserList.js';
import { ROLE_META, ROLES } from '../constants.js';
import { asArray } from '../utils.js';

export default function UsersScreen({ token, user: adminUser, eventos, selectedEventoId }) {
  const [users, setUsers] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [editando, setEditando] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedEvent = eventos?.find((ev) => Number(ev.id) === Number(selectedEventoId));

  const loadUsers = async () => {
    try {
      setUsers(asArray(await get('/usuarios', token)));
    } catch (err) {
      setStatus(err.message);
    }
  };

  useEffect(() => { loadUsers(); }, [token]);

  const saveRole = async (userId, novoTipo) => {
    setLoading(true);
    try {
      await put(`/usuarios/${userId}/tipo`, token, { tipo: novoTipo });
      setUsers((prev) => prev.map((userItem) => userItem.id === userId ? { ...userItem, tipo: novoTipo } : userItem));
      setEditando(null);
      setStatus(`Permissao atualizada para ${ROLE_META[novoTipo]?.label}.`);
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveEvent = async (userId, eventoId) => {
    setLoading(true);
    const payload = eventoId ? { evento_id: eventoId } : { evento_id: null };
    try {
      await put(`/usuarios/${userId}/evento`, token, payload);
      setUsers((prev) => prev.map((userItem) => userItem.id === userId ? { ...userItem, evento_id: eventoId || null } : userItem));
      setEditando(null);
      setStatus('Evento do usuario atualizado com sucesso.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este usuário? Ação irreversível.');
    if (!confirmed) return;

    setLoading(true);
    try {
      await del(`/usuarios/${userId}`, token);
      setUsers((prev) => prev.filter((userItem) => userItem.id !== userId));
      setStatus('Usuário excluído com sucesso.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eventFilteredUsers = selectedEventoId
    ? users.filter((userItem) => Number(userItem.evento_id) === Number(selectedEventoId))
    : users;

  const counts = ROLES.reduce((acc, role) => {
    acc[role] = eventFilteredUsers.filter((userItem) => userItem.tipo === role).length;
    return acc;
  }, {});

  return (
    <div className="screen-body">
      <div className="stats-grid">
        {ROLES.map((role) => {
          const meta = ROLE_META[role];
          return <StatCard key={role} label={meta.label} value={counts[role] || 0} sub="usuarios" tone={meta.color} />;
        })}
      </div>

      {selectedEvent && (
        <div className="card" style={{ marginTop: 12, padding: '12px 16px', background: '#f3f4f6' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937' }}>Evento filtrado</div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{selectedEvent.nome}</div>
        </div>
      )}

      <UserList
        users={eventFilteredUsers}
        busca={busca}
        filtro={filtro}
        adminUser={adminUser}
        editando={editando}
        loading={loading}
        eventos={eventos}
        onBuscaChange={setBusca}
        onFiltroChange={setFiltro}
        onEditUser={setEditando}
        onDeleteUser={deleteUser}
        onSaveRole={saveRole}
        onSaveEvent={saveEvent}
      />

      {status && <div className="inline-alert" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>{status}</div>}
    </div>
  );
}
