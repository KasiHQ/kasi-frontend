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
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    accentBorder: 'border-amber-400/80',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500 text-white',
    stepperActive: 'bg-amber-500 text-white ring-2 ring-amber-100 dark:ring-amber-900',
    stepperBar: 'bg-amber-500',
  },
  paid: {
    label: 'Ready to Dispatch',
    color: 'primary',
    badgeClass: 'bg-emerald-50 text-[#1A7A4A] border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    accentBorder: 'border-[#1A7A4A]',
    dot: 'bg-[#1A7A4A]',
    pill: 'bg-[#1A7A4A] text-white',
    stepperActive: 'bg-[#1A7A4A] text-white ring-2 ring-emerald-100 dark:ring-emerald-900',
    stepperBar: 'bg-[#1A7A4A]',
  },
  transit: {
    label: 'Out for Delivery',
    color: 'blue',
    badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    accentBorder: 'border-sky-500',
    dot: 'bg-sky-500',
    pill: 'bg-sky-500 text-white',
    stepperActive: 'bg-sky-500 text-white ring-2 ring-sky-100 dark:ring-sky-900',
    stepperBar: 'bg-sky-500',
  },
  delivered: {
    label: 'Completed',
    color: 'gray',
    badgeClass: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    accentBorder: 'border-gray-300 dark:border-gray-600',
    dot: 'bg-gray-400',
    pill: 'bg-gray-400 text-white',
    stepperActive: 'bg-gray-500 text-white ring-2 ring-gray-100 dark:ring-gray-800',
    stepperBar: 'bg-gray-300 dark:bg-gray-700',
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
  if (mins < 1) return '< 1m';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

// ─── Summary Card (Clean, balanced, human-designed metrics) ─────────────────────
function SummaryCard({ label, count, variant }) {
  const cfg = STATUS_CONFIG[variant] || STATUS_CONFIG.attention;
  const hasItems = count > 0;

  return (
    <div className="relative rounded-xl p-4 md:p-5 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 shadow-xs hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full ${cfg.dot} ${hasItems ? 'opacity-100' : 'opacity-30'}`} />
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {count}
        </p>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>
          {variant === 'attention' && hasItems ? 'Action required' : variant === 'paid' && hasItems ? 'Ready' : variant === 'transit' ? 'In delivery' : 'Settled'}
        </span>
      </div>
    </div>
  );
}

// ─── Compact Stepper (Clean pill-stepper without giant empty lines) ─────────────
function OrderStepper({ status, group }) {
  const currentIdx = getPathwayIndex(status);

  return (
    <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60 text-xs">
      {pathwaySteps.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                active
                  ? group === 'attention'
                    ? 'bg-amber-100 text-amber-900 font-bold dark:bg-amber-950/60 dark:text-amber-300'
                    : group === 'paid'
                    ? 'bg-emerald-100 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-sky-100 text-sky-900 font-bold dark:bg-sky-950/60 dark:text-sky-300'
                  : done
                  ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 shadow-2xs'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {done ? (
                <CheckCircle2 size={13} className={active ? 'text-current' : 'text-[#1A7A4A]'} />
              ) : (
                <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] flex items-center justify-center text-gray-500">
                  {idx + 1}
                </span>
              )}
              <span className="truncate">{step.label}</span>
            </div>
            {idx < pathwaySteps.length - 1 && (
              <ChevronRight size={12} className="text-gray-300 dark:text-gray-600 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Full Order Card (High-end commerce layout) ────────────────────────────────
function FullOrderCard({ order, group, onConfirmPayment, onAssignRider, onMarkDelivered, updating }) {
  const cfg = STATUS_CONFIG[group];
  const waitTime = group === 'attention' ? waitingLabel(order.updated_at || order.created_at) : null;
  const isPickup = (order.delivery_mode || '').toUpperCase() === 'PICKUP';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700/70">
        <div className="flex items-start sm:items-center gap-3">
          {/* Subtle initials indicator */}
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-sm shrink-0">
            {(order.customer_name || '?')[0].toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                {order.customer_name || 'Customer'}
              </h3>
              <span className="font-mono text-xs text-gray-400">
                #{order.invoice_reference}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isPickup
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-emerald-50 text-[#1A7A4A] border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300'
                }`}
              >
                {isPickup ? '📍 Store Pickup' : '🚚 Home Delivery'}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Phone size={11} className="text-gray-400" />
                {order.customer_phone || 'No phone'}
              </span>
              {waitTime && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/70 font-medium">
                  <Clock size={11} /> Waiting {waitTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Order Value & Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-700/60">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Order Total
          </span>
          <span className="text-xl font-black text-gray-900 dark:text-white">
            ₦{(order.total_amount || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4">
        {/* Step Flow */}
        <OrderStepper status={order.status} group={group} />

        {/* Items & Fulfillment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Purchased Items List */}
          <div className="md:col-span-7 bg-gray-50/70 dark:bg-gray-900/40 rounded-xl p-3.5 border border-gray-100/90 dark:border-gray-800 text-xs">
            <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">
              Purchased Items
            </p>
            {order.invoice_items && order.invoice_items.length > 0 ? (
              <div className="space-y-1.5 divide-y divide-gray-100 dark:divide-gray-800">
                {order.invoice_items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center pt-1.5 first:pt-0">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {it.quantity}× {it.description}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ₦{(it.total_price || (it.unit_price * it.quantity) || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Sales agreement order</p>
            )}
          </div>

          {/* Logistics & Primary Call to Action */}
          <div className="md:col-span-5 bg-gray-50/70 dark:bg-gray-900/40 rounded-xl p-3.5 border border-gray-100/90 dark:border-gray-800 text-xs flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">
                Logistics & Rider
              </p>
              {order.rider_name ? (
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Bike size={13} className="text-[#1A7A4A]" />
                    <span>{order.rider_name}</span>
                  </p>
                  {order.rider_phone && (
                    <p className="text-gray-500 dark:text-gray-400 pl-4.5">
                      {order.rider_phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No rider assigned yet</p>
              )}
            </div>

            {/* Contextual Action Button */}
            <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/60 flex justify-end">
              {group === 'attention' && (
                <button
                  onClick={() => onConfirmPayment(order.id)}
                  disabled={updating}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  Confirm Payment (₦{(order.total_amount || 0).toLocaleString()})
                </button>
              )}
              {group === 'paid' && (
                <button
                  onClick={() => onAssignRider(order)}
                  disabled={updating}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#1A7A4A] hover:bg-[#15603A] text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Truck size={14} />
                  Assign Rider & Dispatch
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300 flex items-center justify-center shrink-0">
          <Truck size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm text-gray-900 dark:text-white">
              {order.customer_name || 'Customer'}
            </p>
            <span className="font-mono text-[11px] text-gray-400">
              #{order.invoice_reference}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
            {order.rider_name && (
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Rider: {order.rider_name}
              </span>
            )}
            <span className="text-gray-400">· {timeAgo(order.updated_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-gray-700/60">
        <p className="font-black text-sm text-gray-900 dark:text-white">
          ₦{(order.total_amount || 0).toLocaleString()}
        </p>
        <button
          onClick={() => onMarkDelivered(order.id)}
          disabled={updating}
          className="px-3 py-1.5 bg-[#1A7A4A] hover:bg-[#15603A] text-white rounded-lg font-bold text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
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
      <h2 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{label}</h2>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>{count}</span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700/80" />
    </div>
  );
}

// ─── Assign Rider Modal ────────────────────────────────────────────────────────
function AssignRiderModal({ order, riderName, setRiderName, riderPhone, setRiderPhone, onClose, onDispatch, updating }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white">Assign Rider & Dispatch</h3>
            <p className="text-xs text-gray-500 mt-0.5">Order #{order.invoice_reference} · {order.customer_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
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
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Rider Phone</label>
            <input
              type="text"
              placeholder="e.g. 08012345678"
              value={riderPhone}
              onChange={(e) => setRiderPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDispatch}
            disabled={updating}
            className="flex-1 px-4 py-2.5 bg-[#1A7A4A] hover:bg-[#15603A] text-white rounded-xl text-sm font-bold cursor-pointer transition-all active:scale-95 shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Truck size={15} />
            {updating ? 'Dispatching…' : 'Dispatch Order'}
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
