import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { conversationAPI } from '../../../api/conversations';
import api from '../../../api/axios';
import { 
  Package, Truck, CheckCircle2, Clock, MapPin, Phone, User, 
  Search, Filter, ChevronRight, AlertCircle, ShoppingBag, Send
} from 'lucide-react';

const pathwaySteps = [
  { id: 'placed', label: 'Order Placed' },
  { id: 'paid', label: 'Payment Verified' },
  { id: 'transit', label: 'Out for Delivery / Pickup' },
  { id: 'delivered', label: 'Delivered & Complete' }
];

const getPathwayIndex = (status) => {
  if (status === 'Delivered') return 3;
  if (status === 'In Transit') return 2;
  if (status === 'Paid') return 1;
  return 0; // Requires Attention, In Progress, etc.
};

function Fulfilment() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Rider Assignment Modal State
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

      // Combine conversation status with invoice details
      const activeOrders = conversations.filter(c => 
        ['Requires Attention', 'In Progress', 'Paid', 'In Transit', 'Delivered'].includes(c.status)
      ).map(c => {
        // Find matching invoice
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
          delivery_mode: (c.delivery_address || '').toUpperCase() === 'PICKUP' ? 'PICKUP' : 'DELIVERY'
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (conversationId, newStatus, riderData = {}) => {
    setUpdating(true);
    try {
      await conversationAPI.updateStatus(conversationId, { 
        status: newStatus,
        ...riderData
      });
      addToast(`Order updated to ${newStatus}`, 'success');
      setAssignRiderOrder(null);
      setRiderName('');
      setRiderPhone('');
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      addToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(q) ||
      (o.invoice_reference || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Pickup') return o.delivery_mode === 'PICKUP';
    if (activeTab === 'Delivery') return o.delivery_mode === 'DELIVERY';
    if (activeTab === 'Active') return o.status !== 'Delivered';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'Requires Attention' || o.status === 'In Progress').length;
  const processingCount = orders.filter(o => o.status === 'Paid').length;
  const transitCount = orders.filter(o => o.status === 'In Transit').length;
  const completedCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
            <Truck className="text-primary" size={26} />
            Fulfilment & Order Pathway
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track customer orders through complete fulfillment stages from payment verification to final delivery
          </p>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Needs Attention</p>
          <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Paid / Processing</p>
          <p className="text-2xl font-black text-blue-600">{processingCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Out for Delivery / Pickup</p>
          <p className="text-2xl font-black text-purple-600">{transitCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Completed Deliveries</p>
          <p className="text-2xl font-black text-primary">{completedCount}</p>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          {['All', 'Active', 'Delivery', 'Pickup'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'All' ? 'All Orders' : tab === 'Active' ? 'Active Pipeline' : `${tab} Orders`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search invoice #, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading fulfillment pipeline...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-dark dark:text-white">No fulfillment orders found</h3>
          <p className="text-xs text-gray-400 mt-1">Orders appear here when Kasi processes sales & invoices.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const currentStepIdx = getPathwayIndex(order.status);
            return (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-xs hover:border-gray-200 transition-all space-y-4">
                {/* Top Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {(order.customer_name || '?')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-dark dark:text-white text-sm">{order.customer_name || 'Customer'}</h3>
                        <span className="font-mono text-xs font-bold text-gray-400">#{order.invoice_reference}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.delivery_mode === 'PICKUP' 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {order.delivery_mode === 'PICKUP' ? '📍 Store Pickup' : '🚚 Home Delivery'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{order.customer_phone || 'No phone'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Value</p>
                      <p className="text-base font-black text-primary">₦{(order.total_amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Visual Pathway Stepper */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 dark:bg-gray-700 z-0" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 z-0"
                      style={{ width: `${(currentStepIdx / 3) * 100}%` }}
                    />
                    
                    {pathwaySteps.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                          }`}>
                            {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 whitespace-nowrap hidden sm:block ${
                            isDone ? 'text-dark dark:text-white' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Rider Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Items list */}
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-xs space-y-1">
                    <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Purchased Products</p>
                    {order.invoice_items && order.invoice_items.length > 0 ? (
                      order.invoice_items.map((it, idx) => (
                        <div key={idx} className="flex justify-between font-medium text-gray-700 dark:text-gray-300">
                          <span>{it.quantity}× {it.description}</span>
                          <span>₦{(it.total_price || (it.unit_price * it.quantity) || 0).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 font-medium">Standard sales agreement order</p>
                    )}
                  </div>

                  {/* Rider / Pickup Info */}
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-xs flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Logistics / Rider Status</p>
                      {order.rider_name ? (
                        <p className="font-semibold text-dark dark:text-white">
                          🚚 Assigned Rider: <strong className="text-primary">{order.rider_name}</strong> {order.rider_phone ? `(${order.rider_phone})` : ''}
                        </p>
                      ) : (
                        <p className="text-gray-400 font-medium">No rider assigned yet</p>
                      )}
                    </div>

                    {/* Pathway Action Buttons */}
                    <div className="mt-3 flex gap-2 justify-end">
                      {order.status !== 'Paid' && order.status !== 'In Transit' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Paid')}
                          disabled={updating}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Confirm Payment
                        </button>
                      )}

                      {order.status === 'Paid' && (
                        <button
                          onClick={() => setAssignRiderOrder(order)}
                          disabled={updating}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-bold text-xs hover:bg-purple-700 transition-colors cursor-pointer"
                        >
                          Dispatch / Assign Rider
                        </button>
                      )}

                      {order.status === 'In Transit' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                          disabled={updating}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg font-bold text-xs hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          Mark Delivered & Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Rider Modal */}
      {assignRiderOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-dark dark:text-white">Assign Rider & Dispatch</h3>
            <p className="text-xs text-gray-500">Enter dispatch rider details for #{assignRiderOrder.invoice_reference}</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Rider Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Okon"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Rider Phone</label>
                <input
                  type="text"
                  placeholder="e.g. 08012345678"
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <button
                onClick={() => setAssignRiderOrder(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(assignRiderOrder.id, 'In Transit', { rider_name: riderName, rider_phone: riderPhone })}
                disabled={updating}
                className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 cursor-pointer"
              >
                {updating ? 'Dispatching...' : 'Dispatch Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fulfilment;
