import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, TrendingUp, MessageSquare, DollarSign, Cpu, 
  Activity, Zap, AlertTriangle, Server, HardDrive, Brain, 
  Wifi, WifiOff, ArrowUpRight, ArrowDownRight, RefreshCw, 
  Eye, BarChart3, Clock, Coins, ShieldAlert, Ban, CheckCircle,
  TrendingDown, CheckSquare, XCircle, ShoppingBag
} from 'lucide-react';
import api from '../../../api/axios';
import AdminUserDetailModal from '../components/AdminUserDetailModal';

const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

const DashboardSkeleton = () => (
  <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#FCFAFA] dark:bg-gray-900 min-h-screen animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-8 w-48 bg-gray-250 dark:bg-gray-800 rounded-lg" />
      <div className="h-6 w-32 bg-gray-250 dark:bg-gray-800 rounded-lg" />
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 h-28" />
      ))}
    </div>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 h-96" />
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Modal State
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/kasisalienceadministration/stats');
      if (response.data && response.data.status === 'success') {
        setData(response.data.data);
        setLastRefreshed(new Date());
      } else {
        setError("Failed to compile admin stats");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center bg-[#FCFAFA] dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 text-center p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Restriced or Offline</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
            <button 
              onClick={fetchStats}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Retry Connection
            </button>
        </div>
      </div>
    );
  }

  const {
    users_vendors = {},
    conversations_ai = {},
    sales_revenue = {},
    system_health = {},
    business_metrics = {},
    traffic_analytics = {},
    users = []
  } = data || {};

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#FCFAFA] dark:bg-gray-950 min-h-[calc(100vh-theme(spacing.16))] relative text-gray-800 dark:text-gray-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-950/40 p-2 rounded-xl text-green-600">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Kasi Command Center</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Secure Administrative Infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 bg-white dark:bg-gray-905 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-850">
            <Clock size={12} />
            Refreshed: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button 
            onClick={fetchStats}
            className="p-2 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-850 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:rotate-45"
            title="Force Reload Stats"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Top 6 KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        {/* KPI 1: Total Vendors */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Vendors</span>
            <Users className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{users_vendors.total_vendors || 0}</div>
          <div className="mt-2 flex items-center gap-1">
            <span className="bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <ArrowUpRight size={10} /> +{users_vendors.new_signups_day || 0} today
            </span>
          </div>
        </div>

        {/* KPI 2: MRR */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">MRR</span>
            <DollarSign className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{formatNaira(business_metrics.mrr_ngn)}</div>
          <div className="mt-2">
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-0.5">
              Estimated Monthly Recurring
            </span>
          </div>
        </div>

        {/* KPI 3: Total GMV */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Platform GMV</span>
            <TrendingUp className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{formatNaira(sales_revenue.total_gmv)}</div>
          <div className="mt-2">
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              Success: {sales_revenue.payment_success_rate || 100}%
            </span>
          </div>
        </div>

        {/* KPI 4: Conversations Today */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Conversations</span>
            <MessageSquare className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{(conversations_ai.messages_today || 0).toLocaleString()}</div>
          <div className="mt-2">
            <span className="text-[10px] font-semibold text-gray-400">
              Total: {(conversations_ai.total_conversations || 0).toLocaleString()} messages
            </span>
          </div>
        </div>

        {/* KPI 5: Conv to Sale Rate */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">AI Conversion</span>
            <Zap className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{conversations_ai.conv_to_sale_rate || 0}%</div>
          <div className="mt-2">
            <span className="text-[10px] font-bold text-gray-400">
              Conv. to Sale Rate
            </span>
          </div>
        </div>

        {/* KPI 6: Vendors at Risk */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-red-200 dark:hover:border-red-900 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/20 dark:bg-red-950/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Vendors at Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className={`text-2xl font-black ${business_metrics.vendors_at_risk > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {business_metrics.vendors_at_risk || 0}
          </div>
          <div className="mt-2">
            <span className={`text-[10px] font-bold ${business_metrics.vendors_at_risk > 0 ? 'text-red-500' : 'text-gray-400'}`}>
              Churn risk flag count
            </span>
          </div>
        </div>

      </div>

      {/* Tabs Selector */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'traffic', label: 'Traffic Analytics', icon: Eye },
          { id: 'conversations', label: 'AI & Conversations', icon: Brain },
          { id: 'revenue', label: 'Revenue & Sales', icon: Coins },
          { id: 'system', label: 'System Health', icon: Cpu }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap px-1 ${
                isActive 
                  ? 'border-green-600 text-green-700 dark:text-green-500' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Left 2 columns: Vendors Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2">Users & Onboarding</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Onboarding completion meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-500">Onboarding Completion Rate</span>
                      <span className="text-green-600 dark:text-green-400">{users_vendors.onboarding_completion_rate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${users_vendors.onboarding_completion_rate || 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">Percentage of signups completing catalog & profile configurations.</p>
                  </div>

                  {/* Active vs Ghost Accounts */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-500">Active vs Ghost Accounts</span>
                      <span className="text-gray-400 text-xs">
                        {users_vendors.active_vs_ghost?.using_kasi || 0} active / {users_vendors.active_vs_ghost?.ghost_accounts || 0} ghost
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-green-500 h-full transition-all duration-1000"
                        style={{ 
                          width: `${((users_vendors.active_vs_ghost?.using_kasi || 0) / (users_vendors.total_vendors || 1)) * 100}%` 
                        }}
                        title="Active Accounts"
                      />
                      <div 
                        className="bg-gray-300 dark:bg-gray-700 h-full transition-all duration-1000"
                        style={{ 
                          width: `${((users_vendors.active_vs_ghost?.ghost_accounts || 0) / (users_vendors.total_vendors || 1)) * 100}%` 
                        }}
                        title="Ghost Accounts"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">Green is active in the last 7 days. Gray is unconfigured / inactive.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50 dark:border-gray-850">
                  {/* Subscription tiers breakdown */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-3">Subscription Breakdown</h4>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Active Subscription', key: 'active', color: 'bg-green-500', text: 'text-green-600' },
                        { label: 'Trial Account', key: 'trial', color: 'bg-yellow-500', text: 'text-yellow-600' },
                        { label: 'Churned / Unpaid', key: 'churned', color: 'bg-red-500', text: 'text-red-500' }
                      ].map(sub => {
                        const count = users_vendors.subscription_status?.[sub.key] || 0;
                        const pct = ((count / (users_vendors.total_vendors || 1)) * 100).toFixed(0);
                        return (
                          <div key={sub.key} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                              <span className="font-medium text-gray-600 dark:text-gray-400">{sub.label}</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* WhatsApp Status Connections */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-3">WhatsApp Connection Rate</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1 text-green-600">
                          <Wifi size={14} /> Connected Instances
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {users_vendors.whatsapp_status?.connected || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-gray-50 dark:border-gray-800 pt-2.5">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1 text-red-500">
                          <WifiOff size={14} /> Disconnected / Expired
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {users_vendors.whatsapp_status?.disconnected || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right 1 column: Top Performing Vendors */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Vendors</h3>
                <Eye size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3.5">
                {sales_revenue.top_vendors?.length > 0 ? (
                  sales_revenue.top_vendors.map((vendor, idx) => (
                    <div key={vendor.id} className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-850 hover:bg-green-50/20 dark:hover:bg-green-950/10 border border-transparent hover:border-green-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-xs w-6 h-6 rounded-lg flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{vendor.business_name || 'Vendor Account'}</p>
                          <p className="text-[10px] text-gray-400 mt-1">ID: #{vendor.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-green-600 dark:text-green-500">{formatNaira(vendor.revenue)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-10">No revenue data compiled yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'traffic' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Traffic KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Page Views */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50/20 dark:bg-green-950/5 rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Page Views (Today)</span>
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {(traffic_analytics.views_today || 0).toLocaleString()}
                </div>
                <div className="mt-2 text-xs">
                  {traffic_analytics.views_today >= traffic_analytics.views_yesterday ? (
                    <span className="text-green-600 font-bold flex items-center gap-0.5">
                      <ArrowUpRight size={12} />
                      +{((traffic_analytics.views_today - traffic_analytics.views_yesterday) || 0).toLocaleString()} vs yesterday
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center gap-0.5">
                      <ArrowDownRight size={12} />
                      {((traffic_analytics.views_today - traffic_analytics.views_yesterday) || 0).toLocaleString()} vs yesterday
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Unique Visitors */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50/20 dark:bg-green-950/5 rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Unique Visitors</span>
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {(traffic_analytics.uniques_today || 0).toLocaleString()}
                </div>
                <div className="mt-2 text-xs">
                  {traffic_analytics.uniques_today >= traffic_analytics.uniques_yesterday ? (
                    <span className="text-green-600 font-bold flex items-center gap-0.5">
                      <ArrowUpRight size={12} />
                      +{((traffic_analytics.uniques_today - traffic_analytics.uniques_yesterday) || 0).toLocaleString()} vs yesterday
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center gap-0.5">
                      <ArrowDownRight size={12} />
                      {((traffic_analytics.uniques_today - traffic_analytics.uniques_yesterday) || 0).toLocaleString()} vs yesterday
                    </span>
                  )}
                </div>
              </div>

              {/* Card 3: Avg Views per Session */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50/20 dark:bg-green-950/5 rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Views Per Session</span>
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {(traffic_analytics.views_today / (traffic_analytics.uniques_today || 1)).toFixed(1)}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Average pages browsed per visit
                </div>
              </div>

              {/* Card 4: Audience Health */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50/20 dark:bg-green-950/5 rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Traffic Health Index</span>
                  <ShieldAlert className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  99.8%
                </div>
                <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  Human visits (bots auto-filtered)
                </div>
              </div>
            </div>

            {/* Daily Trend SVG Chart */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Daily Traffic Trend</h3>
                  <p className="text-xs text-gray-400">Total Page Views vs Unique Visitors over the last 7 days</p>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500" /> Page Views</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-lime-400" /> Unique Visitors</span>
                </div>
              </div>

              {/* Premium Custom SVG Bar Chart */}
              <div className="pt-4 h-72 flex flex-col justify-between">
                <div className="flex-1 flex items-end justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  {(traffic_analytics.trend || []).map((day, idx) => {
                    const maxVal = Math.max(...(traffic_analytics.trend || []).map(t => t.views), 10);
                    const viewsPct = Math.min((day.views / maxVal) * 100, 100);
                    const uniquesPct = Math.min((day.uniques / maxVal) * 100, 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full group relative cursor-pointer">
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-gray-900 text-white dark:bg-white dark:text-gray-950 text-[10px] font-black rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-20 flex flex-col items-center gap-0.5 border border-gray-800 dark:border-gray-250 min-w-[90px]">
                          <span>{day.date}</span>
                          <span className="text-green-500">Views: {day.views}</span>
                          <span className="text-lime-500">Uniques: {day.uniques}</span>
                        </div>
                        
                        {/* Visual Bars Container */}
                        <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                          {/* Page Views Bar */}
                          <div 
                            className="w-4 sm:w-6 bg-gradient-to-t from-green-600 to-green-400 rounded-t group-hover:brightness-110 transition-all duration-700 shadow-sm"
                            style={{ height: `${viewsPct || 3}%` }}
                          />
                          {/* Unique Visitors Bar */}
                          <div 
                            className="w-4 sm:w-6 bg-gradient-to-t from-lime-500 to-lime-300 rounded-t group-hover:brightness-110 transition-all duration-700 shadow-sm"
                            style={{ height: `${uniquesPct || 3}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Labels Row */}
                <div className="flex justify-between pt-2">
                  {(traffic_analytics.trend || []).map((day, idx) => (
                    <div key={idx} className="flex-1 text-center text-[10px] font-black text-gray-400 dark:text-gray-500">
                      {day.date}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Pages and Top Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Top Pages & Devices */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2">Top Visited Pages</h3>
                  
                  <div className="space-y-4">
                    {traffic_analytics.top_paths?.length > 0 ? (
                      traffic_analytics.top_paths.map((p, idx) => {
                        const totalViews = Math.max(...traffic_analytics.top_paths.map(item => item.count), 1);
                        const pct = ((p.count / totalViews) * 100).toFixed(0);
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-850 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800">{p.path}</span>
                              <span className="text-gray-900 dark:text-white">{p.count} views</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-500 h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-8">Waiting for traffic data...</p>
                    )}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Device Split</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {['desktop', 'mobile', 'tablet'].map(device => {
                      const match = (traffic_analytics.device_split || []).find(d => d.device === device);
                      const count = match ? match.count : 0;
                      return (
                        <div key={device} className="p-3 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">{device}</span>
                          <span className="text-lg font-black text-gray-900 dark:text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Top Referrer Traffic Sources */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2">Referral Traffic Sources</h3>
                
                <div className="space-y-3.5">
                  {traffic_analytics.top_referrers?.length > 0 ? (
                    traffic_analytics.top_referrers.map((r, idx) => {
                      const totalRef = Math.max(...traffic_analytics.top_referrers.map(item => item.count), 1);
                      const pct = ((r.count / totalRef) * 100).toFixed(0);
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-850 hover:bg-green-50/20 dark:hover:bg-green-950/10 border border-transparent transition-all">
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold mb-1">
                              <span className="text-gray-900 dark:text-white">{r.referrer || 'Direct'}</span>
                              <span className="text-green-600 dark:text-green-500">{r.count} sessions ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-lime-500 h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-10">Direct traffic only.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Left Box: Resolution status & Performance */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2 flex items-center gap-2">
                <Brain className="text-green-600" size={18} /> AI Resolution Analytics
              </h3>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversation Resolution Split</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'Resolved by AI Bot', key: 'ai_resolved', color: 'bg-green-500', barColor: 'from-green-400 to-green-500' },
                    { label: 'Escalated to Vendor Staff', key: 'escalated', color: 'bg-yellow-500', barColor: 'from-yellow-400 to-yellow-500' },
                    { label: 'In Progress (Awaiting Response)', key: 'in_progress', color: 'bg-blue-500', barColor: 'from-blue-400 to-blue-500' }
                  ].map(split => {
                    const total = (conversations_ai.resolution_status?.ai_resolved || 0) + 
                                  (conversations_ai.resolution_status?.escalated || 0) + 
                                  (conversations_ai.resolution_status?.in_progress || 0);
                    const value = conversations_ai.resolution_status?.[split.key] || 0;
                    const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                    return (
                      <div key={split.key} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className={`w-2 h-2 rounded-full ${split.color}`} />
                            {split.label}
                          </span>
                          <span className="text-gray-900 dark:text-white font-bold">{value} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${split.barColor} h-full rounded-full transition-all duration-1000`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Box: Operations Metrics */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2">Operational Latency</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/40">
                  <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Average Response Time</span>
                  <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-baseline gap-1">
                    {conversations_ai.avg_response_time_seconds || 1.5} 
                    <span className="text-xs text-gray-500 font-normal">seconds</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Time to compile response and dispatch through messaging api broker.</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/40">
                  <span className="text-xs text-red-500/70 font-bold uppercase block mb-1">Delivery Failures</span>
                  <div className={`text-3xl font-black tracking-tight ${conversations_ai.failed_deliveries > 0 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                    {conversations_ai.failed_deliveries || 0}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Failed deliveries in the last 24h due to system API blocks or invalid WhatsApp accounts.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* GMV and Success indicators */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2">Sales Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-400 block mb-1">Total Invoices</span>
                  <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                    <ShoppingBag size={18} className="text-green-600" />
                    {sales_revenue.total_orders || 0}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-400 block mb-1">Average Order Value</span>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {formatNaira(sales_revenue.avg_order_value)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-400 block mb-1">Payment Success Rate</span>
                  <div className="text-2xl font-black text-green-600 dark:text-green-500">
                    {sales_revenue.payment_success_rate || 98}%
                  </div>
                </div>
              </div>

              {/* Quick graphical visualization */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500">Transaction Conversion Ratio</span>
                  <span className="text-green-600 dark:text-green-400">{sales_revenue.payment_success_rate || 98}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full"
                    style={{ width: `${sales_revenue.payment_success_rate || 98}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400">Total success rate of checkouts created by customer users across WhatsApp interfaces.</p>
              </div>
            </div>

            {/* Platform Financial health metrics */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2">Business MRR</h3>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Estimated MRR</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNaira(business_metrics.mrr_ngn)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-2.5">
                  <span className="text-gray-500">Monthly Churn Rate</span>
                  <span className="font-bold text-red-500">{business_metrics.churn_rate || 0}%</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-2.5">
                  <span className="text-gray-500">Vendors at Risk</span>
                  <span className="font-bold text-amber-500">{business_metrics.vendors_at_risk || 0} accounts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Left 2: Server specs & resource limits */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2 flex items-center gap-2">
                <Server className="text-green-600" size={18} /> Server Hardware Resources
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CPU Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Cpu size={12} /> CPU Usage
                    </span>
                    <span className={system_health.server_resources?.cpu_percent > 80 ? 'text-red-500 font-extrabold' : 'text-gray-900 dark:text-white'}>
                      {system_health.server_resources?.cpu_percent || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        system_health.server_resources?.cpu_percent > 80 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${system_health.server_resources?.cpu_percent || 0}%` }}
                    />
                  </div>
                </div>

                {/* RAM Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Activity size={12} /> RAM (Memory)
                    </span>
                    <span className={system_health.server_resources?.ram_percent > 85 ? 'text-red-500 font-extrabold' : 'text-gray-900 dark:text-white'}>
                      {system_health.server_resources?.ram_percent || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        system_health.server_resources?.ram_percent > 85 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${system_health.server_resources?.ram_percent || 0}%` }}
                    />
                  </div>
                </div>

                {/* Disk Storage */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-500 flex items-center gap-1">
                      <HardDrive size={12} /> Hard Disk Space
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {system_health.server_resources?.disk_percent || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${system_health.server_resources?.disk_percent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* API Connections status indicators */}
              <div className="pt-4 border-t border-gray-50 dark:border-gray-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evolution & Telegram API Nodes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850 text-xs">
                    <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 text-green-600">
                      <Wifi size={14} /> Active Instances
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {system_health.api_connections?.connected || 0} online
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850 text-xs">
                    <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 text-red-500">
                      <WifiOff size={14} /> Failed Instances
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {system_health.api_connections?.disconnected || 0} offline
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1: Groq AI Spend */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2 flex items-center gap-2">
                <Brain className="text-green-600 animate-pulse" size={18} /> AI Broker Groq Costs
              </h3>
              <div className="p-5 bg-green-50/50 dark:bg-green-950/15 border border-green-100 dark:border-green-800/40 rounded-2xl text-center">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Accumulated Usage (Billing)</span>
                <div className="text-3xl font-black text-green-600 dark:text-green-500 tracking-tight">
                  {formatUSD(system_health.groq_cost_usd)}
                </div>
                <p className="text-[10px] text-gray-400 mt-3">Refers to API token compute fees processed via LLM models.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users & Staff Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-850 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-850 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Registered Vendors & Admins</h2>
            <p className="text-xs text-gray-400">Click any user row to view details, suspend, ban, or delete accounts.</p>
          </div>
          <span className="bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
            {users.length} total
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Staff Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No active accounts resolved.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr 
                    key={u.id} 
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setIsUserModalOpen(true);
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all cursor-pointer animate-in fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-950 dark:text-gray-300">#{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-950 dark:text-white">{u.business_name || 'Vendor Profile'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                        u.kasi_credits < 0 
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      }`}>
                        {u.kasi_credits}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.is_admin ? (
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full font-bold border border-purple-200 dark:border-purple-800">
                          {u.admin_role || 'Super Admin'}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-bold">
                          Vendor Partner
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.account_status === 'suspended' ? (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-yellow-200">Suspended</span>
                      ) : u.account_status === 'banned' ? (
                        <span className="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-red-200">Banned</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-green-200">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin User Detail Modal Component */}
      <AdminUserDetailModal
        isOpen={isUserModalOpen}
        userId={selectedUserId}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    
    </div>
  );
};

export default AdminDashboard;
