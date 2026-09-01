import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, Activity, Crown, Award, MessageSquare, Users, ArrowUpRight } from 'lucide-react';
import { getAnalyticsData } from '../../../api/analytics';
import api from '../../../api/axios';
import { AnalyticsSkeleton } from '../../../components/ui/Skeleton';
import useNetwork from '../../../hooks/useNetwork';

const formatNaira = (amount) => {
  if (amount === undefined || amount === null) return '₦0';
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}k`;
  return `₦${Number(amount).toLocaleString()}`;
};

const Analytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [bestCustomers, setBestCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useNetwork();

  useEffect(() => {
    fetchData();
  }, [isOnline]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!isOnline) return;
      const [analyticsRes, custRes] = await Promise.all([
        getAnalyticsData(),
        api.get('/api/invoices/customers').catch(() => ({ data: [] }))
      ]);

      if (analyticsRes && analyticsRes.status === 'success') {
        setData(analyticsRes.data);
      }

      const custData = custRes.data || [];
      // Sort customers by total spend / revenue descending
      const sorted = [...custData].sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0)).slice(0, 5);
      setBestCustomers(sorted);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOnline) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-dark">Analytics</h1>
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-200">
          Analytics are unavailable in Offline Mode.
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <AnalyticsSkeleton />;
  }

  const topCards = [
    { label: 'Total Revenue', value: formatNaira(data.total_agent_revenue), sublabel: 'This month', icon: DollarSign, color: 'text-primary' },
    { label: 'Net Profit', value: formatNaira(data.net_profit), sublabel: `${data.net_profit_margin}% avg. margin`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Avg. Deal Value', value: formatNaira(data.average_order_value), sublabel: 'Per transaction', icon: Target, color: 'text-blue-600' },
    { label: 'Conversion Rate', value: `${data.conversion_rate}%`, sublabel: 'DMs → purchases', icon: Activity, color: 'text-purple-600' },
  ];

  const platformSplit = data?.platform_split || [];
  const productMargins = data?.product_margins || [];
  const revenueByProduct = data?.revenue_by_product || [];

  return (
    <div className="p-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Analytics</h1>
        <p className="text-sm text-gray-400">Auto-calculated from your cost price and sales data</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-2xl font-black text-dark mb-1">{card.value}</p>
            <p className="text-xs text-gray-400">{card.sublabel}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Product Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-dark">Revenue by product (₦000s)</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByProduct} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip 
                  cursor={{ fill: '#f9f9f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                  {revenueByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#F97316" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="space-y-6">
          {/* Platform Split */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-dark mb-6">Platform split</h3>
            <div className="space-y-6">
              {platformSplit.map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">{p.name}</span>
                    <span className="text-gray-400">{p.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${p.name === 'WhatsApp' ? 'bg-green-500' : 'bg-pink-500'}`} 
                      style={{ width: `${p.value}%` }} 
                    />
                  </div>
                </div>
              ))}
              {platformSplit.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No platform data available</p>}
            </div>
          </div>

          {/* Margins by Product */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-dark mb-6">Margins by product</h3>
            <div className="space-y-5">
              {productMargins.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 truncate pr-4">{p.name}</span>
                  <span className="text-sm font-bold text-primary">{p.margin}</span>
                </div>
              ))}
              {productMargins.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No product margins available</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Best Customers (Top Spenders) Leaderboard */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-dark text-base flex items-center gap-2">
              <Crown className="text-amber-500 fill-amber-400" size={18} />
              Best Customers & Top Spenders
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">High value buyers ranked by lifetime purchase value</p>
          </div>
          <button 
            onClick={() => navigate('/customers')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Customer Database
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {bestCustomers.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-gray-400">
              No customer revenue records found yet.
            </div>
          ) : (
            bestCustomers.map((cust, idx) => {
              const ranks = [
                { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: '👑 #1 Top Buyer' },
                { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: '🥈 #2 Top Buyer' },
                { bg: 'bg-amber-50 text-amber-900 border-amber-100', icon: '🥉 #3 Top Buyer' },
              ];
              const rankInfo = ranks[idx] || { bg: 'bg-gray-100 text-gray-600 border-gray-200', icon: `#${idx + 1} Buyer` };

              return (
                <div key={cust.id || idx} className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {(cust.name || '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-dark text-sm leading-tight truncate">{cust.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{cust.phone || cust.email || '—'}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${rankInfo.bg}`}>
                      {rankInfo.icon}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lifetime Spend</p>
                      <p className="text-base font-black text-primary">₦{(cust.total_spent || 0).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/chats?customer=${encodeURIComponent(cust.phone || cust.name)}`)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-primary hover:text-white hover:border-primary text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <MessageSquare size={12} />
                      Chat
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
