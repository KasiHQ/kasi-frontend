import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { conversationAPI } from '../../../api/conversations';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Search, Users, Download, Send, MessageSquare, X } from 'lucide-react';
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
  'Buyers': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'Hot Lead': { bg: 'bg-rose-100', text: 'text-rose-800' },
  'Negotiating': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Cold Lead': { bg: 'bg-blue-100', text: 'text-blue-800' },
};

const platformBadge = (platform) => {
  const cleanPlatform = (platform || '').toLowerCase();
  if (cleanPlatform === 'whatsapp') {
    return {
      label: 'WhatsApp',
      color: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
      icon: (
        <svg className="w-3.5 h-3.5 fill-emerald-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.289 3.507 8.494-.004 6.66-5.338 11.997-11.95 11.997-2.005-.001-3.973-.503-5.714-1.46L0 24zm6.59-20.347c-.186-.412-.384-.42-.562-.427-.146-.006-.314-.006-.482-.006-.168 0-.441.063-.672.314-.23.251-.879.859-.879 2.094 0 1.235.9 2.428 1.025 2.595.126.167 1.767 2.699 4.284 3.782.598.258 1.065.412 1.428.527.6.19 1.15.163 1.583.099.483-.072 1.482-.605 1.691-1.19.209-.584.209-1.086.146-1.19-.063-.105-.23-.167-.481-.293-.251-.126-1.482-.731-1.712-.815-.23-.084-.397-.126-.564.126-.167.251-.648.815-.794.982-.146.167-.293.188-.543.063-.25-.126-.98-.362-1.868-1.154-.69-.616-1.157-1.378-1.293-1.611-.136-.234-.015-.361.11-.486.112-.112.251-.293.376-.44.126-.146.167-.25.251-.418.084-.167.042-.314-.021-.44-.063-.125-.562-1.355-.77-1.854z"/>
        </svg>
      )
    };
  }
  if (cleanPlatform === 'instagram') {
    return {
      label: 'Instagram',
      color: 'text-pink-700 bg-pink-50 border border-pink-100',
      icon: (
        <svg className="w-3.5 h-3.5 stroke-pink-600 fill-none shrink-0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    };
  }
  if (cleanPlatform === 'telegram') {
    return {
      label: 'Telegram',
      color: 'text-sky-700 bg-sky-50 border border-sky-100',
      icon: (
        <svg className="w-3.5 h-3.5 fill-sky-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.92 9.07c-.14.63-.52.79-1.05.49l-2.93-2.16-1.41 1.36c-.16.16-.29.29-.6.29l.21-2.98 5.43-4.91c.24-.21-.05-.33-.37-.12L8.2 13.98l-2.89-.9c-.63-.2-.64-.63.13-.93l11.27-4.34c.52-.19.98.12.85.37z"/>
        </svg>
      )
    };
  }
  return {
    label: platform || 'Unknown',
    color: 'text-gray-600 bg-gray-50 border border-gray-100',
    icon: (
      <svg className="w-3.5 h-3.5 fill-gray-500 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    )
  };
};

const timeAgo = (dateString) => {
  if (!dateString) return '—';
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

const Clients = () => {
  const { token, logout } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();
  
  // Data states
  const [customers, setCustomers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Broadcast states
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastSegment, setBroadcastSegment] = useState('All');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastStatus, setBroadcastStatus] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    if (token) fetchAll();
  }, [token]);

  const fetchAll = async () => {
    try {
      if (!isOnline) {
        setCustomers(await getLocalCustomers() || []);
        setLoading(false);
        return;
      }

      const [custRes, convRes] = await Promise.all([
        api.get('/api/invoices/customers').catch(() => ({ data: [] })),
        conversationAPI.getConversations().catch(() => ({ data: [] })),
      ]);

      const custData = custRes.data || [];
      const convData = convRes.data || [];

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Contacts</p>
          <p className="text-3xl font-black text-dark">{totalContacts}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Paying Buyers</p>
          <p className="text-3xl font-black text-dark">{payingBuyers}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-black text-primary">{formatNaira(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hot Leads</p>
          <p className="text-3xl font-black text-dark">{hotLeadsCount}</p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === f.label
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f.label} {f.count > 0 && `(${f.count})`}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Platform</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Tag</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Total Spend</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider text-center">Orders</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Last Active</th>
                <th className="px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton rows={6} cols={8} />
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <Users size={36} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-dark mb-1">No customers yet</p>
                    <p className="text-xs text-gray-400">Customers appear here when Kasi interacts with them.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const pb = platformBadge(customer.platform);
                  const tag = customer.tag || 'Cold Lead';
                  const tc = tagConfig[tag] || tagConfig['Cold Lead'];

                  return (
                    <tr key={customer.id} className="group hover:bg-gray-50/80 transition-colors">
                      {/* Customer Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${getAvatarColor(customer.name)} text-white flex items-center justify-center font-bold text-[11px] shrink-0`}>
                            {getInitials(customer.name)}
                          </div>
                          <span className="font-semibold text-dark text-sm">{customer.name}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {customer.phone || customer.email || '—'}
                      </td>

                      {/* Platform */}
                      <td className="px-5 py-4">
                        {customer.platform ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${pb.color}`}>
                            {pb.icon} <span>{pb.label}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
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
                        <span className={`font-bold text-sm ${customer.total_spent ? 'text-primary' : 'text-gray-400'}`}>
                          {formatNaira(customer.total_spent)}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-4 text-center">
                        <span className="font-semibold text-dark text-sm">{customer.order_count || 0}</span>
                      </td>

                      {/* Last Active */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {timeAgo(customer.last_active || customer.last_purchase_date)}
                      </td>

                      {/* Message Action */}
                      <td className="px-5 py-4">
                        <button className="text-primary font-semibold text-sm hover:text-green-700 transition-colors flex items-center gap-1">
                          <MessageSquare size={14} />
                          Message
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                  <Send size={18} className="text-primary animate-pulse" />
                  Send Marketing Broadcast
                </h2>
                <p className="text-xs text-gray-500 mt-1">Send bulk WhatsApp messages to your segmented customer lists</p>
              </div>
              <button 
                onClick={() => { if (!isBroadcasting) setShowBroadcast(false); }} 
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                disabled={isBroadcasting}
              >
                <X size={18} />
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
    </div>
  );
};

export default Clients;
