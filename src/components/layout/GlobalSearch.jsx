import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Users, FileText, ChevronRight, LayoutDashboard, Settings, Calendar, Briefcase, Truck, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const GlobalSearch = () => {
  const { user } = useAuth();
  const isService = user?.business_type === 'service';
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ pages: [], products: [], clients: [], invoices: [] });
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic pages based on business type
  const ALL_PAGES = isService ? [
    { title: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Schedule', path: '/bookings', icon: Calendar },
    { title: 'Chats', path: '/chats', icon: MessageSquare },
    { title: 'Clients', path: '/customers', icon: Users },
    { title: 'Services', path: '/services', icon: Briefcase },
    { title: 'Invoices', path: '/invoices', icon: FileText },
    { title: 'Settings', path: '/settings', icon: Settings },
  ] : [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Chats', path: '/chats', icon: MessageSquare },
    { title: 'Store', path: '/products', icon: Package },
    { title: 'Logistics', path: '/logistics', icon: Truck },
    { title: 'Customers', path: '/customers', icon: Users },
    { title: 'Analytics', path: '/analytics', icon: LayoutDashboard },
    { title: 'Invoices', path: '/invoices', icon: FileText },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search API Call
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ pages: [], products: [], clients: [], invoices: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Find matching pages locally
        const matchedPages = ALL_PAGES.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

        // We can do parallel calls if we have endpoints, or just fetch all and filter if it's a small dataset.
        // For a true global search, you might want a backend `/api/search?q=` endpoint.
        // But since this is MVP, we can quickly fetch the lists and filter them.
        
        const [prodRes, invRes] = await Promise.all([
          isService ? api.get('/api/services/') : api.get('/api/products/'),
          api.get('/api/invoices/')
        ].map(p => p.catch(e => ({ data: [] }))));

        // Quick mock filter (In a real app, the backend should handle this for scale)
        const matchedProducts = (Array.isArray(prodRes.data) ? prodRes.data : []).filter(p => 
          p.name?.toLowerCase().includes(query.toLowerCase()) || 
          p.brand?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
        
        const matchedInvoices = (Array.isArray(invRes.data) ? invRes.data : []).filter(i => 
          i.reference?.toLowerCase().includes(query.toLowerCase()) || 
          i.customer_name?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);

        setResults({
          pages: matchedPages,
          products: matchedProducts,
          clients: [], // We'd need a real clients endpoint to filter these
          invoices: matchedInvoices
        });
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          placeholder="Search for products, invoices..."
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
        />
        {loading && (
          <div className="absolute right-3 w-3.5 h-3.5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="max-h-[400px] overflow-y-auto py-2 scrollbar-hide">
            
            {/* Navigation Pages */}
            {results.pages.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Navigation</div>
                {results.pages.map(page => (
                  <button key={page.path} onClick={() => handleSelect(page.path)} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-2">
                      <page.icon size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-dark">{page.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Products / Services */}
            {results.products.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isService ? 'Services' : 'Products'}</div>
                {results.products.map(prod => (
                  <button key={prod.id} onClick={() => handleSelect(isService ? '/services' : '/products')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                        {prod.image_url ? <img src={prod.image_url} alt="" className="w-full h-full object-cover" /> : (isService ? <Briefcase size={14} className="text-gray-400" /> : <Package size={14} className="text-gray-400" />)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark leading-tight">{prod.name}</div>
                        <div className="text-xs text-primary font-bold">₦{Number(prod.price).toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Invoices */}
            {results.invoices.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Invoices</div>
                {results.invoices.map(inv => (
                  <button key={inv.id} onClick={() => handleSelect('/invoices')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
                      <div>
                        <div className="text-sm font-medium text-dark leading-tight">{inv.reference}</div>
                        <div className="text-[11px] text-gray-500">{inv.customer_name || 'Unknown Client'}</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-dark">₦{Number(inv.grand_total).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && results.pages.length === 0 && results.products.length === 0 && results.invoices.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Search size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-dark">No results found</p>
                <p className="text-xs text-gray-500">Try searching for a different keyword</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
