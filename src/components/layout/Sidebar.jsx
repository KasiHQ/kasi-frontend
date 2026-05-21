import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Settings, LogOut, MessageSquare, Package, Truck, Users, TrendingUp, ChevronsLeft, ChevronsRight, Sun, Moon, PanelTop, Briefcase, Calendar, Home } from 'lucide-react';
import clsx from 'clsx';
import { useLayout } from '../../context/LayoutContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from './GlobalSearch';

const SIDEBAR_KEY = 'bfm-sidebar-collapsed';

const Sidebar = ({ onWidthChange }) => {
  const { toggleLayout } = useLayout();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === 'true'; } catch { return false; }
  });

  const isService = user?.business_type === 'service';

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed); } catch {}
    onWidthChange?.(collapsed ? 72 : 220);
  }, [collapsed]);

  useEffect(() => {
    onWidthChange?.(collapsed ? 72 : 220);
  }, []);

  const navItems = isService ? [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Calendar, label: 'Schedule', path: '/bookings' },
    { icon: MessageSquare, label: 'Chats', path: '/chats', badge: true },
    { icon: Users, label: 'Clients', path: '/customers' },
    { icon: Briefcase, label: 'Services', path: '/services' },
  ] : [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chats', path: '/chats', badge: true },
    { icon: Package, label: 'Store', path: '/products' },
    { icon: Truck, label: 'Logistics', path: '/logistics', badge: true },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  ];

  // Admin overrides
  const isAdmin = user?.is_admin;

  return (
    <div
      className="kasi-sidebar h-screen hidden md:flex flex-col fixed left-0 top-0 z-50"
      style={{ width: collapsed ? 72 : 220, transition: 'width 0.25s ease' }}
    >
      {/* Brand Header */}
      <div className={clsx('flex items-center py-5', collapsed ? 'px-3 justify-center' : 'px-5 justify-between')}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Kasi" className="w-7 h-7 rounded-lg" />
            <span className="text-xl font-extrabold tracking-tight" style={{ background: 'linear-gradient(135deg, #0F8C55, #0BBF6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kasi</span>
          </div>
        ) : (
          <img src="/logo.png" alt="K" className="w-7 h-7 rounded-lg" />
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

      {/* Global Search (Hidden when collapsed) */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <GlobalSearch />
        </div>
      )}

      {/* Navigation */}
      <nav className={clsx('flex-1 space-y-1', collapsed ? 'px-2' : 'px-3')}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
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
            <item.icon size={19} className="transition-colors duration-200 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {/* Badge */}
            {item.badge && !collapsed && (
              <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                !
              </span>
            )}
            {item.badge && collapsed && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={clsx('border-t border-gray-100 space-y-1', collapsed ? 'p-2' : 'p-3')}>
        {/* Settings */}
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            clsx(
              'kasi-nav-item flex items-center rounded-xl transition-all duration-200 font-semibold text-sm',
              collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5',
              isActive
                ? 'kasi-nav-active bg-primary text-white shadow-md'
                : 'text-gray-500 hover:text-dark hover:bg-gray-100/80'
            )
          }
        >
          <Settings size={19} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* Utility Row */}
        <div className={clsx('flex gap-1 pt-1', collapsed ? 'flex-col items-center' : 'items-center')}>
          {/*
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              <ChevronsRight size={15} />
            </button>
          )}
        </div>

        {/* Business Card */}
        {!collapsed && user && (
          <div className="mt-2 px-3 py-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {(user.business_name || 'K').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-dark truncate">{user.business_name || 'My Business'}</p>
                <p className="text-[11px] text-gray-400 truncate">Pro Plan · Active</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          className={clsx(
            'flex items-center w-full text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium text-sm mt-1',
            collapsed ? 'justify-center py-2.5' : 'gap-3 px-4 py-2.5'
          )}
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
