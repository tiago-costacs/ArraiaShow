import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../utils/tokens.js';
import Phone from '../components/Phone.js';
import NavBar from '../components/NavBar.js';
import { get, post, put } from '../utils/api.js';

const { primary: BA, light: BL, mid: BM } = tokens.barraqueiro;
const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;

const initials = (name = '') => name.trim().slice(0, 2).toUpperCase() || '??';

function B_LerQR({ participants, products, scanState, setScanState, onConfirmSale, status, setStatus, loading }) {
  const [qrPayload, setQrPayload] = useState('');
  const [parsedOrder, setParsedOrder] = useState(null);
  const { active, selectedParticipantId, selectedProductId, quantity } = scanState;
  const activeProducts = products.filter((product) => Number(product.estoque || 0) > 0);
  const participant = participants.find((item) => Number(item.id) === Number(selectedParticipantId));
  const product = activeProducts.find((item) => Number(item.id) === Number(selectedProductId));
  const total = product ? Number(product.preco) * quantity : 0;

  const handleScan = () => {
    if (!participants.length) return setStatus('Nenhum participante disponivel para simular o QR Code.');
    if (!activeProducts.length) return setStatus('Nenhum produto ativo em estoque para vender.');
    setScanState((prev) => ({
      ...prev,
      active: true,
      selectedParticipantId: prev.selectedParticipantId || participants[0].id,
      selectedProductId: prev.selectedProductId || activeProducts[0].id,
      quantity: prev.quantity || 1,
    }));
    setStatus('QR Code simulado. Selecione o produto e confirme a venda.');
  };

  const handleProcessQr = () => {
    if (!qrPayload.trim()) return setStatus('Cole o conteúdo do QR Code do pedido.');
    try {
      const parsed = JSON.parse(qrPayload);
      if (!parsed.usuario_id || !Array.isArray(parsed.itens) || parsed.itens.length === 0) {
        throw new Error();
      }
      setParsedOrder(parsed);
      setStatus('QR Code do pedido carregado. Revise os itens e confirme.');
    } catch (err) {
      setParsedOrder(null);
      setStatus('QR Code inválido. Cole o JSON do pedido gerado pelo participante.');
    }
  };

  const handleConfirmParsedSale = async () => {
    if (!parsedOrder) return;
    await onConfirmSale(parsedOrder);
    setParsedOrder(null);
    setQrPayload('');
  };

  return (
    <div className="screen-body">
      <div className="scan-cam">
        <div className="scan-frame">
          {['tl', 'tr', 'bl', 'br'].map((pos) => <div key={pos} className={`sc ${pos}`} style={{ borderColor: BA }} />)}
          <div className="scan-line" style={{ background: BA }} />
        </div>
        <div className="scan-hint">Aponte o telefone para o QR Code do participante</div>
      </div>
      <div className="card" style={{ marginTop: 10 }}>
        <p className="card-title">Pedido via QR Code</p>
        <textarea
          value={qrPayload}
          onChange={(e) => setQrPayload(e.target.value)}
          placeholder="Cole aqui o JSON do pedido gerado pelo participante"
          style={{ width: '100%', minHeight: 100, padding: 12, borderRadius: 12, border: '1px solid #d1d5db', resize: 'vertical', fontSize: 13, marginBottom: 10 }}
        />
        <button className="btn btn-secondary" type="button" onClick={handleProcessQr} disabled={loading} style={{ marginBottom: 10, width: '100%', borderColor: '#d1d5db', color: '#111827' }}>
          Processar QR Code
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => setQrPayload('')} disabled={loading} style={{ width: '100%', borderColor: '#d1d5db', color: '#111827' }}>
          Limpar QR Code
        </button>
      </div>

      <button className="btn btn-secondary" type="button" onClick={handleScan}>Simular leitura de QR Code</button>

      {parsedOrder ? (
        <div className="card" style={{ marginTop: 10 }}>
          <p className="card-title">Pedido do QR Code</p>
          {(parsedOrder.itens || []).map((item) => (
            <div key={`${item.produto_id}-${item.quantidade}`} className="item-row" style={{ padding: 0 }}>
              <div className="item-info">
                <div className="item-name">{item.nome || item.produto_id}</div>
                <div className="item-meta">{item.quantidade} x {formatCurrency(item.preco || 0)}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{formatCurrency((item.preco || 0) * item.quantidade)}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{parsedOrder.usuario_nome || 'Participante'}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>ID: {parsedOrder.usuario_id}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: BA }}>
              Total: {formatCurrency((parsedOrder.itens || []).reduce((sum, item) => sum + Number(item.preco || 0) * Number(item.quantidade || 0), 0))}
            </div>
          </div>
          <button
            className="btn"
            type="button"
            style={{ background: BA, color: '#fff', marginTop: 10 }}
            onClick={handleConfirmParsedSale}
            disabled={loading}
          >
            {loading ? 'Confirmando...' : 'Confirmar venda do pedido'}
          </button>
        </div>
      ) : null}

      {active && (
        <div className="card" style={{ marginTop: 10 }}>
          <p className="card-title">Participante detectado</p>
          <div className="item-row" style={{ borderBottom: 0, paddingTop: 0 }}>
            <div className="avatar" style={{ background: BL, color: BM }}>{initials(participant?.nome)}</div>
            <div className="item-info">
              <div className="item-name">{participant?.nome || 'Participante'}</div>
              <div className="item-meta">{participant?.email || 'usuario selecionado'}</div>
            </div>
          </div>

          <div className="field">
            <label>Participante</label>
            <div style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', background: '#f9fafb' }}>
              {participant?.nome || 'Participante desconhecido'}
            </div>
          </div>
          <div className="field">
            <label>Produto ativo</label>
            <select value={selectedProductId || ''} onChange={(e) => setScanState((prev) => ({ ...prev, selectedProductId: Number(e.target.value), quantity: 1 }))}>
              {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.nome} - {formatCurrency(item.preco)} - estoque {item.estoque}</option>)}
            </select>
          </div>

          <div className="row">
            <span className="row-label">Quantidade</span>
            <div className="qty-ctrl">
              <button className="qty-btn" type="button" onClick={() => setScanState((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</button>
              <div className="qty-num">{quantity}</div>
              <button className="qty-btn" type="button" onClick={() => setScanState((prev) => ({ ...prev, quantity: Math.min(Number(product?.estoque || 1), prev.quantity + 1) }))}>+</button>
            </div>
          </div>
          <div className="row">
            <span className="row-label">Valor total</span>
            <span className="row-value">{formatCurrency(total)}</span>
          </div>
          <button
            className="btn"
            type="button"
            style={{ background: BA, color: '#fff' }}
            onClick={() => onConfirmSale({ usuario_id: selectedParticipantId, itens: [{ produto_id: selectedProductId, quantidade: quantity }] })}
            disabled={!participant || !product || loading}
          >
            {loading ? 'Confirmando...' : 'Confirmar venda'}
          </button>
        </div>
      )}
      {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
    </div>
  );
}

function B_RegistrarVenda({ orders, onChangeOrderStatus, status, setStatus, loading }) {
  const inProgressOrders = orders.filter((order) => order.status !== 'entregue');

  const statusMap = {
    pendente: { label: 'Pendente', badge: 'badge-warn', detail: 'Aguardando aceitação.' },
    'em preparo': { label: 'Em preparo', badge: 'badge-info', detail: 'Pedido em preparo.' },
    pronto: { label: 'Pronto', badge: 'badge-info', detail: 'Pedido pronto para retirada.' },
    entregue: { label: 'Finalizado', badge: 'badge-ok', detail: 'Pedido concluído.' },
    pago: { label: 'Finalizado', badge: 'badge-ok', detail: 'Pedido pago.' },
  };

  const actionFor = (status) => {
    if (status === 'pendente') return { label: 'Aceitar pedido', next: 'em preparo' };
    if (status === 'em preparo') return { label: 'Marcar como pronto', next: 'pronto' };
    if (status === 'pronto') return { label: 'Confirmar entrega', next: 'entregue' };
    return null;
  };

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Pedidos</p>
          <h2>{orders.length} pedido(s)</h2>
        </div>
        <span className="badge badge-info">Fluxo</span>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <div className="empty-state">Nenhum pedido recebido ainda.</div>
        </div>
      ) : (
        orders.map((order) => {
          const action = actionFor(order.status);
          const current = statusMap[order.status] || { label: order.status || 'Pedido finalizado', badge: 'badge-info', detail: '' };
          return (
            <div key={order.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Pedido #{order.id}</div>
                  <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>
                    {order.usuario_nome} • {new Date(order.criado_em).toLocaleString('pt-BR')}
                  </div>
                </div>
                <span className={`badge ${current.badge}`} style={{ alignSelf: 'flex-start' }}>{current.label}</span>
              </div>
              {current.detail ? (
                <div style={{ marginTop: 10, color: '#374151', fontSize: 13 }}>{current.detail}</div>
              ) : null}
              <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                {(order.itens || []).map((item) => (
                  <div key={`${order.id}-${item.produto_id}`} className="item-row" style={{ padding: 0 }}>
                    <div className="item-info">
                      <div className="item-name">{item.produto_nome}</div>
                      <div className="item-meta">{item.quantidade} x {formatCurrency(item.preco)} — {item.barraca_nome}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(item.subtotal)}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                <div style={{ fontWeight: 800 }}>{formatCurrency(order.total)}</div>
                {action ? (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: BA, color: '#fff' }}
                    onClick={() => onChangeOrderStatus(order.id, action.next)}
                    disabled={loading}
                  >
                    {loading ? 'Atualizando...' : action.label}
                  </button>
                ) : null}
              </div>
              {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
            </div>
          );
        })
      )}
    </div>
  );
}

function B_VendasDia({ orders }) {
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total || 0), 0), [orders]);
  const totalItems = useMemo(() => orders.reduce((sum, order) => sum + (order.itens || []).reduce((sub, item) => sub + Number(item.quantidade || 0), 0), 0), [orders]);
  const topProducts = useMemo(() => {
    const counts = {};
    orders.forEach((order) => (order.itens || []).forEach((item) => {
      counts[item.produto_nome] = (counts[item.produto_nome] || 0) + Number(item.quantidade || 0);
    }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [orders]);

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <div className="stat-card"><p className="stat-label">Total arrecadado</p><div className="stat-value">{formatCurrency(totalRevenue)}</div><div className="stat-sub">{orders.length} vendas</div></div>
        <div className="stat-card"><p className="stat-label">Itens vendidos</p><div className="stat-value">{totalItems}</div><div className="stat-sub">em todas as vendas</div></div>
        <div className="stat-card"><p className="stat-label">Pedidos</p><div className="stat-value">{orders.length}</div><div className="stat-sub">desde o inicio</div></div>
      </div>
      <div className="card">
        <p className="card-title">Produtos mais vendidos</p>
        {topProducts.length === 0 ? (
          <div className="empty-state">Ainda nao ha vendas registradas.</div>
        ) : topProducts.map(([name, count]) => (
          <div key={name} className="bar-row">
            <span className="bar-label">{name}</span>
            <div className="bar-bg"><div className="bar-fill" style={{ width: `${Math.min(100, count * 4)}%`, background: BA }} /></div>
            <span className="bar-val">{count} un.</span>
          </div>
        ))}
      </div>
      <div className="card">
        <p className="card-title">Ultimas vendas</p>
        {orders.length === 0 ? (
          <div className="empty-state">Nenhuma venda encontrada.</div>
        ) : orders.slice(0, 5).map((order) => (
          <div key={order.id} className="item-row">
            <div className="avatar" style={{ background: BL, color: BM, fontSize: 10, fontWeight: 800 }}>{new Date(order.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="item-info"><div className="item-name">{order.usuario_nome}</div><div className="item-meta">{order.itens?.length || 0} item(s)</div></div>
            <div className="money-value">{formatCurrency(order.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function B_Cardapio({ products, newProduct, setNewProduct, addProduct, loading, status }) {
  const ativos = products.filter((product) => Number(product.estoque || 0) > 0).length;

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Cardapio</p>
          <h2>{products.length} item(ns)</h2>
        </div>
        <span className="badge badge-ok">{ativos} ativos</span>
      </div>

      <div className="menu-grid">
        {products.length === 0 ? (
          <div className="card"><div className="empty-state">Nenhum produto cadastrado ainda.</div></div>
        ) : products.map((product) => {
          const estoque = Number(product.estoque || 0);
          return (
            <div key={product.id} className={`menu-card ${estoque <= 0 ? 'is-off' : ''}`}>
              <div className="menu-thumb" style={{ background: estoque > 0 ? BL : '#fee2e2', color: estoque > 0 ? BM : '#991b1b' }}>{product.nome?.slice(0, 1).toUpperCase() || 'P'}</div>
              <div className="menu-info">
                <div className="menu-name">{product.nome}</div>
                <div className="menu-price">{formatCurrency(product.preco)}</div>
                <div className="menu-meta">Estoque {estoque}</div>
              </div>
              <span className={`badge ${estoque > 0 ? 'badge-ok' : 'badge-warn'}`}>{estoque > 0 ? 'Ativo' : 'Esgotado'}</span>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="card-title">Adicionar produto</p>
        <div className="field">
          <label>Nome do produto</label>
          <input value={newProduct.nome} onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })} placeholder="Ex: Quentao" />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Preco (R$)</label>
            <input value={newProduct.preco} onChange={(e) => setNewProduct({ ...newProduct, preco: e.target.value })} type="number" placeholder="10,00" />
          </div>
          <div className="field">
            <label>Estoque inicial</label>
            <input value={newProduct.estoque} onChange={(e) => setNewProduct({ ...newProduct, estoque: e.target.value })} type="number" placeholder="10" />
          </div>
        </div>
        <button className="btn" type="button" style={{ background: BA, color: '#fff' }} onClick={addProduct} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar produto'}
        </button>
        {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
      </div>
    </div>
  );
}

function B_Estoque({ products, onUpdateStock, loading, status }) {
  const total = products.reduce((sum, product) => sum + Number(product.estoque || 0), 0);
  const criticos = products.filter((product) => Number(product.estoque || 0) > 0 && Number(product.estoque || 0) <= 5).length;
  const esgotados = products.filter((product) => Number(product.estoque || 0) <= 0).length;

  return (
    <div className="screen-body">
      <div className="stats-grid">
        <div className="stat-card"><p className="stat-label">Unidades</p><div className="stat-value" style={{ color: BM }}>{total}</div><div className="stat-sub">em estoque</div></div>
        <div className="stat-card"><p className="stat-label">Criticos</p><div className="stat-value" style={{ color: '#BA7517' }}>{criticos}</div><div className="stat-sub">ate 5 unidades</div></div>
        <div className="stat-card"><p className="stat-label">Esgotados</p><div className="stat-value" style={{ color: '#b42318' }}>{esgotados}</div><div className="stat-sub">fora da venda</div></div>
      </div>

      <div className="card">
        <p className="card-title">Controle de estoque</p>
        {products.length === 0 ? (
          <div className="empty-state">Cadastre produtos no cardapio para controlar estoque.</div>
        ) : products.map((product) => {
          const estoque = Number(product.estoque || 0);
          const percent = Math.min(100, (estoque / 30) * 100);
          return (
            <div key={product.id} className="stock-row">
              <div className="stock-main">
                <div className="item-name">{product.nome}</div>
                <div className="item-meta">{formatCurrency(product.preco)} - {estoque > 0 ? 'aparece para venda' : 'oculto nas vendas'}</div>
                <div className="bar-bg" style={{ marginTop: 8 }}>
                  <div className="bar-fill" style={{ width: `${percent}%`, background: estoque <= 0 ? '#b42318' : estoque <= 5 ? '#BA7517' : BA }} />
                </div>
              </div>
              <div className="stock-actions">
                <button className="qty-btn" type="button" disabled={loading} onClick={() => onUpdateStock(product, Math.max(0, estoque - 1))}>-</button>
                <div className="qty-num">{estoque}</div>
                <button className="qty-btn" type="button" disabled={loading} onClick={() => onUpdateStock(product, estoque + 1)}>+</button>
                {estoque > 0 ? (
                  <button className="chip" type="button" disabled={loading} onClick={() => onUpdateStock(product, 0)}>Esgotar</button>
                ) : (
                  <button className="chip active" type="button" disabled={loading} onClick={() => onUpdateStock(product, 10)}>Reativar</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
    </div>
  );
}

export default function BarraqueiroApp({ onBack, subtitle, user, token }) {
  const [tab, setTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [barraca, setBarraca] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [scanState, setScanState] = useState({ active: false, selectedParticipantId: null, selectedProductId: null, quantity: 1 });
  const [newProduct, setNewProduct] = useState({ nome: '', preco: '', estoque: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const loadParticipants = async () => {
    try {
      const data = await get('/usuarios/participantes', token);
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await get('/eventos', token);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadBarracas = async () => {
    try {
      const data = await get('/barracas', token);
      const mine = data.find((item) => Number(item.responsavel_id) === Number(user.id));
      setBarraca(mine || null);
      if (!mine) setStatus('Nenhuma barraca associada a este usuario.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadProducts = async (barracaId) => {
    if (!barracaId) return;
    try {
      setProducts(await get(`/produtos/barraca/${barracaId}`, token));
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadOrders = async (barracaId) => {
    if (!barracaId) return;
    try {
      setOrders(await get(`/pedidos/barraca/${barracaId}`, token));
    } catch (err) {
      setStatus(err.message);
    }
  };

  const activeEvent = useMemo(
    () => events.find((ev) => Number(ev.id) === Number(barraca?.evento_id)),
    [events, barraca?.evento_id]
  );

  const filteredParticipants = useMemo(
    () => participants.filter((participant) => Number(participant.evento_id) === Number(barraca?.evento_id)),
    [participants, barraca?.evento_id]
  );

  useEffect(() => {
    if (!token || !user) return;

    const loadAll = async () => {
      setDataLoading(true);
      setStatus('');
      await Promise.all([loadParticipants(), loadEvents(), loadBarracas()]);
      setDataLoading(false);
    };

    loadAll();
  }, [token, user]);

  useEffect(() => {
    if (!barraca) return;
    loadProducts(barraca.id);
    loadOrders(barraca.id);
  }, [barraca]);

  useEffect(() => {
    if (filteredParticipants.length > 0 && !selectedParticipantId) {
      setSelectedParticipantId(filteredParticipants[0].id);
    }
    if (filteredParticipants.length > 0 && !scanState.selectedParticipantId) {
      setScanState((prev) => ({ ...prev, selectedParticipantId: filteredParticipants[0].id }));
    }
  }, [filteredParticipants, selectedParticipantId, scanState.selectedParticipantId]);

  const confirmSale = async (payload) => {
    if (!barraca) return setStatus('Nenhuma barraca associada.');
    setLoading(true);
    setStatus('Registrando venda...');
    try {
      await post('/pedidos', token, payload);
      setCart([]);
      setScanState({ active: false, selectedParticipantId: null, selectedProductId: null, quantity: 1 });
      setStatus('Venda registrada com sucesso. Estoque atualizado.');
      await loadOrders(barraca.id);
      await loadProducts(barraca.id);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeOrderStatus = async (orderId, nextStatus) => {
    if (!barraca) return setStatus('Nenhuma barraca associada.');
    setLoading(true);
    setStatus('Atualizando status do pedido...');
    try {
      await put(`/pedidos/${orderId}/status`, token, { status: nextStatus });
      await loadOrders(barraca.id);
      const message = nextStatus === 'em preparo'
        ? `Pedido #${orderId} aceito e em preparo.`
        : nextStatus === 'pronto'
          ? `Pedido #${orderId} pronto para retirada.`
          : nextStatus === 'entregue'
            ? `Pedido #${orderId} marcado como entregue.`
            : `Pedido #${orderId} atualizado para ${nextStatus}.`;
      setStatus(message);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    if (!barraca) return setStatus('Nenhuma barraca associada.');
    if (!newProduct.nome || !newProduct.preco || !newProduct.estoque) return setStatus('Preencha nome, preco e estoque.');
    setLoading(true);
    try {
      await post('/produtos', token, {
        barraca_id: barraca.id,
        nome: newProduct.nome,
        preco: Number(newProduct.preco),
        estoque: Number(newProduct.estoque),
      });
      setNewProduct({ nome: '', preco: '', estoque: '' });
      setStatus('Produto cadastrado com sucesso.');
      await loadProducts(barraca.id);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (product, estoque) => {
    setLoading(true);
    try {
      await put(`/produtos/atualizar/${product.id}`, token, {
        nome: product.nome,
        preco: Number(product.preco),
        estoque: Number(estoque),
      });
      setStatus(estoque > 0 ? `${product.nome} atualizado para ${estoque} unidade(s).` : `${product.nome} esgotado e oculto das vendas.`);
      await loadProducts(barraca.id);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { icon: 'Q', label: 'Ler QR' },
    { icon: 'V', label: 'Pedidos' },
    { icon: '$', label: 'Vendas' },
    { icon: 'M', label: 'Cardapio' },
    { icon: 'E', label: 'Estoque' },
  ];

  const screens = [
    <B_LerQR key="ler" participants={filteredParticipants} products={products} scanState={scanState} setScanState={setScanState} onConfirmSale={confirmSale} status={status} setStatus={setStatus} loading={loading} />,
    <B_RegistrarVenda key="registrar" orders={orders} onChangeOrderStatus={changeOrderStatus} status={status} setStatus={setStatus} loading={loading} />,
    <B_VendasDia key="vendas" orders={orders} />,
    <B_Cardapio key="cardapio" products={products} newProduct={newProduct} setNewProduct={setNewProduct} addProduct={saveProduct} loading={loading} status={status} />,
    <B_Estoque key="estoque" products={products} onUpdateStock={updateStock} loading={loading} status={status} />,
  ];
  const titles = ['Ler QR Code', 'Pedidos', 'Vendas do dia', 'Meu cardapio', 'Estoque'];

  return (
    <Phone
      color={BM}
      textColor={BL}
      title={titles[tab]}
      subtitle={activeEvent ? `Evento: ${activeEvent.nome}` : subtitle}
      onBack={onBack}
      topContent={
        activeEvent ? (
          <div style={{ padding: '12px 16px', background: '#eff6ff', marginBottom: 10, borderRadius: 18, color: '#1d4ed8', fontWeight: 700 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>Evento Selecionado</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
              <span>🎪</span>
              <strong>{activeEvent.nome}</strong>
            </div>
          </div>
        ) : null
      }
    >
      {barraca ? screens[tab] : (
        <div className="screen-body">
          <div className="card">
            <p className="card-title">Nenhuma barraca associada</p>
            <div className="empty-state">O seu usuario ainda nao esta vinculado a uma barraca. Entre em contato com o organizador ou verifique o cadastro.</div>
          </div>
        </div>
      )}
      <NavBar items={navItems} active={tab} onSelect={setTab} activeColor={BA} />
    </Phone>
  );
}
