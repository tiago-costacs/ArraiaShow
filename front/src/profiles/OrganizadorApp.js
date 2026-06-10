import React, { useEffect, useState, useMemo } from 'react';
import Phone from '../components/Phone.js';
import NavBar from '../components/NavBar.js';
import { get } from '../utils/api.js';
import { ORG_COLOR, ORG_MID } from './organizador/constants.js';
import { asArray } from './organizador/utils.js';
import DashboardScreen from './organizador/screens/DashboardScreen.js';
import BarracasScreen from './organizador/screens/BarracasScreen.js';
import CreateBarracaScreen from './organizador/screens/CreateBarracaScreen.js';
import FinanceiroScreen from './organizador/screens/FinanceiroScreen.js';
import UsuariosScreen from './organizador/screens/UsuariosScreen.js';
import RelatoriosScreen from './organizador/screens/RelatoriosScreen.js';
import ConfigScreen from './organizador/screens/ConfigScreen.js';
import EventosScreen from './organizador/screens/EventosScreen.js';

export default function OrganizadorApp({ subtitle, token, user }) {
  const [tab, setTab] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  const [users, setUsers] = useState([]);
  const [barracas, setBarracas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeEvent = eventos.find(e => Number(e.id) === Number(activeEventId));

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [evs, usrs, brcs, ords, prods] = await Promise.all([
        get('/eventos', token),
        get('/usuarios', token),
        get('/barracas', token),
        get('/pedidos', token),
        get('/produtos', token),
      ]);
      
      const meusEventos = asArray(evs).filter(ev => !ev.organizador_id || Number(ev.organizador_id) === Number(user?.id));
      setEventos(meusEventos);
      
      if (meusEventos.length > 0 && !activeEventId) {
        setActiveEventId(meusEventos[0].id);
      }
      
      setUsers(asArray(usrs));
      setBarracas(asArray(brcs));
      setOrders(asArray(ords));
      setProducts(asArray(prods));
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados do painel.');
    } finally {
      setLoading(false);
    }
  };

  const eventUsers = useMemo(
    () => users.filter((usr) => Number(usr.evento_id) === Number(activeEventId)),
    [users, activeEventId]
  );

  useEffect(() => { if (token) loadData(); }, [token]);

  // Filtros robustos para destravar o financeiro e relatórios
  const filteredBarracas = useMemo(() => 
    barracas.filter(b => Number(b.evento_id) === Number(activeEventId)),
  [barracas, activeEventId]);

  const currentBarracaIds = useMemo(() => filteredBarracas.map(b => Number(b.id)), [filteredBarracas]);

  const filteredOrders = useMemo(() => 
    orders.filter((o) => o.itens?.some((item) => currentBarracaIds.includes(Number(item.barraca_id)))),
  [orders, currentBarracaIds]);

  const filteredProducts = useMemo(() => 
    products.filter(p => p.barraca_id && currentBarracaIds.includes(Number(p.barraca_id))),
  [products, currentBarracaIds]);

  const navItems = [
    { icon: 'P', label: 'Painel' },
    { icon: 'Ba', label: 'Barracas' },
    { icon: '+', label: 'Nova' },
    { icon: '$', label: 'Financeiro' },
    { icon: 'Us', label: 'Usuarios' },
    { icon: 'R$', label: 'Relatorios' },
    { icon: '🎪', label: 'Eventos' },
    { icon: 'Cf', label: 'Config.' },
  ];

  const screens = [
    <DashboardScreen key="dash" event={activeEvent} users={eventUsers} barracas={filteredBarracas} orders={filteredOrders} products={filteredProducts} />,
    <BarracasScreen key="lista" barracas={filteredBarracas} users={users} barraqueiros={users.filter((u) => u.tipo === 'barraqueiro')} orders={filteredOrders} products={filteredProducts} token={token} onDelete={loadData} />,
    <CreateBarracaScreen key="criar" token={token} eventos={eventos} usuarios={users.filter((u) => u.tipo === 'barraqueiro')} onSuccess={loadData} />,
    <FinanceiroScreen key="fin" barracas={filteredBarracas} orders={filteredOrders} products={filteredProducts} />,
    <UsuariosScreen key="usrs" users={eventUsers} />,
    <RelatoriosScreen key="rel" orders={filteredOrders} users={eventUsers} barracas={filteredBarracas} products={filteredProducts} />,
    <EventosScreen key="eventos" token={token} eventos={eventos} user={user} onSuccess={loadData} />,
    <ConfigScreen key="conf" event={activeEvent} products={filteredProducts} />,
  ];

  const titles = ['Painel geral', 'Barracas', 'Cadastrar barraca', 'Financeiro', 'Usuarios', 'Relatorios', 'Eventos', 'Configuracoes'];
return (
  <Phone
    color={ORG_COLOR}
    textColor="#fff"
    title={titles[tab]}
    subtitle={activeEvent ? `Evento: ${activeEvent.nome}` : subtitle}
    onBack={null}
      topContent={
        eventos.length > 0 ? (
          <div
            style={{
              background: ORG_COLOR,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderBottom: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 18,
              }}
            >
              🎪
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: 'rgba(255,255,255,.75)',
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 2,
                }}
              >
                Evento selecionado
              </div>

              <select
                value={activeEventId || ''}
                onChange={(e) => setActiveEventId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  appearance: 'none'
                }}
              >
                {eventos.map((ev) => (
                  <option key={ev.id} value={ev.id} style={{ color: '#000' }}>
                    {ev.nome}
                  </option>
                ))}
              </select>
            </div>
            <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 10 }}>▼</span>
          </div>
        ) : null
      }
  >
    {loading ? (
      <div className="screen-body">
        <div className="card">Carregando dados...</div>
      </div>
    ) : error ? (
      <div className="screen-body">
        <div className="inline-alert">{error}</div>
      </div>
    ) : (
      <>
        {eventos.length === 0 ? (
          <div className="screen-body">
            <div className="card">
              Você ainda não foi atribuído a nenhum evento.
            </div>
          </div>
        ) : (
          screens[tab]
        )}
      </>
    )}

    <NavBar
      items={navItems}
      active={tab}
      onSelect={setTab}
      activeColor={ORG_MID}
    />
  </Phone> 
);
}
