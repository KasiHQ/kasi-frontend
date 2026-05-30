import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ImpersonationBanner from './ImpersonationBanner';
import BroadcastBanner from './BroadcastBanner';
import { useLayout } from '../../context/LayoutContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, X, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const MainLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      const data = response.data?.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleNotificationClick = async (noti) => {
    try {
      await api.patch(`/api/notifications/${noti.id}/read`);
      // Update local state
      setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Route if link exists
      if (noti.link) {
        navigate(noti.link);
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const formatTimeAgo = (dateStr) => {
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

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

  // HTML5 Web Notifications Polling (Dynamic push notifications for all vendor alerts)
  useEffect(() => {
    if (!user) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const notifiedIds = new Set();

    const checkNewNotifications = async () => {
      try {
        const response = await api.get('/api/notifications');
        const notis = response.data?.data || [];
        
        notis.forEach(noti => {
          if (!noti.is_read && !notifiedIds.has(noti.id)) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(noti.title, {
                body: noti.message,
                icon: "/kasi.png",
                tag: `noti-${noti.id}`,
                requireInteraction: true
              });
            }
            notifiedIds.add(noti.id);
          }
        });
      } catch (err) {
        console.error("Failed to check push notifications:", err);
      }
    };

    checkNewNotifications();
    const interval = setInterval(checkNewNotifications, 12000);

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
              
              {/* Notification bell icon container */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] transition-colors shrink-0 relative cursor-pointer"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#E53E3E] ring-2 ring-white animate-pulse" />
                  )}
                </button>
                
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md border border-[#EAECF0] rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* header */}
                      <div className="px-4 py-3 border-b border-[#EAECF0] flex items-center justify-between select-none">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#101828]">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="bg-[#1A7A4A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] font-semibold text-[#1A7A4A] hover:underline cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* list */}
                      <div className="max-h-[300px] overflow-y-auto divide-y divide-[#EAECF0] custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-8 px-4 text-center text-[#667085] text-xs font-medium select-none">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map(noti => {
                            const Icon = noti.type === 'invoice_paid' ? DollarSign 
                                       : noti.type === 'booking_created' ? Calendar
                                       : noti.type === 'attention_needed' ? AlertTriangle
                                       : Bell;
                            const bgClass = noti.type === 'invoice_paid' ? 'bg-[#ECFDF3] text-[#027A48]'
                                          : noti.type === 'booking_created' ? 'bg-[#F4F3FF] text-[#7A5AF8]'
                                          : noti.type === 'attention_needed' ? 'bg-[#FFFAEB] text-[#B54708]'
                                          : 'bg-[#F2F4F7] text-[#667085]';
                            return (
                              <div 
                                key={noti.id}
                                onClick={() => handleNotificationClick(noti)}
                                className={`px-4 py-3 hover:bg-[#F8F9FC] transition-colors cursor-pointer flex gap-3 ${!noti.is_read ? 'bg-[#F8F9FC]/60' : ''}`}
                              >
                                <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center shrink-0`}>
                                  <Icon size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-1">
                                    <p className={`text-xs truncate ${!noti.is_read ? 'font-bold text-[#101828]' : 'font-semibold text-[#344054]'}`}>
                                      {noti.title}
                                    </p>
                                    {!noti.is_read && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-2 leading-relaxed">
                                    {noti.message}
                                  </p>
                                  <span className="text-[10px] text-[#98A2B3] mt-1 block">
                                    {formatTimeAgo(noti.created_at)}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
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
