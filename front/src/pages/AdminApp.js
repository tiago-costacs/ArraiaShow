import React, { useEffect, useState } from 'react';
import Phone from '../components/Phone.js';
import NavBar from '../components/NavBar.js';
import { get, post, put } from '../utils/api.js';

// ─── Tokens do Admin ──────────────────────────────────────────────────────────
const ADM_COLOR = '#7c3aed';
const ADM_MID   = '#a78bfa';

// ─── Utilidades ───────────────────────────────────────────────────────────────
const ROLES = ['participante', 'barraqueiro', 'organizador', 'admin'];

const ROLE_META = {
  participante:  { label: 'Participante',  icon: '🎟️', color: '#e97125', badge: 'badge-warn'   },
  barraqueiro:   { label: 'Barraqueiro',   icon: '🏪', color: '#1D9E75', badge: 'badge-ok'     },
  organizador:   { label: 'Organizador',   icon: '🎪', color: '#D85A30', badge: 'badge-info'   },
  admin:         { label: 'Administrador', icon: '🛡️', color: '#7c3aed', badge: 'badge-purple' },
};

// ─── Tela: Usuários ───────────────────────────────────────────────────────────
function A_Usuarios({ token, user: adminUser, eventos }) {
  const [users, setUsers]       = useState([]);
  const [busca, setBusca]       = useState('');
  const [filtro, setFiltro]     = useState('todos');
  const [editando, setEditando] = useState(null);
  const [status, setStatus]     = useState('');
  const [loading, setLoading]   = useState(false);

  const loadUsers = async () => {
    try {
      const data = await get('/usuarios', token);
      setUsers(data);
    } catch (err) {
      setStatus(err.message);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const saveRole = async (userId, novoTipo) => {
    setLoading(true);
    try {
      await put(`/usuarios/${userId}/tipo`, token, { tipo: novoTipo });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, tipo: novoTipo } : u));
      setEditando(null);
      setStatus(`Perfil atualizado para ${ROLE_META[novoTipo]?.label}.`);
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchBusca = !busca ||
      u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      u.email?.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === 'todos' || u.tipo === filtro;
    return matchBusca && matchFiltro;
  });

  const counts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter((u) => u.tipo === r).length;
    return acc;
  }, {});

  return (
    <div className="screen-body">
      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {ROLES.map((role) => {
          const m = ROLE_META[role];
          return (
            <div key={role} className="stat-card"
              style={{ cursor: 'pointer', borderTop: `3px solid ${m.color}` }}
              onClick={() => setFiltro(filtro === role ? 'todos' : role)}>
              <p className="stat-label">{m.label}</p>
              <div className="stat-value" style={{ color: m.color }}>{counts[role] ?? 0}</div>
            </div>
          );
        })}
      </div>

      {/* Busca + filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <input
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '100%', minHeight: 44, padding: '10px 13px', border: '1px solid var(--line-strong)', borderRadius: 12, outline: 'none', marginBottom: 10 }}
        />
        <div className="chips" style={{ marginBottom: 0 }}>
          {['todos', ...ROLES].map((r) => (
            <button key={r} type="button"
              className={`chip ${filtro === r ? 'active' : ''}`}
              onClick={() => setFiltro(r)}
              style={{ fontSize: 11 }}>
              {r === 'todos' ? 'Todos' : ROLE_META[r].label}
              {r !== 'todos' && ` (${counts[r] ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="card">
        <p className="card-title">{filtered.length} usuário(s)</p>
        {filtered.length === 0 ? (
          <div className="empty-state">Nenhum usuário encontrado.</div>
        ) : filtered.map((u) => {
          const meta = ROLE_META[u.tipo] || ROLE_META.participante;
          const isMe = u.id === adminUser?.id;
          const isEditing = editando?.id === u.id;
          const evNome = eventos.find(e => e.id === u.evento_id)?.nome;

          return (
            <div key={u.id} className="user-row"
              style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0, padding: '14px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div className="avatar"
                  style={{ background: `color-mix(in srgb, ${meta.color} 14%, white)`, color: meta.color, fontSize: 18 }}>
                  {meta.icon}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {u.nome || '—'}
                    {isMe && <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}> (você)</span>}
                  </div>
                  <div className="user-meta">{u.email}</div>
                  {evNome && <div style={{ fontSize: 10, color: meta.color, fontWeight: 700 }}>📍 {evNome}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge ${meta.badge}`}>{meta.label}</span>
                  {!isMe && (
                    <button type="button"
                      onClick={() => setEditando(isEditing ? null : { id: u.id, tipo: u.tipo })}
                      style={{ fontSize: 14, background: 'none', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '4px 10px', color: 'var(--muted)', fontWeight: 700 }}>
                      {isEditing ? '✕' : '✏️'}
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--surface-soft)', borderRadius: 12, border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    Alterar perfil de {u.nome?.split(' ')[0]}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {ROLES.map((role) => {
                      const rm = ROLE_META[role];
                      const isCurrent = u.tipo === role;
                      return (
                        <button key={role} type="button"
                          disabled={loading || isCurrent}
                          onClick={() => saveRole(u.id, role)}
                          style={{
                            minHeight: 44, borderRadius: 10,
                            border: `2px solid ${isCurrent ? rm.color : 'var(--line)'}`,
                            background: isCurrent ? `color-mix(in srgb, ${rm.color} 10%, white)` : '#fff',
                            color: isCurrent ? rm.color : 'var(--text)',
                            fontWeight: 800, fontSize: 13,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                            cursor: isCurrent ? 'default' : 'pointer',
                            opacity: loading ? .6 : 1,
                          }}>
                          <span>{rm.icon}</span> {rm.label}
                          {isCurrent && <span style={{ fontSize: 10 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {status && (
        <div className="inline-alert" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          ✓ {status}
        </div>
      )}
    </div>
  );
}

// ─── Tela: Criar usuário ──────────────────────────────────────────────────────
function A_CriarUsuario({ token, eventos }) {
  const [nome, setNome]       = useState('');
  const [email, setEmail]     = useState('');
  const [senha, setSenha]     = useState('');
  const [tipo, setTipo]       = useState('barraqueiro');
  const [eventoId, setEventoId] = useState('');
  const [status, setStatus]   = useState({ msg: '', ok: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return setStatus({ msg: 'Preencha todos os campos.', ok: false });
    setLoading(true);
    try {
      await post('/auth/registrar', token, { nome, email, senha, tipo, evento_id: eventoId || null });
      setStatus({ msg: `${ROLE_META[tipo].label} criado com sucesso!`, ok: true });
      setNome(''); setEmail(''); setSenha('');
    } catch (err) {
      setStatus({ msg: err.message, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Novo usuário com perfil específico</p>

        <div style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 12, background: 'color-mix(in srgb, #7c3aed 8%, white)', border: '1px solid color-mix(in srgb, #7c3aed 18%, transparent)', fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>
          Use este formulário para criar contas de <strong>organizadores</strong> e <strong>barraqueiros</strong>.
          Participantes se cadastram pela tela principal.
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Perfil</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {['barraqueiro', 'organizador', 'admin', 'participante'].map((role) => {
                const m = ROLE_META[role];
                return (
                  <button key={role} type="button" onClick={() => setTipo(role)}
                    style={{
                      minHeight: 52, borderRadius: 12,
                      border: `2px solid ${tipo === role ? m.color : 'var(--line)'}`,
                      background: tipo === role ? `color-mix(in srgb, ${m.color} 10%, white)` : '#fff',
                      color: tipo === role ? m.color : 'var(--muted)',
                      fontWeight: 800, fontSize: 13,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label>Vincular ao Evento</label>
            <select value={eventoId} onChange={e => setEventoId(e.target.value)} style={{ width: '100%', minHeight: 44, padding: '10px 13px', border: '1px solid var(--line-strong)', borderRadius: 12 }}>
              <option value="">Nenhum (Acesso Global)</option>
              {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.nome}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="c-nome">Nome completo</label>
            <input id="c-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria da Silva" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="c-email">E-mail</label>
            <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@email.com" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="c-senha">Senha inicial</label>
            <input id="c-senha" type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha temporária" autoComplete="off" />
          </div>

          <button className="btn" type="submit" disabled={loading} style={{ background: ADM_COLOR }}>
            {loading ? 'Criando...' : `Criar ${ROLE_META[tipo]?.label}`}
          </button>
        </form>

        {status.msg && (
          <div className="inline-alert" style={{
            marginTop: 12,
            background: status.ok ? '#f0fdf4' : '#fff7ed',
            borderColor: status.ok ? '#bbf7d0' : '#fed7aa',
            color: status.ok ? '#166534' : '#9a3412',
          }}>
            {status.ok ? '✓ ' : '⚠ '}{status.msg}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tela: Gerenciar Estrutura (Eventos e Barracas) ───────────────────────────
function A_GerenciarEventos({ token, eventos, onUpdate }) {
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nomeBarraca, setNomeBarraca] = useState('');
  const [eventoIdBarraca, setEventoIdBarraca] = useState('');
  const [respIdBarraca, setRespIdBarraca] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get('/usuarios', token).then(setUsuarios).catch(console.error);
  }, [token]);

  useEffect(() => {
    if (eventos.length > 0 && !eventoIdBarraca) {
      setEventoIdBarraca(eventos[0].id);
    }
  }, [eventos, eventoIdBarraca]);

  const handleCriarEvento = async (e) => {
    e.preventDefault();
    if (!nomeEvento || !dataEvento || !endereco || !horario) {
      alert('Por favor, preencha Nome, Data, Horário e Endereço.');
      return;
    }
    setLoading(true);
    try {
      await post('/eventos', token, { 
        nome: nomeEvento, 
        data_evento: dataEvento,
        endereco,
        horario,
        descricao
      });
      setNomeEvento('');
      setDataEvento('');
      setEndereco('');
      setHorario('');
      setDescricao('');
      onUpdate();
      alert('✅ Sucesso: Evento criado e disponível para configuração.');
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleCriarBarraca = async (e) => {
    e.preventDefault();
    if (!nomeBarraca || !eventoIdBarraca) return;
    setLoading(true);
    try {
      await post('/barracas', token, { nome: nomeBarraca, evento_id: eventoIdBarraca, responsavel_id: respIdBarraca || null });
      setNomeBarraca('');
      alert('Barraca criada com sucesso!');
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Criar Arraiá (Evento)</p>
        <form onSubmit={handleCriarEvento}>
          <div className="field">
            <label>Nome do Evento</label>
            <input value={nomeEvento} onChange={e => setNomeEvento(e.target.value)} placeholder="Ex: Grande Arraiá 2026" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Data</label>
              <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} />
            </div>
            <div className="field">
              <label>Horário</label>
              <input type="time" value={horario} onChange={e => setHorario(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Endereço</label>
            <input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua, Número, Bairro" />
          </div>
          <div className="field">
            <label>Descrição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes do evento..." style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line-strong)', minHeight: 80 }} />
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ background: ADM_COLOR }}>Criar Arraiá</button>
        </form>
      </div>

      {/* Lista de Eventos com os detalhes solicitados */}
      <div className="card" style={{ marginTop: 16 }}>
        <p className="card-title">Arraiás Cadastrados (Configuração)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {eventos.length === 0 ? <p style={{fontSize:13, color:'var(--muted)'}}>Nenhum evento criado ainda.</p> : eventos.map(ev => (
            <div key={ev.id} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong style={{ color: ADM_COLOR }}>#{ev.id} - {ev.nome}</strong>
                <span style={{ fontSize: 12, fontWeight: 700 }}>📅 {new Date(ev.data_evento).toLocaleDateString('pt-BR')}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
                📍 {ev.endereco} | ⏰ {ev.horario?.substring(0, 5)}
              </div>
              {ev.descricao && <div style={{ fontSize: 11, fontStyle: 'italic', borderTop: '1px solid var(--line)', paddingTop: 4 }}>{ev.descricao}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <p className="card-title">Criar Barraquinha</p>
        <form onSubmit={handleCriarBarraca}>
          <div className="field">
            <label>Nome da Barraca</label>
            <input value={nomeBarraca} onChange={e => setNomeBarraca(e.target.value)} placeholder="Ex: Barraca da Pipoca" />
          </div>
          <div className="field">
            <label>Vincular ao Evento</label>
            <select value={eventoIdBarraca} onChange={e => setEventoIdBarraca(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line-strong)' }}>
              {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.nome}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Responsável (Opcional)</label>
            <select value={respIdBarraca} onChange={e => setRespIdBarraca(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line-strong)' }}>
              <option value="">Nenhum</option>
              {usuarios.filter(u => u.tipo === 'barraqueiro').map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ background: ADM_COLOR }}>Criar Barraca</button>
        </form>
      </div>
    </div>
  );
}

// ─── App principal do Admin ───────────────────────────────────────────────────
export default function AdminApp({ onBack, subtitle, user, token }) {
  const [tab, setTab] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [selectedEvId, setSelectedEvId] = useState(null);

  const loadEventos = async () => {
    try {
      const data = await get('/eventos', token);
      setEventos(data);
      if (data.length > 0 && !selectedEvId) setSelectedEvId(data[0].id);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadEventos(); }, []);

  const activeEvento = eventos.find(e => Number(e.id) === Number(selectedEvId));

  const navItems = [
    { icon: '🎪', label: 'Eventos' },
    { icon: '👥', label: 'Usuários' },
    { icon: '➕', label: 'Novo Perfil' },
  ];

  const screens = [
    <A_GerenciarEventos key="eventos" token={token} eventos={eventos} onUpdate={loadEventos} />,
    <A_Usuarios key="usuarios" token={token} user={user} eventos={eventos} />,
    <A_CriarUsuario key="criar" token={token} eventos={eventos} />,
  ];

  const titles = ['Gerenciar Eventos', 'Controle de Usuários', 'Cadastrar Perfil'];

  const topContent = eventos.length > 0 ? (
    <div
      style={{
        background: ADM_COLOR,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div style={{ background: '#fff', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
        🛡️
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.75)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
          Evento selecionado
        </div>
        <select
          value={selectedEvId || ''}
          onChange={e => setSelectedEvId(e.target.value)}
          style={{
            width: '100%',
            fontSize: 14,
            fontWeight: 800,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: '#fff',
            padding: 0,
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          {eventos.map(ev => <option key={ev.id} value={ev.id} style={{ color: '#333' }}>{ev.nome}</option>)}
        </select>
      </div>
      <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 10 }}>▼</span>
    </div>
  ) : null;

  return (
    <Phone color={ADM_COLOR} textColor="#fff" title={titles[tab]} subtitle={activeEvento ? `Arraiá: ${activeEvento.nome}` : subtitle} onBack={onBack} topContent={topContent}>
      {screens[tab]}
      <NavBar items={navItems} active={tab} onSelect={setTab} activeColor={ADM_MID} />
    </Phone>
  );
}