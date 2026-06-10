import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, CheckCircle, MapPin, Phone, User, 
  Grid, List, Search, Copy, Check, ExternalLink, RefreshCw 
} from 'lucide-react';
import { conversationAPI } from '../../../api/conversations';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const Logistics = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'spreadsheet'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const res = await conversationAPI.getConversations();
      // Only retain orders that are Paid, In Transit, or Delivered
      const logisticsStatuses = ['Paid', 'In Transit', 'Delivered'];
      const filtered = (res.data || []).filter(c => logisticsStatuses.includes(c.status));
      setConversations(filtered);
    } catch (err) {
      console.error('Failed to fetch logistics data:', err);
      addToast('Failed to load logistics records', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (conversationId, newStatus) => {
    // Optimistic UI Update: transition the order state locally immediately
    const originalConversations = [...conversations];
    setConversations(prev => 
      prev.map(c => c.id === conversationId ? { ...c, status: newStatus } : c)
    );

    try {
      await conversationAPI.updateStatus(conversationId, { status: newStatus });
      addToast(`Status updated to ${newStatus}`, 'success');
      // Silently sync with backend in the background to ensure data consistency
      await fetchConversations(true);
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update logistics stage', 'error');
      // Rollback to original state on network failure
      setConversations(originalConversations);
    }
  };

  const handleCopyAddress = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Delivery address copied!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter conversations by search term
  const searchedConversations = conversations.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.customer_name || '').toLowerCase().includes(term) ||
      (c.customer_phone || '').toLowerCase().includes(term) ||
      (c.invoice_reference || '').toLowerCase().includes(term) ||
      (c.delivery_address || '').toLowerCase().includes(term)
    );
  });

  const readyToPack = searchedConversations.filter(c => c.status === 'Paid');
  const inTransit = searchedConversations.filter(c => c.status === 'In Transit');
  const delivered = searchedConversations.filter(c => c.status === 'Delivered');

  const columns = [
    {
      title: 'Ready to Pack',
      statusValue: 'Paid',
      icon: Package,
      items: readyToPack,
      count: readyToPack.length,
      color: 'amber',
      emptyText: 'No paid orders to pack',
      action: { label: '🚚 Dispatch order', nextStatus: 'In Transit' },
    },
    {
      title: 'In Transit',
      statusValue: 'In Transit',
      icon: Truck,
      items: inTransit,
      count: inTransit.length,
      color: 'blue',
      emptyText: 'No packages currently in transit',
      action: { label: '✓ Mark Delivered', nextStatus: 'Delivered' },
    },
    {
      title: 'Delivered',
      statusValue: 'Delivered',
      icon: CheckCircle,
      items: delivered,
      count: delivered.length,
      color: 'green',
      emptyText: 'No delivered shipments logged',
      action: null,
    },
  ];

  const avatarColors = [
    'bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500'
  ];

  const getAvatarColor = (name) => {
    if (!name) return avatarColors[0];
    return avatarColors[name.charCodeAt(0) % avatarColors.length];
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      
      {/* Upper Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-1 flex items-center gap-2">
            <Truck className="text-primary dark:text-emerald-400" />
            Logistics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Control order stages, view dispatch lists, and trigger customer WhatsApp transit notifications</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search ref, customer, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-white transition-all shadow-sm"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-xl border border-gray-200/50 dark:border-gray-800">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-gray-800 text-dark dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-dark dark:hover:text-gray-300'
              }`}
            >
              <Grid size={13} />
              Board View
            </button>
            <button
              onClick={() => setViewMode('spreadsheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'spreadsheet'
                  ? 'bg-white dark:bg-gray-800 text-dark dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-dark dark:hover:text-gray-300'
              }`}
            >
              <List size={13} />
              Spreadsheet Ledger
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchConversations(true)}
            className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh Order List"
          >
            <RefreshCw size={15} className={loading || refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'board' ? (
        /* ── Kanban Board View ─────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const Icon = col.icon;
            const colorMap = {
              amber: { bg: 'bg-amber-50/40 dark:bg-amber-950/5', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30' },
              blue: { bg: 'bg-blue-50/40 dark:bg-blue-950/5', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/30' },
              green: { bg: 'bg-green-50/40 dark:bg-green-950/5', text: 'text-green-700 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400', border: 'border-green-100 dark:border-green-900/30' },
            };
            const cm = colorMap[col.color];

            return (
              <div key={col.title} className="flex flex-col space-y-4">
                {/* Column Header */}
                <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-800 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={cm.text} />
                    <h3 className="font-bold text-dark dark:text-white text-xs uppercase tracking-wider">{col.title}</h3>
                  </div>
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${cm.badge}`}>
                    {col.count}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 min-h-[350px]">
                  {loading ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
                      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                    </div>
                  ) : col.items.length === 0 ? (
                    <div className={`${cm.bg} rounded-xl py-12 text-center border ${cm.border}`}>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{col.emptyText}</p>
                    </div>
                  ) : (
                    col.items.map((item) => (
                      <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-150 dark:border-gray-800/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
                        
                        {/* Customer Avatar & ID Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-full ${getAvatarColor(item.customer_name)} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                              {getInitials(item.customer_name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white text-xs truncate">{item.customer_name || 'Walk-in Customer'}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 truncate">
                                {item.invoice_reference ? `#${item.invoice_reference}` : 'No Invoice Ref'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700 font-mono">
                            ₦{(item.agreed_price || 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Customer Phone & Address */}
                        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-50 dark:border-gray-800/60 mb-2.5">
                          {item.customer_phone && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <Phone size={12} className="text-gray-400" />
                              <span className="font-semibold">{item.customer_phone}</span>
                            </div>
                          )}
                          <div className="flex items-start gap-1.5 text-[11px]">
                            <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="line-clamp-2 leading-relaxed">
                                {item.delivery_address || <span className="italic text-gray-400">Store Pickup</span>}
                              </p>
                              {item.delivery_address && (
                                <button
                                  onClick={() => handleCopyAddress(item.delivery_address, item.id)}
                                  className="text-[9px] text-primary hover:underline font-bold mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                                >
                                  {copiedId === item.id ? <Check size={8} /> : <Copy size={8} />}
                                  {copiedId === item.id ? 'Copied' : 'Copy address'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ordered Items List */}
                        {item.invoice_items && item.invoice_items.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Items</p>
                            <div className="space-y-1 max-h-[70px] overflow-y-auto custom-scrollbar">
                              {item.invoice_items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[10px] font-medium bg-gray-50 dark:bg-gray-850 px-2 py-1 rounded border border-gray-100/30 dark:border-gray-800/20">
                                  <span className="text-gray-750 dark:text-gray-300 truncate mr-2">{it.description}</span>
                                  <span className="text-gray-400 shrink-0 font-bold">x{it.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {col.action && (
                          <button
                            onClick={() => handleStatusUpdate(item.id, col.action.nextStatus)}
                            className={`w-full py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                              col.color === 'amber'
                                ? 'bg-primary hover:bg-green-700 shadow-xs shadow-green-200 dark:shadow-none'
                                : 'bg-blue-500 hover:bg-blue-600 shadow-xs shadow-blue-200 dark:shadow-none'
                            }`}
                          >
                            {col.action.label}
                          </button>
                        )}

                        {/* Complete Status Indicator */}
                        {col.title === 'Delivered' && (
                          <div className="flex items-center justify-center gap-1 py-1.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-xl text-xs font-bold border border-green-100/50 dark:border-green-900/30">
                            <CheckCircle size={12} /> Delivered & Complete
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Spreadsheet Ledger View ──────────────────────────── */
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-850 border-b border-gray-150 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice Ref</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Delivery Address</th>
                  <th className="px-6 py-4">Ordered Items</th>
                  <th className="px-6 py-4 text-right">Amount Paid</th>
                  <th className="px-6 py-4 text-center">Logistics Stage</th>
                  <th className="px-6 py-4 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-400 animate-pulse font-bold">
                      Loading spreadsheet records...
                    </td>
                  </tr>
                ) : searchedConversations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-gray-400">
                      <p className="font-bold text-sm text-gray-700 dark:text-gray-300">No logistics records found</p>
                      <p className="text-xs text-gray-400 mt-1">Try searching for other tags or invoices.</p>
                    </td>
                  </tr>
                ) : (
                  searchedConversations.map((item) => {
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-850/40 transition-colors"
                      >
                        {/* Reference */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-800 dark:text-gray-200">
                          {item.invoice_reference ? `#${item.invoice_reference}` : `CONV-${item.id}`}
                        </td>
                        
                        {/* Customer */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${getAvatarColor(item.customer_name)} text-white flex items-center justify-center font-bold text-[10px]`}>
                              {getInitials(item.customer_name)}
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{item.customer_name || 'Walk-in Customer'}</span>
                          </div>
                        </td>
                        
                        {/* Phone */}
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-500 dark:text-gray-400">
                          {item.customer_phone || '—'}
                        </td>
                        
                        {/* Address */}
                        <td className="px-6 py-4 max-w-[220px]">
                          <div className="flex items-start gap-1.5 group">
                            <span className="truncate flex-1">
                              {item.delivery_address || <span className="italic text-gray-400">Store Pickup</span>}
                            </span>
                            {item.delivery_address && (
                              <button
                                onClick={() => handleCopyAddress(item.delivery_address, item.id)}
                                className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                                title="Copy Address"
                              >
                                {copiedId === item.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                              </button>
                            )}
                          </div>
                        </td>
                        
                        {/* Items */}
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="space-y-0.5">
                            {item.invoice_items && item.invoice_items.length > 0 ? (
                              item.invoice_items.map((it, idx) => (
                                <div key={idx} className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                                  {it.quantity}x {it.description}
                                </div>
                              ))
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">No items details</span>
                            )}
                          </div>
                        </td>
                        
                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-bold text-gray-800 dark:text-gray-150">
                          ₦{(item.agreed_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        
                        {/* Stage Selector */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                            className={`text-[10px] font-black px-3 py-1 rounded-full border outline-none cursor-pointer tracking-wider ${
                              item.status === 'Paid'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                                : item.status === 'In Transit'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                                : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                            }`}
                          >
                            <option value="Paid">Ready to Pack</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        
                        {/* Action Button */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.status === 'Paid' && (
                            <button
                              onClick={() => handleStatusUpdate(item.id, 'In Transit')}
                              className="px-3 py-1 bg-primary hover:bg-green-750 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                            >
                              🚚 Dispatch
                            </button>
                          )}
                          {item.status === 'In Transit' && (
                            <button
                              onClick={() => handleStatusUpdate(item.id, 'Delivered')}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                            >
                              ✓ Complete
                            </button>
                          )}
                          {item.status === 'Delivered' && (
                            <span className="text-green-600 dark:text-green-400 font-bold text-[10px] flex items-center justify-center gap-0.5">
                              <CheckCircle size={10} /> Complete
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;
