import React, { useMemo } from 'react';
import BarracaCard from './BarracaCard.js';
import { barracaMetrics, formatCurrency } from '../utils.js';

export default function BarracaList({
  barracas,
  users,
  barraqueiros,
  orders,
  products,
  assignBarracaId,
  selectedResponsavel,
  menuOpenId,
  loading,
  onStartAssign,
  onCancelAssign,
  onSaveResponsavel,
  onDeleteBarraca,
  onToggleMenu,
  onChangeResponsavel,
}) {
  const usersById = useMemo(() => new Map(users.map((user) => [Number(user.id), user])), [users]);

  return (
    <>
      {barracas.length === 0 ? (
        <div className="card"><div className="empty-state">Nenhuma barraca cadastrada no momento.</div></div>
      ) : (
        barracas.map((barraca) => {
          const owner = usersById.get(Number(barraca.responsavel_id));
          const metrics = barracaMetrics(barraca, orders, products);
          return (
            <BarracaCard
              key={barraca.id}
              barraca={barraca}
              owner={owner}
              metrics={metrics}
              barraqueiros={barraqueiros}
              assignBarracaId={assignBarracaId}
              selectedResponsavel={selectedResponsavel}
              menuOpenId={menuOpenId}
              loading={loading}
              onStartAssign={onStartAssign}
              onCancelAssign={onCancelAssign}
              onSaveResponsavel={onSaveResponsavel}
              onDeleteBarraca={onDeleteBarraca}
              onToggleMenu={onToggleMenu}
              onChangeResponsavel={onChangeResponsavel}
            />
          );
        })
      )}
    </>
  );
}
