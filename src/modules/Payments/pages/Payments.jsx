import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import useNetwork from '../../../hooks/useNetwork';
import { getLocalInvoices, addInvoiceToLocal } from '../../../db/db';
import { 
  Search, CheckCircle, Calendar, ArrowUpRight, Eye, CreditCard, 
  ShieldCheck, Landmark, DollarSign, Wallet, FileText, 
  RefreshCw, Clock, XCircle, ArrowRightLeft, HelpCircle, X
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import DetailModal from '../../../components/ui/DetailModal';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

/* ── Ledger Split Calculation Card ─────────────────── */
const SplitLedgerCard = ({ total, fee, bankName, accNumber }) => {
  const net = total - fee;
  return (
    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 space-y-4">
      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paystack Instant Split Ledger</h4>
      
      <div className="space-y-2.5">
        {/* Total Collected */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Customer Payment (Gross Total)</span>
          <span className="font-semibold text-gray-900 dark:text-white">₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* 2% Kasi platform Fee */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Platform Fee (Paid by Customer)</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50">Auto Routing</span>
          </div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">₦{fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-2" />

        {/* 98% Merchant Net Payout */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Instant Vendor Revenue (100% of Product Price)</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">100% of product price settled directly</span>
          </div>
          <span className="text-base font-extrabold text-primary dark:text-emerald-400">₦{net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Target Settlement Bank Details */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
          <Landmark size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">
            {bankName || 'No bank connected'}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
            {accNumber ? `Account: ****${accNumber.slice(-4)}` : 'Link bank in Payout Settings to receive direct funds'}
          </p>
        </div>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>
    </div>
  );
};

/* ── Payment Detail Modal Content ─────────────────── */
const PaymentDetail = ({ invoice, user }) => {
  if (!invoice) return null;
  const isPaid = invoice.status === 'Paid';
  const total = invoice.total_amount || 0;
  const fee = invoice.platform_fee || (total * 0.02);

  return (
    <div className="space-y-6">
      {/* Transaction status card */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Reference ID</p>
          <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">{invoice.reference}</p>
        </div>
        <div>
          {isPaid ? (
            <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-green-100 dark:border-green-900/50 shadow-sm shadow-green-50/50">
              <CheckCircle size={13} /> Paid & Settled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-100 dark:border-amber-900/50 shadow-sm">
              <Clock size={13} /> Pending Payment
            </span>
          )}
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Customer Profile</p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
            {invoice.customer?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-800 dark:text-gray-200 truncate text-sm">{invoice.customer?.name || 'Walk-in Customer'}</p>
            {invoice.customer?.phone && <p className="text-xs text-gray-400 dark:text-gray-500">{invoice.customer.phone}</p>}
          </div>
        </div>
      </div>

      {/* Line items table */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-2.5">Order Summary</p>
        <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-left border-b border-gray-100 dark:border-gray-700/50">
                <th className="px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 font-bold">Item Description</th>
                <th className="px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 font-bold text-center">Qty</th>
                <th className="px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 font-bold text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {invoice.items?.map((item, i) => (
                <tr key={i} className="bg-white dark:bg-transparent">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{item.description}</td>
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-center font-semibold">{item.quantity}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 text-right">₦{item.unit_price?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Ledger Calculation (Only relevant for Paid, otherwise shows potential split) */}
      <SplitLedgerCard 
        total={total} 
        fee={fee} 
        bankName={user?.bank_name} 
        accNumber={user?.account_number} 
      />

      {/* Platform Note */}
      <div className="flex gap-2 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/30 dark:border-blue-800/30 rounded-xl p-3 text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
        <HelpCircle size={14} className="shrink-0 mt-0.5" />
        <p>
          Payout Routing operates entirely in real-time. Payments processed through Kasi's checkout links split platform commissions automatically at the point of charge. Fund deposits to your connected bank occur immediately.
        </p>
      </div>
    </div>
  );
};

/* ── Main Finance & Audit Dashboard Page ───────────── */
const Payments = () => {
  const { user, token, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'payouts'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Paid' | 'Pending'
  const isOnline = useNetwork();

  useEffect(() => {
    if (token) {
      fetchInvoices();
    }
  }, [token]);

  const fetchInvoices = async () => {
    try {
      let data = [];
      if (isOnline) {
        try {
          const response = await api.get('/api/invoices/');
          data = response.data;
          data.forEach(async (inv) => await addInvoiceToLocal(inv));
        } catch (apiError) {
          console.error('API Error, falling back to local DB:', apiError);
          data = await getLocalInvoices();
        }
      // Filter out non-paid invoices for this Finance Audit view
      const paidData = data.filter(inv => inv.status === 'Paid');
      setInvoices(paidData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        addToast('Failed to load financial records', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter calculations
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending');

  // Math totals
  const totalGrossRevenue = paidInvoices.reduce((sum, p) => sum + (p.total_amount || 0), 0);
  const totalPlatformFees = paidInvoices.reduce((sum, p) => sum + (p.platform_fee || (p.total_amount * 0.02)), 0);
  const netVendorEarnings = totalGrossRevenue - totalPlatformFees;
  const pendingSettlementVal = pendingInvoices.reduce((sum, p) => sum + (p.total_amount || 0), 0);

  // Search and status filters
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && inv.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {!isOnline && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-center shadow-sm border border-yellow-200">
          You are currently offline. Showing cached financial records.
        </div>
      )}

      {/* Header and connected Bank Info */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-dark dark:text-white mb-1 flex items-center gap-2">
            <DollarSign className="text-primary dark:text-emerald-400" />
            Finance & Sales Audit
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time ledger audit, commission analysis, and automated payouts.</p>
        </div>

        {/* Bank Connection Card */}
        {user?.bank_name ? (
          <div className="flex items-center gap-3.5 bg-gradient-to-tr from-emerald-50 dark:from-emerald-950/20 via-white dark:via-gray-800 to-white dark:to-gray-800 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-lg" />
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Landmark size={17} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{user.bank_name}</p>
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold truncate">
                Direct split Payout Account: ****{user.account_number.slice(-4)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 bg-gradient-to-tr from-amber-50 dark:from-amber-950/10 via-white dark:via-gray-800 to-white dark:to-gray-800 px-5 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Landmark size={17} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">No payout account linked</p>
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              </div>
              <button 
                onClick={() => navigate('/settings?tab=payment')}
                className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline transition-all block mt-0.5"
              >
                Connect bank for split payments
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-gradient-to-tr from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Gross Sales (GMV)</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">₦{totalGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
        </div>

        {/* Net Settlement */}
        <div className="bg-gradient-to-tr from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Direct Vendor Revenue (100%)</p>
          </div>
          <p className="text-2xl font-extrabold text-primary dark:text-emerald-400">₦{netVendorEarnings.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
        </div>

        {/* Platform Fees */}
        <div className="bg-gradient-to-tr from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Platform Fees (Paid by Customer)</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">₦{totalPlatformFees.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
        </div>

        {/* Paid Orders Count */}
        <div className="bg-gradient-to-tr from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paid Orders</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{paidInvoices.length}</p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 overflow-hidden shadow-sm">
        
        {/* Navigation Bar */}
        <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/40 dark:bg-gray-800/60">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-primary dark:bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-100 dark:hover:bg-gray-750'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText size={14} /> Sales Audit Log
              </span>
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                activeTab === 'payouts'
                  ? 'bg-primary dark:bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-100 dark:hover:bg-gray-750'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ArrowRightLeft size={14} /> Payout Settlements
              </span>
            </button>
          </div>

          {/* Filtering Controls */}
          {activeTab === 'audit' && (
            <div className="flex gap-3 w-full sm:w-auto shrink-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search ref or client..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Sales Audit Log */}
        {activeTab === 'audit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-800/40">
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Date Issued</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-right">Platform Fee (2%)</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-right">Vendor Revenue</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-right">Customer Paid</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/40">
                {loading ? (
                  <TableSkeleton rows={5} cols={8} />
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-16 text-gray-400 dark:text-gray-500">
                      <FileText size={38} className="mx-auto text-gray-200 dark:text-gray-750 mb-3" />
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No matching audit logs found</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try refining your search terms or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isPaid = inv.status === 'Paid';
                    const fee = inv.platform_fee || (inv.total_amount * 0.02);
                    const vendorNet = inv.total_amount - fee;
                    return (
                      <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv)}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-750/30 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-800 dark:text-gray-200">{inv.reference}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm font-semibold">{inv.customer?.name || 'Walk-in Customer'}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-medium">
                           <div className="flex items-center gap-2">
                             <Calendar size={13} />
                             {inv.date_issued}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                          ₦{fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-extrabold text-gray-850 dark:text-white">
                          ₦{vendorNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">
                          ₦{inv.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-100 dark:border-green-900/50">
                              <CheckCircle size={10} /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-100 dark:border-amber-900/50">
                              <Clock size={10} /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }}
                            className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-emerald-400 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Payout Settlements */}
        {activeTab === 'payouts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-800/40">
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Settlement Date</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Audit Ref</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">Split Account</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-right">Platform Fee (2%)</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-right">Vendor Payout (100% of product price)</th>
                  <th className="px-6 py-3.5 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider text-center">Payout Routing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/40">
                {loading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : paidInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-gray-400 dark:text-gray-500">
                      <ArrowRightLeft size={38} className="mx-auto text-gray-200 dark:text-gray-750 mb-3" />
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No payout settlements audited yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Audited split settlements will show up immediately when invoices are paid securely.</p>
                    </td>
                  </tr>
                ) : (
                  paidInvoices.map((inv) => {
                    const fee = inv.platform_fee || (inv.total_amount * 0.02);
                    const netPayout = inv.total_amount - fee;
                    return (
                      <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv)}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-750/30 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} />
                            {inv.date_issued}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-800 dark:text-gray-200">{inv.reference}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs font-mono font-bold">
                          {user?.bank_name ? `Paystack Split [${user.bank_name.slice(0,4).toUpperCase()}]` : 'Checkout Default'}
                        </td>
                        <td className="px-6 py-4 text-right text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                          ₦{fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-extrabold text-primary dark:text-emerald-400">
                          ₦{netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[9px] font-bold border border-emerald-100 dark:border-emerald-900/50">
                            <ShieldCheck size={9} /> Instant Transfer
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Detail Off-Canvas */}
      {selectedInvoice && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-[#101828]/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedInvoice(null)}
          />
          {/* Off-canvas Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-150 dark:border-gray-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-350 ease-out">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between select-none">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard size={18} className="text-primary dark:text-emerald-400" />
                  Transaction Breakdown
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Reference: {selectedInvoice.reference}</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <PaymentDetail invoice={selectedInvoice} user={user} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Payments;
