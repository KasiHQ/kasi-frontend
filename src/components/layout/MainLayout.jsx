import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ImpersonationBanner from './ImpersonationBanner';
import BroadcastBanner from './BroadcastBanner';
import { useLayout } from '../../context/LayoutContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, X } from 'lucide-react';
import api from '../../api/axios';

const MainLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const { user } = useAuth();
  const location = useLocation();

  // PWA Installation Trigger States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstallable(false);
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log('Kasi PWA was installed successfully!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // HTML5 Web Notifications Polling
  useEffect(() => {
    if (!user) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const notifiedConversations = new Set();

    const checkAttentionNeeded = async () => {
      try {
        const response = await api.get('/api/conversations');
        const convs = Array.isArray(response.data) 
          ? response.data 
          : (response.data && Array.isArray(response.data.data) ? response.data.data : []);
        
        convs.forEach(conv => {
          if (conv.status === 'Requires Attention' && !notifiedConversations.has(conv.id)) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification("⚠️ Kasi: Attention Needed", {
                body: `Customer "${conv.customer_name || 'Guest'}" requires your urgent attention!`,
                icon: "/kasi.png",
                tag: `attention-${conv.id}`,
                requireInteraction: true
              });
            }
            notifiedConversations.add(conv.id);
          }
        });
      } catch (err) {
        console.error("Failed to check push notifications:", err);
      }
    };

    checkAttentionNeeded();
    const interval = setInterval(checkAttentionNeeded, 12000);

    return () => clearInterval(interval);
  }, [user]);

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
          
          {isInstallable && (
            <div className="bg-[#D4F263] border-b border-black py-2.5 px-4 md:px-10 flex items-center justify-between text-xs font-bold text-black animate-in slide-in-from-top-4 duration-300 select-none shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <span role="img" aria-label="phone">📱</span>
                <span>Install Kasi on your device for real-time notifications and faster access!</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleInstallClick}
                  className="px-3 py-1 bg-[#1A7A4A] text-white hover:bg-[#0F5533] rounded-lg transition-all border border-black shadow-[2px_2px_0px_#0A0A0A] font-bold text-[10px] cursor-pointer"
                >
                  Install App
                </button>
                <button 
                  onClick={() => setIsInstallable(false)}
                  className="text-black/60 hover:text-black cursor-pointer shrink-0 p-1"
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          
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
