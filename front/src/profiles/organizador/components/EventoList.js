import React from 'react';
import EventoCard from './EventoCard.js';

export default function EventoList({
  eventos,
  user,
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
  return (
    <>
      {eventos.length === 0 ? (
        <div className="card">
          <div className="empty-state">Nenhum evento disponível para este organizador.</div>
        </div>
      ) : (
        eventos.map((evento) => {
          const isAssigned = Number(evento.organizador_id) === Number(user?.id);
          return (
            <EventoCard
              key={evento.id}
              evento={evento}
              user={user}
              isAssigned={isAssigned}
              editingId={editingId}
              draftEvent={draftEvent}
              menuOpenId={menuOpenId}
              loading={loading}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onToggleStatus={onToggleStatus}
              onDeleteEvent={onDeleteEvent}
              onClaimEvent={onClaimEvent}
              onToggleMenu={onToggleMenu}
            />
          );
        })
      )}
    </>
  );
}
