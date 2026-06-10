import React from 'react';
import Stat from '../components/Stat.js';
import { ORG_COLOR, ROLE_LABELS } from '../constants.js';
import { getInitials } from '../utils.js';

export default function UsuariosScreen({ users }) {
  const counts = users.reduce((acc, user) => {
    acc[user.tipo] = (acc[user.tipo] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <Stat label="Total" value={users.length} sub="usuarios" />
        <Stat label="Participantes" value={counts.participante || 0} sub="compradores" tone="#BA7517" />
        <Stat label="Barraqueiros" value={counts.barraqueiro || 0} sub="operacao" tone="#15956d" />
        <Stat label="Organizadores" value={counts.organizador || 0} sub="gestao" tone="#2563eb" />
      </div>
      <div className="card">
        <p className="card-title">Equipe e participantes</p>
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <div className="avatar" style={{ background: '#fff7ed', color: ORG_COLOR }}>{getInitials(user.nome)}</div>
            <div className="user-info">
              <div className="user-name">{user.nome}</div>
              <div className="user-meta">{user.email}</div>
            </div>
            <span className="badge badge-info">{ROLE_LABELS[user.tipo] || user.tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
