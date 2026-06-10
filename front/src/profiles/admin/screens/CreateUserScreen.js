import React, { useMemo, useState, useEffect } from 'react';
import { post, get } from '../../../utils/api.js';
import { ADM_COLOR, ROLE_META } from '../constants.js';

export default function CreateUserScreen({ token }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('barraqueiro');
  const [eventoId, setEventoId] = useState('');
  const [eventos, setEventos] = useState([]);
  const [status, setStatus] = useState({ msg: '', ok: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get('/eventos', token).then(setEventos).catch(console.error);
  }, [token]);

  const selectedMeta = ROLE_META[tipo] || ROLE_META.participante;
  const roleOptions = useMemo(() => ['barraqueiro', 'organizador', 'admin', 'participante'], []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !senha) {
      return setStatus({ msg: 'Preencha todos os campos.', ok: false });
    }

    setLoading(true);
    try {
      await post('/auth/registrar', token, { nome, email, senha, tipo, evento_id: eventoId || null });
      setStatus({ msg: `${selectedMeta.label} criado com sucesso!`, ok: true });
      setNome('');
      setEmail('');
      setSenha('');
    } catch (err) {
      setStatus({ msg: err.message, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Novo acesso</p>
          <h2>Criar usuario</h2>
        </div>
        <span className="badge badge-purple">{selectedMeta.label}</span>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Perfil a ser criado</label>
            <div className="role-grid">
              {roleOptions.map((role) => {
                const meta = ROLE_META[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTipo(role)}
                    className="role-card"
                    style={{
                      borderColor: tipo === role ? meta.color : 'var(--line)',
                      background: tipo === role ? `color-mix(in srgb, ${meta.color} 10%, white)` : '#fff',
                      color: tipo === role ? meta.color : 'var(--muted)',
                    }}
                  >
                    <span>{meta.short}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label htmlFor="c-nome">Nome completo</label>
            <input id="c-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria da Silva" autoComplete="off" />
          </div>
          <div className="field">
            <label>Vincular a Evento (Opcional)</label>
            <select value={eventoId} onChange={e => setEventoId(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line-strong)' }}>
              <option value="">Nenhum / Global</option>
              {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.nome}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-email">E-mail</label>
            <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@email.com" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="c-senha">Senha inicial</label>
            <input id="c-senha" type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha temporaria" autoComplete="off" />
          </div>

          <button className="btn" type="submit" disabled={loading} style={{ background: ADM_COLOR }}>
            {loading ? 'Criando...' : `Criar ${selectedMeta.label}`}
          </button>
        </form>

        {status.msg && (
          <div className="inline-alert" style={{
            marginTop: 12,
            background: status.ok ? '#f0fdf4' : '#fff7ed',
            borderColor: status.ok ? '#bbf7d0' : '#fed7aa',
            color: status.ok ? '#166534' : '#9a3412',
          }}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}
