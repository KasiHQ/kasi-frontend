import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Store, 
  X, 
  ArrowRight, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  ExternalLink, 
  MessageSquare, 
  Filter, 
  ArrowUpDown, 
  Tag, 
  Building, 
  ShoppingBag,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';
import { formatCurrency } from '../../../utils/formatters';
import { MarketplaceFooter } from './ProductDetail';

// Category list matches backend CORE_CATEGORIES + Others
const CATEGORIES = [
  'All',
  'Fashion & Accessories',
  'Electronics & Devices',
  'Beauty & Personal Care',
  'Food & Consumables',
  'Logistics & Fulfilment',
  'Others'
];

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchContainerRef = useRef(null);
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filters from URL/state
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedVendor = searchParams.get('vendor') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/products/public');
      setProducts(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch marketplace products:', err);
      setError('Could not load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close suggestions overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique vendors list for filtering dropdown
  const vendors = useMemo(() => {
    const list = new Map();
    products.forEach(p => {
      if (p.vendor) {
        list.set(p.vendor.business_name, p.vendor);
      }
    });
    return Array.from(list.values());
  }, [products]);

  // Handle WhatsApp Link formatting
  const getWhatsAppLink = (vendor, product, customText = '') => {
    if (!vendor) return '#';
    const phone = vendor.phone || '';
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('234')) {
      cleanPhone = '234' + cleanPhone;
    }

    const message = customText || `Hi ${vendor.business_name}, I'm interested in buying your product "${product.name}" listed on Kasi Marketplace for ${formatCurrency(product.price)}. Can we chat and finalize this order?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.vendor?.business_name?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Vendor filter
    if (selectedVendor && selectedVendor !== 'All') {
      result = result.filter(p => p.vendor?.business_name === selectedVendor);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Newest first
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedVendor, sortBy]);

  // Real-time suggestions filtering (Image 1 style)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return { terms: [], stores: [], products: [] };
    const query = searchQuery.toLowerCase().trim();

    // Matching terms (categories or key words from product titles)
    const termsSet = new Set();
    CATEGORIES.forEach(c => {
      if (c !== 'All' && c.toLowerCase().includes(query)) {
        termsSet.add(c);
      }
    });
    
    // Add product name splits matching
    products.forEach(p => {
      if (p.name.toLowerCase().includes(query)) {
        const words = p.name.split(' ');
        words.forEach(w => {
          if (w.toLowerCase().startsWith(query) && w.length > 3) {
            termsSet.add(w);
          }
        });
      }
    });

    // Matching stores
    const matchedStores = vendors.filter(v => 
      v.business_name?.toLowerCase().includes(query)
    ).slice(0, 3);

    // Matching products
    const matchedProducts = products.filter(p => 
      p.name?.toLowerCase().includes(query)
    ).slice(0, 5);

    return {
      terms: Array.from(termsSet).slice(0, 4),
      stores: matchedStores,
      products: matchedProducts
    };
  }, [searchQuery, products, vendors]);

  // Update filters helper
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSuggestionClick = (term) => {
    updateFilters('search', term);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] font-sans selection:bg-[#D4F263] selection:text-black flex flex-col justify-between">
      
      <div>
        {/* ── Neubrutalist Header ── */}
        <header className="sticky top-0 z-50 bg-white border-b-4 border-black py-4 px-6 shadow-[0_4px_0_#000]">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group hover:scale-[1.02] transition-transform">
              <img src="/kasi.png" alt="Kasi Logo" className="w-9 h-9 object-contain" />
              <span className="text-2xl font-black tracking-tight font-bricolage">
                KASI <span className="text-[#1A7A4A] underline decoration-4 decoration-[#D4F263]">MARKET</span>
              </span>
            </Link>

            {/* Search bar inside header with overlay suggestions */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  updateFilters('search', e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search products, stores, categories..."
                className="w-full pl-10 pr-4 py-2 border-3 border-black bg-white rounded-xl text-sm font-bold placeholder-gray-500 focus:outline-none focus:bg-[#faf6f1] focus:shadow-[2px_2px_0_#000] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    updateFilters('search', '');
                    setShowSuggestions(false);
                  }} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-black"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              )}

              {/* Suggestions Overlay Dropdown (Image 1 style) */}
              {showSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-3 border-black rounded-2xl shadow-[5px_5px_0_#000] overflow-hidden z-[110] text-left animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 md:grid-cols-12 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                    
                    {/* Left Column: Terms & Stores (5 Cols) */}
                    <div className="md:col-span-5 p-4 space-y-4">
                      {/* Suggestions terms */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Suggestions</h4>
                        {suggestions.terms.length > 0 ? (
                          <div className="flex flex-col gap-1.5 text-xs font-bold text-gray-800">
                            {suggestions.terms.map((term, i) => (
                              <button 
                                key={i} 
                                onClick={() => handleSuggestionClick(term)}
                                className="w-full text-left py-1 hover:text-[#1A7A4A] flex items-center gap-1.5"
                              >
                                <Search size={12} className="text-gray-400" />
                                <span>{term}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 font-semibold italic">No suggested categories</p>
                        )}
                      </div>

                      {/* Stores suggestions */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Stores</h4>
                        {suggestions.stores.length > 0 ? (
                          <div className="flex flex-col gap-2 text-xs font-bold text-gray-800">
                            {suggestions.stores.map((store) => (
                              <Link 
                                key={store.id} 
                                to={`/market/vendor/${store.id}`}
                                onClick={() => setShowSuggestions(false)}
                                className="w-full text-left py-1 hover:text-[#1A7A4A] flex items-center gap-1.5"
                              >
                                {store.logo_url ? (
                                  <img src={store.logo_url} alt="" className="w-4 h-4 rounded-full border border-black" />
                                ) : (
                                  <Store size={12} className="text-gray-400" />
                                )}
                                <span>{store.business_name}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 font-semibold italic">No matching stores</p>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Products (7 Cols) */}
                    <div className="md:col-span-7 p-4 space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Products</h4>
                      {suggestions.products.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {suggestions.products.map((p) => (
                            <Link 
                              key={p.id} 
                              to={`/market/product/${p.id}`}
                              onClick={() => setShowSuggestions(false)}
                              className="flex items-center gap-3 p-1.5 hover:bg-gray-50 border-2 border-transparent hover:border-black rounded-xl transition-all"
                            >
                              <img 
                                src={p.image_url || '/placeholder_product.png'} 
                                alt="" 
                                className="w-10 h-10 object-cover border border-black rounded-lg bg-gray-50 shrink-0" 
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-black truncate">{p.name}</p>
                                <span className="text-[10px] font-black text-[#1A7A4A]">{formatCurrency(p.price)}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 font-semibold italic">No matching products</p>
                      )}
                    </div>
                  </div>

                  {/* View all results footer */}
                  <div className="bg-[#faf6f1] border-t-2 border-black p-3 text-center">
                    <button 
                      onClick={() => setShowSuggestions(false)}
                      className="text-xs font-black text-black hover:text-[#1A7A4A] underline"
                    >
                      View all results
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="px-5 py-2.5 bg-[#D4F263] text-black font-black text-sm rounded-xl border-3 border-black shadow-[3px_3px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#000] transition-all flex items-center gap-1.5"
                >
                  <Building size={16} strokeWidth={2.5} />
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/signup"
                  className="px-5 py-2.5 bg-black text-white font-black text-sm rounded-xl border-3 border-black shadow-[3px_3px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#000] transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={16} className="text-[#D4F263]" />
                  Sell on Kasi
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* ── Main Layout Wrapper ── */}
        <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">
          
          {/* ── Neubrutalist Hero Banner ── */}
          <section className="relative overflow-hidden bg-[#1A7A4A] text-white border-3 border-black rounded-3xl p-8 shadow-[6px_6px_0_#000] select-none text-left">
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1 bg-[#D4F263] text-black border-2 border-black rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider">
                <MessageSquare size={12} fill="currentColor" /> Chat, Bargain & Buy
              </span>
              <h1 className="text-4xl md:text-5xl font-black font-bricolage tracking-tight leading-none">
                Shop directly from local sellers on WhatsApp
              </h1>
              <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed">
                Browse catalogs, view details, and click to open a chat. Kasi's automated merchant sales bots are active 24/7 to negotiate, calculate split shipping, and confirm payments instantly.
              </p>
            </div>
            <div className="absolute right-8 bottom-0 top-0 hidden lg:flex items-center justify-center opacity-90 pointer-events-none">
              <div className="w-56 h-56 bg-[#D4F263] border-4 border-black shadow-[6px_6px_0_#000] rounded-3xl rotate-6 flex flex-col justify-between p-5 text-black">
                <span className="text-[10px] font-black tracking-widest text-[#1A7A4A] uppercase">KASI VENDOR BILL</span>
                <div className="space-y-1">
                  <div className="h-4 bg-black rounded-sm w-3/4" />
                  <div className="h-4 bg-black rounded-sm w-1/2" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 rounded-full bg-[#1A7A4A] flex items-center justify-center text-white font-bold">✓</div>
                  <span className="font-black text-xl leading-none">₦ SALE</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Filters Section ── */}
          <section className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0_#000] space-y-6 text-left">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="text-[#1A7A4A]" size={20} strokeWidth={2.5} />
                <h2 className="text-lg font-black font-bricolage">Filter Catalogs</h2>
              </div>
              
              {/* Sorting & Vendor selectors */}
              <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
                {/* Store selector */}
                <div className="flex-1 lg:flex-none">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-wider">Select Vendor</label>
                  <select 
                    value={selectedVendor} 
                    onChange={(e) => updateFilters('vendor', e.target.value)}
                    className="w-full lg:w-48 py-2 px-3 border-3 border-black rounded-xl text-xs font-black bg-white focus:outline-none focus:shadow-[2px_2px_0_#000] transition-all"
                  >
                    <option value="All">All Stores / Vendors</option>
                    {vendors.map(v => (
                      <option key={v.business_name} value={v.business_name}>{v.business_name}</option>
                    ))}
                  </select>
                </div>

                {/* Sorting selector */}
                <div className="flex-1 lg:flex-none">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-wider">Sort Products</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="w-full lg:w-48 py-2 px-3 border-3 border-black rounded-xl text-xs font-black bg-white focus:outline-none focus:shadow-[2px_2px_0_#000] transition-all"
                  >
                    <option value="newest">Newest Additions</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Chips Scrollbar */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Browse Category</label>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide mask-linear-edges select-none">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => updateFilters('category', cat)}
                      className={`shrink-0 px-4 py-2 text-xs font-black border-2 border-black rounded-xl shadow-[2px_2px_0_#000] active:scale-95 transition-all
                        ${isActive 
                          ? 'bg-[#D4F263] text-black translate-x-[-1px] translate-y-[-1px] shadow-[3px_3px_0_#000]' 
                          : 'bg-[#faf6f1] text-[#3D3D3D] hover:bg-white hover:text-black'
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Products Display Grid ── */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Showing {filteredProducts.length} Product{filteredProducts.length !== 1 && 's'}
              </p>
              {(searchQuery || selectedCategory !== 'All' || selectedVendor !== 'All') && (
                <button 
                  onClick={() => {
                    setSearchParams(new URLSearchParams());
                  }}
                  className="text-xs font-black text-red-600 hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {loading ? (
              /* Neubrutalist Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0_#000] space-y-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 border-2 border-black rounded-xl w-full" />
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
                    <div className="h-6 bg-gray-200 rounded-sm w-1/3" />
                    <div className="h-10 bg-gray-200 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white border-3 border-black rounded-2xl p-12 shadow-[4px_4px_0_#000] text-center max-w-md mx-auto space-y-4">
                <HelpCircle size={48} className="mx-auto text-red-500" strokeWidth={2.5} />
                <h3 className="text-lg font-black font-bricolage">Error Loading Catalog</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">{error}</p>
                <button onClick={fetchProducts} className="btn-primary py-2 px-5 text-sm">Retry Load</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border-3 border-black rounded-2xl p-12 shadow-[4px_4px_0_#000] text-center max-w-md mx-auto space-y-4">
                <ShoppingBag size={48} className="mx-auto text-gray-400" strokeWidth={2.5} />
                <h3 className="text-lg font-black font-bricolage">No items found</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">Try modifying your search or expanding the filter choices.</p>
                <button 
                  onClick={() => setSearchParams(new URLSearchParams())} 
                  className="btn-primary py-2 px-5 text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Dynamic Products List */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.in_stock === false || p.stock_quantity === 0;
                  return (
                    <article 
                      key={p.id}
                      className="bg-white border-3 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0_#000] transition-all flex flex-col justify-between"
                    >
                      {/* Image Area */}
                      <Link to={`/market/product/${p.id}`} className="relative aspect-square w-full bg-gray-50 border-b-3 border-black overflow-hidden group">
                        <img 
                          src={p.image_url || '/placeholder_product.png'} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'; }}
                        />
                        
                        {/* Category Tag overlay */}
                        <span className="absolute top-3 left-3 bg-white border-2 border-black rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_#000]">
                          {p.category || 'General'}
                        </span>

                        {/* Delivery overlay badge */}
                        {p.delivery_available && (
                          <span className="absolute top-3 right-3 bg-[#D4F263] border-2 border-black rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_#000] flex items-center gap-1">
                            <Truck size={10} /> Delivery
                          </span>
                        )}

                        {/* Out of Stock overlay */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-red-600 text-white border-3 border-black px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_#000] rotate-[-5deg]">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Content info */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          {/* Store Info */}
                          {p.vendor && (
                            <Link 
                              to={`/market/vendor/${p.vendor.id}`}
                              className="flex items-center gap-1.5 group/shop hover:underline text-left"
                            >
                              {p.vendor.logo_url ? (
                                <img src={p.vendor.logo_url} alt="" className="w-4 h-4 rounded-full border border-black shrink-0" />
                              ) : (
                                <Store size={12} className="text-[#1A7A4A]" />
                              )}
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/shop:text-black">
                                {p.vendor.business_name}
                              </span>
                            </Link>
                          )}
                          <h3 className="font-black text-base line-clamp-1 leading-snug">
                            <Link to={`/market/product/${p.id}`} className="hover:text-[#1A7A4A]">
                              {p.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                            {p.description || 'No description provided by the merchant.'}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between border-t-2 border-dashed border-gray-100 pt-2.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                            <span className="font-black text-lg text-emerald-700">{formatCurrency(p.price)}</span>
                          </div>

                          {/* Neubrutalist Buttons */}
                          <div className="flex gap-2">
                            <Link 
                              to={`/market/product/${p.id}`}
                              className="flex-1 py-2 px-3 border-2 border-black bg-[#faf6f1] hover:bg-white text-black font-black text-xs rounded-xl shadow-[2px_2px_0_#000] active:scale-95 transition-all text-center"
                            >
                              Details
                            </Link>
                            
                            <a 
                              href={getWhatsAppLink(p.vendor, p)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`flex-2 py-2 px-3.5 border-2 border-black bg-[#1A7A4A] hover:bg-[#125D37] text-white font-black text-xs rounded-xl shadow-[2px_2px_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#000] active:scale-95 transition-all flex items-center justify-center gap-1.5 text-center
                                ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              <MessageSquare size={13} fill="currentColor" />
                              Bargain
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      <MarketplaceFooter />
    </div>
  );
}
