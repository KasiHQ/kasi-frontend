import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ImpersonationBanner from './ImpersonationBanner';
import BroadcastBanner from './BroadcastBanner';
import { useLayout } from '../../context/LayoutContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell } from 'lucide-react';

const MainLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const { user } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/chats')) return 'Chats';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/logistics')) return 'Logistics';
    if (path.startsWith('/customers') || path.startsWith('/clients')) return 'Customers';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/invoices')) return 'Invoices';
    if (path.startsWith('/bookings')) return 'Bookings';
    if (path.startsWith('/services')) return 'Services';
    if (path.startsWith('/billing')) return 'Billing';
    return '';
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] kasi-app text-[#101828] flex flex-col w-full overflow-x-hidden">
      <ImpersonationBanner />
      <BroadcastBanner />
      <div className="flex flex-1 min-w-0">
        <Sidebar onWidthChange={setSidebarWidth} />
        
        {/* Main Content Area wrapper with dynamic margin-left for desktop only */}
        <div 
          className="flex-1 flex flex-col min-w-0 min-h-screen main-content-area"
          style={{ marginLeft: undefined }}
        >
          <style>{`@media(min-width:768px){.main-content-area{margin-left:${sidebarWidth}px !important;transition:margin-left 0.25s ease}}`}</style>
          
          {/* Top Bar of Main Content */}
          <header className="h-16 bg-white border-b border-[#EAECF0] px-4 md:px-10 flex items-center justify-between sticky top-0 z-40 shrink-0">
            <div>
              {isDashboard ? (
                <div className="flex items-center">
                  <img src="/kasi.png" alt="Kasi" className="h-6 md:h-7 w-auto object-contain select-none" />
                </div>
              ) : (
                <span className="text-sm font-bold text-[#101828] tracking-tight capitalize">
                  {getPageTitle()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search input (global) */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" size={15} />
                <input
                  type="text"
                  placeholder="Search for products, invoices..."
                  className="w-[240px] pl-9 pr-3 py-1.5 bg-[#F2F4F7] border-0 rounded-lg text-xs outline-none text-[#101828] placeholder-[#98A2B3] focus:ring-1 focus:ring-[#1A7A4A] focus:bg-white transition-all"
                />
              </div>
              
              {/* Notification bell icon (36px button) */}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] transition-colors shrink-0">
                <Bell size={18} />
              </button>
              
              {/* Avatar (32px circle) */}
              <div className="w-8 h-8 rounded-full bg-[#1A7A4A] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                {user?.business_name ? user.business_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
            </div>
          </header>
          
          <main className="flex-1 min-w-0 p-6 md:p-8 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
