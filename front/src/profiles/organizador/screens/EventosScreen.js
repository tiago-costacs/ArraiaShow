import React, { useState } from 'react';
import { del, put } from '../../../utils/api.js';
import EventoList from '../components/EventoList.js';

export default function EventosScreen({ token, eventos, user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draftEvent, setDraftEvent] = useState({});
  const [menuOpenId, setMenuOpenId] = useState(null);

  const toggleMenu = (eventoId) => {
    setMenuOpenId((prev) => (prev === eventoId ? null : eventoId));
  };

  const handleToggleStatus = async (eventoId, ativo) => {
    setLoading(true);
    try {
      await put(`/eventos/${eventoId}`, token, { ativo: !ativo });
      setStatus('Status do evento atualizado.');
      onSuccess?.();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  const handleClaimEvent = async (eventoId) => {
    if (!window.confirm('Deseja assumir este evento como organizador?')) return;
    setLoading(true);
    try {
      await put(`/eventos/${eventoId}`, token, { organizador_id: user.id });
      setStatus('Evento assumido com sucesso.');
      onSuccess?.();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  const handleDeleteEvent = async (eventoId) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este evento? Esta acao nao pode ser desfeita.');
    if (!confirmed) return;

    setLoading(true);
    try {
      await del(`/eventos/${eventoId}`, token);
      setStatus('Evento excluido com sucesso.');
      onSuccess?.();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  const startEdit = (evento) => {
    setEditingId(evento.id);
    setDraftEvent({
      nome: evento.nome || '',
      data_evento: evento.data_evento || '',
      endereco: evento.endereco || '',
      horario: evento.horario || '',
      descricao: evento.descricao || '',
      ativo: evento.ativo,
    });
    setStatus('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftEvent({});
    setStatus('');
  };

  const saveEdit = async (eventoId) => {
    setLoading(true);
    try {
      await put(`/eventos/${eventoId}`, token, {
        nome: draftEvent.nome,
        data_evento: draftEvent.data_evento,
        endereco: draftEvent.endereco,
        horario: draftEvent.horario,
        descricao: draftEvent.descricao,
        ativo: draftEvent.ativo,
      });
      setStatus('Evento atualizado com sucesso.');
      setEditingId(null);
      setDraftEvent({});
      onSuccess?.();
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
        <span className="badge badge-info">Organizador</span>
      </div>

      <EventoList
        eventos={eventos}
        user={user}
        editingId={editingId}
        draftEvent={draftEvent}
        menuOpenId={menuOpenId}
        loading={loading}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        onToggleStatus={handleToggleStatus}
        onDeleteEvent={handleDeleteEvent}
        onClaimEvent={handleClaimEvent}
        onToggleMenu={toggleMenu}
      />

      {status && <div className="inline-alert" style={{ marginTop: 12 }}>{status}</div>}
    </div>
  );
}
