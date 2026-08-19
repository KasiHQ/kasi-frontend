import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Settings, LogOut, MessageSquare, Package, Truck, Users, TrendingUp, ChevronsLeft, ChevronsRight, Sun, Moon, PanelTop, Briefcase, Calendar, Home, DollarSign, FileText, Store } from 'lucide-react';
import clsx from 'clsx';
import { useLayout } from '../../context/LayoutContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import { conversationAPI } from '../../api/conversations';

const SIDEBAR_KEY = 'bfm-sidebar-collapsed';

const Sidebar = ({ onWidthChange }) => {
  const { toggleLayout } = useLayout();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isAdmin = user?.is_admin;
  const adminRole = user?.admin_role;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === 'true'; } catch { return false; }
  });

  const [badgeCounts, setBadgeCounts] = useState({ chats: 0, logistics: 0 });

  useEffect(() => {
    if (!user || isAdmin) return;

    const fetchCounts = async () => {
      try {
        const res = await conversationAPI.getPipeline();
        if (res && res.data) {
          setBadgeCounts({
            chats: res.data['Requires Attention'] || 0,
            logistics: res.data['Paid'] || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch sidebar badge counts:', err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, [user, isAdmin]);

  const isService = user?.business_type === 'service';

  const getPlanName = (tier) => {
    if (tier === 'starter') return 'Starter Plan';
    if (tier === 'growth') return 'Growth Plan';
    if (tier === 'premium') return 'Premium Plan';
    return 'Free Trial';
  };

  const getTrialDaysLeft = (expiryDate) => {
    if (!expiryDate) return 0;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getPlanStatusText = () => {
    if (isAdmin) return adminRole || 'Admin';
    
    const tier = user?.subscription_tier || 'free_trial';
    const status = user?.subscription_status || 'trialing';
    
    if (status === 'trialing') {
      const days = getTrialDaysLeft(user?.subscription_expires_at);
      return `${getPlanName(tier)} · ${days}d left`;
    }
    
    const formattedStatus = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Active';
    return `${getPlanName(tier)} · ${formattedStatus}`;
  };

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed); } catch {}
    onWidthChange?.(collapsed ? 72 : 220);
  }, [collapsed]);

  useEffect(() => {
    onWidthChange?.(collapsed ? 72 : 220);
  }, []);

  let navGroups = [];
  if (isAdmin) {
    navGroups = [
      {
        title: 'OVERVIEW',
        items: [
          { icon: Home, label: 'Admin Dashboard', path: '/kasisalienceadministration' },
        ]
      },
      {
        title: 'MANAGEMENT',
        items: [
          ...(adminRole === 'Super Admin' || adminRole === 'Support Admin' ? [
            { icon: Users, label: 'Vendors', path: '/kasisalienceadministration/users' },
            { icon: FileText, label: 'Blog Posts', path: '/kasisalienceadministration/blog' },
          ] : []),
          ...(adminRole === 'Super Admin' || adminRole === 'Finance Admin' ? [
            { icon: BarChart3, label: 'Invoices', path: '/kasisalienceadministration/invoices' },
            { icon: TrendingUp, label: 'Transactions', path: '/kasisalienceadministration/transactions' },
          ] : []),
        ]
      },
      {
        title: 'SYSTEM',
        items: [
          ...(adminRole === 'Super Admin' || adminRole === 'Support Admin' ? [
            { icon: MessageSquare, label: 'Broadcasts', path: '/kasisalienceadministration/broadcasts' },
            { icon: PanelTop, label: 'Audit Logs', path: '/kasisalienceadministration/audit-logs' },
          ] : []),
          ...(adminRole === 'Super Admin' ? [
            { icon: Calendar, label: 'Waitlist', path: '/kasisalienceadministration/waitlist' },
            { icon: Settings, label: 'Staff Panel', path: '/kasisalienceadministration/staff' },
          ] : []),
        ]
      }
    ];
  } else if (isService) {
    navGroups = [
      {
        title: 'BUSINESS',
        items: [
          { icon: Home, label: 'Home', path: '/dashboard' },
          { icon: Calendar, label: 'Schedule', path: '/bookings' },
          { icon: Briefcase, label: 'Services', path: '/services' },
        ]
      },
      {
        title: 'INBOX & CRM',
        items: [
          { icon: MessageSquare, label: 'Chats', path: '/chats', badgeKey: 'chats' },
          { icon: Users, label: 'Clients', path: '/customers' },
        ]
      },
      {
        title: 'OPERATIONS',
        items: [
          { icon: DollarSign, label: 'Finance Audit', path: '/payments' },
          { icon: Store, label: 'Marketplace', path: '/market' },
        ]
      }
    ];
  } else {
    navGroups = [
      {
        title: 'SELLING',
        items: [
          { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
          { icon: Package, label: 'Store', path: '/products' },
          { icon: Truck, label: 'Logistics', path: '/logistics', badgeKey: 'logistics' },
          { icon: Store, label: 'Fulfilment', path: '/fulfilment' },
        ]
      },
      {
        title: 'INBOX & CRM',
        items: [
          { icon: MessageSquare, label: 'Chats', path: '/chats', badgeKey: 'chats' },
          { icon: Users, label: 'Customers', path: '/customers' },
        ]
      },
      {
        title: 'FINANCE & MARKET',
        items: [
          { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
          { icon: DollarSign, label: 'Finance Audit', path: '/payments' },
          { icon: Store, label: 'Marketplace', path: '/market' },
        ]
      }
    ];
  }

  return (
    <div
      className="kasi-sidebar h-screen hidden md:flex flex-col fixed left-0 top-0 z-50 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
      style={{ width: collapsed ? 72 : 230, transition: 'width 0.25s ease' }}
    >
      {/* Brand Header */}
      <div className={clsx('flex items-center py-4', collapsed ? 'px-3 justify-center' : 'px-5 justify-between')}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <img src="/kasi.png" alt="Kasi" className="w-7 h-7 rounded-lg" />
            <span className="text-xl font-extrabold tracking-tight" style={{ background: 'linear-gradient(135deg, #0F8C55, #0BBF6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kasi</span>
          </div>
        ) : (
          <img src="/kasi.png" alt="K" className="w-7 h-7 rounded-lg" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'p-1.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-primary hover:bg-primary/10',
            collapsed && 'hidden'
          )}
        >
          <ChevronsLeft size={16} />
        </button>
      </div>

      {/* Global Search (Hidden when collapsed or for admin) */}
      {!collapsed && !isAdmin && (
        <div className="px-3.5 pb-2">
          <GlobalSearch />
        </div>
      )}

      {/* Categorized Navigation */}
      <nav className={clsx('flex-1 space-y-4 py-1', collapsed ? 'px-2' : 'px-3')}>
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && group.title && (
              <div className="px-3 pt-1 pb-1">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                  {group.title}
                </span>
              </div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/kasisalienceadministration' || item.path === '/dashboard'}
                className={({ isActive }) =>
                  clsx(
                    'kasi-nav-item flex items-center rounded-xl transition-all duration-200 group font-semibold text-sm relative',
                    collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5',
                    isActive
                      ? 'kasi-nav-active bg-[#0D7043] dark:bg-[#0D7043] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60'
                  )
                }
              >
                <item.icon size={18} className="transition-colors duration-200 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {/* Badge */}
                {item.badgeKey && badgeCounts[item.badgeKey] > 0 && !collapsed && (
                  <span className="ml-auto px-1.5 py-0.5 min-w-[20px] h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {badgeCounts[item.badgeKey]}
                  </span>
                )}
                {item.badgeKey && badgeCounts[item.badgeKey] > 0 && collapsed && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 border-2 border-white dark:border-gray-900" />
                )}
                {/* Modern Sleek Tooltip when Collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-[100] translate-x-1 group-hover:translate-x-0 hidden md:flex items-center">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={clsx('border-t border-gray-100 space-y-1', collapsed ? 'p-2' : 'p-3')}>
        {/* Settings - Only for standard users */}
        {!isAdmin && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'kasi-nav-item flex items-center rounded-xl transition-all duration-200 group font-semibold text-sm relative',
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5',
                isActive
                  ? 'kasi-nav-active bg-primary text-white shadow-md'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-100/80'
              )
            }
          >
            <Settings size={19} />
            {!collapsed && <span>Settings</span>}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-[100] translate-x-1 group-hover:translate-x-0 hidden md:flex items-center">
                Settings
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </NavLink>
        )}

        {/* Utility Row */}
        <div className={clsx('flex gap-1 pt-1', collapsed ? 'flex-col items-center' : 'items-center')}>
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-lg transition-all duration-200 group relative"
            >
              <ChevronsRight size={15} />
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-[100] translate-x-1 group-hover:translate-x-0 hidden md:flex items-center">
                Expand Sidebar
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </button>
          )}
        </div>

        {/* Business Card */}
        {!collapsed && user && (
          <div className="mt-2 px-3 py-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {(isAdmin ? 'Kasi Admin' : (user.business_name || 'K')).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-dark dark:text-white truncate">{isAdmin ? 'Kasi Admin' : (user.business_name || 'My Business')}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                  {getPlanStatusText()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Plan CTA Card */}
        {!collapsed && user && !isAdmin && user.subscription_tier !== 'premium' && (
          <div className="mt-2.5 px-3 py-3 bg-gradient-to-tr from-primary/10 via-emerald-500/5 to-transparent border border-primary/20 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            <div className="relative">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Upgrade to Premium</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">Unlock maximum payout routing split limits & premium features.</p>
              <button
                onClick={() => navigate('/settings?tab=billing')}
                className="w-full text-center py-1.5 px-3 bg-primary hover:bg-green-700 text-white rounded-lg text-[10px] font-bold shadow-md shadow-green-100 dark:shadow-none transition-all duration-200 hover:scale-[1.02]"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          className={clsx(
            'flex items-center w-full text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium text-sm mt-1 group relative',
            collapsed ? 'justify-center py-2.5' : 'gap-3 px-4 py-2.5'
          )}
          onClick={logout}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-[100] translate-x-1 group-hover:translate-x-0 hidden md:flex items-center">
              Logout
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
