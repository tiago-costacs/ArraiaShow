import { TAXA_ORGANIZADOR } from './constants.js';

export const asArray = (value) => Array.isArray(value) ? value : [];

export const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;

export const formatDate = (value) => value ? new Date(value).toLocaleDateString('pt-BR') : 'Nao informado';

export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() : '??';
};

export function ordersFromBarraca(orders, barracaId) {
  return orders.filter((order) => order.itens?.some((item) => Number(item.barraca_id) === Number(barracaId)));
}

export function barracaMetrics(barraca, orders, products) {
  const relatedOrders = ordersFromBarraca(orders, barraca.id);
  const itens = relatedOrders.flatMap((order) => order.itens || []).filter((item) => Number(item.barraca_id) === Number(barraca.id));
  const receita = itens.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  const itensVendidos = itens.reduce((sum, item) => sum + Number(item.quantidade || 0), 0);
  const lucro = receita * TAXA_ORGANIZADOR;
  const repasse = receita - lucro;
  const estoque = products.filter((product) => Number(product.barraca_id) === Number(barraca.id));
  const estoqueBaixo = estoque.filter((product) => Number(product.estoque || 0) > 0 && Number(product.estoque || 0) <= 5).length;
  const esgotados = estoque.filter((product) => Number(product.estoque || 0) <= 0).length;

  return { relatedOrders, itensVendidos, receita, lucro, repasse, estoque, estoqueBaixo, esgotados };
}
