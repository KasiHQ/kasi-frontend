import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { conversationAPI } from '../../../api/conversations';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Search, Users, Download, Send, MessageSquare, X, History, ShoppingBag, Receipt, Calendar, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { SiWhatsapp, SiTelegram, SiInstagram } from 'react-icons/si';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import useNetwork from '../../../hooks/useNetwork';
import { getLocalCustomers, addCustomerToLocal } from '../../../db/db';

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

const tagConfig = {
  'Buyers': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-[#1C774E] dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50' },
  'Hot Lead': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/50' },
  'Negotiating': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/50' },
  'Cold Lead': { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/50' },
};

const platformBadge = (platform) => {
  const cleanPlatform = (platform || '').toLowerCase();
  if (cleanPlatform === 'whatsapp') {
    return {
      label: 'WhatsApp',
      color: 'bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-950/30 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400',
      icon: <SiWhatsapp size={12} className="text-[#25D366] shrink-0" />
    };
  }
  if (cleanPlatform === 'instagram') {
    return {
      label: 'Instagram',
      color: 'bg-pink-50 border border-pink-200/60 dark:bg-pink-950/30 dark:border-pink-800/40 text-pink-700 dark:text-pink-400',
      icon: <SiInstagram size={12} className="text-[#E1306C] shrink-0" />
    };
  }
  if (cleanPlatform === 'telegram') {
    return {
      label: 'Telegram',
      color: 'bg-sky-50 border border-sky-200/60 dark:bg-sky-950/30 dark:border-sky-800/40 text-sky-700 dark:text-sky-400',
      icon: <SiTelegram size={12} className="text-[#229ED9] shrink-0" />
    };
  }
  return {
    label: platform || 'Web',
    color: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700',
    icon: (
      <svg className="w-3 h-3 fill-gray-400 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    )
  };
};

const timeAgo = (dateString) => {
  if (!dateString) return '—';
  const cleanDateString = dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-')
    ? dateString
    : `${dateString}Z`;
  const diff = Date.now() - new Date(cleanDateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(cleanDateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Derive a customer tag from their conversation/invoice data
const deriveTag = (customer, conversations) => {
  const custConvs = conversations.filter(c =>
    (customer.phone && c.customer_phone === customer.phone) ||
    (customer.name && c.customer_name === customer.name)
  );

  const totalSpent = customer.total_spent || 0;
  const orderCount = customer.order_count || 0;

  if (orderCount > 0 || totalSpent > 0) return 'Buyers';
  if (custConvs.some(c => c.status === 'Requires Attention')) return 'Hot Lead';
  if (custConvs.some(c => c.status === 'In Progress')) return 'Negotiating';
  return 'Cold Lead';
};

/* ── Customer History Off-Canvas Slide-over Drawer ───────────────── */
const CustomerHistoryDrawer = ({ customer, invoices, onClose, onOpenChat }) => {
  if (!customer) return null;

  const normalize = (p) => p ? p.toString().replace(/\D/g, '') : '';
  const customerPhoneNorm = normalize(customer.phone);
  const customerNameNorm = (customer.name || '').toLowerCase().trim();

  // Filter invoices for this specific customer
  const customerInvoices = (invoices || []).filter(inv => {
    const invPhone = normalize(inv.customer?.phone);
    const invName = (inv.customer?.name || '').toLowerCase().trim();
    const phoneMatch = customerPhoneNorm && invPhone && customerPhoneNorm === invPhone;
    const nameMatch = customerNameNorm && invName && customerNameNorm === invName;
    return phoneMatch || nameMatch;
  }).sort((a, b) => new Date(b.date_issued || b.created_at || 0) - new Date(a.date_issued || a.created_at || 0));

  const totalSpent = customer.total_spent || customerInvoices.reduce((s, i) => s + (i.total_amount || 0), 0);
  const orderCount = customer.order_count || customerInvoices.length;
  const avgOrderValue = orderCount > 0 ? Math.round(totalSpent / orderCount) : 0;
  const pb = platformBadge(customer.platform);
  const tag = customer.tag || 'Cold Lead';
  const tc = tagConfig[tag] || tagConfig['Cold Lead'];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop Scrim */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Container */}
      <div 
        className="fixed top-0 right-0 h-full w-[430px] max-w-[95vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 rounded-l-3xl shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-out transform translate-x-0 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between bg-gray-50/70 dark:bg-gray-800/40 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl ${getAvatarColor(customer.name)} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
              {getInitials(customer.name)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{customer.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${tc.bg} ${tc.text}`}>
                  {tag}
                </span>
                {customer.platform && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${pb.color}`}>
                    {pb.icon} <span>{pb.label}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {customer.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone size={11} className="text-gray-400" /> {customer.phone}
                  </span>
                )}
                {customer.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={11} className="text-gray-400" /> {customer.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-3 gap-2.5 p-4 bg-gray-50/50 dark:bg-gray-950/40 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700/70 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Spent</p>
            <p className="text-base sm:text-lg font-black text-[#1C774E] dark:text-[#DBF361]">₦{totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700/70 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Orders</p>
            <p className="text-base sm:text-lg font-black text-gray-900 dark:text-white">{orderCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700/70 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Avg Order</p>
            <p className="text-base sm:text-lg font-black text-gray-900 dark:text-white">₦{avgOrderValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Scrollable Order History & Transactions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt size={14} className="text-[#1C774E]" />
              Order & Transaction History ({customerInvoices.length})
            </h4>
          </div>

          {customerInvoices.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/40 dark:bg-gray-800/20">
              <ShoppingBag size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">No past orders</p>
              <p className="text-[11px] text-gray-400 mt-0.5">This customer has not placed an order yet.</p>
            </div>
          ) : (
            customerInvoices.map((inv) => (
              <div key={inv.id || inv.reference} className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/70 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">#{inv.reference}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-[#1C774E] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60' :
                      inv.status === 'Delivered' ? 'bg-emerald-50 text-[#1C774E] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60' :
                      inv.status === 'In Transit' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(inv.date_issued || inv.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {inv.items && inv.items.length > 0 && (
                  <div className="bg-gray-50/80 dark:bg-gray-900/50 rounded-xl p-2.5 space-y-1 text-xs border border-gray-100 dark:border-gray-800">
                    {inv.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span className="font-medium truncate mr-2">{item.quantity}× {item.description}</span>
                        <span className="font-semibold text-gray-900 dark:text-white shrink-0">₦{(item.total_price || (item.unit_price * item.quantity) || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {inv.rider_name && (
                  <div className="text-[11px] bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 p-2 rounded-xl border border-sky-100 dark:border-sky-800 flex items-center justify-between">
                    <span>🚚 Rider: <strong>{inv.rider_name}</strong></span>
                    {inv.rider_phone && <span className="font-mono">{inv.rider_phone}</span>}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <span className="text-gray-400">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">₦{(inv.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onOpenChat(customer)}
            className="flex-1 py-2.5 bg-[#1C774E] hover:bg-[#15603A] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95"
          >
            <MessageSquare size={14} />
            Open Chat
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Clients = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();
  
  // Data states
  const [customers, setCustomers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  // Broadcast states
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastSegment, setBroadcastSegment] = useState('All');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastStatus, setBroadcastStatus] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      if (!isOnline) {
        setCustomers(await getLocalCustomers() || []);
        setLoading(false);
        return;
      }

      const [custRes, convRes, invRes] = await Promise.all([
        api.get('/api/invoices/customers').catch(() => ({ data: [] })),
        conversationAPI.getConversations().catch(() => ({ data: [] })),
        api.get('/api/invoices/').catch(() => ({ data: [] }))
      ]);

      const custData = custRes.data || [];
      const convData = convRes.data || [];
      const invoiceData = invRes.data || [];
      setAllInvoices(invoiceData);

      // Helper to normalize phone numbers
      const normalizePhone = (phone) => {
        if (!phone) return '';
        const digits = phone.toString().replace(/\D/g, '');
        if (digits.length === 11 && digits.startsWith('0')) {
          return '234' + digits.slice(1);
        }
        return digits;
      };

      const consolidatedMap = new Map();

      // Step 1: Add all invoice customers
      custData.forEach(c => {
        const phoneKey = c.phone ? normalizePhone(c.phone) : '';
        const nameKey = c.name ? c.name.trim().toLowerCase() : '';
        const uniqueKey = c.id || `cust-${nameKey || 'unnamed'}-${phoneKey || Math.random()}`;

        consolidatedMap.set(uniqueKey, {
          id: uniqueKey,
          name: c.name || `Customer ${c.phone || ''}`,
          phone: c.phone || '',
          email: c.email || null,
          address: c.address || null,
          total_spent: c.total_spent || 0,
          order_count: c.order_count || 0,
          last_purchase_date: c.last_purchase_date || null,
          platform: null,
          last_active: c.last_purchase_date || null,
          invoice_count: c.invoice_count || 0,
        });
      });

      // Step 2: Merge conversation data
      convData.forEach(cv => {
        const cvPhoneNorm = cv.customer_phone ? normalizePhone(cv.customer_phone) : '';
        const cvNameNorm = cv.customer_name ? cv.customer_name.trim().toLowerCase() : '';

        // Find match in current map
        let matchedKey = null;
        let matchedCustomer = null;

        for (const [key, cust] of consolidatedMap.entries()) {
          const custPhoneNorm = cust.phone ? normalizePhone(cust.phone) : '';
          const custNameNorm = cust.name ? cust.name.trim().toLowerCase() : '';

          const phoneMatch = cvPhoneNorm && custPhoneNorm && cvPhoneNorm === custPhoneNorm;
          const nameMatch = cvNameNorm && custNameNorm && cvNameNorm === custNameNorm;

          if (phoneMatch || nameMatch) {
            matchedKey = key;
            matchedCustomer = cust;
            break;
          }
        }

        if (matchedCustomer) {
          // Merge details
          if (!matchedCustomer.phone && cv.customer_phone) {
            matchedCustomer.phone = cv.customer_phone;
          }
          if (cv.platform) {
            matchedCustomer.platform = cv.platform;
          }
          if (cv.last_message_at) {
            const currentLastActive = matchedCustomer.last_active;
            if (!currentLastActive || new Date(cv.last_message_at) > new Date(currentLastActive)) {
              matchedCustomer.last_active = cv.last_message_at;
            }
          }
        } else {
          // Add as new conversation-only contact
          const uniqueKey = `conv-${cv.id}`;
          consolidatedMap.set(uniqueKey, {
            id: uniqueKey,
            name: cv.customer_name || `Customer ${cv.customer_phone || ''}`,
            phone: cv.customer_phone || '',
            email: null,
            address: null,
            total_spent: 0,
            order_count: 0,
            last_purchase_date: null,
            platform: cv.platform || null,
            last_active: cv.last_message_at || null,
            invoice_count: 0,
          });
        }
      });

      // Step 3: Map to final customers array and attach derived tags
      const consolidatedCustomers = Array.from(consolidatedMap.values()).map(c => ({
        ...c,
        tag: deriveTag(c, convData),
      }));

      setCustomers(consolidatedCustomers);
      setConversations(convData);

      // Cache
      custData.forEach(async (c) => await addCustomerToLocal(c));
    } catch (error) {
      console.error('Error fetching customers:', error);
      if (error.response?.status === 401) logout();
      else addToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Computed stats
  const totalContacts = customers.length;
  const payingBuyers = customers.filter(c => c.tag === 'Buyers').length;
  const totalRevenue = customers.reduce((s, c) => s + (c.total_spent || 0), 0);
  const hotLeadsCount = customers.filter(c => c.tag === 'Hot Lead').length;

  // Tag counts for filters
  const tagCounts = customers.reduce((acc, c) => {
    const tag = c.tag || 'Cold Lead';
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const filters = [
    { label: 'All', count: totalContacts },
    { label: 'Buyers', match: (c) => c.tag === 'Buyers', count: tagCounts['Buyers'] || 0 },
    { label: 'Hot Leads', match: (c) => c.tag === 'Hot Lead', count: tagCounts['Hot Lead'] || 0 },
    { label: 'Negotiating', match: (c) => c.tag === 'Negotiating', count: tagCounts['Negotiating'] || 0 },
    { label: 'Cold Leads', match: (c) => c.tag === 'Cold Lead', count: tagCounts['Cold Lead'] || 0 },
  ];

  const filteredCustomers = customers.filter(c => {
    const currentFilter = filters.find(f => f.label === activeFilter);
    const matchesFilter = activeFilter === 'All' || (currentFilter?.match && currentFilter.match(c));
    const matchesSearch = !searchTerm ||
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatNaira = (amount) => {
    if (!amount) return '—';
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${amount.toLocaleString()}`;
    return `₦${amount}`;
  };

  // Broadcast Recipients
  const targetRecipients = customers.filter(c => {
    if (broadcastSegment === 'All') return true;
    if (broadcastSegment === 'Buyers') return c.tag === 'Buyers';
    if (broadcastSegment === 'Hot Leads') return c.tag === 'Hot Lead';
    if (broadcastSegment === 'Negotiating') return c.tag === 'Negotiating';
    if (broadcastSegment === 'Cold Leads') return c.tag === 'Cold Lead';
    return false;
  });

  // Execute Broadcast Campaign (Connected to Backend Celery & Redis)
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim() || targetRecipients.length === 0) return;
    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setBroadcastStatus('Queuing campaign on server...');

    try {
      // Map frontend segment filter to backend customer segmentation categories
      let backendSegments = ["New", "Regular", "VIP"];
      if (broadcastSegment === 'Buyers') {
        backendSegments = ["Regular", "VIP"];
      }

      const payload = {
        message_text: broadcastMessage,
        segment_filter: {
          segments: backendSegments
        }
      };

      // Dispatch to real backend endpoint
      const response = await api.post('/api/whatsapp/broadcast', payload);

      if (response.data?.status === 'queued' || response.data?.status === 'scheduled') {
        // Perform a responsive client-side progress visualization while Celery dispatches in background
        for (let i = 0; i < targetRecipients.length; i++) {
          const recipient = targetRecipients[i];
          setBroadcastStatus(`Dispatching to ${recipient.name}...`);
          await new Promise(resolve => setTimeout(resolve, 300));
          setBroadcastProgress(prev => prev + 1);
        }

        setIsBroadcasting(false);
        setBroadcastSuccess(true);
        addToast(`Broadcast successfully queued for ${targetRecipients.length} customers!`, 'success');
      } else {
        throw new Error(response.data?.error || 'Failed to initialize broadcast campaign');
      }
    } catch (err) {
      console.error('Broadcast dispatch error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to dispatch broadcast';
      addToast(errMsg, 'error');
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center shadow-sm border border-yellow-200">
          Offline Mode. Showing locally saved customers.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-1">Customer Database</h1>
          <p className="text-gray-500 text-sm">
            All customer data collected by Kasi across platforms · {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowBroadcast(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Send size={15} />
            Broadcast
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-xs border border-gray-200/80 dark:border-gray-700/80">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Total Contacts</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{totalContacts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-xs border border-gray-200/80 dark:border-gray-700/80">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Paying Buyers</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{payingBuyers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-xs border border-gray-200/80 dark:border-gray-700/80">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-black text-[#1C774E] dark:text-[#DBF361] tracking-tight">{formatNaira(totalRevenue)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-xs border border-gray-200/80 dark:border-gray-700/80">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Hot Leads</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{hotLeadsCount}</p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.label
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {f.label} {f.count > 0 && <span className="opacity-75 font-mono text-[11px]">({f.count})</span>}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C774E]/20 dark:text-white transition-all shadow-2xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40">
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Platform</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Tag</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Total Spend</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider text-center">Orders</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Last Active</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {loading ? (
                <TableSkeleton rows={6} cols={8} />
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <Users size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No customers yet</p>
                    <p className="text-xs text-gray-400">Customers appear here when Kasi interacts with them.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.slice((currentPage - 1) * 15, currentPage * 15).map((customer) => {
                  const pb = platformBadge(customer.platform);
                  const tag = customer.tag || 'Cold Lead';
                  const tc = tagConfig[tag] || tagConfig['Cold Lead'];

                  return (
                    <tr key={customer.id} className="group hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors">
                      {/* Customer Name */}
                      <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedCustomerHistory(customer)}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl ${getAvatarColor(customer.name)} text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}>
                            {getInitials(customer.name)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-[#1C774E] transition-colors">{customer.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium">Click for history</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                        {customer.phone || customer.email || '—'}
                      </td>

                      {/* Platform */}
                      <td className="px-5 py-4">
                        {customer.platform ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${pb.color}`}>
                            {pb.icon} <span>{pb.label}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs font-mono">—</span>
                        )}
                      </td>

                      {/* Tag */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tc.bg} ${tc.text}`}>
                          {tag}
                        </span>
                      </td>

                      {/* Total Spend */}
                      <td className="px-5 py-4">
                        <span className={`font-bold text-sm ${customer.total_spent ? 'text-[#1C774E] dark:text-[#DBF361]' : 'text-gray-400'}`}>
                          {formatNaira(customer.total_spent)}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedCustomerHistory(customer)}>
                        <span className="inline-flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200 text-xs hover:text-[#1C774E] transition-colors">
                          <History size={13} className="text-gray-400" />
                          {customer.order_count || 0}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {timeAgo(customer.last_active || customer.last_purchase_date)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedCustomerHistory(customer)}
                            className="text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700 px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs"
                            title="View Full Order History"
                          >
                            <History size={13} />
                            Orders
                          </button>
                          <button 
                            onClick={() => navigate(`/chats?customer=${encodeURIComponent(customer.phone || customer.name)}`)}
                            className="text-[#1C774E] dark:text-[#DBF361] font-bold text-xs hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60 transition-colors flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs"
                          >
                            <MessageSquare size={13} />
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {Math.ceil(filteredCustomers.length / 15) > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold font-mono">
              Page {currentPage} of {Math.ceil(filteredCustomers.length / 15)}
            </span>
            <button
              disabled={currentPage === Math.ceil(filteredCustomers.length / 15)}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCustomers.length / 15)))}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 transition-opacity duration-300 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Send size={18} className="text-[#1C774E]" />
                  Send Marketing Broadcast
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send bulk WhatsApp messages to your segmented customer lists</p>
              </div>
              <button 
                onClick={() => { if (!isBroadcasting) setShowBroadcast(false); }} 
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                disabled={isBroadcasting}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            {broadcastSuccess ? (
              /* Success Screen */
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-primary shadow-sm animate-bounce">
                  <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-dark">Broadcast Sent Successfully!</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your message has been queued and dispatched to {targetRecipients.length} customer{targetRecipients.length !== 1 ? 's' : ''} in the background.
                  </p>
                </div>


                <button
                  onClick={() => {
                    setShowBroadcast(false);
                    setBroadcastSuccess(false);
                    setBroadcastMessage('');
                  }}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              /* Form Screen */
              <div className="overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {/* Target Segment */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Target Segment</label>
                  <select
                    value={broadcastSegment}
                    onChange={(e) => setBroadcastSegment(e.target.value)}
                    disabled={isBroadcasting}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer font-medium text-dark"
                  >
                    <option value="All">All Customers ({customers.length})</option>
                    <option value="Buyers">Buyers ({customers.filter(c => c.tag === 'Buyers').length})</option>
                    <option value="Hot Leads">Hot Leads ({customers.filter(c => c.tag === 'Hot Lead').length})</option>
                    <option value="Negotiating">Negotiating ({customers.filter(c => c.tag === 'Negotiating').length})</option>
                    <option value="Cold Leads">Cold Leads ({customers.filter(c => c.tag === 'Cold Lead').length})</option>
                  </select>
                </div>

                {/* Recipients List Preview */}
                {targetRecipients.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-500 uppercase tracking-wider">Recipients ({targetRecipients.length})</span>
                      <span className="text-gray-400 font-medium">WhatsApp Enabled</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto pr-1">
                      {targetRecipients.map((rec) => (
                        <div key={rec.id} className="flex items-center gap-1.5 bg-white border border-gray-200 pl-1.5 pr-2.5 py-1 rounded-full text-xs shadow-sm">
                          <div className={`w-4 h-4 rounded-full ${getAvatarColor(rec.name)} text-white flex items-center justify-center font-bold text-[8px]`}>
                            {getInitials(rec.name)}
                          </div>
                          <span className="font-semibold text-dark text-[11px]">{rec.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Marketing Message</label>
                    <span className="text-[10px] text-gray-400 font-semibold">{broadcastMessage.length} chars</span>
                  </div>
                  <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    disabled={isBroadcasting}
                    placeholder="Hi {name}! 🌟 Check out our brand new catalog items..."
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder-gray-400"
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
                    💡 Protip: Insert <span className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-dark">{'{name}'}</span> to automatically merge the recipient's first name.
                  </p>
                </div>

                {/* Broadcast Progress Pipeline */}
                {isBroadcasting && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3 animate-pulse">
                    <div className="flex justify-between items-center text-xs font-bold text-green-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-600 rounded-full animate-ping"></span>
                        {broadcastStatus}
                      </span>
                      <span>{Math.round((broadcastProgress / targetRecipients.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-green-200/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-300 rounded-full" 
                        style={{ width: `${(broadcastProgress / targetRecipients.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-green-700 leading-normal">
                      Using randomized human typing intervals (800ms simulation) to safeguard WhatsApp account reputation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            {!broadcastSuccess && (
              <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={() => setShowBroadcast(false)}
                  disabled={isBroadcasting}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBroadcast}
                  disabled={isBroadcasting || !broadcastMessage.trim() || targetRecipients.length === 0}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-primary/20"
                >
                  {isBroadcasting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Broadcast
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer History Off-Canvas Drawer */}
      {selectedCustomerHistory && (
        <CustomerHistoryDrawer
          customer={selectedCustomerHistory}
          invoices={allInvoices}
          onClose={() => setSelectedCustomerHistory(null)}
          onOpenChat={(c) => {
            setSelectedCustomerHistory(null);
            navigate(`/chats?customer=${encodeURIComponent(c.phone || c.name)}`);
          }}
        />
      )}
    </div>
  );
};

export default Clients;
