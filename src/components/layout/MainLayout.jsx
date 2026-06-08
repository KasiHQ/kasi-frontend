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
  const { user, fetchUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Legacy Rider Migration States
  const [showRiderMigrator, setShowRiderMigrator] = useState(false);
  const [legacyRiders, setLegacyRiders] = useState([]);

  useEffect(() => {
    if (user?.logistics_phone) {
      const trimmed = user.logistics_phone.trim();
      if (trimmed && !trimmed.startsWith('[')) {
        const phones = trimmed.split(',').map(p => p.trim()).filter(Boolean);
        if (phones.length > 0) {
          setLegacyRiders(phones.map(phone => ({ name: '', phone })));
          setShowRiderMigrator(true);
        }
      }
    }
  }, [user]);

  const handleMigrateRiders = async (e) => {
    e.preventDefault();
    if (legacyRiders.some(r => !r.name.trim())) {
      alert("Please enter names for all riders.");
      return;
    }
    try {
      const ridersJSON = JSON.stringify(legacyRiders.map(r => ({ name: r.name.trim(), phone: r.phone })));
      await api.patch('/api/auth/profile', { logistics_phone: ridersJSON });
      await fetchUser();
      setShowRiderMigrator(false);
    } catch (err) {
      console.error("Failed to migrate legacy riders:", err);
      alert("Failed to save riders. Please try again.");
    }
  };

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationTab, setNotificationTab] = useState('all');

  const filteredNotifications = notifications.filter(noti => {
    if (notificationTab === 'all') return true;
    if (notificationTab === 'unread') return !noti.is_read;
    if (notificationTab === 'attention') return noti.type === 'attention_needed';
    if (notificationTab === 'paid') return noti.type === 'invoice_paid';
    return true;
  });

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
      if (noti.type === 'invoice_paid' || (noti.link && noti.link.startsWith('/invoices'))) {
        navigate('/payments');
      } else if (noti.link) {
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
                
                {/* Dropdown removed - now handled via Off-Canvas */}
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

      {/* Notifications Off-Canvas Panel */}
      {showNotifications && (
        <>
          {/* Backdrop/Overlay */}
          <div 
            className="fixed inset-0 z-50 bg-[#101828]/45 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setShowNotifications(false)}
          />
          {/* Off-canvas Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#EAECF0] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-350 ease-out">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#EAECF0] flex items-center justify-between select-none">
              <div>
                <h2 className="text-base font-extrabold text-[#101828] flex items-center gap-2">
                  <Bell size={18} className="text-[#1A7A4A]" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-[#1A7A4A] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#667085] mt-0.5">Stay updated with customer activity and system alerts</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-bold text-[#1A7A4A] hover:text-[#0F5533] cursor-pointer hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 hover:bg-[#F2F4F7] rounded-lg text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Compartment Tabs: all | unread | attention | paid */}
            <div className="px-6 py-3 border-b border-[#EAECF0] bg-[#F8F9FC] flex gap-1.5 overflow-x-auto select-none no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread', count: unreadCount },
                { id: 'attention', label: 'Attention', count: notifications.filter(n => !n.is_read && n.type === 'attention_needed').length },
                { id: 'paid', label: 'Invoice Paid', count: notifications.filter(n => !n.is_read && n.type === 'invoice_paid').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNotificationTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    notificationTab === tab.id
                      ? 'bg-white text-[#1A7A4A] shadow-sm border border-[#EAECF0]'
                      : 'text-[#667085] hover:text-[#101828] hover:bg-[#EAECF0]/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="bg-[#12B76A]/15 text-[#1A7A4A] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#EAECF0] custom-scrollbar">
              {filteredNotifications.length === 0 ? (
                <div className="py-24 px-6 text-center text-[#667085] flex flex-col items-center justify-center space-y-3 select-none">
                  <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                    <Bell size={20} className="text-[#98A2B3]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#344054]">No notifications found</p>
                    <p className="text-xs text-[#667085] mt-1">
                      {notificationTab === 'unread' ? "You have read all notifications."
                       : notificationTab === 'attention' ? "No alerts requiring attention."
                       : notificationTab === 'paid' ? "No invoice payment events."
                       : "Check back later for client activity."}
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map(noti => {
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
                      className={`px-6 py-4 hover:bg-[#F8F9FC] transition-colors cursor-pointer flex gap-4 ${!noti.is_read ? 'bg-[#F8F9FC]/40' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-xs leading-normal ${!noti.is_read ? 'font-extrabold text-[#101828]' : 'font-bold text-[#344054]'}`}>
                            {noti.title}
                          </p>
                          {!noti.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                          {noti.message}
                        </p>
                        <span className="text-[10px] text-[#98A2B3] mt-2 block font-medium">
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

      {showRiderMigrator && (
        <div className="fixed inset-0 z-50 bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#EAECF0] p-6 animate-in scale-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101828]">Logistics Update</h3>
                <p className="text-xs text-[#667085]">Add names to your existing riders list</p>
              </div>
            </div>
            
            <form onSubmit={handleMigrateRiders} className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {legacyRiders.map((rider, idx) => (
                  <div key={idx} className="p-3 bg-[#F8F9FC] border border-[#EAECF0] rounded-xl space-y-2">
                    <label className="text-[10px] font-bold text-[#667085] block">
                      Rider Phone: {rider.phone}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Rider Name"
                      value={rider.name}
                      onChange={(e) => {
                        const updated = [...legacyRiders];
                        updated[idx].name = e.target.value;
                        setLegacyRiders(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#D0D5DD] rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#1A7A4A] transition-all"
                      required
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={legacyRiders.some(r => !r.name.trim())}
                  className="w-full py-2 bg-[#1A7A4A] text-white hover:bg-[#125D37] disabled:bg-[#D0D5DD] disabled:text-[#98A2B3] disabled:cursor-not-allowed rounded-lg transition-all border border-black shadow-[2px_2px_0px_#0A0A0A] font-bold text-xs cursor-pointer text-center"
                >
                  Save & Update Riders
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
