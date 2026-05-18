import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import { getAnalyticsData } from '../../../api/analytics';
import { AnalyticsSkeleton } from '../../../components/ui/Skeleton';
import useNetwork from '../../../hooks/useNetwork';

const formatNaira = (amount) => {
  if (amount === undefined || amount === null) return '₦0';
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}k`;
  return `₦${Number(amount).toLocaleString()}`;
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOnline = useNetwork();

  useEffect(() => {
    fetchData();
  }, [isOnline]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!isOnline) return;
      const response = await getAnalyticsData();
      if (response && response.status === 'success') {
        setData(response.data);
      }
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
    </div>
  );
};

export default Analytics;
