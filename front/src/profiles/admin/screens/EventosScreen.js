import React, { useEffect, useState } from 'react';
import { get, put, del } from '../../../utils/api.js';
import EventoList from '../components/EventoList.js';
import { ADM_COLOR } from '../constants.js';

export default function EventosScreen({ token }) {
  const [eventos, setEventos] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [menuOpenId, setMenuOpenId] = useState(null);

  const toggleMenu = (eventoId) => {
    setMenuOpenId((prev) => (prev === eventoId ? null : eventoId));
  };

  const closeMenu = () => {
    setMenuOpenId(null);
  };

  const loadData = async () => {
    try {
      const [evs, users] = await Promise.all([
        get('/eventos', token),
        get('/usuarios', token),
      ]);

      setEventos(Array.isArray(evs) ? evs : []);
      setOrganizadores(Array.isArray(users) ? users.filter((u) => u.tipo === 'organizador') : []);
    } catch (err) {
      console.error(err);
      setStatus(err.message || 'Erro ao carregar eventos.');
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const startEdit = (evento) => {
    setEditingId(evento.id);
    setDraft({
      nome: evento.nome || '',
      data_evento: evento.data_evento || '',
      endereco: evento.endereco || '',
      horario: evento.horario || '',
      descricao: evento.descricao || '',
      ativo: evento.ativo,
      organizador_id: evento.organizador_id || '',
    });
    setStatus('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
    setStatus('');
  };

  const saveEdit = async (eventoId) => {
    setLoading(true);
    try {
      await put(`/eventos/${eventoId}`, token, {
        nome: draft.nome,
        data_evento: draft.data_evento,
        endereco: draft.endereco,
        horario: draft.horario,
        descricao: draft.descricao,
        ativo: draft.ativo,
        organizador_id: draft.organizador_id || null,
      });
      setStatus('Evento atualizado com sucesso.');
      setEditingId(null);
      setDraft({});
      loadData();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  const handleToggleStatus = async (eventoId, ativo) => {
    setLoading(true);
    try {
      await put(`/eventos/${eventoId}`, token, { ativo: !ativo });
      setStatus('Status do evento atualizado.');
      loadData();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  const handleDeleteEvent = async (eventoId) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.');
    if (!confirmed) return;

    setLoading(true);
    try {
      await del(`/eventos/${eventoId}`, token);
      setStatus('Evento excluído com sucesso.');
      loadData();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Eventos</p>
          <h2>{eventos.length} evento(s)</h2>
        </div>
        <span className="badge badge-purple">Admin</span>
      </div>

      {status && <div className="inline-alert" style={{ marginBottom: 16 }}>{status}</div>}

      <EventoList
        eventos={eventos}
        organizadores={organizadores}
        editingId={editingId}
        draft={draft}
        menuOpenId={menuOpenId}
        loading={loading}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        onToggleStatus={handleToggleStatus}
        onDeleteEvent={handleDeleteEvent}
        onToggleMenu={toggleMenu}
      />
    </div>
  );
}
