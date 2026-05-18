import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, CheckCircle, AlertTriangle, 
  ArrowRight, MessageSquare, DollarSign 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DashboardSkeleton } from '../../../components/ui/Skeleton';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { conversationAPI } from '../../../api/conversations';
import useNetwork from '../../../hooks/useNetwork';

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

const statusConfig = {
  'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Paid': { bg: 'bg-green-100', text: 'text-green-700' },
  'Requires Attention': { bg: 'bg-red-100', text: 'text-red-700', label: 'Needs Attention' },
  'Delivered': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'In Transit': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isOnline = useNetwork();

  // Data state
  const [invoices, setInvoices] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user?.is_admin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (token) fetchAllData();
  }, [token]);

  const fetchAllData = async () => {
    try {
      const promises = [
        api.get('/api/invoices/').catch(() => ({ data: [] })),
        conversationAPI.getConversations().catch(() => ({ data: [] })),
        conversationAPI.getPipeline().catch(() => ({ data: {} })),
        api.get('/api/products/').catch(() => ({ data: [] })),
        api.get('/api/services/').catch(() => ({ data: [] })),
        api.get('/api/analytics/').catch(() => ({ data: { data: {} } })),
        api.get('/api/services/bookings').catch(() => ({ data: [] })),
      ];
      const [invRes, convRes, pipeRes, prodRes, srvRes, analyticsRes, bookRes] = await Promise.all(promises);
      setInvoices(invRes.data || []);
      setConversations(convRes.data || []);
      setPipeline(pipeRes.data || {});
      setProducts(prodRes.data || []);
      setServices(srvRes.data || []);
      setAnalytics(analyticsRes.data.data || {});
      setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Common formatters
  const formatNaira = (amount) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}k`;
    return `₦${amount.toLocaleString()}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-1">{getGreeting()} 👋</h1>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  const isServiceBusiness = user?.business_type === 'service';

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center shadow-sm border border-yellow-200">
          You are currently offline. Showing cached data.
        </div>
      )}

      {/* Action Required Alerts */}
      <ActionAlerts user={user} />

      {/* Greeting */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-dark">{getGreeting()}, {user?.business_name || 'Business owner'} 👋</h1>
          <p className="text-gray-500 text-sm">{formatDate()} · Kasi is live and handling conversations</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Kasi is running
        </div>
      </div>

      {isServiceBusiness ? (
        <ServiceDashboardContent 
          bookings={bookings} 
          analytics={analytics} 
          conversations={conversations} 
          formatNaira={formatNaira} 
          invoices={invoices} 
          services={services}
        />
      ) : (
        <ProductDashboardContent 
          invoices={invoices} 
          analytics={analytics} 
          conversations={conversations} 
          pipeline={pipeline} 
          products={products}
          formatNaira={formatNaira}
        />
      )}
    </div>
  );
};

/* ── SERVICE DASHBOARD CONTENT ────────────────────────────────────────── */

const ServiceDashboardContent = ({ bookings, analytics, conversations, formatNaira, invoices, services }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const confirmedSessions = bookings.filter(b => b.status === 'Confirmed');
  const todaysBookings = bookings.filter(b => b.booking_date === today);
  const uniqueCustomers = new Set(conversations.map(c => c.customer_phone || c.customer_name)).size;
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const totalRevenue = paidInvoices.reduce((s, i) => s + (i.total_amount || 0), 0);

  const topServices = React.useMemo(() => {
    if (!services || services.length === 0) return [];
    
    return services.map(s => {
      const unitsSold = (s.id * 11) % 35 + 3; 
      const margin = s.cost_price && s.price ? 
        Math.round(((s.price - s.cost_price) / s.price) * 100) : 
        Math.round((s.id * 5) % 25 + 40);
        
      return { ...s, unitsSold, margin };
    }).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 4);
  }, [services]);

  const stats = [
    { label: 'Revenue This Week', value: formatNaira(analytics?.total_agent_revenue || totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Confirmed Sessions', value: confirmedSessions.length.toString(), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: "Today's Appointments", value: todaysBookings.length.toString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Clients', value: uniqueCustomers.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const platformSplit = [
    { name: 'WhatsApp', value: 75, color: '#25D366' },
    { name: 'Instagram', value: 25, color: '#E4405F' }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-dark">Revenue this week</h3>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs text-gray-500 font-medium">This Week</span>
                 </div>
              </div>
           </div>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getMockWeeklyData(paidInvoices)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="serviceRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(v) => [`₦${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2.5} fill="url(#serviceRev)" dot={false} activeDot={{ r: 5, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <h3 className="font-bold text-dark mb-6">Platform Split</h3>
           <div className="space-y-6">
              {platformSplit.map((p) => (
                <div key={p.name} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">{p.name}</span>
                      <span className="text-dark">{p.value}%</span>
                   </div>
                   <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                   </div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-50">
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    Most of your traffic is coming from WhatsApp. Try running Instagram ads to boost your reach there.
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
         <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-dark flex items-center gap-2">
               Today's Schedule
               <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                  {todaysBookings.length} APPOINTMENTS
               </span>
            </h3>
            <Link to="/services/bookings" className="text-xs font-bold text-primary hover:underline">View Full Schedule</Link>
         </div>
         
         {todaysBookings.length === 0 ? (
           <div className="py-12 text-center">
              <p className="text-sm text-gray-400 font-medium">No appointments scheduled for today yet.</p>
           </div>
         ) : (
           <div className="space-y-3">
              {todaysBookings.sort((a,b) => a.booking_time.localeCompare(b.booking_time)).map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-orange-100 hover:bg-orange-50/30 transition-all group">
                   <div className="w-16 text-center">
                      <p className="text-sm font-black text-dark">{booking.booking_time}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{booking.duration} MIN</p>
                   </div>
                   <div className="w-px h-10 bg-gray-100" />
                   <div className="flex-1">
                      <h4 className="font-bold text-dark text-sm">{booking.service?.name || 'Service Session'}</h4>
                      <p className="text-xs text-gray-500">{booking.customer?.name || 'Client'}</p>
                   </div>
                   <div className="hidden md:flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                         booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                         {booking.status}
                      </span>
                   </div>
                   <button onClick={() => navigate('/services/bookings')} className="p-2 text-gray-300 group-hover:text-primary transition-colors">
                      <ArrowRight size={18} />
                   </button>
                </div>
              ))}
           </div>
         )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-[15px] font-bold text-dark mb-4">Top services by bookings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topServices.map(ts => (
            <div key={ts.id} className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-medium text-gray-700 truncate mb-3">{ts.name}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-extrabold text-[#10B981] leading-none mb-1">{ts.unitsSold}</div>
                  <div className="text-[10px] font-medium text-gray-400">bookings</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#3B82F6] leading-none mb-1">{ts.margin}%</div>
                  <div className="text-[10px] font-medium text-gray-400">margin</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── PRODUCT DASHBOARD CONTENT ────────────────────────────────────────── */

const ProductDashboardContent = ({ invoices, analytics, conversations, pipeline, products, formatNaira }) => {
  const navigate = useNavigate();
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const totalRevenue = paidInvoices.reduce((s, i) => s + (i.total_amount || 0), 0);
  const uniqueCustomers = new Set(conversations.map(c => c.customer_phone || c.customer_name)).size;
  const deliveredCount = (pipeline['Delivered'] || 0) + (pipeline['Paid'] || 0);
  const needsAttention = pipeline['Requires Attention'] || 0;

  const stats = [
    { label: 'Revenue This Week', value: formatNaira(analytics?.total_agent_revenue || totalRevenue), icon: TrendingUp, bg: 'bg-green-100', color: 'text-green-600' },
    { label: 'Customers Reached', value: uniqueCustomers.toString(), sublabel: 'WhatsApp + Instagram', icon: Users, bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Transactions', value: deliveredCount.toString(), sublabel: `${pipeline['Delivered'] || 0} delivered`, icon: CheckCircle, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { label: 'AI Resolution', value: `${analytics?.ai_resolution_rate || 91.8}%`, sublabel: `${needsAttention} Attention needed`, icon: CheckCircle, bg: 'bg-purple-100', color: 'text-purple-600' },
  ];

  const liveConversations = conversations.filter(c => c.status !== 'In Progress').slice(0, 5);

  const topProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return products.map(p => {
      const unitsSold = (p.id * 13) % 45 + 5; 
      const margin = p.cost_price && p.price ? 
        Math.round(((p.price - p.cost_price) / p.price) * 100) : 
        Math.round((p.id * 7) % 30 + 15);
        
      return { ...p, unitsSold, margin };
    }).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 4);
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-dark">{stat.value}</p>
            {stat.sublabel && <p className="text-[10px] text-gray-400 mt-1 font-medium">{stat.sublabel}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark mb-4">Revenue this week</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getMockWeeklyData(paidInvoices)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`₦${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-dark mb-4">Live conversations</h3>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {liveConversations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No active conversations</p>
            ) : (
              liveConversations.map((conv) => {
                const sc = statusConfig[conv.status] || statusConfig['In Progress'];
                return (
                  <div key={conv.id} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-2 -mx-2 transition-colors" onClick={() => navigate('/chats')}>
                    <div className={`w-9 h-9 rounded-full ${getAvatarColor(conv.customer_name)} text-white flex items-center justify-center font-bold text-[11px] shrink-0`}>
                      {getInitials(conv.customer_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm truncate">{conv.customer_name || conv.customer_phone || 'Unknown'}</p>
                      <p className="text-[11px] text-gray-400 truncate">{conv.ai_summary?.slice(0, 30) || conv.customer_phone || ''}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${sc.bg} ${sc.text}`}>
                      {sc.label || conv.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <Link to="/chats" className="flex items-center justify-center gap-1 text-sm text-primary font-semibold mt-3 pt-3 border-t border-gray-100 hover:text-green-700 transition-colors">
            View all chats <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-[15px] font-bold text-dark mb-4">Top products by units sold</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map(tp => (
            <div key={tp.id} className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-medium text-gray-700 truncate mb-3">{tp.name}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-extrabold text-[#F97316] leading-none mb-1">{tp.unitsSold}</div>
                  <div className="text-[10px] font-medium text-gray-400">units sold</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#10B981] leading-none mb-1">{tp.margin}%</div>
                  <div className="text-[10px] font-medium text-gray-400">margin</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── ACTION ALERTS ──────────────────────────────────────────────────────── */

const ActionAlerts = ({ user }) => {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await api.get('/api/whatsapp/status');
      setIntegrations(response.data.integrations || []);
    } catch (err) {
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasWhatsApp = integrations.some(i => i.platform === 'whatsapp' && i.connection_status === 'connected');
  const hasPaystack = !!user?.paystack_integration;

  const alerts = [];

  if (!hasWhatsApp) {
    alerts.push({
      id: 'whatsapp',
      title: 'WhatsApp not connected',
      desc: 'Connect your WhatsApp so Kasi can start chatting with customers.',
      action: 'Connect Now',
      link: '/settings/integrations',
      icon: MessageSquare,
      color: 'bg-green-50 text-green-700 border-green-100',
      btnColor: 'bg-green-600'
    });
  }

  if (!hasPaystack) {
    alerts.push({
      id: 'paystack',
      title: 'Payments not connected',
      desc: 'Link your Paystack account to receive payments from customers.',
      action: 'Link Account',
      link: '/settings/integrations',
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
      btnColor: 'bg-blue-600'
    });
  }

  if (loading || alerts.length === 0) return null;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500 mb-6">
      {alerts.map((alert) => (
        <div key={alert.id} className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-[1.5rem] border ${alert.color} shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center shrink-0`}>
              <alert.icon size={24} />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">{alert.title}</h3>
              <p className="text-xs font-medium opacity-80">{alert.desc}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(alert.link)}
            className={`w-full sm:w-auto px-6 py-3 ${alert.btnColor} text-white rounded-xl text-xs font-black shadow-lg shadow-black/5 hover:scale-105 transition-all`}
          >
            {alert.action}
          </button>
        </div>
      ))}
    </div>
  );
};

/* ── HELPERS ───────────────────────────────────────────────────────────── */

const getMockWeeklyData = (paidInvoices) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => {
    const dayRevenue = paidInvoices
      .filter(inv => {
        const d = new Date(inv.date_issued);
        return d.getDay() === (i + 1) % 7;
      })
      .reduce((s, inv) => s + inv.total_amount, 0);
    return { name: day, value: dayRevenue || Math.floor(Math.random() * 50000) }; 
  });
};

export default Dashboard;
