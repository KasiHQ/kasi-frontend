import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { conversationAPI } from '../../../api/conversations';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Search, Users, Download, Send, MessageSquare } from 'lucide-react';
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
  'High Value': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Repeat Likely': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Repeat': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Hot Lead': { bg: 'bg-green-100', text: 'text-green-700' },
  'Negotiating': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Browser': { bg: 'bg-gray-100', text: 'text-gray-600' },
  'New': { bg: 'bg-sky-100', text: 'text-sky-700' },
};

const platformBadge = (platform) => {
  if (platform === 'whatsapp') return { label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-50', icon: '📱' };
  if (platform === 'instagram') return { label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50', icon: '📷' };
  if (platform === 'telegram') return { label: 'Telegram', color: 'text-blue-500', bg: 'bg-blue-50', icon: '✈️' };
  return { label: platform || 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50', icon: '💬' };
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
    c.customer_phone === customer.phone ||
    c.customer_name === customer.name
  );

  const totalSpent = customer.total_spent || 0;
  const orderCount = customer.order_count || 0;

  if (totalSpent >= 500000) return 'High Value';
  if (orderCount >= 2) return 'Repeat';
  if (custConvs.some(c => c.status === 'Requires Attention')) return 'Hot Lead';
  if (custConvs.some(c => c.status === 'In Progress')) return 'Negotiating';
  if (orderCount === 0 && custConvs.length > 0) return 'Browser';
  return 'New';
};

const Clients = () => {
  const { token, logout } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();
  const [customers, setCustomers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

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

      // Merge conversation-only contacts into customer list
      const existingPhones = new Set(custData.map(c => c.phone).filter(Boolean));
      const conversationOnlyContacts = convData
        .filter(c => c.customer_phone && !existingPhones.has(c.customer_phone))
        .reduce((acc, c) => {
          if (!acc.has(c.customer_phone)) {
            acc.set(c.customer_phone, {
              id: `conv-${c.id}`,
              name: c.customer_name || `Customer ${c.customer_phone}`,
              phone: c.customer_phone,
              email: null,
              address: null,
              segment: 'New',
              total_spent: 0,
              order_count: 0,
              last_purchase_date: null,
              platform: c.platform,
              last_active: c.last_message_at,
              invoice_count: 0,
            });
          }
          return acc;
        }, new Map());

      // Enhance existing customers with conversation data
      const enhancedCustomers = custData.map(c => {
        const custConvs = convData.filter(cv =>
          cv.customer_phone === c.phone || cv.customer_name === c.name
        );
        const latestConv = custConvs.sort((a, b) =>
          new Date(b.last_message_at) - new Date(a.last_message_at)
        )[0];

        return {
          ...c,
          platform: latestConv?.platform || null,
          last_active: latestConv?.last_message_at || c.last_purchase_date,
          tag: deriveTag(c, convData),
        };
      });

      // Add conversation-only contacts
      const convOnlyArr = Array.from(conversationOnlyContacts.values()).map(c => ({
        ...c,
        tag: deriveTag(c, convData),
      }));

      setCustomers([...enhancedCustomers, ...convOnlyArr]);
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
  const payingBuyers = customers.filter(c => (c.order_count || 0) > 0).length;
  const totalRevenue = customers.reduce((s, c) => s + (c.total_spent || 0), 0);
  const hotLeads = customers.filter(c => c.tag === 'Hot Lead').length;

  // Tag counts for filters
  const tagCounts = customers.reduce((acc, c) => {
    const tag = c.tag || 'New';
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const filters = [
    { label: 'All', count: totalContacts },
    { label: 'Buyers', match: (c) => (c.order_count || 0) > 0, count: payingBuyers },
    { label: 'Hot Leads', match: (c) => c.tag === 'Hot Lead', count: tagCounts['Hot Lead'] || 0 },
    { label: 'Negotiating', match: (c) => c.tag === 'Negotiating', count: tagCounts['Negotiating'] || 0 },
    { label: 'Browsers', match: (c) => c.tag === 'Browser', count: tagCounts['Browser'] || 0 },
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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
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
          <p className="text-3xl font-black text-dark">{hotLeads}</p>
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
                  const tag = customer.tag || 'New';
                  const tc = tagConfig[tag] || tagConfig['New'];

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
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${pb.bg} ${pb.color}`}>
                            {pb.icon} {pb.label}
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
    </div>
  );
};

export default Clients;
