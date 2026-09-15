import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { conversationAPI } from '../../../api/conversations';
import api from '../../../api/axios';
import {
  Package, Truck, CheckCircle2, Clock, MapPin, Phone, User,
  Search, AlertCircle, ShoppingBag, Send, Bike, ChevronRight,
  ChevronLeft, RotateCcw, X, Check, Smartphone, Monitor,
  LayoutGrid, List, Store, Sparkles
} from 'lucide-react';

// ─── Pathway Steps Definition ──────────────────────────────────────────────────
const STEPS = {
  delivery: [
    { key: 'paid', label: 'Paid', sub: 'Payment received' },
    { key: 'packed', label: 'Prepared', sub: 'Packed and ready' },
    { key: 'on_way', label: 'On the way', sub: 'Rider is delivering' },
    { key: 'delivered', label: 'Delivered', sub: 'Order complete' }
  ],
  pickup: [
    { key: 'paid', label: 'Paid', sub: 'Payment received' },
    { key: 'packed', label: 'Prepared', sub: 'Packed and ready' },
    { key: 'ready', label: 'Ready', sub: 'Customer can collect' },
    { key: 'collected', label: 'Picked up', sub: 'Order complete' }
  ]
};

// ─── Format 2-Sentence Context Helper ─────────────────────────────────────────
function formatTwoSentenceSummary(rawText) {
  if (!rawText || !rawText.trim()) return '';
  // Strip raw transcripts and tags appended like [Customer]: ..., [Kasi AI]: ..., 🚨
  let clean = rawText
    .replace(/\[Customer\]:.*$/s, '')
    .replace(/\[Kasi AI\]:.*$/s, '')
    .replace(/\[Merchant\]:.*$/s, '')
    .replace(/🚨/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  if (!clean) {
    clean = rawText.replace(/\[(Customer|Kasi AI|Merchant|Agent)\]:\s*/gi, ' ').trim();
  }

  // Extract at most the first two clear sentences
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  const twoSentences = sentences.slice(0, 2).map(s => s.trim()).join(' ');
  return twoSentences || clean;
}

// Map backend conversation/invoice status to prototype state
function mapToState(status, deliveryMode) {
  const s = (status || '').toLowerCase().trim();
  const isPickup = deliveryMode === 'PICKUP';

  if (s === 'delivered' || s === 'collected' || s === 'completed') {
    return isPickup ? 'collected' : 'delivered';
  }
  if (s === 'in transit' || s === 'on_way' || s === 'dispatched') {
    return 'on_way';
  }
  if (s === 'ready' || s === 'ready for pickup') {
    return 'ready';
  }
  if (s === 'packed' || s === 'prepared') {
    return 'packed';
  }
  if (s === 'paid') {
    return 'paid';
  }
  return 'unconfirmed';
}

function getStepIndex(order) {
  const steps = STEPS[order.delivery_type] || STEPS.delivery;
  const keys = steps.map(s => s.key);
  const idx = keys.indexOf(order.state);
  return idx >= 0 ? idx : 0;
}

function isOrderDone(order) {
  return order.state === 'delivered' || order.state === 'collected';
}

function formatMoney(n) {
  return '₦' + (n || 0).toLocaleString();
}

function getDestination(order) {
  if (order.delivery_type === 'pickup') {
    return 'Store pickup';
  }
  return order.delivery_address || 'Customer location';
}

function getPhaseInfo(order) {
  if (order.state === 'unconfirmed') {
    return { cls: 'new', label: 'Needs confirmation', dotCls: 'bg-amber-500' };
  }
  if (order.state === 'paid') {
    return { cls: 'new', label: 'Needs preparing', dotCls: 'bg-amber-500' };
  }
  if (order.state === 'packed') {
    return {
      cls: 'mid',
      label: order.delivery_type === 'delivery' ? 'Ready to dispatch' : 'Ready to set out',
      dotCls: 'bg-sky-500'
    };
  }
  if (order.state === 'on_way') {
    return { cls: 'mid', label: 'Out for delivery', dotCls: 'bg-sky-500' };
  }
  if (order.state === 'ready') {
    return { cls: 'mid', label: 'Waiting for pickup', dotCls: 'bg-sky-500' };
  }
  if (order.state === 'delivered') {
    return { cls: 'done', label: 'Delivered', dotCls: 'bg-[#1C774E]' };
  }
  if (order.state === 'collected') {
    return { cls: 'done', label: 'Picked up', dotCls: 'bg-[#1C774E]' };
  }
  return { cls: 'new', label: 'In Progress', dotCls: 'bg-gray-400' };
}

function getNowText(order) {
  switch (order.state) {
    case 'unconfirmed':
      return 'Verify payment with the customer, then tap the button.';
    case 'paid':
      return 'Prepare this order, then tap the button.';
    case 'packed':
      return order.delivery_type === 'delivery'
        ? 'Book a rider to send this order.'
        : 'Set order aside, then mark it ready for pickup.';
    case 'on_way':
      return 'When the rider delivers, mark it delivered.';
    case 'ready':
      return 'When the customer collects, mark it picked up.';
    case 'delivered':
    case 'collected':
      return 'This order is complete.';
    default:
      return 'Manage this order.';
  }
}

export default function Fulfilment() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('todo'); // 'all', 'todo', 'delivery', 'pickup', 'done'
  const [selectedId, setSelectedId] = useState(null);

  // Mobile specific view states
  const [mobileFilter, setMobileFilter] = useState('todo');
  const [mobileViewMode, setMobileViewMode] = useState('cards'); // 'cards' | 'list'
  const [mobileFlowOpen, setMobileFlowOpen] = useState(false);

  // Rider modal
  const [riderModalOrder, setRiderModalOrder] = useState(null);
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  // In-app WhatsApp banner toast
  const [waToast, setWaToast] = useState({ show: false, name: '', msg: '' });

  const showWaToast = (name, msg) => {
    const firstName = (name || 'Customer').split(' ')[0];
    setWaToast({ show: true, name: firstName, msg });
    setTimeout(() => {
      setWaToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // ─── Fetch Orders from Backend ──────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const [convRes, invRes] = await Promise.all([
        conversationAPI.getConversations().catch(() => ({ data: [] })),
        api.get('/api/invoices/').catch(() => ({ data: [] }))
      ]);

      const conversations = convRes.data || [];
      const invoices = invRes.data || [];

      // Filter and harmonize orders
      const normalizedOrders = conversations
        .filter(c => ['Requires Attention', 'In Progress', 'Paid', 'Packed', 'Ready for Pickup', 'Ready', 'In Transit', 'Delivered', 'Collected'].includes(c.status))
        .map(c => {
          const normalizePhone = (p) => (p ? p.toString().replace(/\D/g, '') : '');
          const matchingInv = invoices.find(i =>
            (c.customer_phone && i.customer?.phone && normalizePhone(i.customer.phone) === normalizePhone(c.customer_phone)) ||
            (c.customer_name && i.customer?.name && i.customer.name.toLowerCase().trim() === c.customer_name.toLowerCase().trim())
          );

          const deliveryMode = (c.delivery_address || matchingInv?.delivery_address || '').toUpperCase() === 'PICKUP' ? 'PICKUP' : 'DELIVERY';
          const deliveryType = deliveryMode === 'PICKUP' ? 'pickup' : 'delivery';
          const state = mapToState(c.status, deliveryMode);

          const rawItems = matchingInv?.items || c.invoice_items || [];
          const items = rawItems.map(it => [
            it.description || it.product_name || 'Item',
            it.quantity || 1,
            it.unit_price || it.price || (it.total_price ? it.total_price / (it.quantity || 1) : 0)
          ]);

          const total = matchingInv?.total_amount || c.agreed_price || c.listed_price || 0;
          const itemsSubtotal = items.reduce((sum, item) => sum + item[1] * item[2], 0);
          const fee = total > itemsSubtotal ? total - itemsSubtotal : 0;

          return {
            id: c.id,
            displayId: matchingInv?.reference || c.invoice_reference || `KAS-${c.id}`,
            name: c.customer_name || 'Customer',
            phone: c.customer_phone || 'No phone',
            delivery_type: deliveryType,
            state: state,
            backend_status: c.status,
            delivery_address: c.delivery_address || matchingInv?.delivery_address || '',
            items: items.length > 0 ? items : [['Order agreement', 1, total]],
            fee: fee,
            total_amount: total,
            rider: (c.rider_name || matchingInv?.rider_name) ? {
              n: c.rider_name || matchingInv?.rider_name,
              p: c.rider_phone || matchingInv?.rider_phone || ''
            } : null,
            note: c.ai_summary || c.vendor_instructions || '',
            created_at: c.created_at,
            updated_at: c.updated_at
          };
        });

      setOrders(normalizedOrders);
    } catch (err) {
      console.error('Failed to fetch fulfilment orders:', err);
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── Status Advancement Handler ─────────────────────────────────────────────
  const advanceOrder = async (order, nextState, backendStatus, message, riderData = null) => {
    setUpdating(true);
    // Optimistically update order in state
    setOrders(prev =>
      prev.map(o => {
        if (o.id === order.id) {
          return {
            ...o,
            state: nextState,
            backend_status: backendStatus,
            rider: riderData ? { n: riderData.rider_name, p: riderData.rider_phone } : o.rider
          };
        }
        return o;
      })
    );

    showWaToast(order.name, message);

    try {
      const payload = { status: backendStatus };
      if (riderData) {
        payload.rider_name = riderData.rider_name;
        payload.rider_phone = riderData.rider_phone;
      }
      await conversationAPI.updateStatus(order.id, payload);
    } catch (err) {
      console.error('Failed to update status on server:', err);
      addToast('Could not sync update with server. Please refresh.', 'error');
      fetchOrders();
    } finally {
      setUpdating(false);
    }
  };

  // ─── Next Action Definition ─────────────────────────────────────────────────
  const getNextAction = (order) => {
    if (order.state === 'unconfirmed') {
      return {
        label: 'Confirm payment',
        run: () => advanceOrder(
          order,
          'paid',
          'Paid',
          'Payment confirmed! We are now processing your order.'
        )
      };
    }

    if (order.delivery_type === 'delivery') {
      if (order.state === 'paid') {
        return {
          label: 'Mark as packed',
          run: () => advanceOrder(
            order,
            'packed',
            'Packed',
            'Your order is confirmed and being prepared for delivery.'
          )
        };
      }
      if (order.state === 'packed') {
        return {
          label: 'Book rider',
          run: () => {
            setRiderModalOrder(order);
            setRiderName(order.rider?.n || '');
            setRiderPhone(order.rider?.p || '');
          }
        };
      }
      if (order.state === 'on_way') {
        return {
          label: 'Mark as delivered',
          run: () => advanceOrder(
            order,
            'delivered',
            'Delivered',
            'Your order has been delivered. Thank you!'
          )
        };
      }
    } else {
      // Pickup
      if (order.state === 'paid') {
        return {
          label: 'Mark as packed',
          run: () => advanceOrder(
            order,
            'packed',
            'Packed',
            'Your order is packed and set aside.'
          )
        };
      }
      if (order.state === 'packed') {
        return {
          label: 'Mark as ready for pickup',
          run: () => advanceOrder(
            order,
            'ready',
            'Ready for Pickup',
            `Your order is ready! Come collect at our store. Ref: ${order.displayId}`
          )
        };
      }
      if (order.state === 'ready') {
        return {
          label: 'Mark as picked up',
          run: () => advanceOrder(
            order,
            'collected',
            'Delivered',
            'Thanks for picking up your order!'
          )
        };
      }
    }
    return null;
  };

  // ─── Filter Logic ───────────────────────────────────────────────────────────
  const matchFilter = (order, f) => {
    if (f === 'all') return true;
    if (f === 'todo') return !isOrderDone(order);
    if (f === 'done') return isOrderDone(order);
    if (f === 'delivery') return order.delivery_type === 'delivery';
    if (f === 'pickup') return order.delivery_type === 'pickup';
    return true;
  };

  const applySearch = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.displayId.toLowerCase().includes(q) ||
      o.items.some(i => i[0].toLowerCase().includes(q))
    );
  };

  const filteredDesktopOrders = applySearch(orders.filter(o => matchFilter(o, filter)));
  const filteredMobileOrders = applySearch(orders.filter(o => matchFilter(o, mobileFilter)));

  const todoCount = orders.filter(o => matchFilter(o, 'todo')).length;
  const allCount = orders.length;
  const deliveryCount = orders.filter(o => matchFilter(o, 'delivery')).length;
  const pickupCount = orders.filter(o => matchFilter(o, 'pickup')).length;
  const doneCount = orders.filter(o => matchFilter(o, 'done')).length;

  const selectedOrder = orders.find(o => o.id === selectedId) || null;

  // Handler for rider confirmation modal
  const handleConfirmRider = () => {
    if (!riderModalOrder) return;
    const name = riderName.trim() || 'Rider';
    const phone = riderPhone.trim() || '—';

    advanceOrder(
      riderModalOrder,
      'on_way',
      'In Transit',
      `Your order is on the way! Rider: ${name} (${phone}).`,
      { rider_name: name, rider_phone: phone }
    );
    setRiderModalOrder(null);
    setRiderName('');
    setRiderPhone('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-[#16211b] dark:text-gray-100">
      
      {/* ─── Top Bar with View Mode and Refresh ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1C774E] text-[#DBF361] flex items-center justify-center font-bold shadow-xs">
              <Truck size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Orders & Fulfilment
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {todoCount > 0 ? `${todoCount} order${todoCount > 1 ? 's' : ''} require action` : 'All caught up'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ─── DESKTOP VIEW ───────────────────────────────────────────────────── */}
      <div className="hidden md:block relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/90 dark:border-gray-800 shadow-sm overflow-hidden">
        
        {/* Desktop Header & Search */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900 dark:text-white">Active Pipeline</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1C774E]/10 text-[#1C774E] dark:bg-[#1C774E]/20 dark:text-[#DBF361]">
              {todoCount} to do
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search customer, order ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1C774E]/20 focus:border-[#1C774E] outline-none transition-all dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Desktop Filter Chips */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: allCount },
            { key: 'todo', label: 'To do', count: todoCount },
            { key: 'delivery', label: 'Delivery', count: deliveryCount },
            { key: 'pickup', label: 'Pickup', count: pickupCount },
            { key: 'done', label: 'Done', count: doneCount }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'bg-[#1C774E] text-white shadow-2xs font-bold'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] ${filter === tab.key ? 'text-white/80' : 'text-gray-400'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto min-h-[420px]">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-[#1C774E] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading orders…</p>
            </div>
          ) : filteredDesktopOrders.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <ShoppingBag size={38} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="font-semibold text-sm text-gray-600 dark:text-gray-300">Nothing here right now</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search query.' : 'Orders will appear here as customers buy.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-3">Order ID</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Items</th>
                  <th className="py-3.5 px-3">Total</th>
                  <th className="py-3.5 px-3">Destination</th>
                  <th className="py-3.5 px-3">Phase</th>
                  <th className="py-3.5 px-4 text-right">Next action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredDesktopOrders.map(order => {
                  const phase = getPhaseInfo(order);
                  const nextAction = getNextAction(order);
                  const isSelected = selectedId === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#1C774E]/5 dark:bg-[#1C774E]/10 border-l-4 border-l-[#1C774E]'
                          : 'hover:bg-gray-50/70 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">{order.name}</div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{order.phone}</div>
                      </td>

                      {/* Order ID */}
                      <td className="py-3.5 px-3 font-mono text-gray-500 dark:text-gray-400">
                        {order.displayId}
                      </td>

                      {/* Type Badge - Clean Lucide SVG icons, NO emojis */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {order.delivery_type === 'delivery' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#1C774E] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                            <Truck size={12} className="shrink-0 text-[#1C774E]" />
                            Delivery
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                            <ShoppingBag size={12} className="shrink-0 text-amber-600" />
                            Pickup
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3 max-w-[200px] truncate text-gray-700 dark:text-gray-300" title={order.items.map(i => `${i[0]} ×${i[1]}`).join(', ')}>
                        {order.items.map(i => `${i[0]} ×${i[1]}`).join(', ')}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatMoney(order.total_amount)}
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-3 max-w-[150px] truncate text-gray-500 dark:text-gray-400" title={getDestination(order)}>
                        {getDestination(order)}
                      </td>

                      {/* Phase */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            phase.cls === 'new'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50'
                              : phase.cls === 'mid'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/50'
                              : 'bg-emerald-50 text-[#1C774E] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${phase.dotCls}`} />
                          {phase.label}
                        </span>
                      </td>

                      {/* Next Action Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {nextAction ? (
                          <button
                            onClick={nextAction.run}
                            disabled={updating}
                            className="px-3.5 py-1.5 bg-[#1C774E] hover:bg-[#15603A] text-white rounded-xl font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            {nextAction.label}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-semibold text-xs border border-gray-200/70 dark:border-gray-700">
                            Completed <Check size={12} strokeWidth={3} className="text-[#1C774E]" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Desktop Slide-Over Detail Panel */}
        {selectedOrder && (
          <>
            {/* Scrim */}
            <div
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-40 transition-opacity"
            />

            {/* Slide-out Drawer */}
            <div className="fixed top-0 right-0 h-full w-[430px] max-w-[95vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 rounded-l-3xl shadow-2xl z-50 overflow-y-auto p-6 sm:p-7 space-y-5 animate-in slide-in-from-right duration-200">
              {/* Top Drawer Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedOrder.name}
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">
                    {selectedOrder.displayId} · {selectedOrder.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOrder.delivery_type === 'delivery' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#1C774E] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60">
                      <Truck size={12} /> Delivery
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60">
                      <ShoppingBag size={12} /> Pickup
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedId(null)}
                    className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Now Banner */}
              {!isOrderDone(selectedOrder) && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl text-xs text-[#1C774E] dark:text-emerald-300 flex items-start gap-2.5 shadow-2xs">
                  <Clock size={15} className="shrink-0 mt-0.5 text-[#1C774E]" />
                  <div className="leading-relaxed">
                    <span className="font-bold mr-1.5">Now:</span>
                    <span>{getNowText(selectedOrder)}</span>
                  </div>
                </div>
              )}

              {/* Horizontal Stepper */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Pathway Progress
                </p>
                <div className="relative flex justify-between items-center py-2">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
                  {(STEPS[selectedOrder.delivery_type] || STEPS.delivery).map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isDone
                              ? 'bg-[#1C774E] text-white'
                              : isCurrent
                              ? 'bg-white dark:bg-gray-900 border-2 border-[#1C774E] text-[#1C774E] ring-4 ring-[#1C774E]/15'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {isDone ? <Check size={11} strokeWidth={3} /> : isCurrent ? <span className="w-2 h-2 rounded-full bg-[#1C774E]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-1.5 whitespace-nowrap ${
                            isCurrent || isDone ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Big CTA Button */}
              {(() => {
                const action = getNextAction(selectedOrder);
                return (
                  <div>
                    {action ? (
                      <button
                        onClick={action.run}
                        disabled={updating}
                        className="w-full py-3 bg-[#1C774E] hover:bg-[#15603A] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                      >
                        {action.label}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl font-bold text-sm cursor-default flex items-center justify-center gap-1.5"
                      >
                        Order complete <Check size={14} strokeWidth={3} />
                      </button>
                    )}
                    {action && (
                      <p className="text-center text-[11px] text-gray-400 mt-1.5">
                        This sends a WhatsApp update to {selectedOrder.name.split(' ')[0]}.
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Order Items Breakdown */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Order Items
                </h3>
                <div className="space-y-1.5 divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="pt-1.5 first:pt-0 flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item[0]} <span className="text-gray-400">×{item[1]}</span>
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatMoney(item[1] * item[2])}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery fee</span>
                    <span>{selectedOrder.fee ? formatMoney(selectedOrder.fee) : '—'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-1">
                    <span>Total paid</span>
                    <span>{formatMoney(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Destination & Logistics */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {selectedOrder.delivery_type === 'delivery' ? 'Deliver to' : 'Pickup at'}
                </h3>
                <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {getDestination(selectedOrder)}
                </div>

                {selectedOrder.delivery_type === 'delivery' && (
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Assigned Rider
                    </p>
                    {selectedOrder.rider ? (
                      <div className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <Bike size={16} className="text-[#1C774E]" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.rider.n}</p>
                            <p className="text-gray-500">{selectedOrder.rider.p}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Not booked yet. Use “Book rider” button.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Note / Context - Summarized in 2 Sentences */}
              {selectedOrder.note && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Customer Note / Context
                  </h3>
                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 rounded-2xl text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                    “{formatTwoSentenceSummary(selectedOrder.note)}”
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ─── MOBILE VIEW ────────────────────────────────────────────────────── */}
      <div className="block md:hidden">
        
        {/* Main List Screen */}
        <div className={`space-y-3 ${mobileFlowOpen ? 'hidden' : 'block'}`}>
          {/* Mobile Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/90 p-1.5 rounded-2xl border border-gray-200/70 dark:border-gray-700/60">
            {[
              { key: 'todo', label: 'To do', count: todoCount },
              { key: 'all', label: 'All', count: allCount },
              { key: 'done', label: 'Done', count: doneCount }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setMobileFilter(tab.key)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer ${
                  mobileFilter === tab.key
                    ? 'bg-[#1C774E] text-white shadow-2xs font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                {tab.label} <span className="text-[11px] opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Cards vs List View Switch with Lucide Icons (NO EMOJIS) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileViewMode('cards')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mobileViewMode === 'cards'
                  ? 'bg-[#1C774E]/10 border-[#1C774E] text-[#1C774E] dark:text-[#DBF361] font-bold'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <LayoutGrid size={13} />
              Cards
            </button>
            <button
              onClick={() => setMobileViewMode('list')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mobileViewMode === 'list'
                  ? 'bg-[#1C774E]/10 border-[#1C774E] text-[#1C774E] dark:text-[#DBF361] font-bold'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <List size={13} />
              List
            </button>
          </div>

          {/* Mobile Orders List */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-gray-400">
              <div className="w-7 h-7 border-2 border-[#1C774E] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading orders…</p>
            </div>
          ) : filteredMobileOrders.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 text-gray-400">
              <ShoppingBag size={34} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="font-semibold text-xs text-gray-600 dark:text-gray-300">Nothing here right now</p>
            </div>
          ) : mobileViewMode === 'list' ? (
            /* Compact List View */
            <div className="space-y-2">
              {filteredMobileOrders.map(order => {
                const phase = getPhaseInfo(order);

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id);
                      setMobileFlowOpen(true);
                    }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-gray-300 active:bg-gray-50 dark:active:bg-gray-700 transition-all cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                          {order.name}
                        </span>
                        {order.delivery_type === 'delivery' ? (
                          <Truck size={12} className="text-gray-400 shrink-0" />
                        ) : (
                          <ShoppingBag size={12} className="text-gray-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5 font-mono">
                        {order.displayId} · {order.phone}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {order.items.map(i => `${i[0]} ×${i[1]}`).join(', ')}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm text-gray-900 dark:text-white">
                        {formatMoney(order.total_amount)}
                      </div>
                      <div className={`text-[10px] font-semibold mt-0.5 ${
                        phase.cls === 'new' ? 'text-amber-600 dark:text-amber-400' : phase.cls === 'mid' ? 'text-sky-600 dark:text-sky-400' : 'text-[#1C774E] dark:text-[#DBF361]'
                      }`}>
                        {phase.label}
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            /* Cards View */
            <div className="space-y-3">
              {filteredMobileOrders.map(order => {
                const phase = getPhaseInfo(order);
                const nextAction = getNextAction(order);

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id);
                      setMobileFlowOpen(true);
                    }}
                    className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-4 shadow-xs space-y-3 cursor-pointer"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">
                          {order.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {order.displayId} · {order.phone}
                        </p>
                      </div>
                      {order.delivery_type === 'delivery' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#1C774E] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60">
                          <Truck size={12} /> Delivery
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60">
                          <ShoppingBag size={12} /> Pickup
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className={`w-2 h-2 rounded-full ${phase.dotCls}`} />
                      <span className={
                        phase.cls === 'new' ? 'text-amber-700 dark:text-amber-400' : phase.cls === 'mid' ? 'text-sky-700 dark:text-sky-400' : 'text-[#1C774E] dark:text-[#DBF361]'
                      }>
                        {phase.label}
                      </span>
                    </div>

                    {/* Items & Amount */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">
                        {order.items.map(i => `${i[0]} ×${i[1]}`).join(', ')}
                      </span>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {formatMoney(order.total_amount)}
                      </span>
                    </div>

                    {/* Next Action Button */}
                    <div onClick={(e) => e.stopPropagation()}>
                      {nextAction ? (
                        <button
                          onClick={nextAction.run}
                          disabled={updating}
                          className="w-full py-2.5 bg-[#1C774E] hover:bg-[#15603A] text-white rounded-xl font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          {nextAction.label}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl font-semibold text-xs cursor-default flex items-center justify-center gap-1"
                        >
                          Completed <Check size={12} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Full Flow Sub-Screen (Mobile) */}
        {mobileFlowOpen && selectedOrder && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden space-y-4 animate-in fade-in zoom-in-95 duration-150 shadow-sm">
            {/* Mobile Header with Back */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <button
                onClick={() => setMobileFlowOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-base text-gray-900 dark:text-white truncate">
                  {selectedOrder.name}
                </h2>
                <p className="text-xs font-mono text-gray-400">
                  {selectedOrder.displayId} · {selectedOrder.phone}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium">
                {selectedOrder.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-5">
              {/* Now Banner */}
              {!isOrderDone(selectedOrder) && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl text-xs text-[#1C774E] dark:text-emerald-300 flex items-start gap-2.5">
                  <Clock size={15} className="shrink-0 mt-0.5 text-[#1C774E]" />
                  <div className="leading-relaxed">
                    <span className="font-bold mr-1.5">Now:</span>
                    <span>{getNowText(selectedOrder)}</span>
                  </div>
                </div>
              )}

              {/* Vertical Stepper */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Pathway Progress
                </p>
                <div className="relative pl-7 space-y-4">
                  {/* Vertical connecting line */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  
                  {(STEPS[selectedOrder.delivery_type] || STEPS.delivery).map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    let sub = step.sub;
                    if (step.key === 'on_way' && selectedOrder.rider) {
                      sub = `Rider: ${selectedOrder.rider.n} · ${selectedOrder.rider.p}`;
                    }

                    return (
                      <div key={step.key} className="relative">
                        <div
                          className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone
                              ? 'bg-[#1C774E] text-white'
                              : isCurrent
                              ? 'bg-white dark:bg-gray-900 border-2 border-[#1C774E] text-[#1C774E] ring-3 ring-[#1C774E]/20'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {isDone ? <Check size={10} strokeWidth={3} /> : isCurrent ? '•' : ''}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${
                            isCurrent || isDone ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Card */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Purchased Items
                </p>
                <div className="space-y-1.5 divide-y divide-gray-100 dark:divide-gray-700/60">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="pt-1.5 first:pt-0 flex justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item[0]} <span className="text-gray-400">×{item[1]}</span>
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatMoney(item[1] * item[2])}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-200/70 dark:border-gray-700 flex justify-between font-bold text-sm text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatMoney(selectedOrder.total_amount)}</span>
                </div>
              </div>

              {/* Destination */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1 text-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {selectedOrder.delivery_type === 'delivery' ? 'Deliver to' : 'Pickup at'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {getDestination(selectedOrder)}
                </p>
              </div>

              {/* Note / Context (2-sentence formatted) */}
              {selectedOrder.note && (
                <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 rounded-2xl text-xs text-amber-950 dark:text-amber-200 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Customer Context
                  </p>
                  <p className="leading-relaxed font-medium">
                    “{formatTwoSentenceSummary(selectedOrder.note)}”
                  </p>
                </div>
              )}

              {/* Action Button at bottom */}
              {(() => {
                const action = getNextAction(selectedOrder);
                return (
                  <div className="pt-2">
                    {action ? (
                      <button
                        onClick={action.run}
                        disabled={updating}
                        className="w-full py-3 bg-[#1C774E] hover:bg-[#15603A] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                      >
                        {action.label}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl font-bold text-sm cursor-default flex items-center justify-center gap-1.5"
                      >
                        Order complete <Check size={14} strokeWidth={3} />
                      </button>
                    )}
                    {action && (
                      <p className="text-center text-[11px] text-gray-400 mt-1.5">
                        This sends a WhatsApp update to {selectedOrder.name.split(' ')[0]}.
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ─── BOOK A RIDER MODAL - Enhanced border radius & soft elevation ──── */}
      {riderModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => e.target === e.currentTarget && setRiderModalOrder(null)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-7 space-y-4 border border-gray-100 dark:border-gray-700/80 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Book a rider
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Enter rider details. Kasi sends them to {riderModalOrder.name.split(' ')[0]} on WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setRiderModalOrder(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Rider's name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Musa or Samuel"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-[#1C774E] focus:ring-2 focus:ring-[#1C774E]/20 transition-all text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Rider's phone number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0803 000 0000"
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-[#1C774E] focus:ring-2 focus:ring-[#1C774E]/20 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setRiderModalOrder(null)}
                className="flex-none px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRider}
                disabled={updating}
                className="flex-1 px-4 py-2.5 bg-[#1C774E] hover:bg-[#15603A] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Truck size={14} />
                Send order with rider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING WHATSAPP UPDATE TOAST ─────────────────────────────────── */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-[#16211b] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-md w-[92vw] sm:w-auto transition-all duration-300 pointer-events-none ${
          waToast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-black shrink-0">
          <Check size={12} strokeWidth={3} />
        </span>
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-[#cdebd7]">WhatsApp sent to {waToast.name}: </span>
          <span>{waToast.msg}</span>
        </div>
      </div>

    </div>
  );
}
