import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../utils/tokens.js';
import Phone from '../components/Phone.js';
import NavBar from '../components/NavBar.js';
import QRCode from '../components/QRCode.js';
import { get, post } from '../utils/api.js';

const { primary: PA, dark: PD, light: PL, mid: PM } = tokens.participante;

const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

const normalizeStatus = (status) => String(status || '').toLowerCase().trim();

const orderStatusLabel = {
  pendente: 'Pedido feito',
  'em preparo': 'Pedido em preparo',
  pronto: 'Pedido pronto',
  entregue: 'Finalizado',
  pago: 'Pago',
};

const orderStatusBadge = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'entregue') return 'badge-ok';
  if (normalized === 'pago') return 'badge-ok';
  if (normalized === 'pendente') return 'badge-warn';
  return 'badge-info';
};

const orderStatusMessage = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'pendente') return 'Pedido enviado. Aguardando aceitação da barraca.';
  if (normalized === 'em preparo') return 'Pedido aceito pela barraca e em preparo.';
  if (normalized === 'pronto') return 'Pedido aceito e pronto para retirada.';
  if (normalized === 'pago') return 'Pedido pago. Aguarde a retirada ou entrega.';
  if (normalized === 'entregue') return 'Pedido finalizado.';
  return 'Pedido registrado. Aguardando atualização da barraca.';
};

const P_ComprarFichas = ({ user, token, products, cart, setCart, loading, setLoading, status, setStatus, reloadOrders, onGenerateQRCode, dataLoading }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (products.length > 0 && selectedProductId === null) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const addItem = (product) => {
    if (!product || product.estoque <= 0) {
      setStatus('Produto sem estoque disponível.');
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.produto_id === product.id);
      if (existing) {
        return current.map((item) =>
          item.produto_id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...current, { produto_id: product.id, nome: product.nome, preco: product.preco, quantidade: 1 }];
    });
    setStatus(`${product.nome} adicionado ao carrinho.`);
  };

  const removeItem = (produtoId) => {
    setCart((current) => current.filter((item) => item.produto_id !== produtoId));
  };

  const changeQuantity = (produtoId, delta) => {
    setCart((current) => current.map((item) => {
      if (item.produto_id !== produtoId) return item;
      const next = Math.max(1, item.quantidade + delta);
      return { ...item, quantidade: next };
    }));
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    [cart]
  );

  const submitOrder = async () => {
    if (cart.length === 0) {
      setStatus('Adicione pelo menos um produto ao carrinho.');
      return;
    }
    setLoading(true);
    setStatus('Criando pedido...');
    try {
      await post('/pedidos', token, {
        usuario_id: user.id,
        itens: cart.map((item) => ({ produto_id: item.produto_id, quantidade: item.quantidade })),
      });
      setCart([]);
      setStatus('Pedido criado com sucesso!');
      reloadOrders();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-body">
      <div className="card">
        <p className="card-title">Produtos disponíveis</p>
        {products.length === 0 ? (
          <div style={{ color: '#777', fontSize: 13 }}>
            {dataLoading ? 'Carregando produtos...' : 'Nenhum produto disponível para este evento.'}
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="item-row" style={{ alignItems: 'center' }}>
              <div className="item-info">
                <div className="item-name">{product.nome}</div>
                <div className="item-meta">{formatCurrency(product.preco)} · Estoque: {product.estoque}</div>
              </div>
              <button
                className="btn"
                type="button"
                onClick={() => addItem(product)}
                style={{ width: 'auto', padding: '8px 14px', background: '#1a1a1a', color: '#fff' }}
              >
                Adicionar
              </button>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <p className="card-title">Carrinho</p>
        {cart.length === 0 ? (
          <div style={{ color: '#777', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
            Seu carrinho está vazio. Adicione produtos para criar um pedido.
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.produto_id} className="row">
              <div>
                <div className="row-label">{item.nome} × {item.quantidade}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{formatCurrency(item.preco)} cada</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="qty-btn" type="button" onClick={() => changeQuantity(item.produto_id, -1)}>-</button>
                <div className="qty-num" style={{ minWidth: 20 }}>{item.quantidade}</div>
                <button className="qty-btn" type="button" onClick={() => changeQuantity(item.produto_id, 1)}>+</button>
                <span style={{ cursor: 'pointer', color: '#aa0000' }} onClick={() => removeItem(item.produto_id)}>✕</span>
              </div>
            </div>
          ))
        )}
        <div className="row" style={{ borderTop: '2px solid #f0eeea', paddingTop: 10, marginTop: 10 }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800 }}>{formatCurrency(total)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <button className="btn" type="button" onClick={submitOrder} disabled={loading} style={{ background: PA, color: PD }}>
          {loading ? 'Enviando pedido...' : 'Fazer pedido'}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => onGenerateQRCode(cart)}
          disabled={loading || cart.length === 0}
          style={{ width: '100%', borderColor: '#d1d5db', color: '#111827' }}
        >
          Gerar QR Code
        </button>
      </div>
      {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
    </div>
  );
};

const P_Carteira = ({ orders, onConfirmReceipt, loading, status }) => {
  const totalGasto = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );
  const visitas = useMemo(
    () => new Set(orders.flatMap((order) => order.itens.map((item) => item.barraca_id))).size,
    [orders]
  );
  const pendentes = useMemo(
    () => orders.filter((order) => order.status !== 'entregue'),
    [orders]
  );
  const nextOrder = pendentes[0] || null;
  const nextOrderMessage = nextOrder ? (
    nextOrder.status === 'pendente' ? 'Pedido feito. Aguarde a aceitação da barraca.' :
    nextOrder.status === 'em preparo' ? 'Pedido aceito e em preparo.' :
    nextOrder.status === 'pronto' ? 'Pedido aceito e pronto para retirada.' :
    nextOrder.status === 'pago' ? 'Pedido pago. Aguardando retirada.' :
    nextOrder.status === 'entregue' ? 'Pedido finalizado.' :
    'Acompanhe o status do pedido.'
  ) : 'Nenhum pedido em andamento no momento.';

  return (
    <div className="screen-body">
      <div className="hero-card" style={{ background: PA }}>
        <div style={{ fontSize: 11, color: PD, opacity: .8, marginBottom: 4 }}>Resumo da conta</div>
        <div style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 800, color: PD, lineHeight: 1 }}>{formatCurrency(totalGasto)}</div>
        <div style={{ fontSize: 12, color: PD, opacity: .7, marginTop: 6 }}>{visitas} barracas visitadas</div>
        <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(255,255,255,.25)', borderRadius: 12, color: PD, fontSize: 13 }}>
          {nextOrderMessage}
        </div>
        {status && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(255,255,255,.18)', borderRadius: 12, color: PD, fontSize: 13 }}>
            {status}
          </div>
        )}
        <div style={{ display: 'flex', gap: 24, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${PM}` }}>
          {[[orders.length, 'Pedidos'], [formatCurrency(totalGasto), 'Total gasto'], [visitas, 'Barracas']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: PD }}>{v}</div>
              <div style={{ fontSize: 10, color: PD, opacity: .7 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <p className="card-title">{pendentes.length ? 'Pedidos em andamento' : 'Últimos pedidos'}</p>
        {orders.length === 0 ? (
          <div style={{ color: '#777', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
            Nenhum pedido registrado ainda.
          </div>
        ) : pendentes.length === 0 ? (
          <div style={{ color: '#777', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
            Nenhum pedido em andamento no momento.
          </div>
        ) : pendentes.slice(0, 3).map((order) => (
          <div key={order.id} className="item-row" style={{ justifyContent: 'space-between' }}>
            <div className="item-info">
              <div className="item-name">Pedido #{order.id}</div>
              <div className="item-meta">{new Date(order.criado_em).toLocaleString('pt-BR')}</div>
            </div>
            <span className={`badge ${orderStatusBadge(order.status)}`} style={{ marginRight: 12 }}>{orderStatusLabel[order.status] || order.status}</span>
            <div style={{ fontWeight: 700 }}>{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const P_QRCode = ({ user, eventName, qrOrder, onClearQr }) => {
  const payload = qrOrder
    ? JSON.stringify(qrOrder, null, 2)
    : JSON.stringify({ user_id: user.id, nome: user.nome, tipo: 'participante' }, null, 2);
  const orderItems = qrOrder?.itens || [];
  const orderTotal = orderItems.reduce((sum, item) => sum + Number(item.preco || 0) * Number(item.quantidade || 0), 0);

  return (
    <div className="screen-body">
      <div style={{ background: PA, borderRadius: 16, padding: '12px 16px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: PD, opacity: .8 }}>Perfil</div>
          <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 700, color: PD }}>{user.nome}</div>
          <div style={{ fontSize: 11, color: PD, opacity: .8 }}>{eventName || 'Evento atual'}</div>
        </div>
      </div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{user.nome}</div>
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>{qrOrder ? 'QR Code do pedido' : 'QR Code do participante'}</div>
        <div className="qr-box" style={{ marginBottom: 12 }}><QRCode value={payload} size={160} /></div>
        <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace', letterSpacing: '.06em', marginBottom: 10 }}>ID: {user.id}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: qrOrder ? '#eff6ff' : '#E1F5EE', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: qrOrder ? '#1d4ed8' : '#0F6E56', fontWeight: 600 }}>
          <div className="dot-pulse" style={{ background: qrOrder ? '#2563eb' : '#1D9E75' }} />
          {qrOrder ? 'QR Code de pedido pronto' : 'Pronto para usar'}
        </div>
      </div>
      {qrOrder ? (
        <div className="card">
          <p className="card-title">Detalhes do pedido</p>
          {orderItems.length === 0 ? (
            <div style={{ color: '#777', fontSize: 13 }}>Nenhum item encontrado no pedido.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {orderItems.map((item) => (
                <div key={item.produto_id} className="item-row" style={{ padding: 0 }}>
                  <div className="item-info">
                    <div className="item-name">{item.nome}</div>
                    <div className="item-meta">{item.quantidade} x {formatCurrency(item.preco)}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatCurrency(item.preco * item.quantidade)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0eeea', fontWeight: 700 }}>
                <span>Total</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
            </div>
          )}
          <pre style={{ marginTop: 12, padding: 12, background: '#f3f4f6', borderRadius: 12, overflowX: 'auto', fontSize: 12, lineHeight: 1.4 }}>{payload}</pre>
          <button className="btn btn-secondary" type="button" onClick={onClearQr} style={{ marginTop: 10, borderColor: '#d1d5db', color: '#111827' }}>
            Limpar QR Code
          </button>
        </div>
      ) : (
        <div className="card">
          <p className="card-title">Como usar</p>
          {['Adicione produtos e gere o QR Code', 'Apresente este QR Code no caixa', 'Acompanhe o status do pedido na carteira'].map((step, index) => (
            <div key={step} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: index < 2 ? '1px solid #f0eeea' : 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E1F5EE', color: '#0F6E56', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{index + 1}</div>
              <div style={{ fontSize: 13, color: '#1a1a1a' }}>{step}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const P_Historico = ({ orders, onConfirmReceipt, loading }) => (
  <div className="screen-body">
    <div className="stats-grid">
      <div className="stat-card"><p className="stat-label">Pedidos realizados</p><div className="stat-value">{orders.length}</div><div className="stat-sub">Últimos pedidos</div></div>
      <div className="stat-card"><p className="stat-label">Barracas visitadas</p><div className="stat-value">{new Set(orders.flatMap((order) => order.itens.map((item) => item.barraca_id))).size}</div><div className="stat-sub">barracas diferentes</div></div>
    </div>
    <div className="card">
      <p className="card-title">Histórico de pedidos</p>
      {orders.length === 0 ? (
        <div style={{ color: '#777', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
          Nenhum pedido encontrado ainda.
        </div>
      ) : orders.map((order) => (
        <div key={order.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div className="item-name">Pedido #{order.id}</div>
              <div className="item-meta">{new Date(order.criado_em).toLocaleString('pt-BR')}</div>
            </div>
            <span className={`badge ${orderStatusBadge(order.status)}`}>{orderStatusLabel[order.status] || order.status}</span>
          </div>
          <div style={{ marginTop: 6, color: '#555', fontSize: 12 }}>{orderStatusMessage(order.status)}</div>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {(order.itens || []).map((item) => (
              <div key={`${order.id}-${item.produto_id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{item.produto_nome}</div>
                  <div style={{ fontSize: 11, color: '#777' }}>{item.quantidade} x {formatCurrency(item.preco)} • {item.barraca_nome}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{formatCurrency(item.subtotal)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTop: '1px solid #f0eeea', paddingTop: 10, gap: 10 }}>
            <div style={{ fontWeight: 700 }}>Total <span style={{ fontWeight: 600, color: '#6b7280' }}>#{order.id}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <div style={{ fontWeight: 700 }}>{formatCurrency(order.total)}</div>
              {order.status === 'pronto' ? (
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: PA, color: PD, width: 'auto' }}
                  onClick={() => onConfirmReceipt(order.id)}
                  disabled={loading}
                >
                  {loading ? 'Confirmando...' : 'Confirmar retirada'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function ParticipanteApp({ onBack, subtitle, user, token }) {
  const [tab, setTab] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [barracas, setBarracas] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [qrOrder, setQrOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const activeEvent = useMemo(
    () => eventos.find((ev) => Number(ev.id) === Number(user?.evento_id)),
    [eventos, user?.evento_id]
  );

  const eventBarracas = useMemo(
    () => barracas.filter((b) => Number(b.evento_id) === Number(user?.evento_id)),
    [barracas, user?.evento_id]
  );

  const eventBarracaIds = useMemo(
    () => eventBarracas.map((b) => Number(b.id)),
    [eventBarracas]
  );

  const products = useMemo(
    () => allProducts.filter((product) => eventBarracaIds.includes(Number(product.barraca_id))),
    [allProducts, eventBarracaIds]
  );

  const filteredOrders = useMemo(
    () => orders.filter((order) => order.itens?.some((item) => eventBarracaIds.includes(Number(item.barraca_id)))),
    [orders, eventBarracaIds]
  );

  const loadEventos = async () => {
    try {
      const data = await get('/eventos', token);
      setEventos(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadBarracas = async () => {
    try {
      const data = await get('/barracas', token);
      setBarracas(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await get('/produtos', token);
      setAllProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await get(`/pedidos/usuario/${user.id}`, token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const generateOrderQRCode = (items) => {
    if (!items || items.length === 0) {
      setStatus('Adicione produtos ao carrinho para gerar o QR Code.');
      return;
    }

    const payload = {
      usuario_id: user.id,
      usuario_nome: user.nome,
      evento_id: activeEvent?.id,
      itens: items.map((item) => ({
        produto_id: item.produto_id,
        nome: item.nome,
        preco: item.preco,
        quantidade: item.quantidade,
      })),
    };

    setQrOrder(payload);
    setTab(2);
    setStatus('QR Code de pedido pronto. Apresente ao caixa para escanear.');
  };

  const confirmOrderReceipt = async (orderId) => {
    if (!orderId) return;
    setLoading(true);
    setStatus('Confirmando pedido recebido...');
    try {
      await put(`/pedidos/${orderId}/status`, token, { status: 'entregue' });
      await loadOrders();
      setStatus(`Pedido #${orderId} confirmado como retirado.`);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user) return;

    const loadAll = async () => {
      setDataLoading(true);
      setStatus('');
      await Promise.all([loadEventos(), loadBarracas(), loadProducts(), loadOrders()]);
      setDataLoading(false);
    };

    loadAll();
  }, [token, user]);

  const navItems = [
    { icon: '🛍️', label: 'Pedido' },
    { icon: '💳', label: 'Carteira' },
    { icon: '📲', label: 'QR Code' },
    { icon: '📋', label: 'Histórico' },
  ];
  const screens = [
    <P_ComprarFichas
      key="comprar"
      user={user}
      token={token}
      products={products}
      cart={cart}
      setCart={setCart}
      loading={loading}
      setLoading={setLoading}
      status={status}
      setStatus={setStatus}
      reloadOrders={loadOrders}
      onGenerateQRCode={generateOrderQRCode}
      dataLoading={dataLoading}
    />,
    <P_Carteira key="carteira" orders={filteredOrders} onConfirmReceipt={confirmOrderReceipt} loading={loading} status={status} />,
    <P_QRCode key="qrcode" user={user} eventName={activeEvent?.nome} qrOrder={qrOrder} onClearQr={() => setQrOrder(null)} />,
    <P_Historico key="historico" orders={filteredOrders} onConfirmReceipt={confirmOrderReceipt} loading={loading} />,
  ];
  const titles = ['Fazer pedido', 'Minha carteira', 'Meu QR Code', 'Histórico'];

  return (
    <Phone
      color={PA}
      textColor={PD}
      title={titles[tab]}
      subtitle={activeEvent ? `Evento: ${activeEvent.nome}` : subtitle}
      onBack={onBack}
      topContent={
        activeEvent ? (
          <div style={{ padding: '12px 16px', background: '#fff7ed', marginBottom: 10, borderRadius: 18, color: '#92400e', fontWeight: 700 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>Evento Selecionado</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
              <span>🎪</span>
              <strong>{activeEvent.nome}</strong>
            </div>
          </div>
        ) : null
      }
    >
      {screens[tab]}
      <NavBar items={navItems} active={tab} onSelect={setTab} activeColor={PM} />
    </Phone>
  );
}
