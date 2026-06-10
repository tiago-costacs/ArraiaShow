import React, { useEffect, useState } from 'react';
import { get } from '../../../utils/api.js';
import StatCard from '../components/StatCard.js';
import { ADM_COLOR, ROLE_META, ROLES } from '../constants.js';
import { asArray, formatCurrency } from '../utils.js';

export default function OverviewScreen({ token, selectedEventoId }) {
  const [data, setData] = useState({ users: [], barracas: [], pedidos: [], eventos: [] });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const selectedEvent = data.eventos.find((ev) => Number(ev.id) === Number(selectedEventoId));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setStatus('');
      try {
        const [users, barracas, pedidos, eventos] = await Promise.all([
          get('/usuarios', token),
          get('/barracas', token),
          get('/pedidos', token),
          get('/eventos', token),
        ]);
        setData({
          users: asArray(users),
          barracas: asArray(barracas),
          pedidos: asArray(pedidos),
          eventos: asArray(eventos),
        });
      } catch (err) {
        setStatus(err.message || 'Nao foi possivel carregar a visao geral.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const receita = data.pedidos.reduce((sum, pedido) => sum + Number(pedido.total || 0), 0);
  const pedidosPagos = data.pedidos.filter((pedido) => pedido.status === 'pago').length;
  const barracasSemDono = data.barracas.filter((barraca) => !barraca.responsavel_id);
  const counts = ROLES.reduce((acc, role) => {
    acc[role] = data.users.filter((userItem) => userItem.tipo === role).length;
    return acc;
  }, {});

  const receitaPorEvento = (evento) => data.pedidos.reduce((sum, pedido) => {
    const itensDoEvento = (pedido.itens || []).filter((item) => {
      const barraca = data.barracas.find((b) => Number(b.id) === Number(item.barraca_id));
      return barraca && Number(barraca.evento_id) === Number(evento.id);
    });
    return sum + itensDoEvento.reduce((subSum, item) => subSum + Number(item.subtotal || 0), 0);
  }, 0);

  if (loading) {
    return <div className="screen-body"><div className="card">Carregando visao geral...</div></div>;
  }

  return (
    <div className="screen-body">
      <div className="hero-card admin-hero">
        <div>
          <div className="eyebrow">Central administrativa</div>
          <h2>Visao geral do sistema</h2>
          <p>{selectedEvent ? `${selectedEvent.nome} com operacao, acessos e financeiro no mesmo painel.` : `${data.eventos[0]?.nome || 'Arraia Show'} com operacao, acessos e financeiro no mesmo painel.`}</p>
        </div>
        <span className="badge badge-purple">Admin</span>
      </div>

      {status && <div className="inline-alert">{status}</div>}

      <div className="stats-grid">
        <StatCard label="Pedidos" value={data.pedidos.length} sub={`${pedidosPagos} pagos`} />
        <StatCard label="Receita total" value={formatCurrency(receita)} sub={`${data.eventos.length} eventos`} tone="#15956d" />
        <StatCard label="Barracas" value={data.barracas.length} sub={`${barracasSemDono.length} sem responsavel`} tone="#D85A30" />
        <StatCard label="Usuarios" value={data.users.length} sub="contas cadastradas" tone="#2563eb" />
      </div>

      {/* Detalhamento por Evento */}
      <div className="card" style={{ marginTop: 16 }}>
        <p className="card-title">Resumo por Evento</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '10px 5px' }}>Evento</th>
                <th>Barracas</th>
                <th>Usuários</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.eventos.map(ev => {
                const bCount = data.barracas.filter(b => b.evento_id === ev.id).length;
                const uCount = data.users.filter(u => u.evento_id === ev.id).length;
                const rValue = receitaPorEvento(ev);
                return (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                    <td style={{ padding: '12px 5px', fontWeight: 600 }}>{ev.nome}</td>
                    <td>{bCount}</td>
                    <td>{uCount}</td>
                    <td style={{ fontWeight: 700, color: '#15956d' }}>{formatCurrency(rValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <p className="card-title">Perfis no sistema</p>
          {ROLES.map((role) => {
            const meta = ROLE_META[role];
            const percent = Math.round(((counts[role] || 0) / (data.users.length || 1)) * 100);
            return (
              <div key={role} className="bar-row">
                <span className="bar-label">{meta.label}</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${percent}%`, background: meta.color }} />
                </div>
                <span className="bar-val">{counts[role] || 0}</span>
              </div>
            );
          })}
        </div>

        <div className="card">
          <p className="card-title">Barracas sem Responsável</p>
          {barracasSemDono.length === 0 ? (
            <div className="alert-row">
              <span className="alert-dot sdot-ok" />
              <div className="alert-text">Tudo em ordem!</div>
            </div>
          ) : barracasSemDono.map(b => (
            <div key={b.id} className="alert-row" style={{ marginBottom: 8 }}>
              <span className="alert-dot sdot-warn" />
              <div className="alert-text">
                <strong>{b.nome}</strong> <br/>
                <small style={{ color: 'var(--muted)' }}>Evento: {b.evento_nome || 'Não definido'}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-title">Ultimos pedidos</p>
        {data.pedidos.length === 0 ? (
          <div className="empty-state">As vendas aparecerao aqui conforme forem registradas.</div>
        ) : data.pedidos.slice(0, 5).map((pedido) => (
          <div key={pedido.id} className="item-row">
            <div className="avatar" style={{ background: '#ede9fe', color: ADM_COLOR }}>#{pedido.id}</div>
            <div className="item-info">
              <div className="item-name">{pedido.usuario_nome || 'Participante'}</div>
              <div className="item-meta">{pedido.itens?.length || 0} item(s) - {pedido.status}</div>
            </div>
            <div className="money-value">{formatCurrency(pedido.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
