import React, { useState } from 'react';
import { post } from '../../../utils/api.js';
import { ORG_COLOR } from '../constants.js';

export default function CreateBarracaScreen({ token, eventos, usuarios, onSuccess }) {
  const [nome, setNome] = useState('');
  const [eventoId, setEventoId] = useState('');
  const [respId, setRespId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', ok: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !eventoId) return setStatus({ msg: 'Nome e evento sao obrigatorios.', ok: false });

    setLoading(true);
    try {
      await post('/barracas', token, { nome, evento_id: eventoId, responsavel_id: respId || null });
      setStatus({ msg: 'Barraca criada com sucesso.', ok: true });
      setNome('');
      setEventoId('');
      setRespId('');
      onSuccess?.();
    } catch (err) {
      setStatus({ msg: err.message, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Nova barraca</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome da barraca</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Barraca da Pipoca" />
          </div>
          <div className="field">
            <label>Vincular ao evento</label>
            <select value={eventoId} onChange={(e) => setEventoId(e.target.value)}>
              <option value="">Selecione um evento...</option>
              {eventos.map((evento) => <option key={evento.id} value={evento.id}>{evento.nome}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Responsavel</label>
            <select value={respId} onChange={(e) => setRespId(e.target.value)}>
              <option value="">Atribuir depois</option>
              {usuarios.map((usuario) => <option key={usuario.id} value={usuario.id}>{usuario.nome} ({usuario.email})</option>)}
            </select>
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ background: ORG_COLOR }}>
            {loading ? 'Criando...' : 'Cadastrar barraca'}
          </button>
        </form>
        {status.msg && <div className="inline-alert" style={{ background: status.ok ? '#f0fdf4' : '#fff7ed' }}>{status.msg}</div>}
      </div>
    </div>
  );
}
