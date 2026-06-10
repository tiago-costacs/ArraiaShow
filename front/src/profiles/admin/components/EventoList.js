import React from 'react';
import EventoCard from './EventoCard.js';

export default function EventoList({
  eventos,
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
  return (
    <>
      {eventos.length === 0 ? (
        <div className="card">
          <div className="empty-state">Nenhum evento cadastrado.</div>
        </div>
      ) : (
        eventos.map((evento) => (
          <EventoCard
            key={evento.id}
            evento={evento}
            organizadores={organizadores}
            editingId={editingId}
            draft={draft}
            menuOpenId={menuOpenId}
            loading={loading}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onToggleStatus={onToggleStatus}
            onDeleteEvent={onDeleteEvent}
            onToggleMenu={onToggleMenu}
          />
        ))
      )}
    </>
  );
}
