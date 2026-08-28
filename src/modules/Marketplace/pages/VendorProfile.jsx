import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Calendar,
  AlertTriangle,
  ShoppingBag,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import api from '../../../api/axios';
import { formatCurrency } from '../../../utils/formatters';
import { MarketplaceHeader, MarketplaceFooter } from './ProductDetail';

export default function VendorProfile() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Show Phone state
  const [showPhone, setShowPhone] = useState(false);

  // Fetch Vendor Profile & Products
  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/public/vendor/${vendorId}`);
        setVendor(res.data.vendor);
        setProducts(res.data.products || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch public vendor details:', err);
        setError('The vendor you are looking for does not exist or has been deactivated.');
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [vendorId]);

  // Extract categories listed by this vendor
  const categoriesList = useMemo(() => {
    const list = new Set(['All']);
    products.forEach(p => {
      if (p.category) list.add(p.category);
    });
    return Array.from(list);
  }, [products]);

  // Format WhatsApp Link
  const getWhatsAppLink = (vendorObj, productObj, customText = '') => {
    if (!vendorObj) return '#';
    const phone = vendorObj.phone || '';
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('234')) {
      cleanPhone = '234' + cleanPhone;
    }

    const message = customText || `Hi ${vendorObj.business_name}, I'm interested in buying your products listed on your Kasi Marketplace page. Can we chat?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
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
  }, [products, searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] flex flex-col justify-between">
        <MarketplaceHeader />
        <main className="max-w-[1200px] mx-auto w-full px-6 py-12 flex-1 space-y-8 animate-pulse text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-96 bg-gray-200 border border-[#E7E5E0] rounded-2xl" />
            <div className="lg:col-span-8 space-y-6">
              <div className="h-10 bg-gray-200 border border-[#E7E5E0] rounded-xl w-1/3" />
              <div className="h-96 bg-gray-200 border border-[#E7E5E0] rounded-2xl w-full" />
            </div>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] flex flex-col justify-between">
        <MarketplaceHeader />
        <main className="max-w-md mx-auto px-6 py-16 flex-1 text-center flex flex-col justify-center items-center space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)]">
            <X size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold font-bricolage">Store Not Found</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">{error}</p>
          <Link to="/market" className="btn-primary py-2.5 px-6 text-sm">
            Return to Marketplace
          </Link>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] flex flex-col justify-between font-sans">
      <MarketplaceHeader />

      <main className="max-w-[1200px] mx-auto w-full px-4 md:px-6 py-8 space-y-6 flex-1 text-left">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">
          <Link to="/market" className="hover:text-black transition-colors">Marketplace</Link>
          <ChevronRight size={14} className="shrink-0 text-gray-400" />
          <span className="text-black font-bold truncate">Store: {vendor.business_name}</span>
        </nav>

        {/* Back Link */}
        <div>
          <Link 
            to="/market"
            className="inline-flex items-center gap-2 py-2 px-4 border border-[#E7E5E0] bg-white hover:bg-gray-50 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] active:scale-95 transition-all text-xs font-bold text-gray-800"
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Back to Catalog
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Vendor Card Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)] space-y-6">
              
              {/* Profile Header card */}
              <div className="flex flex-col items-center text-center space-y-3.5 border-b border-dashed border-gray-200 pb-5">
                {vendor.logo_url ? (
                  <img 
                    src={vendor.logo_url} 
                    alt={vendor.business_name} 
                    className="w-24 h-24 rounded-full border border-[#E7E5E0] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] object-cover" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-50 text-[#1A7A4A] border border-[#E7E5E0] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center font-black text-3xl">
                    {vendor.business_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight leading-tight text-black">{vendor.business_name}</h2>
                  <div className="flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                      <ShieldCheck size={10} strokeWidth={2.5} /> Verified Seller
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 pt-0.5">
                      <Calendar size={10} /> Active on Kasi
                    </span>
                  </div>
                </div>
              </div>

              {/* Show Contact & WhatsApp buttons */}
              <div className="space-y-3">
                {showPhone ? (
                  <div className="w-full py-3.5 px-4 bg-gray-50 border border-[#E7E5E0] text-[#0A0A0A] font-bold rounded-xl text-center flex items-center justify-center gap-2 text-sm select-all">
                    <Phone size={16} />
                    {vendor.phone || 'No phone number uploaded'}
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowPhone(true)}
                    className="w-full py-3.5 px-4 bg-[#1A7A4A] hover:bg-[#125D37] text-white font-bold rounded-xl shadow-none hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)] hover:translate-y-[-1px] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Phone size={16} />
                    Show Contact Line
                  </button>
                )}

                <a 
                  href={getWhatsAppLink(vendor)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-black border border-[#E7E5E0] font-bold rounded-xl shadow-none hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)] hover:translate-y-[-1px] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm text-center"
                >
                  <MessageSquare size={16} fill="currentColor" className="text-black" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Location details */}
              <div className="space-y-4 pt-2 text-xs font-medium text-gray-700">
                {vendor.address && (
                  <div className="flex gap-2.5 items-start">
                    <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-400 block mb-0.5">LOCATION</span>
                      <span className="font-bold text-black leading-snug">{vendor.address}</span>
                      {vendor.store_google_maps_link && (
                        <a 
                          href={vendor.store_google_maps_link}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#1A7A4A] hover:underline font-bold text-[10px] flex items-center gap-0.5 mt-1"
                        >
                          Google Maps Link <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5 items-start">
                  <Clock size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-400 block mb-0.5">OPENING HOURS</span>
                    <span className="font-bold text-black">{vendor.opening_hours || 'Not specified'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* About Store bio section */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A7A4A] border-b border-gray-100 pb-2">
                About the Merchant
              </h3>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">
                {vendor.business_bio || 'This merchant has not set up a public business bio overview yet.'}
              </p>
            </div>
          </div>

          {/* Right Column: Catalog Listing & Categories (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header: Search & Category Filter pills inside catalogs */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] space-y-5">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <h3 className="font-bold text-lg font-bricolage text-black shrink-0">
                  Seller Catalog ({filteredProducts.length} items)
                </h3>

                {/* Local search bar */}
                <div className="relative w-full md:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={14} />
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inside this store..."
                    className="w-full pl-9 pr-3 py-1.5 border border-[#E7E5E0] bg-white rounded-xl text-xs font-medium focus:outline-none focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/20 transition-all"
                  />
                </div>
              </div>

              {/* Vendor local categories list */}
              {categoriesList.length > 2 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Store Categories</span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {categoriesList.map(cat => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs transition-all
                            ${isActive 
                              ? 'bg-[#D4F263] text-black shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] font-bold' 
                              : 'bg-[#faf6f1] text-gray-500 border border-[#E7E5E0] hover:bg-white hover:text-black hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)]'}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] text-center space-y-4">
                <ShoppingBag size={48} className="mx-auto text-gray-300" />
                <h4 className="text-base font-bold font-bricolage">No products found</h4>
                <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">This vendor has no products matching the active filters or search terms.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  Reset Store Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map(p => {
                  const isOutOfStock = p.in_stock === false || p.stock_quantity === 0;
                  return (
                    <article 
                      key={p.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)] transition-all flex flex-col justify-between"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-square bg-gray-50 border-b border-[#E7E5E0] overflow-hidden group">
                        <img 
                          src={p.image_url || '/placeholder_product.png'} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'; }}
                        />
                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] text-gray-800">
                          {p.category || 'General'}
                        </span>
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-red-600 text-white rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-[0_4px_8px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)] rotate-[-5deg]">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info body */}
                      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm line-clamp-1">{p.name}</h4>
                          <p className="text-[11px] text-gray-500 line-clamp-2 min-h-[2rem]">
                            {p.description || 'No description provided by merchant.'}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between items-baseline border-t border-dashed border-gray-150 pt-2 text-[10px] font-semibold uppercase text-gray-400">
                            <span>Price</span>
                            <span className="text-sm text-emerald-800 font-bold">{formatCurrency(p.price)}</span>
                          </div>

                          {/* CTA Row */}
                          <div className="flex gap-1.5">
                            <Link 
                              to={`/market/product/${p.id}`}
                              className="flex-1 py-1.5 border border-[#E7E5E0] bg-transparent hover:bg-gray-50 text-black font-bold text-[10px] rounded-lg shadow-none active:scale-95 transition-all text-center"
                            >
                              Details
                            </Link>
                            <a 
                              href={getWhatsAppLink(vendor, p)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`flex-1.5 py-1.5 bg-[#1A7A4A] text-white hover:bg-[#125D37] font-bold text-[10px] rounded-lg shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] hover:translate-y-[-1px] text-center flex items-center justify-center gap-1 transition-all
                                ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              <MessageSquare size={11} fill="currentColor" />
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
          </div>
        </div>

      </main>

      <MarketplaceFooter />
    </div>
  );
}
