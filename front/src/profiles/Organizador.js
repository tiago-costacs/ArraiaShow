import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../utils/tokens.js';
import Phone from '../components/Phone.js';
import NavBar from '../components/NavBar.js';
import { get } from '../utils/api.js';

const { primary: OA, dark: OD, light: OL, mid: OM } = tokens.organizador;

const asArray = (value) => Array.isArray(value) ? value : [];
const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
const formatDate = (value) => value ? new Date(value).toLocaleDateString('pt-BR') : 'Nao informado';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
};

const ordersFromBarraca = (orders, barracaId) =>
  orders.filter((order) => order.itens.some((item) => Number(item.barraca_id) === Number(barracaId)));

const Stat = ({ label, value, sub, tone = OA }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <div className="stat-value" style={{ color: tone }}>{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const Empty = ({ children }) => (
  <div className="empty-state">{children}</div>
);

const O_Dashboard = ({ event, users, barracas, orders }) => {
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total || 0), 0), [orders]);
  const paidOrders = orders.filter((order) => order.status === 'pago').length;
  const participantes = users.filter((user) => user.tipo === 'participante').length;
  const barraqueiros = users.filter((user) => user.tipo === 'barraqueiro').length;
  const topBarracas = useMemo(() => {
    const totals = {};
    orders.forEach((order) => {
      order.itens.forEach((item) => {
        const name = item.barraca_nome || 'Sem barraca';
        totals[name] = (totals[name] || 0) + Number(item.subtotal || 0);
      });
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [orders]);

  return (
    <div className="screen-body">
      <div className="hero-card org-hero">
        <div>
          <div className="eyebrow">Evento em operacao</div>
          <h2>{event?.nome || 'Arraia Show'}</h2>
          <p>{event ? `Data do evento: ${formatDate(event.data_evento)}` : 'Cadastre um evento para acompanhar a operacao completa.'}</p>
        </div>
        <span className={`badge ${event?.ativo ? 'badge-ok' : 'badge-warn'}`}>
          {event?.ativo ? 'Ativo' : 'Aguardando'}
        </span>
      </div>

      <div className="stats-grid">
        <Stat label="Arrecadacao" value={formatCurrency(totalRevenue)} sub={`${orders.length} pedidos`} />
        <Stat label="Pedidos pagos" value={paidOrders} sub="confirmados" tone="#1D9E75" />
        <Stat label="Participantes" value={participantes} sub={`${barraqueiros} barraqueiros`} tone="#BA7517" />
        <Stat label="Barracas" value={barracas.length} sub="cadastradas" tone={OM} />
      </div>

      <div className="card">
        <p className="card-title">Barracas em destaque</p>
        {topBarracas.length === 0 ? (
          <Empty>Nenhuma venda registrada ainda.</Empty>
        ) : topBarracas.map(([name, total]) => (
          <div key={name} className="bar-row">
            <span className="bar-label">{name}</span>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${Math.min(100, (total / Math.max(topBarracas[0][1], 1)) * 100)}%`, background: OA }} />
            </div>
            <span className="bar-val">{formatCurrency(total)}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Pedidos recentes</p>
        {orders.length === 0 ? (
          <Empty>Os pedidos aparecerao aqui conforme as vendas forem acontecendo.</Empty>
        ) : orders.slice(0, 5).map((order) => (
          <div key={order.id} className="item-row">
            <div className="avatar" style={{ background: OL, color: OM }}>{getInitials(order.usuario_nome)}</div>
            <div className="item-info">
              <div className="item-name">{order.usuario_nome || `Pedido #${order.id}`}</div>
              <div className="item-meta">{new Date(order.criado_em).toLocaleString('pt-BR')} - {order.itens.length} item(s)</div>
            </div>
            <div className="money-value">{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const O_Barracas = ({ barracas, users, orders }) => {
  const usersById = useMemo(() => new Map(users.map((user) => [Number(user.id), user])), [users]);

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Gestao de barracas</p>
          <h2>{barracas.length} barraca(s)</h2>
        </div>
        <span className="badge badge-info">Operacao</span>
      </div>

      {barracas.length === 0 ? (
        <div className="card"><Empty>Nenhuma barraca cadastrada no momento.</Empty></div>
      ) : barracas.map((barraca) => {
        const owner = usersById.get(Number(barraca.responsavel_id));
        const barracaOrders = ordersFromBarraca(orders, barraca.id);
        const total = barracaOrders.reduce((sum, order) => {
          const itemTotal = order.itens
            .filter((item) => Number(item.barraca_id) === Number(barraca.id))
            .reduce((sub, item) => sub + Number(item.subtotal || 0), 0);
          return sum + itemTotal;
        }, 0);

        return (
          <div key={barraca.id} className="barraca-card">
            <div className="barraca-header">
              <div className="barraca-icon" style={{ background: OL, color: OM }}>B</div>
              <div className="barraca-info">
                <div className="barraca-name">{barraca.nome}</div>
                <div className="barraca-owner">{owner ? owner.nome : 'Responsavel nao vinculado'}</div>
              </div>
              <span className="badge badge-ok">Ativa</span>
            </div>
            <div className="barraca-stats">
              <div className="bstat"><p className="bstat-label">Vendas</p><div className="bstat-val">{barracaOrders.length}</div></div>
              <div className="bstat"><p className="bstat-label">Receita</p><div className="bstat-val">{formatCurrency(total)}</div></div>
              <div className="bstat"><p className="bstat-label">Evento</p><div className="bstat-val">#{barraca.evento_id}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const O_Financeiro = ({ orders }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const ticketMedio = orders.length ? totalRevenue / orders.length : 0;
  const totalsByStatus = orders.reduce((acc, order) => {
    acc[order.status || 'pendente'] = (acc[order.status || 'pendente'] || 0) + Number(order.total || 0);
    return acc;
  }, {});

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <Stat label="Total recebido" value={formatCurrency(totalRevenue)} sub="em pedidos" />
        <Stat label="Ticket medio" value={formatCurrency(ticketMedio)} sub="por pedido" tone="#1D9E75" />
        <Stat label="Pedidos" value={orders.length} sub="registrados" tone="#BA7517" />
      </div>

      <div className="card">
        <p className="card-title">Status financeiro</p>
        {Object.keys(totalsByStatus).length === 0 ? (
          <Empty>Sem movimentacao financeira para exibir.</Empty>
        ) : Object.entries(totalsByStatus).map(([status, total]) => (
          <div key={status} className="status-row">
            <span className={`sdot ${status === 'pago' ? 'sdot-ok' : 'sdot-warn'}`} />
            <span className="status-name">{status}</span>
            <span className="status-val">{formatCurrency(total)}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Ultimas entradas</p>
        {orders.length === 0 ? (
          <Empty>Nenhum pedido financeiro encontrado.</Empty>
        ) : orders.slice(0, 6).map((order) => (
          <div key={order.id} className="report-card">
            <div className="report-icon" style={{ background: OL, color: OM }}>R$</div>
            <div className="report-info">
              <div className="report-name">Pedido #{order.id}</div>
              <div className="report-desc">{order.usuario_nome || 'Participante'} - {new Date(order.criado_em).toLocaleString('pt-BR')}</div>
            </div>
            <div className="money-value">{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const O_Usuarios = ({ users }) => {
  const counts = users.reduce((acc, user) => {
    acc[user.tipo] = (acc[user.tipo] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <Stat label="Total" value={users.length} sub="usuarios" />
        <Stat label="Participantes" value={counts.participante || 0} sub="compradores" tone="#BA7517" />
        <Stat label="Barraqueiros" value={counts.barraqueiro || 0} sub="operacao" tone="#1D9E75" />
        <Stat label="Organizadores" value={counts.organizador || 0} sub="gestao" tone={OM} />
      </div>

      <div className="card">
        <p className="card-title">Usuarios cadastrados</p>
        {users.length === 0 ? (
          <Empty>Nenhum usuario cadastrado.</Empty>
        ) : users.map((user) => (
          <div key={user.id} className="user-row">
            <div className="avatar" style={{ background: OL, color: OM }}>{getInitials(user.nome)}</div>
            <div className="user-info">
              <div className="user-name">{user.nome}</div>
              <div className="user-meta">{user.email}</div>
            </div>
            <span className="badge badge-purple">{user.tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const O_Relatorios = ({ orders, users, barracas }) => {
  const reports = [
    { name: 'Resumo financeiro', desc: `${orders.length} pedidos processados`, value: formatCurrency(orders.reduce((sum, order) => sum + Number(order.total || 0), 0)) },
    { name: 'Operacao das barracas', desc: `${barracas.length} barracas cadastradas`, value: 'Ver detalhes' },
    { name: 'Usuarios por perfil', desc: `${users.length} usuarios no sistema`, value: 'Atualizado' },
  ];

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Relatorios rapidos</p>
        {reports.map((report) => (
          <div key={report.name} className="report-card">
            <div className="report-icon" style={{ background: OL, color: OM }}>PDF</div>
            <div className="report-info">
              <div className="report-name">{report.name}</div>
              <div className="report-desc">{report.desc}</div>
            </div>
            <div className="report-arrow">{report.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">Saude do evento</p>
        <div className="status-row"><span className="sdot sdot-ok" /><span className="status-name">Pedidos sincronizados</span><span className="status-val">{orders.length}</span></div>
        <div className="status-row"><span className="sdot sdot-ok" /><span className="status-name">Barracas cadastradas</span><span className="status-val">{barracas.length}</span></div>
        <div className="status-row"><span className="sdot sdot-warn" /><span className="status-name">Usuarios aguardando revisao</span><span className="status-val">0</span></div>
      </div>
    </div>
  );
};

const O_Config = ({ event }) => (
  <div className="screen-body">
    <div className="card">
      <p className="card-title">Configuracoes do evento</p>
      <div className="row"><span className="row-label">Nome</span><span className="row-value">{event?.nome || 'Nao configurado'}</span></div>
      <div className="row"><span className="row-label">Data</span><span className="row-value">{formatDate(event?.data_evento)}</span></div>
      <div className="row"><span className="row-label">Status</span><span className="row-value">{event?.ativo ? 'Ativo' : 'Inativo'}</span></div>
    </div>

    <div className="card">
      <p className="card-title">Preferencias</p>
      {['Permitir novos cadastros', 'Mostrar vendas em tempo real', 'Enviar alertas de estoque'].map((label, index) => (
        <div key={label} className="toggle-row">
          <div className="toggle-info">
            <div className="toggle-name">{label}</div>
            <div className="toggle-sub">Configuracao operacional</div>
          </div>
          <label className="tog">
            <input type="checkbox" defaultChecked={index !== 2} />
            <span className="tog-sl" />
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default function OrganizadorApp({ onBack, subtitle, token }) {
  const [tab, setTab] = useState(0);
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [barracas, setBarracas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoading(true);
      setStatus('');
      try {
        const [eventsData, usersData, barracasData, ordersData] = await Promise.all([
          get('/eventos', token),
          get('/usuarios', token),
          get('/barracas', token),
          get('/pedidos', token),
        ]);
        setEvent(asArray(eventsData)[0] || null);
        setUsers(asArray(usersData));
        setBarracas(asArray(barracasData));
        setOrders(asArray(ordersData));
      } catch (err) {
        setStatus(err.message || 'Nao foi possivel carregar o painel do organizador.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const navItems = [
    { icon: '▦', label: 'Painel' },
    { icon: '▤', label: 'Barracas' },
    { icon: '$', label: 'Financeiro' },
    { icon: '◉', label: 'Usuarios' },
    { icon: '▣', label: 'Relatorios' },
    { icon: '⚙', label: 'Config.' },
  ];
  const screens = [
    <O_Dashboard key="dashboard" event={event} users={users} barracas={barracas} orders={orders} />,
    <O_Barracas key="barracas" barracas={barracas} users={users} orders={orders} />,
    <O_Financeiro key="financeiro" orders={orders} />,
    <O_Usuarios key="usuarios" users={users} />,
    <O_Relatorios key="relatorios" orders={orders} users={users} barracas={barracas} />,
    <O_Config key="config" event={event} />,
  ];
  const titles = ['Painel geral', 'Barracas', 'Financeiro', 'Usuarios', 'Relatorios', 'Configuracoes'];

  return (
    <Phone color={OM} textColor={OL} title={titles[tab]} subtitle={subtitle} onBack={onBack}>
      {loading && (
        <div className="screen-body screen-body-compact">
          <div className="card"><Empty>Carregando dados do evento...</Empty></div>
        </div>
      )}
      {!loading && status && <div className="inline-alert">{status}</div>}
      {!loading && screens[tab]}
      <NavBar items={navItems} active={tab} onSelect={setTab} activeColor={OA} />
    </Phone>
  );
}
