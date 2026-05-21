import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Pencil, Trash2, X, Upload, ImageIcon, Star, Image as ImageIcon2, Grid, List, Search, Info, Coins, Truck } from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ProductGridSkeleton } from '../../../components/ui/Skeleton';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import useNetwork from '../../../hooks/useNetwork';

const MAX_IMAGES = 5;

const Products = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter/search/view states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('All'); // All | In Stock | Out of Stock | Hidden
  const [viewMode, setViewMode] = useState('Grid'); // Grid | List
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Image gallery states
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]); // Currently uploaded images for the editing product
  const [uploadingImages, setUploadingImages] = useState(false); // Are we currently uploading to Cloudinary?
  const [activeFormTab, setActiveFormTab] = useState('basic'); // 'basic' | 'pricing' | 'inventory'
  
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    happy_price: '',
    min_price: '',
    cost_price: '',
    in_stock: true,
    stock_quantity: '',
    variants: '',
    weight: '',
    dimensions: '',
    expiry_date: '',
    voice_pitch: '',
    instagram_links: '',
    external_knowledge: '',
    bulk_discount_quantity: '',
    bulk_discount_percentage: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (!isOnline) {
          setLoading(false);
          return;
      }
      const res = await api.get(`/api/products/?t=${Date.now()}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch products error:', err);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ 
      name: '', brand: '', category: '', description: '', price: '', happy_price: '', min_price: '', cost_price: '', in_stock: true, stock_quantity: '',
      variants: '', weight: '', dimensions: '', expiry_date: '', voice_pitch: '', instagram_links: '', external_knowledge: '', bulk_discount_quantity: '', bulk_discount_percentage: ''
    });
    setEditing(null);
    setImages([]);
    setActiveFormTab('basic');
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let productId = editing;
      
      const payload = {
        ...form,
        variants: form.variants ? form.variants.split(',').map(v => v.trim()).filter(Boolean) : [],
        instagram_links: form.instagram_links ? form.instagram_links.split(',').map(v => v.trim()).filter(Boolean) : [],
      };
      
      if (editing) {
        await api.patch(`/api/products/${editing}`, payload);
        addToast('Product updated!', 'success');
      } else {
        const res = await api.post('/api/products/', payload);
        productId = res.data.id;
        addToast('Product added!', 'success');
      }
      
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Submit error:', err);
      addToast('Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || '',
      happy_price: product.happy_price || '',
      min_price: product.min_price || '',
      cost_price: product.cost_price || '',
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
      stock_quantity: product.stock_quantity || '',
      variants: Array.isArray(product.variants) ? product.variants.join(', ') : (product.variants || ''),
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      expiry_date: product.expiry_date ? product.expiry_date.split('T')[0] : '',
      voice_pitch: product.voice_pitch || '',
      instagram_links: Array.isArray(product.instagram_links) ? product.instagram_links.join(', ') : (product.instagram_links || ''),
      external_knowledge: product.external_knowledge || '',
      bulk_discount_quantity: product.bulk_discount_quantity || '',
      bulk_discount_percentage: product.bulk_discount_percentage || '',
    });
    setEditing(product.id);
    setImages(product.images || []);
    setActiveFormTab('basic');
    setShowModal(true);
  };

  const handleDeleteClick = (product) => {
    setDeletingId(product.id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/products/${deletingId}`);
      addToast('Product deleted', 'success');
      fetchProducts();
    } catch {
      addToast('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // --- Image Gallery Handlers ---

  const handleFileSelect = async (e) => {
    if (!editing) {
      addToast('Save the product first before adding images.', 'info');
      return;
    }
    
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    if (images.length + files.length > MAX_IMAGES) {
      addToast(`Maximum ${MAX_IMAGES} images allowed.`, 'error');
      return;
    }
    
    setUploadingImages(true);
    
    // Upload files sequentially to avoid rate limits
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await api.post(`/api/products/${editing}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        // Append newly uploaded image to gallery instantly
        setImages(prev => [...prev, res.data.image]);
      } catch (err) {
        console.error('Image upload failed', err);
        addToast(`Failed to upload ${file.name}`, 'error');
      }
    }
    
    setUploadingImages(false);
    fetchProducts(); // Refresh list in background to update card previews
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/api/products/${editing}/images/${imageId}`);
      setImages(prev => prev.filter(img => img.id !== imageId));
      fetchProducts(); // Refresh list to update primary image if needed
    } catch (err) {
      console.error('Delete image failed', err);
      addToast('Failed to delete image', 'error');
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await api.patch(`/api/products/${editing}/images/${imageId}/primary`);
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
      fetchProducts();
    } catch (err) {
      console.error('Set primary failed', err);
      addToast('Failed to set primary image', 'error');
    }
  };

  // Drag and Drop support
  const handleDrop = (e) => {
    e.preventDefault();
    if (!editing) {
      addToast('Save the product first before dropping images.', 'info');
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event to reuse handleFileSelect
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesTab = true;
    if (filterTab === 'In Stock') {
      matchesTab = product.in_stock && (product.stock_quantity === null || product.stock_quantity > 0);
    } else if (filterTab === 'Out of Stock') {
      matchesTab = !product.in_stock || (product.stock_quantity !== null && product.stock_quantity <= 0);
    } else if (filterTab === 'Hidden') {
      matchesTab = !product.in_stock;
    }
    
    return matchesSearch && matchesTab;
  });

  return (
    <div>
      {!isOnline && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center shadow-sm border border-yellow-200 mb-6">
          Products list is unavailable in Offline Mode.
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your product catalog — the AI assistant uses this to answer customer queries
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-dark mb-2">No products yet</h3>
          <p className="text-gray-500 text-sm mb-4">
            Add your products so the AI can answer pricing and availability questions.
          </p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group"
            >
              {/* Image area */}
              <div 
                className="relative h-48 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => handleEdit(product)}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
                
                {/* Image Count Badge */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                    <ImageIcon2 size={12} />
                    {product.images.length}
                  </div>
                )}
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm text-dark text-xs font-medium px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <Pencil size={12} />
                    Edit Details
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-dark text-base leading-tight">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 ml-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        product.in_stock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.in_stock ? 'Visible' : 'Hidden'}
                    </span>
                    {product.stock_quantity !== null && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                          product.stock_quantity <= 0
                            ? 'bg-red-100 text-red-600'
                            : product.stock_quantity <= 5
                            ? 'bg-orange-100 text-orange-700 animate-pulse'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {product.stock_quantity <= 0 
                          ? 'Out of Stock' 
                          : product.stock_quantity <= 5 
                          ? `Low Stock: ${product.stock_quantity}` 
                          : `${product.stock_quantity} in stock`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-3">
                  <span className="text-lg font-bold text-primary">₦{Number(product.price).toLocaleString()}</span>
                  {product.min_price && (
                    <span className="text-xs text-gray-400 line-through">₦{Number(product.min_price).toLocaleString()}</span>
                  )}
                </div>
                {product.bulk_discount_quantity && product.bulk_discount_percentage && (
                  <div className="mt-2 inline-flex items-center self-start bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                    Buy {product.bulk_discount_quantity}+ get {product.bulk_discount_percentage}% off
                  </div>
                )}

                <div className="flex items-center gap-2 border-t border-gray-100 mt-4 pt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col transition-all duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <Package size={22} className="text-primary" />
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Form Details (7cols on desktop) */}
                <div className="md:col-span-7 flex flex-col">
                  {/* Premium Tab Bar Selector */}
                  <div className="flex border-b border-gray-100 pb-2 mb-5 gap-5 shrink-0 select-none">
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('basic')}
                      className={`pb-2 text-sm font-semibold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                        activeFormTab === 'basic'
                          ? 'text-primary border-b-2 border-primary font-bold'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Info size={15} />
                      Basic Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('pricing')}
                      className={`pb-2 text-sm font-semibold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                        activeFormTab === 'pricing'
                          ? 'text-primary border-b-2 border-primary font-bold'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Coins size={15} />
                      Pricing
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('inventory')}
                      className={`pb-2 text-sm font-semibold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                        activeFormTab === 'inventory'
                          ? 'text-primary border-b-2 border-primary font-bold'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Truck size={15} />
                      Inventory
                    </button>
                  </div>

                  <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                    {/* Tab 1: Basic Info */}
                    {activeFormTab === 'basic' && (
                      <div className="space-y-4 transition-all duration-200">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                          <input 
                            type="text" 
                            value={form.name} 
                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            placeholder="e.g. HP Pavilion 15" 
                            required 
                            className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Brand</label>
                            <input 
                              type="text" 
                              value={form.brand} 
                              onChange={(e) => setForm({ ...form, brand: e.target.value })} 
                              placeholder="e.g. HP" 
                              className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                            <input 
                              type="text" 
                              value={form.category} 
                              onChange={(e) => setForm({ ...form, category: e.target.value })} 
                              placeholder="e.g. Budget/Student" 
                              className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                          <textarea 
                            value={form.description} 
                            onChange={(e) => setForm({ ...form, description: e.target.value })} 
                            placeholder="Provide a captivating description for your buyers..." 
                            rows={3} 
                            className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none resize-none transition-all" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Instagram Links (comma separated)</label>
                          <input 
                            type="text" 
                            value={form.instagram_links} 
                            onChange={(e) => setForm({ ...form, instagram_links: e.target.value })} 
                            placeholder="e.g. https://instagram.com/p/..." 
                            className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Smart Pricing */}
                    {activeFormTab === 'pricing' && (
                      <div className="space-y-4 transition-all duration-200">
                        {/* 3-tier pricing */}
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Starting (₦) *</label>
                            <input 
                              type="number" 
                              value={form.price} 
                              onChange={(e) => setForm({ ...form, price: e.target.value })} 
                              placeholder="850000" 
                              required 
                              min="0" 
                              className="w-full px-3 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm font-semibold outline-none transition-all" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Happy (₦)</label>
                            <input 
                              type="number" 
                              value={form.happy_price} 
                              onChange={(e) => setForm({ ...form, happy_price: e.target.value })} 
                              placeholder="14500" 
                              min="0" 
                              className="w-full px-3 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm font-semibold outline-none transition-all" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Last (₦)</label>
                            <input 
                              type="number" 
                              value={form.min_price} 
                              onChange={(e) => setForm({ ...form, min_price: e.target.value })} 
                              placeholder="800000" 
                              min="0" 
                              className="w-full px-3 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm font-semibold outline-none transition-all" 
                            />
                          </div>
                        </div>

                        {/* Guideline helper card */}
                        <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3 text-[11px] text-gray-500 leading-normal select-none">
                          <span className="font-semibold text-dark block mb-0.5">ℹ️ Kasi AI Negotiation Rules:</span>
                          <span className="block font-medium">· <strong className="text-gray-700">Starting Price</strong>: Open quote first offered to buyers.</span>
                          <span className="block font-medium">· <strong className="text-gray-700">Happy Price</strong>: Target price AI handles to maximize deal value.</span>
                          <span className="block font-medium">· <strong className="text-gray-700">Last Price</strong>: Absolute floor limit AI is barred from bypassing.</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cost Price (₦)</label>
                          <input 
                            type="number" 
                            value={form.cost_price} 
                            onChange={(e) => setForm({ ...form, cost_price: e.target.value })} 
                            placeholder="680000" 
                            min="0" 
                            className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                          />
                        </div>

                        {/* Bulk wholesale group */}
                        <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 space-y-3">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">⚡ Wholesale Bulk Discounts</span>
                          <div className="grid grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[11px] font-semibold text-emerald-800/80 mb-1">Bulk Buy Quantity</label>
                              <input 
                                type="number" 
                                value={form.bulk_discount_quantity} 
                                onChange={(e) => setForm({ ...form, bulk_discount_quantity: e.target.value })} 
                                placeholder="e.g. 5" 
                                min="2" 
                                className="w-full px-3 py-2 border border-emerald-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-emerald-800/80 mb-1">Discount %</label>
                              <input 
                                type="number" 
                                value={form.bulk_discount_percentage} 
                                onChange={(e) => setForm({ ...form, bulk_discount_percentage: e.target.value })} 
                                placeholder="e.g. 15" 
                                min="1" 
                                max="99" 
                                className="w-full px-3 py-2 border border-emerald-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Inventory & Shipping */}
                    {activeFormTab === 'inventory' && (
                      <div className="space-y-4 transition-all duration-200">
                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                            <input 
                              type="number" 
                              value={form.stock_quantity} 
                              onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} 
                              placeholder="e.g. 50" 
                              min="0" 
                              className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="w-full flex items-center justify-center gap-2.5 p-2.5 border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-all h-[44px] select-none">
                              <input
                                type="checkbox"
                                checked={form.in_stock}
                                onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                                className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer"
                              />
                              <span className="text-sm font-semibold text-gray-700">Set as In Stock</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Variants (comma separated)</label>
                          <input 
                            type="text" 
                            value={form.variants} 
                            onChange={(e) => setForm({ ...form, variants: e.target.value })} 
                            placeholder="e.g. Red, Blue, XL" 
                            className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Weight</label>
                            <input 
                              type="text" 
                              value={form.weight} 
                              onChange={(e) => setForm({ ...form, weight: e.target.value })} 
                              placeholder="e.g. 500g" 
                              className="w-full px-2.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Dimensions</label>
                            <input 
                              type="text" 
                              value={form.dimensions} 
                              onChange={(e) => setForm({ ...form, dimensions: e.target.value })} 
                              placeholder="e.g. 10x10x5 cm" 
                              className="w-full px-2.5 py-2.5 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm outline-none transition-all" 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Expiry Date</label>
                            <input 
                              type="date" 
                              value={form.expiry_date} 
                              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} 
                              className="w-full px-2 py-2 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-xs outline-none transition-all h-[44px]" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Right Column: Image Gallery (5cols on desktop) */}
                <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
                    <ImageIcon2 size={16} className="text-primary" />
                    Product Images
                  </h3>
                  
                  {!editing ? (
                    <div className="h-[250px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                        <Upload className="text-gray-400" size={24} />
                      </div>
                      <p className="text-sm font-medium text-dark mb-1">Save product to add images</p>
                      <p className="text-xs text-gray-500 max-w-[200px]">You can upload multiple high-res photos once the basic details are saved.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Image Drop Zone */}
                      {images.length < MAX_IMAGES && (
                        <div 
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${uploadingImages ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 cursor-pointer'}`}
                          onClick={() => !uploadingImages && fileInputRef.current?.click()}
                        >
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            disabled={uploadingImages}
                          />
                          
                          {uploadingImages ? (
                            <div className="flex flex-col items-center py-4">
                              <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin mb-3"></div>
                              <p className="text-sm font-medium text-dark">Uploading images...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="text-gray-400 mb-2" size={24} />
                              <p className="text-sm font-medium text-dark">Click or drag images here</p>
                              <p className="text-xs text-gray-500 mt-1">Up to {MAX_IMAGES - images.length} more images (Max {MAX_IMAGES})</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Image Gallery Thumbnails */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {images.map((img) => (
                            <div key={img.id} className={`group relative aspect-square rounded-xl overflow-hidden border-2 ${img.is_primary ? 'border-primary shadow-sm' : 'border-transparent bg-gray-100'}`}>
                              <img src={img.image_url} alt="Product" className="w-full h-full object-cover animate-fadeIn" />
                              
                              {/* Primary Badge */}
                              {img.is_primary && (
                                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                  <Star size={10} className="fill-white" /> Cover
                                </div>
                              )}

                              {/* Hover Controls */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                                {!img.is_primary && (
                                  <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(img.id); }}
                                    className="bg-white/90 hover:bg-white text-dark text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Star size={12} /> Set Cover
                                  </button>
                                )}
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                                  className="bg-red-500/90 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                form="productForm"
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-primary/20"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editing ? 'Save Changes' : 'Create Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Product?"
        message="Are you sure you want to remove this product from your catalog? This will also affect the AI assistant's ability to answer questions about it."
      />
    </div>
  );
};

export default Products;
