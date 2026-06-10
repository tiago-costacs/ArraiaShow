import React, { useState, useEffect } from 'react';
import { get, post } from '../../../utils/api.js';
import TimePicker from '../components/TimePicker.js';
import { ADM_COLOR } from '../constants.js';

export default function CriarEventoScreen({ token }) {
  const [nome, setNome] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [organizadorId, setOrganizadorId] = useState('');
  const [organizadores, setOrganizadores] = useState([]);
  const [status, setStatus] = useState({ msg: '', ok: false });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const usrs = await get('/usuarios', token);
      setOrganizadores(Array.isArray(usrs) ? usrs.filter((u) => u.tipo === 'organizador') : []);
    } catch (err) {
      console.error('Erro ao carregar organizadores:', err);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !dataEvento || !endereco.trim() || !horario.trim()) {
      return setStatus({ msg: 'Preencha nome, data, endereço e horário.', ok: false });
    }

    setLoading(true);
    try {
      await post('/eventos', token, {
        nome,
        data_evento: dataEvento,
        endereco,
        horario,
        descricao,
        ativo,
        organizador_id: organizadorId || null,
      });
      setStatus({ msg: `Evento "${nome}" criado com sucesso!`, ok: true });
      setNome('');
      setDataEvento('');
      setEndereco('');
      setHorario('');
      setDescricao('');
      setAtivo(true);
      setOrganizadorId('');
      loadData();
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
          <p className="card-title">Novo evento</p>
          <h2>Criar evento</h2>
        </div>
        <span className="badge badge-purple">Admin</span>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="ev-nome">Nome do evento</label>
            <input
              id="ev-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Festa Junina 2026"
              autoComplete="off"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="ev-data">Data</label>
              <input
                id="ev-data"
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Horário</label>
              <TimePicker
                value={horario}
                onChange={setHorario}
                accentColor={ADM_COLOR}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="ev-endereco">Endereço</label>
            <input
              id="ev-endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Ex: Rua das Flores, 123 – Centro"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="ev-organizador">Organizador Responsável</label>
            <select
              id="ev-organizador"
              value={organizadorId}
              onChange={(e) => setOrganizadorId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14 }}
            >
              <option value="">Nenhum organizador</option>
              {organizadores.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.nome} ({org.email})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="ev-descricao">
              Descrição{' '}
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}>(opcional)</span>
            </label>
            <input
              id="ev-descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descrição do evento"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label>Status do evento</label>
            <div className="role-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { value: true, label: 'Ativo', short: '✓' },
                { value: false, label: 'Inativo', short: '✕' },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setAtivo(opt.value)}
                  className="role-card"
                  style={{
                    borderColor: ativo === opt.value ? ADM_COLOR : 'var(--line)',
                    background:
                      ativo === opt.value
                        ? `color-mix(in srgb, ${ADM_COLOR} 10%, white)`
                        : '#fff',
                    color: ativo === opt.value ? ADM_COLOR : 'var(--muted)',
                  }}
                >
                  <span>{opt.short}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ background: ADM_COLOR }}
          >
            {loading ? 'Criando evento...' : 'Criar evento'}
          </button>
        </form>

        {status.msg && (
          <div
            className="inline-alert"
            style={{
              marginTop: 12,
              background: status.ok ? '#f0fdf4' : '#fff7ed',
              borderColor: status.ok ? '#bbf7d0' : '#fed7aa',
              color: status.ok ? '#166534' : '#9a3412',
            }}
          >
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}
