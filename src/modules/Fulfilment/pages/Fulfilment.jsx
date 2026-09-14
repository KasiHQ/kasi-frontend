import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { conversationAPI } from '../../../api/conversations';
import api from '../../../api/axios';
import {
  Package, Truck, CheckCircle2, Clock, MapPin, Phone, User,
  Search, AlertCircle, ShoppingBag, Send, Bike, ChevronRight,
  RotateCcw, X
} from 'lucide-react';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  attention: {
    label: 'Needs Attention',
    color: 'amber',
    borderClass: 'border-l-amber-500',
    bgClass: 'bg-amber-50/60 dark:bg-amber-950/20',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    stepperActive: 'bg-amber-500 text-white',
    stepperBar: 'bg-amber-500',
  },
  paid: {
    label: 'Ready to Dispatch',
    color: 'primary',
    borderClass: 'border-l-primary',
    bgClass: 'bg-primary/5 dark:bg-primary/10',
    badgeBg: 'bg-primary/10 text-primary',
    dot: 'bg-primary',
    stepperActive: 'bg-primary text-white',
    stepperBar: 'bg-primary',
  },
  transit: {
    label: 'Out for Delivery',
    color: 'blue',
    borderClass: 'border-l-blue-500',
    bgClass: 'bg-blue-50/60 dark:bg-blue-950/20',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    stepperActive: 'bg-blue-500 text-white',
    stepperBar: 'bg-blue-500',
  },
  delivered: {
    label: 'Completed',
    color: 'gray',
    borderClass: 'border-l-gray-300 dark:border-l-gray-600',
    bgClass: 'bg-gray-50/50 dark:bg-gray-800/50',
    badgeBg: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
    dot: 'bg-gray-400',
    stepperActive: 'bg-gray-400 text-white',
    stepperBar: 'bg-gray-300 dark:bg-gray-600',
  },
};

const getStatusGroup = (status) => {
  if (status === 'Delivered') return 'delivered';
  if (status === 'In Transit') return 'transit';
  if (status === 'Paid') return 'paid';
  return 'attention'; // Requires Attention, In Progress, etc.
};

const pathwaySteps = [
  { id: 'placed', label: 'Placed' },
  { id: 'paid', label: 'Payment' },
  { id: 'transit', label: 'Dispatched' },
  { id: 'delivered', label: 'Complete' },
];

const getPathwayIndex = (status) => {
  if (status === 'Delivered') return 3;
  if (status === 'In Transit') return 2;
  if (status === 'Paid') return 1;
  return 0;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function waitingLabel(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Waiting < 1m';
  if (mins < 60) return `Waiting ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Waiting ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Waiting ${days}d`;
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, count, variant, pulse }) {
  const cfg = STATUS_CONFIG[variant] || STATUS_CONFIG.attention;
  const isDominant = variant === 'attention';
  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-300 overflow-hidden
        ${isDominant
          ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-200/40 dark:shadow-amber-900/30'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-xs'
        }`}
    >
      {/* Subtle pulse ring for attention when count > 0 */}
      {pulse && count > 0 && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white/90" />
        </span>
      )}

      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2
        ${isDominant ? 'text-amber-100' : 'text-gray-400 dark:text-gray-500'}`}>
        {label}
      </p>
      <p className={`text-3xl font-black tracking-tight
        ${isDominant
          ? 'text-white'
          : variant === 'paid' ? 'text-primary'
          : variant === 'transit' ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-400 dark:text-gray-500'
        }`}>
        {count}
      </p>
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
function OrderStepper({ status, group }) {
  const cfg = STATUS_CONFIG[group];
  const currentIdx = getPathwayIndex(status);
  return (
    <div className="relative flex items-center justify-between py-1">
      {/* track */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 dark:bg-gray-700" />
      {/* fill */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 transition-all duration-700 ease-out ${cfg.stepperBar}`}
        style={{ width: `${(currentIdx / 3) * 100}%` }}
      />
      {pathwaySteps.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300
                ${done ? cfg.stepperActive : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}
                ${active ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 ' + (group === 'attention' ? 'ring-amber-400' : group === 'paid' ? 'ring-primary/50' : group === 'transit' ? 'ring-blue-400' : 'ring-gray-300') : ''}
              `}
            >
              {done ? <CheckCircle2 size={13} /> : idx + 1}
            </div>
            <span className={`text-[9px] font-bold mt-1 hidden sm:block whitespace-nowrap
              ${done ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Full Order Card (Attention + Paid) ───────────────────────────────────────
function FullOrderCard({ order, group, onConfirmPayment, onAssignRider, onMarkDelivered, updating }) {
  const cfg = STATUS_CONFIG[group];
  const waiting = group === 'attention' ? waitingLabel(order.updated_at || order.created_at) : null;

  return (
    <div className={`rounded-2xl border border-l-4 ${cfg.borderClass} ${cfg.bgClass}
      border-gray-100 dark:border-gray-700/60 overflow-hidden
      shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
      {/* Top bar */}
      <div className="px-5 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100/80 dark:border-gray-700/60">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-white
            ${group === 'attention' ? 'bg-amber-500' : group === 'paid' ? 'bg-primary' : group === 'transit' ? 'bg-blue-500' : 'bg-gray-400'}`}>
            {(order.customer_name || '?')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-dark dark:text-white text-sm">{order.customer_name || 'Customer'}</h3>
              <span className="font-mono text-[10px] font-bold text-gray-400">#{order.invoice_reference}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                ${order.delivery_mode === 'PICKUP'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800'
                }`}>
                {order.delivery_mode === 'PICKUP' ? '📍 Pickup' : '🚚 Delivery'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs text-gray-400">{order.customer_phone || 'No phone'}</p>
              {waiting && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 animate-pulse">
                  ⏱ {waiting}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Value</p>
          <p className="text-lg font-black text-dark dark:text-white">₦{(order.total_amount || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Stepper */}
        <OrderStepper status={order.status} group={group} />

        {/* Items + logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white/70 dark:bg-gray-900/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-xs space-y-1.5">
            <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">Purchased Items</p>
            {order.invoice_items && order.invoice_items.length > 0 ? (
              order.invoice_items.map((it, idx) => (
                <div key={idx} className="flex justify-between font-medium text-gray-700 dark:text-gray-300">
                  <span>{it.quantity}× {it.description}</span>
                  <span className="font-bold">₦{(it.total_price || (it.unit_price * it.quantity) || 0).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Sales agreement order</p>
            )}
          </div>

          <div className="bg-white/70 dark:bg-gray-900/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-xs flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">Logistics</p>
              {order.rider_name ? (
                <p className="font-semibold text-dark dark:text-white">
                  🚚 <strong className="text-primary">{order.rider_name}</strong>
                  {order.rider_phone ? ` · ${order.rider_phone}` : ''}
                </p>
              ) : (
                <p className="text-gray-400">No rider assigned</p>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-3 flex gap-2 justify-end">
              {group === 'attention' && (
                <button
                  onClick={() => onConfirmPayment(order.id)}
                  disabled={updating}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm shadow-amber-200 dark:shadow-amber-900/40 cursor-pointer"
                >
                  ✓ Confirm Payment
                </button>
              )}
              {group === 'paid' && (
                <button
                  onClick={() => onAssignRider(order)}
                  disabled={updating}
                  className="px-4 py-2 bg-primary hover:bg-green-700 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm shadow-green-200 dark:shadow-green-900/40 cursor-pointer"
                >
                  🚀 Dispatch Rider
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slim Transit Card ─────────────────────────────────────────────────────────
function SlimTransitCard({ order, onMarkDelivered, updating }) {
  const cfg = STATUS_CONFIG.transit;
  return (
    <div className={`rounded-xl border border-l-4 ${cfg.borderClass} ${cfg.bgClass}
      border-gray-100 dark:border-gray-700/60
      px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3
      shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-xs text-white shrink-0">
          {(order.customer_name || '?')[0].toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm text-dark dark:text-white">{order.customer_name || 'Customer'}</p>
            <span className="font-mono text-[10px] text-gray-400">#{order.invoice_reference}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {order.rider_name && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">🚚 {order.rider_name}</span>
            )}
            <span className="text-[10px] text-gray-400">{timeAgo(order.updated_at)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <p className="font-black text-sm text-dark dark:text-white">₦{(order.total_amount || 0).toLocaleString()}</p>
        <button
          onClick={() => onMarkDelivered(order.id)}
          disabled={updating}
          className="px-3 py-1.5 bg-primary hover:bg-green-700 text-white rounded-lg font-bold text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Mark Delivered
        </button>
      </div>
    </div>
  );
}

// ─── Collapsed Completed Row ───────────────────────────────────────────────────
function CompletedRow({ order }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/60 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-gray-300">
          {(order.customer_name || '?')[0].toUpperCase()}
        </div>
        <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{order.customer_name || 'Customer'}</p>
        <span className="font-mono text-[10px] text-gray-400">#{order.invoice_reference}</span>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">₦{(order.total_amount || 0).toLocaleString()}</p>
        <CheckCircle2 size={14} className="text-gray-300 dark:text-gray-600" />
      </div>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ label, count, group }) {
  const cfg = STATUS_CONFIG[group];
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      <h2 className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">{label}</h2>
      <span className={`ml-1 text-[10px] font-black px-2 py-0.5 rounded-full ${cfg.badgeBg}`}>{count}</span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700/80" />
    </div>
  );
}

// ─── Assign Rider Modal ────────────────────────────────────────────────────────
function AssignRiderModal({ order, riderName, setRiderName, riderPhone, setRiderPhone, onClose, onDispatch, updating }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4
        animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-dark dark:text-white">Assign Rider & Dispatch</h3>
            <p className="text-xs text-gray-500 mt-0.5">Order #{order.invoice_reference} · {order.customer_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Rider Name</label>
            <input
              type="text"
              placeholder="e.g. Samuel Okon"
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
              autoFocus
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Rider Phone</label>
            <input
              type="text"
              placeholder="e.g. 08012345678"
              value={riderPhone}
              onChange={(e) => setRiderPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDispatch}
            disabled={updating}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-green-700 cursor-pointer transition-all active:scale-95 shadow-sm shadow-green-200 dark:shadow-green-900/30 disabled:opacity-50"
          >
            {updating ? 'Dispatching…' : '🚀 Dispatch Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
function Fulfilment() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Rider modal
  const [assignRiderOrder, setAssignRiderOrder] = useState(null);
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const [convRes, invRes] = await Promise.all([
        conversationAPI.getConversations().catch(() => ({ data: [] })),
        api.get('/api/invoices/').catch(() => ({ data: [] }))
      ]);

      const conversations = convRes.data || [];
      const invoices = invRes.data || [];

      const activeOrders = conversations.filter(c =>
        ['Requires Attention', 'In Progress', 'Paid', 'In Transit', 'Delivered'].includes(c.status)
      ).map(c => {
        const normalize = (p) => p ? p.toString().replace(/\D/g, '') : '';
        const matchingInv = invoices.find(i =>
          (c.customer_phone && i.customer?.phone && normalize(i.customer.phone) === normalize(c.customer_phone)) ||
          (c.customer_name && i.customer?.name && i.customer.name.toLowerCase().trim() === c.customer_name.toLowerCase().trim())
        );
        return {
          ...c,
          invoice_reference: matchingInv?.reference || c.invoice_reference || `INV-${c.id}`,
          invoice_items: matchingInv?.items || [],
          total_amount: matchingInv?.total_amount || c.agreed_price || c.listed_price || 0,
          rider_name: c.rider_name || matchingInv?.rider_name,
          rider_phone: c.rider_phone || matchingInv?.rider_phone,
          delivery_mode: (c.delivery_address || '').toUpperCase() === 'PICKUP' ? 'PICKUP' : 'DELIVERY',
        };
      });

      setOrders(activeOrders);
    } catch (err) {
      console.error('Failed to fetch fulfilment orders:', err);
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (conversationId, newStatus, riderData = {}) => {
    setUpdating(true);
    try {
      await conversationAPI.updateStatus(conversationId, { status: newStatus, ...riderData });
      addToast(`Order updated to ${newStatus}`, 'success');
      setAssignRiderOrder(null);
      setRiderName('');
      setRiderPhone('');
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // ── Derived counts ─────────────────────────────────────────────────────────
  const attentionOrders = orders.filter(o => getStatusGroup(o.status) === 'attention');
  const paidOrders      = orders.filter(o => getStatusGroup(o.status) === 'paid');
  const transitOrders   = orders.filter(o => getStatusGroup(o.status) === 'transit');
  const deliveredOrders = orders.filter(o => getStatusGroup(o.status) === 'delivered');

  // ── Filter + search ────────────────────────────────────────────────────────
  const applySearch = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(o =>
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(q) ||
      (o.invoice_reference || '').toLowerCase().includes(q)
    );
  };

  const applyFilter = (list) => {
    if (activeFilter === 'Pickup') return list.filter(o => o.delivery_mode === 'PICKUP');
    if (activeFilter === 'Delivery') return list.filter(o => o.delivery_mode === 'DELIVERY');
    return list;
  };

  const filter = (list) => applySearch(applyFilter(list));

  const fAttention = filter(attentionOrders);
  const fPaid      = filter(paidOrders);
  const fTransit   = filter(transitOrders);
  const fDelivered = filter(deliveredOrders);

  const totalVisible = fAttention.length + fPaid.length + fTransit.length + fDelivered.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Truck size={22} />
            </div>
            Fulfilment & Order Pathway
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track orders from payment verification to final delivery
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <RotateCcw size={13} />
          Refresh
        </button>
      </div>

      {/* ── Summary Strip ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Needs Attention" count={attentionOrders.length} variant="attention" pulse />
        <SummaryCard label="Ready to Dispatch" count={paidOrders.length} variant="paid" />
        <SummaryCard label="Out for Delivery" count={transitOrders.length} variant="transit" />
        <SummaryCard label="Completed" count={deliveredOrders.length} variant="delivered" />
      </div>

      {/* ── Toolbar (filters + search) ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Delivery', 'Pickup'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'All' ? 'All Orders' : `${f} Only`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search customer, invoice…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Orders ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading fulfilment pipeline…</p>
        </div>
      ) : totalVisible === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-dark dark:text-white">No orders found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery ? 'Try a different search term.' : 'Orders appear here when Kasi processes sales & invoices.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">

          {/* — Needs Attention — */}
          {fAttention.length > 0 && (
            <section>
              <SectionHeader label="Needs Attention" count={fAttention.length} group="attention" />
              <div className="space-y-3">
                {fAttention.map(order => (
                  <FullOrderCard
                    key={order.id}
                    order={order}
                    group="attention"
                    onConfirmPayment={(id) => handleUpdateStatus(id, 'Paid')}
                    onAssignRider={setAssignRiderOrder}
                    onMarkDelivered={(id) => handleUpdateStatus(id, 'Delivered')}
                    updating={updating}
                  />
                ))}
              </div>
            </section>
          )}

          {/* — Ready to Dispatch — */}
          {fPaid.length > 0 && (
            <section>
              <SectionHeader label="Ready to Dispatch" count={fPaid.length} group="paid" />
              <div className="space-y-3">
                {fPaid.map(order => (
                  <FullOrderCard
                    key={order.id}
                    order={order}
                    group="paid"
                    onConfirmPayment={(id) => handleUpdateStatus(id, 'Paid')}
                    onAssignRider={setAssignRiderOrder}
                    onMarkDelivered={(id) => handleUpdateStatus(id, 'Delivered')}
                    updating={updating}
                  />
                ))}
              </div>
            </section>
          )}

          {/* — Out for Delivery — */}
          {fTransit.length > 0 && (
            <section>
              <SectionHeader label="Out for Delivery" count={fTransit.length} group="transit" />
              <div className="space-y-2">
                {fTransit.map(order => (
                  <SlimTransitCard
                    key={order.id}
                    order={order}
                    onMarkDelivered={(id) => handleUpdateStatus(id, 'Delivered')}
                    updating={updating}
                  />
                ))}
              </div>
            </section>
          )}

          {/* — Completed — */}
          {fDelivered.length > 0 && (
            <section>
              <SectionHeader label="Completed" count={fDelivered.length} group="delivered" />
              <div className="space-y-1.5">
                {fDelivered.map(order => (
                  <CompletedRow key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Assign Rider Modal ─────────────────────────────────────────────── */}
      {assignRiderOrder && (
        <AssignRiderModal
          order={assignRiderOrder}
          riderName={riderName}
          setRiderName={setRiderName}
          riderPhone={riderPhone}
          setRiderPhone={setRiderPhone}
          onClose={() => { setAssignRiderOrder(null); setRiderName(''); setRiderPhone(''); }}
          onDispatch={() => handleUpdateStatus(assignRiderOrder.id, 'In Transit', { rider_name: riderName, rider_phone: riderPhone })}
          updating={updating}
        />
      )}
    </div>
  );
}

export default Fulfilment;
