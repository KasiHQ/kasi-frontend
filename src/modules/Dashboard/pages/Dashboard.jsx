import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, CheckCircle, AlertTriangle, 
  ArrowRight, MessageSquare, DollarSign, Cpu,
  Package, ShoppingBag, Clock, UserPlus, Tag, Share2, BarChart3, Briefcase, Calendar,
  Megaphone, Settings, GraduationCap, UserCheck, Truck, MapPin
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DashboardSkeleton } from '../../../components/ui/Skeleton';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { conversationAPI } from '../../../api/conversations';
import useNetwork from '../../../hooks/useNetwork';

// Naira Icon for Settlement payouts
const NairaIcon = ({ className }) => (
  <span className={`font-extrabold flex items-center justify-center select-none ${className}`} style={{ fontStyle: 'normal', fontSize: '18px', fontWeight: '900', lineHeight: 1 }}>₦</span>
);

// Dynamic Color Mapping for Avatars (B -> Green, T -> Pink, O -> Purple)
const getAvatarTheme = (name) => {
  if (!name) return { bg: 'bg-[#1A7A4A]', text: 'text-white' };
  const initial = name.trim().charAt(0).toUpperCase();
  if (initial === 'B') return { bg: 'bg-[#1A7A4A]', text: 'text-white' };
  if (initial === 'T') return { bg: 'bg-[#EC4899]', text: 'text-white' };
  if (initial === 'O') return { bg: 'bg-[#7A5AF8]', text: 'text-white' };
  
  // Dynamic fallback
  const themes = [
    { bg: 'bg-[#1A7A4A]', text: 'text-white' }, // Green
    { bg: 'bg-[#EC4899]', text: 'text-white' }, // Pink
    { bg: 'bg-[#7A5AF8]', text: 'text-white' }, // Purple
    { bg: 'bg-[#175CD3]', text: 'text-white' }, // Blue
    { bg: 'bg-[#F97316]', text: 'text-white' }, // Orange
  ];
  return themes[name.charCodeAt(0) % themes.length];
};

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// Clean Product Semantic Status Colors
const statusConfig = {
  'In Progress': { bg: 'bg-[#EFF8FF]', text: 'text-[#175CD3]', label: 'In Progress' },
  'Paid': { bg: 'bg-[#ECFDF3]', text: 'text-[#027A48]', label: 'Paid' },
  'Requires Attention': { bg: 'bg-[#FFFAEB]', text: 'text-[#B54708]', label: 'Needs Attention' },
  'Delivered': { bg: 'bg-[#ECFDF3]', text: 'text-[#027A48]', label: 'Delivered' },
  'In Transit': { bg: 'bg-[#F0F9FF]', text: 'text-[#026AA2]', label: 'In Transit' },
};

// Custom Status Badge with Semantic Dot
const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { bg: 'bg-[#EFF8FF]', text: 'text-[#175CD3]', label: status };
  const dotColor = {
    'bg-[#EFF8FF]': 'bg-[#2E90FA]',
    'bg-[#ECFDF3]': 'bg-[#12B76A]',
    'bg-[#FFFAEB]': 'bg-[#F79009]',
    'bg-[#F0F9FF]': 'bg-[#0284C7]'
  }[config.bg] || 'bg-[#2E90FA]';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5`} />
      {config.label || status}
    </span>
  );
};

// Custom Chart Tooltip: styled in midnight blue with downward arrow
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative bg-[#101828] text-white px-3 py-2 rounded-lg text-[13px] font-semibold shadow-md flex flex-col items-center">
        <span>{`${label} · ₦${payload[0].value.toLocaleString()}`}</span>
        {/* Downward pointing arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#101828] rotate-45" />
      </div>
    );
  }
  return null;
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
      navigate('/kasisalienceadministration');
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
    if (amount === 0 || !amount) return '₦0';
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
      <div className="kasi-app space-y-8 min-h-screen bg-[#F7F8FA] p-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828] mb-1">{getGreeting()} 👋</h1>
          <p className="text-[#667085] text-sm">Loading your dashboard...</p>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  const isServiceBusiness = user?.business_type === 'service';

  return (
    <div className="kasi-app space-y-6 bg-[#F7F8FA] min-h-screen">
      {!isOnline && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center border border-yellow-200">
          You are currently offline. Showing cached data.
        </div>
      )}

      {/* Action Required Alert Banners */}
      <ActionAlerts user={user} />

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828] tracking-tight leading-tight">
            {getGreeting()}, {user?.business_name || 'AFH'} 👋
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            {formatDate()} · Kasi is live and handling conversations
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#ECFDF3] text-[#027A48] border border-[#D1FAE5] px-4 py-2 rounded-full text-xs font-semibold self-start sm:self-center shadow-sm select-none">
          <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse" />
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

  // Calculate real week-over-week revenue
  const thisWeekRevenue = React.useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); 
    startOfWeek.setHours(0,0,0,0);
    return paidInvoices
      .filter(inv => new Date(inv.date_issued) >= startOfWeek)
      .reduce((s, inv) => s + (inv.total_amount || 0), 0);
  }, [paidInvoices]);

  const lastWeekRevenue = React.useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); 
    startOfWeek.setHours(0,0,0,0);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    return paidInvoices
      .filter(inv => {
        const d = new Date(inv.date_issued);
        return d >= startOfLastWeek && d < startOfWeek;
      })
      .reduce((s, inv) => s + (inv.total_amount || 0), 0);
  }, [paidInvoices]);

  const trendText = React.useMemo(() => {
    const diff = thisWeekRevenue - lastWeekRevenue;
    return diff >= 0 
      ? `+₦${diff.toLocaleString()} vs last week`
      : `-₦${Math.abs(diff).toLocaleString()} vs last week`;
  }, [thisWeekRevenue, lastWeekRevenue]);

  const topServices = React.useMemo(() => {
    if (!services || services.length === 0) return [];
    
    // Count real appointments booked from bookings state
    const serviceBookingsMap = {};
    bookings.forEach(b => {
      if (b.status === 'Confirmed' || b.status === 'Paid') {
        const sName = b.service?.name;
        if (sName) {
          serviceBookingsMap[sName] = (serviceBookingsMap[sName] || 0) + 1;
        }
      }
    });

    return services.map(s => {
      const unitsSold = serviceBookingsMap[s.name] || 0; 
      const margin = s.cost_price && s.price ? 
        Math.round(((s.price - s.cost_price) / s.price) * 100) : 
        100;
        
      return { ...s, unitsSold, margin };
    }).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 4);
  }, [services, bookings]);

  const stats = [
    { 
      label: 'REVENUE THIS WEEK', 
      value: formatNaira(thisWeekRevenue), 
      icon: TrendingUp, 
      color: 'text-[#F97316]', 
      bg: 'bg-[#FFF4ED]',
      trend: trendText
    },
    { 
      label: 'CONFIRMED SESSIONS', 
      value: confirmedSessions.length.toString(), 
      icon: CheckCircle, 
      color: 'text-[#12B76A]', 
      bg: 'bg-[#ECFDF3]',
      sub: 'Total booked classes'
    },
    { 
      label: "TODAY'S APPOINTMENTS", 
      value: todaysBookings.length.toString(), 
      icon: TrendingUp, 
      color: 'text-[#7A5AF8]', 
      bg: 'bg-[#F4F3FF]',
      sub: `${todaysBookings.length} sessions active`
    },
    { 
      label: 'TOTAL CLIENTS', 
      value: uniqueCustomers.toString(), 
      icon: Users, 
      color: 'text-[#2E90FA]', 
      bg: 'bg-[#EFF8FF]',
      sub: 'WhatsApp + Instagram'
    },
  ];

  const platformSplit = React.useMemo(() => {
    if (analytics?.platform_split && analytics.platform_split.length > 0) {
      return analytics.platform_split.map(p => {
        const color = p.name.toLowerCase() === 'whatsapp' ? '#1A7A4A' : '#F97316';
        return { name: p.name, value: p.value, color };
      });
    }
    return [
      { name: 'WhatsApp', value: 75, color: '#1A7A4A' },
      { name: 'Instagram', value: 25, color: '#F97316' }
    ];
  }, [analytics]);

  return (
    <div className="space-y-6">
      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 md:p-5 border border-[#EAECF0] flex flex-col justify-between h-[105px] md:h-[120px] shadow-none">
            <div className="flex items-start justify-between">
              <p className="text-[10px] md:text-[11px] font-bold text-[#667085] uppercase tracking-wider line-clamp-1 md:line-clamp-none">{stat.label}</p>
              <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 ml-1 md:ml-3`}>
                <stat.icon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
              </div>
            </div>
            <div className="mt-1 md:mt-2">
              <p className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">{stat.value}</p>
              {stat.trend ? (
                <p className="text-[10px] md:text-xs text-[#12B76A] font-semibold mt-0.5 md:mt-1">{stat.trend}</p>
              ) : (
                <p className="text-[10px] md:text-xs text-[#667085] mt-0.5 md:mt-1">{stat.sub || ''}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EAECF0] shadow-none">
        <h3 className="text-sm font-bold text-gray-700 mb-6">Quick actions</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {[
            { label: 'Train Kasi AI', icon: GraduationCap, path: '/settings?tab=ai_rules' },
            { label: 'Link WhatsApp', icon: MessageSquare, path: '/settings?tab=integrations' },
            { label: 'Setup Payouts', icon: NairaIcon, path: '/settings?tab=payment' },
            { label: 'Send Broadcast', icon: Megaphone, path: '/customers' },
            { label: 'Live Takeover', icon: UserCheck, path: '/chats' },
            { label: 'Manage Services', icon: Briefcase, path: '/services' },
            { label: 'Client Directory', icon: Users, path: '/customers' },
            { label: 'Store Settings', icon: Settings, path: '/settings?tab=general' },
          ].map((act, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(act.path)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-100 bg-white shadow-xs flex items-center justify-center text-gray-600 group-hover:text-[#1A7A4A] group-hover:bg-[#E8F5EE] group-hover:border-[#B0D9C1] group-hover:scale-105 transition-all duration-200">
                <act.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[10px] md:text-[11px] font-bold text-gray-500 group-hover:text-dark mt-2.5 text-center leading-normal">
                {act.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[#EAECF0] h-[360px] flex flex-col justify-between shadow-none">
           <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#101828]">Revenue this week</h3>
              <select className="text-sm text-[#667085] border-0 bg-transparent py-1 pl-1 pr-6 font-medium outline-none cursor-pointer">
                <option>Week</option>
                <option>Month</option>
                <option>All time</option>
              </select>
           </div>
           <div className="h-[240px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getWeeklyRevenueData(paidInvoices)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="serviceRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(249, 115, 22, 0.12)" />
                      <stop offset="95%" stopColor="rgba(249, 115, 22, 0.01)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} tickFormatter={(v) => v === 0 ? '₦0' : `₦${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: '#F2F4F7', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fill="url(#serviceRev)" dot={false} activeDot={{ r: 5, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#EAECF0] h-[360px] flex flex-col justify-between shadow-none">
           <div>
              <h3 className="text-base font-semibold text-[#101828] mb-6">Platform Split</h3>
              <div className="space-y-6">
                 {platformSplit.map((p) => (
                   <div key={p.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                         <span className="text-[#667085]">{p.name}</span>
                         <span className="text-[#101828]">{p.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#F2F4F7] rounded-full overflow-hidden">
                         <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="pt-4 border-t border-[#EAECF0]">
              <p className="text-xs text-[#667085] leading-relaxed">
                 Most of your traffic is coming from WhatsApp. Try running Instagram ads to boost your reach there.
              </p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#EAECF0] shadow-none">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-[#101828] flex items-center gap-2">
               Today's Schedule
               <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3EA] text-[#F97316] text-[10px] font-bold tracking-wider uppercase">
                  {todaysBookings.length} APPOINTMENTS
               </span>
            </h3>
            <Link to="/services/bookings" className="text-xs font-bold text-[#1A7A4A] hover:underline">View Full Schedule</Link>
         </div>
         
         {todaysBookings.length === 0 ? (
           <div className="py-12 text-center">
              <p className="text-sm text-[#667085] font-medium">No appointments scheduled for today yet.</p>
           </div>
         ) : (
           <div className="space-y-3">
              {todaysBookings.sort((a,b) => a.booking_time.localeCompare(b.booking_time)).map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#EAECF0] hover:bg-[#F8F9FC] transition-colors group">
                   <div className="w-16 text-center shrink-0">
                      <p className="text-sm font-bold text-[#101828]">{booking.booking_time}</p>
                      <p className="text-[10px] text-[#667085] font-semibold uppercase tracking-tight">{booking.duration} MIN</p>
                   </div>
                   <div className="w-px h-8 bg-[#EAECF0] shrink-0" />
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#101828] text-sm truncate">{booking.service?.name || 'Service Session'}</h4>
                      <p className="text-xs text-[#667085] truncate">{booking.customer?.name || 'Client'}</p>
                   </div>
                   <div className="shrink-0 flex items-center gap-3">
                      <StatusBadge status={booking.status} />
                      <button onClick={() => navigate('/services/bookings')} className="p-2 text-[#98A2B3] group-hover:text-[#1A7A4A] transition-colors">
                         <ArrowRight size={16} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>

      <div className="bg-white rounded-2xl border border-[#EAECF0] p-6 shadow-none">
        <h2 className="text-[15px] font-bold text-[#101828] mb-4">Top services by bookings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topServices.map(ts => (
            <div key={ts.id} className="bg-[#F8F9FC] rounded-xl border border-[#EAECF0] p-4 flex flex-col justify-between shadow-none">
              <h3 className="text-xs font-semibold text-[#667085] uppercase tracking-wider truncate mb-3">{ts.name}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-[#1A7A4A] leading-none mb-1">{ts.unitsSold}</div>
                  <div className="text-[10px] font-medium text-[#667085]">bookings</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#175CD3] leading-none mb-1">{ts.margin}%</div>
                  <div className="text-[10px] font-medium text-[#667085]">margin</div>
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

  // Calculate real week-over-week revenue
  const thisWeekRevenue = React.useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); 
    startOfWeek.setHours(0,0,0,0);
    return paidInvoices
      .filter(inv => new Date(inv.date_issued) >= startOfWeek)
      .reduce((s, inv) => s + (inv.total_amount || 0), 0);
  }, [paidInvoices]);

  const lastWeekRevenue = React.useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); 
    startOfWeek.setHours(0,0,0,0);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    return paidInvoices
      .filter(inv => {
        const d = new Date(inv.date_issued);
        return d >= startOfLastWeek && d < startOfWeek;
      })
      .reduce((s, inv) => s + (inv.total_amount || 0), 0);
  }, [paidInvoices]);

  const trendText = React.useMemo(() => {
    const diff = thisWeekRevenue - lastWeekRevenue;
    return diff >= 0 
      ? `+₦${diff.toLocaleString()} vs last week`
      : `-₦${Math.abs(diff).toLocaleString()} vs last week`;
  }, [thisWeekRevenue, lastWeekRevenue]);

  const stats = [
    { 
      label: 'REVENUE THIS WEEK', 
      value: formatNaira(thisWeekRevenue), 
      icon: TrendingUp, 
      bg: 'bg-[#FFF4ED]', 
      color: 'text-[#F97316]',
      trend: trendText
    },
    { 
      label: 'CUSTOMERS REACHED', 
      value: uniqueCustomers.toString(), 
      icon: Users, 
      bg: 'bg-[#EFF8FF]', 
      color: 'text-[#2E90FA]',
      sub: 'WhatsApp + Instagram'
    },
    { 
      label: 'TRANSACTIONS', 
      value: deliveredCount.toString(), 
      icon: CheckCircle, 
      bg: 'bg-[#ECFDF3]', 
      color: 'text-[#12B76A]',
      sub: `${deliveredCount} delivered`
    },
    { 
      label: 'AI RESOLUTION', 
      value: `${analytics?.ai_resolution_rate || 91.8}%`, 
      icon: Cpu, 
      bg: 'bg-[#F4F3FF]', 
      color: 'text-[#7A5AF8]',
      attention: needsAttention > 0,
      sub: `${needsAttention} Attention needed`
    },
  ];

  const liveConversations = conversations.filter(c => c.status !== 'In Progress').slice(0, 5);

  const topProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Count real units sold from paid invoices
    const productSalesMap = {};
    paidInvoices.forEach(inv => {
      if (inv.items) {
        inv.items.forEach(item => {
          const desc = item.description || "";
          const qty = item.quantity || 1;
          productSalesMap[desc] = (productSalesMap[desc] || 0) + qty;
        });
      }
    });

    return products.map(p => {
      const unitsSold = productSalesMap[p.name] || 0; 
      const margin = p.cost_price && p.price ? 
        Math.round(((p.price - p.cost_price) / p.price) * 100) : 
        0;
        
      return { ...p, unitsSold, margin };
    }).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 4);
  }, [products, paidInvoices]);

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 md:p-5 border border-[#EAECF0] flex flex-col justify-between h-[105px] md:h-[120px] shadow-none">
            <div className="flex items-start justify-between">
              <p className="text-[10px] md:text-[11px] font-bold text-[#667085] uppercase tracking-wider line-clamp-1 md:line-clamp-none">{stat.label}</p>
              <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 ml-1 md:ml-3`}>
                <stat.icon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
              </div>
            </div>
            <div className="mt-1 md:mt-2">
              <p className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">{stat.value}</p>
              {stat.trend ? (
                <p className="text-[10px] md:text-xs text-[#12B76A] font-semibold mt-0.5 md:mt-1">{stat.trend}</p>
              ) : (
                <p className={`text-[10px] md:text-xs font-semibold mt-0.5 md:mt-1 ${stat.attention ? 'text-[#F79009]' : 'text-[#667085]'}`}>{stat.sub || ''}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EAECF0] shadow-none">
        <h3 className="text-sm font-bold text-gray-700 mb-6">Quick actions</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {[
            { label: 'Train Kasi AI', icon: GraduationCap, path: '/settings?tab=ai_rules' },
            { label: 'Link WhatsApp', icon: MessageSquare, path: '/settings?tab=integrations' },
            { label: 'Setup Payouts', icon: NairaIcon, path: '/settings?tab=payment' },
            { label: 'Send Broadcast', icon: Megaphone, path: '/customers' },
            { label: 'Live Takeover', icon: UserCheck, path: '/chats' },
            { label: 'Manage Products', icon: Package, path: '/products' },
            { label: 'Client Directory', icon: Users, path: '/customers' },
            { label: 'Store Settings', icon: Settings, path: '/settings?tab=general' },
          ].map((act, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(act.path)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-100 bg-white shadow-xs flex items-center justify-center text-gray-600 group-hover:text-[#1A7A4A] group-hover:bg-[#E8F5EE] group-hover:border-[#B0D9C1] group-hover:scale-105 transition-all duration-200">
                <act.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[10px] md:text-[11px] font-bold text-gray-500 group-hover:text-dark mt-2.5 text-center leading-normal">
                {act.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Revenue Chart Card (~65% width) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[#EAECF0] h-[360px] flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#101828]">Revenue this week</h3>
            <select className="text-sm text-[#667085] border-0 bg-transparent py-1 pl-1 pr-6 font-medium outline-none cursor-pointer">
              <option>Week</option>
              <option>Month</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-[240px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getWeeklyRevenueData(paidInvoices)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(249, 115, 22, 0.12)" />
                    <stop offset="95%" stopColor="rgba(249, 115, 22, 0.01)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} tickFormatter={(v) => v === 0 ? '₦0' : `₦${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: '#F2F4F7', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Conversations Panel (~35% width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#EAECF0] h-[360px] flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between mb-4 border-b border-[#F2F4F7] pb-3 shrink-0">
            <h3 className="text-base font-semibold text-[#101828]">Live conversations</h3>
            <span className="text-[11px] font-semibold text-[#12B76A]">● Live</span>
          </div>
          
          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {liveConversations.length === 0 ? (
              <p className="text-sm text-[#667085] text-center py-12">No active conversations</p>
            ) : (
              liveConversations.map((conv) => {
                const avatarTheme = getAvatarTheme(conv.customer_name);
                return (
                  <div 
                    key={conv.id} 
                    className="h-[68px] flex items-center justify-between py-3 border-b border-[#F2F4F7] last:border-0 cursor-pointer group hover:bg-[#F8F9FC] rounded-lg px-2 -mx-2 transition-colors" 
                    onClick={() => navigate('/chats')}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full ${avatarTheme.bg} ${avatarTheme.text} flex items-center justify-center font-bold text-[13px] shrink-0 select-none`}>
                        {getInitials(conv.customer_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#101828] text-sm truncate">{conv.customer_name || conv.customer_phone || 'Unknown'}</p>
                        <p className="text-[13px] text-[#667085] truncate">{conv.ai_summary || conv.customer_phone || ''}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      <StatusBadge status={conv.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <Link to="/chats" className="text-sm font-semibold text-[#1A7A4A] hover:underline block text-center pt-4 border-t border-[#F2F4F7] mt-3 shrink-0 select-none">
            View all chats →
          </Link>
        </div>
      </div>

      {/* Bottom Row - Top Products */}
      <div className="bg-white rounded-2xl border border-[#EAECF0] p-6 shadow-none">
        <h2 className="text-[15px] font-bold text-[#101828] mb-4">Top products by units sold</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map(tp => (
            <div key={tp.id} className="bg-[#F8F9FC] rounded-xl border border-[#EAECF0] p-4 flex flex-col justify-between shadow-none">
              <h3 className="text-xs font-semibold text-[#667085] uppercase tracking-wider truncate mb-3">{tp.name}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-[#F97316] leading-none mb-1">{tp.unitsSold}</div>
                  <div className="text-[10px] font-medium text-[#667085]">units sold</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#12B76A] leading-none mb-1">{tp.margin}%</div>
                  <div className="text-[10px] font-medium text-[#667085]">margin</div>
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

  // States to manage local banner dismissals
  const [dismissedPaystack, setDismissedPaystack] = useState(false);
  const [dismissedWhatsApp, setDismissedWhatsApp] = useState(false);
  const [dismissedRateSheet, setDismissedRateSheet] = useState(false);
  const [dismissedStoreProfile, setDismissedStoreProfile] = useState(false);
  const [dismissedTrial, setDismissedTrial] = useState(false);

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
  const hasPaystack = !!user?.account_number;
  
  let hasRateSheet = false;
  if (user?.delivery_rates) {
    try {
      const rates = typeof user.delivery_rates === 'object' ? user.delivery_rates : JSON.parse(user.delivery_rates);
      hasRateSheet = rates && Object.keys(rates).length > 0;
    } catch (e) {
      hasRateSheet = false;
    }
  }

  const hasStoreProfile = !!user?.address && !!user?.store_google_maps_link && !!user?.general_enquiry_phone;

  if (loading) return null;

  const showPaystack = !hasPaystack && !dismissedPaystack;
  const showWhatsApp = !hasWhatsApp && !dismissedWhatsApp;
  const showRateSheet = !hasRateSheet && !dismissedRateSheet;
  const showStoreProfile = !hasStoreProfile && !dismissedStoreProfile;
  const daysRemaining = user?.trial_days_remaining ?? 0;
  const showTrial = user?.subscription_status === 'trialing' && daysRemaining > 0 && !dismissedTrial;

  if (!showPaystack && !showWhatsApp && !showRateSheet && !showStoreProfile && !showTrial) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full">
      {/* TRIAL COUNTDOWN BANNER */}
      {showTrial && (
        <div className="relative bg-[#FFFBEB] border border-[#FEF08A] rounded-xl p-2.5 px-3 flex items-center justify-between gap-3 shadow-none flex-1 min-w-[280px] max-w-[400px] transition-all duration-300">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Clock size={10} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 text-xs">
              <span className="font-bold text-[#D97706] tracking-wide shrink-0">
                {daysRemaining} {daysRemaining === 1 ? 'DAY' : 'DAYS'} LEFT IN TRIAL
              </span>
              <span className="text-[#344054] text-[11px] leading-relaxed font-medium">
                Upgrade to premium now to keep your WhatsApp agent and automated features live.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/settings?tab=billing')}
              className="px-2.5 py-1 bg-[#D97706] hover:bg-[#B45309] text-white rounded-md text-[10px] font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => setDismissedTrial(true)}
              className="text-[#98A2B3] hover:text-[#667085] p-0.5 rounded transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* PAYMENTS BANNER */}
      {showPaystack && (
        <div className="relative bg-[#EFF8FF] border border-[#B2DDFF] rounded-xl p-2.5 px-3 flex items-center justify-between gap-3 shadow-none flex-1 min-w-[280px] max-w-[400px] transition-all duration-300">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-5 h-5 rounded-full bg-[#D1E9FF] text-[#175CD3] flex items-center justify-center shrink-0">
              <DollarSign size={10} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 text-xs">
              <span className="font-bold text-[#175CD3] tracking-wide shrink-0">PAYMENTS NOT CONNECTED</span>
              <span className="text-[#344054] text-[11px] leading-relaxed font-medium">Link your Paystack account to receive payments from customers.</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/settings?tab=payment')}
              className="px-2.5 py-1 bg-[#175CD3] hover:bg-[#114B9E] text-white rounded-md text-[10px] font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Link Account
            </button>
            <button
              onClick={() => setDismissedPaystack(true)}
              className="text-[#98A2B3] hover:text-[#667085] p-0.5 rounded transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* WHATSAPP BANNER */}
      {showWhatsApp && (
        <div className="relative bg-[#ECFDF3] border border-[#D1FADF] rounded-xl p-2.5 px-3 flex items-center justify-between gap-3 shadow-none flex-1 min-w-[280px] max-w-[400px] transition-all duration-300">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-5 h-5 rounded-full bg-[#D1FADF] text-[#027A48] flex items-center justify-center shrink-0">
              <MessageSquare size={10} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 text-xs">
              <span className="font-bold text-[#027A48] tracking-wide shrink-0">WHATSAPP NOT CONNECTED</span>
              <span className="text-[#344054] text-[11px] leading-relaxed font-medium">Connect your WhatsApp so Kasi can start chatting with customers.</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/settings?tab=integrations')}
              className="px-2.5 py-1 bg-[#1A7A4A] hover:bg-[#0F5533] text-white rounded-md text-[10px] font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Connect Now
            </button>
            <button
              onClick={() => setDismissedWhatsApp(true)}
              className="text-[#98A2B3] hover:text-[#667085] p-0.5 rounded transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* RATE SHEET BANNER */}
      {showRateSheet && (
        <div className="relative bg-[#FFF4ED] border border-[#FCD2C1] rounded-xl p-2.5 px-3 flex items-center justify-between gap-3 shadow-none flex-1 min-w-[280px] max-w-[400px] transition-all duration-300">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-5 h-5 rounded-full bg-[#FFE4D6] text-[#F97316] flex items-center justify-center shrink-0">
              <Truck size={10} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 text-xs">
              <span className="font-bold text-[#D46B18] tracking-wide shrink-0">RATE SHEET NOT ADDED</span>
              <span className="text-[#344054] text-[11px] leading-relaxed font-medium">Set up your delivery rate sheet so Kasi can quote delivery fees dynamically to customers.</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/settings?tab=logistics')}
              className="px-2.5 py-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-md text-[10px] font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Add Rate Sheet
            </button>
            <button
              onClick={() => setDismissedRateSheet(true)}
              className="text-[#98A2B3] hover:text-[#667085] p-0.5 rounded transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* STORE PROFILE BANNER */}
      {showStoreProfile && (
        <div className="relative bg-[#F4F3FF] border border-[#D9D6FE] rounded-xl p-2.5 px-3 flex items-center justify-between gap-3 shadow-none flex-1 min-w-[280px] max-w-[400px] transition-all duration-300">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-5 h-5 rounded-full bg-[#EBE9FE] text-[#7A5AF8] flex items-center justify-center shrink-0">
              <MapPin size={10} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 text-xs">
              <span className="font-bold text-[#6938EF] tracking-wide shrink-0">PICKUP PROFILE INCOMPLETE</span>
              <span className="text-[#344054] text-[11px] leading-relaxed font-medium">Complete your store's address, Google Maps link, and enquiry line to support pickups.</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/settings?tab=general')}
              className="px-2.5 py-1 bg-[#7A5AF8] hover:bg-[#6938EF] text-white rounded-md text-[10px] font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Complete Profile
            </button>
            <button
              onClick={() => setDismissedStoreProfile(true)}
              className="text-[#98A2B3] hover:text-[#667085] p-0.5 rounded transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── HELPERS ───────────────────────────────────────────────────────────── */

const getWeeklyRevenueData = (paidInvoices) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  
  // Calculate Monday of the current week
  const currentDay = now.getDay();
  const distance = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + distance);
  startOfWeek.setHours(0, 0, 0, 0);

  return days.map((day, i) => {
    const dayRevenue = paidInvoices
      .filter(inv => {
        const d = new Date(inv.date_issued);
        const targetDay = (i + 1) % 7;
        return d >= startOfWeek && d.getDay() === targetDay;
      })
      .reduce((s, inv) => s + (inv.total_amount || 0), 0);
    return { name: day, value: dayRevenue }; 
  });
};

export default Dashboard;
