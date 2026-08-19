import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
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
  ArrowUpDown, 
  Building,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Instagram,
  Twitter,
  Linkedin,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';
import { formatCurrency } from '../../../utils/formatters';

// Common Neubrutalist Footer component for public marketplace views
export function MarketplaceFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-[#9ca3af] py-20 font-sans select-none text-left border-t-4 border-black mt-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 items-start">
          <div className="lg:col-span-4 space-y-5">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2 font-bricolage">
              <img src="/kasi.png" alt="Kasi" className="w-6 h-6 object-contain shrink-0" />
              <span>Kasi AI</span>
            </span>
            <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-xs mt-4">
              Your AI sales agent that never sleeps.
            </p>
          </div>
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest">PRODUCT</h4>
            <ul className="space-y-3 text-[15px] font-medium">
              <li><Link to="/market" className="text-white/70 hover:text-white transition-colors">Marketplace</Link></li>
              <li><a href="#dms" className="text-white/70 hover:text-white transition-colors">Direct Messages</a></li>
              <li><a href="#invoices" className="text-white/70 hover:text-white transition-colors">Invoices & Payments</a></li>
              <li><a href="#negotiation" className="text-white/70 hover:text-white transition-colors">Negotiations</a></li>
            </ul>
          </div>
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest">INTEGRATIONS</h4>
            <ul className="space-y-3 text-[15px] font-medium text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram DMs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Paystack</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest">COMPANY</h4>
            <ul className="space-y-3 text-[15px] font-medium text-white/70">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><a href="mailto:support@usekasi.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[13px] text-white/40 font-medium">
            © 2026 Endogenous Technologies. All rights reserved.
          </span>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/official_kasi247/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all"><Instagram size={16} /></a>
            <a href="https://x.com/hq_kasi" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all"><Twitter size={16} /></a>
            <a href="https://www.linkedin.com/company/122863967/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Common Neubrutalist Header component for public marketplace views
export function MarketplaceHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-black py-4 px-6 shadow-[0_4px_0_#000]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        <Link to="/market" className="flex items-center gap-2.5 group hover:scale-[1.02] transition-transform">
          <img src="/kasi.png" alt="Kasi Logo" className="w-9 h-9 object-contain" />
          <span className="text-2xl font-black tracking-tight font-bricolage">
            KASI <span className="text-[#1A7A4A] underline decoration-4 decoration-[#D4F263]">MARKET</span>
          </span>
        </Link>
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
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productsList, setProductsList] = useState([]); // full list for comparison matches
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Fetch specific product and full list for category comparison
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const detailRes = await api.get(`/api/products/public/${id}`);
        setProduct(detailRes.data);
        setActiveImageIdx(0);
        
        // Fetch full catalog for comparison details
        const listRes = await api.get('/api/products/public');
        setProductsList(listRes.data || []);
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('The product you are looking for does not exist or has been deactivated.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Format WhatsApp Link
  const getWhatsAppLink = (vendor, prod, customText = '') => {
    if (!vendor) return '#';
    const phone = vendor.phone || '';
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '234' + cleanPhone.slice(1);
    } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('234')) {
      cleanPhone = '234' + cleanPhone;
    }

    const message = customText || `Hi ${vendor.business_name}, I'm interested in buying your product "${prod.name}" listed on Kasi Marketplace for ${formatCurrency(prod.price)}. Can we chat and finalize this order?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Find other vendors in the same category
  const comparisonProducts = useMemo(() => {
    if (!product || !productsList.length) return [];
    return productsList.filter(p => 
      p.category === product.category && 
      p.id !== product.id && 
      p.vendor?.business_name !== product.vendor?.business_name
    ).slice(0, 3);
  }, [product, productsList]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] flex flex-col justify-between">
        <MarketplaceHeader />
        <main className="max-w-[1200px] mx-auto w-full px-6 py-12 flex-1 space-y-8 animate-pulse text-left">
          <div className="h-8 bg-gray-200 border-2 border-black rounded-lg w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 aspect-square bg-gray-200 border-3 border-black rounded-2xl" />
            <div className="lg:col-span-7 space-y-6">
              <div className="h-10 bg-gray-200 border-2 border-black rounded-xl w-3/4" />
              <div className="h-6 bg-gray-200 border-2 border-black rounded-lg w-1/4" />
              <div className="h-32 bg-gray-200 border-3 border-black rounded-2xl w-full" />
            </div>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] flex flex-col justify-between">
        <MarketplaceHeader />
        <main className="max-w-md mx-auto px-6 py-16 flex-1 text-center flex flex-col justify-center items-center space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#000]">
            X
          </div>
          <h3 className="text-xl font-black font-bricolage">Product Not Found</h3>
          <p className="text-sm text-gray-500 font-semibold leading-relaxed">{error}</p>
          <Link to="/market" className="btn-primary py-2.5 px-6 text-sm">
            Return to Marketplace
          </Link>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  const isOutOfStock = product.in_stock === false || product.stock_quantity === 0;

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#0A0A0A] flex flex-col justify-between font-sans">
      <MarketplaceHeader />

      <main className="max-w-[1200px] mx-auto w-full px-4 md:px-6 py-8 space-y-8 flex-1 text-left">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
          <Link to="/market" className="hover:text-black">Marketplace</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-gray-400">{product.category || 'General'}</span>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-black truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Action Button: Back */}
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 py-2 px-4 border-2 border-black bg-white hover:bg-gray-150 rounded-xl shadow-[3px_3px_0_#000] active:scale-95 transition-all text-xs font-black"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Go Back
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media Gallery (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square bg-white border-3 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0_#000]">
              <img 
                src={
                  product.images && product.images.length > 0
                    ? product.images[activeImageIdx]?.image_url
                    : product.image_url || '/placeholder_product.png'
                } 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'; }}
              />
              
              {/* Overlays */}
              <span className="absolute top-4 left-4 bg-[#D4F263] border-2 border-black rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0_#000]">
                {product.category || 'General'}
              </span>

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-red-600 text-white border-3 border-black px-6 py-3 text-sm font-black uppercase tracking-widest shadow-[4px_4px_0_#000] rotate-[-5deg]">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 bg-white overflow-hidden shadow-[2px_2px_0_#000] hover:scale-105 active:scale-95 transition-all
                      ${activeImageIdx === idx ? 'border-primary outline outline-2 outline-[#1A7A4A]' : 'border-black'}`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Descriptions & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              {product.vendor && (
                <Link 
                  to={`/market/vendor/${product.vendor.id}`}
                  className="flex items-center gap-1.5 group/store hover:underline font-black text-xs text-[#1A7A4A] uppercase tracking-widest w-fit"
                >
                  <Store size={14} className="text-[#1A7A4A]" />
                  <span>Store: {product.vendor.business_name}</span>
                  <ExternalLink size={12} className="text-[#1A7A4A] opacity-0 group-hover/store:opacity-100 transition-opacity" />
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none font-bricolage">
                {product.name}
              </h1>
              <div className="text-4xl font-black text-[#1A7A4A] pt-1">
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Direct Bargaining / WhatsApp box */}
            <div className="bg-[#E8F5EE] border-3 border-black rounded-3xl p-6 shadow-[5px_5px_0_#000] space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A7A4A] text-white flex items-center justify-center font-bold shadow-[2px_2px_0_#000] border-2 border-black shrink-0">
                  AI
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-[#1A7A4A] text-base leading-snug">Negotiate on WhatsApp</h4>
                  <p className="text-xs font-semibold text-gray-700 leading-normal">
                    This seller uses Kasi's automated catalog assistant. In WhatsApp, the AI handles bargaining rules (conforming to the merchant's target pricing), calculates dynamic delivery, and auto-verifies bank payments.
                  </p>
                </div>
              </div>

              <a 
                href={getWhatsAppLink(product.vendor, product)}
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-4 bg-[#1A7A4A] hover:bg-[#125D37] text-white font-black rounded-xl shadow-[3px_3px_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#000] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm border-3 border-black text-center
                  ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <MessageSquare size={16} fill="currentColor" />
                Bargain on WhatsApp
              </a>
            </div>

            {/* Specifications Details */}
            <div className="bg-white border-3 border-black rounded-2xl p-5 shadow-[4px_4px_0_#000] space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider border-b-2 border-dashed border-gray-100 pb-2">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-gray-400 font-bold block mb-0.5">Brand</span>
                  <span className="font-black text-gray-800">{product.brand || 'Generic'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-0.5">Weight</span>
                  <span className="font-black text-gray-800">{product.weight || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-0.5">Dimensions</span>
                  <span className="font-black text-gray-800">{product.dimensions || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-0.5">Expiry Date</span>
                  <span className="font-black text-gray-850">
                    {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0_#000] space-y-3">
          <h3 className="font-black text-lg font-bricolage">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-semibold">
            {product.description || 'No detailed description was uploaded for this product.'}
          </p>
        </div>

        {/* Vendor Details */}
        {product.vendor && (
          <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0_#000] space-y-4">
            <h3 className="font-black text-lg font-bricolage flex items-center gap-2">
              <Store size={20} className="text-[#1A7A4A]" /> About The Store
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {product.vendor.logo_url ? (
                    <img src={product.vendor.logo_url} alt="" className="w-12 h-12 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-[#1A7A4A] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center font-bold">
                      {product.vendor.business_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-black text-lg text-black leading-snug">{product.vendor.business_name}</h4>
                    <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md w-fit">
                      <ShieldCheck size={10} /> Verified Seller
                    </span>
                  </div>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                  {product.vendor.business_bio || 'This merchant has not set up a public profile overview bio yet.'}
                </p>

                <div className="space-y-2 pt-1.5">
                  {product.vendor.address && (
                    <div className="flex gap-2 items-start text-xs">
                      <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Pickup Location</span>
                        <span className="font-black text-gray-800">{product.vendor.address}</span>
                      </div>
                    </div>
                  )}
                  {product.vendor.phone && (
                    <div className="flex gap-2 items-start text-xs">
                      <Phone size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Inquiry Line</span>
                        <span className="font-black text-gray-850">{product.vendor.phone}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery rate sheets card */}
              <div className="space-y-4 bg-[#faf6f1] p-5 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000]">
                <h5 className="font-black text-xs uppercase tracking-wider flex items-center gap-1">
                  <Truck size={14} className="text-[#1A7A4A]" /> Logistics rates & schedules
                </h5>
                
                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Logistics Hub Base:</span>
                    <span className="font-black text-gray-850">{product.vendor.delivery_city || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Store Hours:</span>
                    <span className="font-black text-gray-850">{product.vendor.opening_hours || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Same-City Delivery Cost:</span>
                    <span className="font-black text-gray-850">
                      {product.delivery_cost_inside_city !== null 
                        ? formatCurrency(product.delivery_cost_inside_city) 
                        : 'Calculated dynamically'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-0.5">
                    <span className="text-gray-500">Out-of-City Delivery Cost:</span>
                    <span className="font-black text-gray-850">
                      {product.delivery_cost_outside_city !== null 
                        ? formatCurrency(product.delivery_cost_outside_city) 
                        : 'Calculated dynamically'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link 
                    to={`/market/vendor/${product.vendor.id}`}
                    className="w-full py-2 bg-white hover:bg-gray-50 border-2 border-black rounded-xl text-center text-xs font-black shadow-[2px_2px_0_#000] active:scale-95 transition-all"
                  >
                    View Store Products
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Compare with other vendors (Image 4 integration) ── */}
        <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0_#000] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h3 className="font-black text-lg font-bricolage flex items-center gap-2">
              <ArrowUpDown size={20} className="text-[#1A7A4A]" /> Compare vendor offers
            </h3>
            <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg w-fit">
              Related listings in {product.category || 'General'}
            </span>
          </div>

          {comparisonProducts.length > 0 ? (
            <div className="overflow-x-auto border-3 border-black rounded-2xl shadow-[3px_3px_0_#000]">
              <table className="w-full text-xs text-left border-collapse bg-white">
                <thead>
                  <tr className="border-b-3 border-black bg-[#faf6f1] font-black uppercase text-gray-500 tracking-wider">
                    <th className="py-3.5 px-4 border-r-2 border-black">Store / Vendor</th>
                    <th className="py-3.5 px-4 border-r-2 border-black">Product Name</th>
                    <th className="py-3.5 px-4 border-r-2 border-black text-right">Price</th>
                    <th className="py-3.5 px-4 border-r-2 border-black">Delivery hub</th>
                    <th className="py-3.5 px-4 text-center">Checkout Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black font-semibold text-gray-700">
                  {/* Current selected product row */}
                  <tr className="bg-[#E8F5EE] border-b-2 border-black font-black text-black">
                    <td className="py-3 px-4 border-r-2 border-black flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
                      <span>{product.vendor?.business_name} (Current)</span>
                    </td>
                    <td className="py-3 px-4 border-r-2 border-black truncate max-w-[150px]">{product.name}</td>
                    <td className="py-3 px-4 border-r-2 border-black text-right text-emerald-800 font-black">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4 border-r-2 border-black">
                      {product.vendor?.delivery_city || 'Lagos'} · {product.delivery_available ? 'Logistics ready' : 'Pickup'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <a 
                        href={getWhatsAppLink(product.vendor, product)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex py-1 px-3 bg-[#1A7A4A] border-2 border-black text-white rounded-lg shadow-[1px_1px_0_#000] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#000] transition-all text-[10px]"
                      >
                        Bargain Now
                      </a>
                    </td>
                  </tr>

                  {/* Other vendor rows */}
                  {comparisonProducts.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 border-r-2 border-black">
                        <Link to={`/market/vendor/${comp.vendor?.id}`} className="hover:underline text-blue-800">
                          {comp.vendor?.business_name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 border-r-2 border-black truncate max-w-[150px]">{comp.name}</td>
                      <td className="py-3 px-4 border-r-2 border-black text-right text-gray-900 font-bold">{formatCurrency(comp.price)}</td>
                      <td className="py-3 px-4 border-r-2 border-black">
                        {comp.vendor?.delivery_city || 'Lagos'} · {comp.delivery_available ? 'Logistics ready' : 'Pickup'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <a 
                          href={getWhatsAppLink(comp.vendor, comp)}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex py-1 px-3 bg-[#D4F263] border-2 border-black text-black rounded-lg shadow-[1px_1px_0_#000] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#000] transition-all text-[10px] font-black"
                        >
                          View Shop
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500 font-semibold bg-gray-50 border-2 border-black border-dashed rounded-xl select-none">
              No other matching stores are currently offering products in this category.
            </div>
          )}
        </div>

      </main>

      <MarketplaceFooter />
    </div>
  );
}
