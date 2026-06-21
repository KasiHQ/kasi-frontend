import React, { useState, useEffect } from 'react';
import { X, Loader2, Package, Users, FileText, Ban, ShieldAlert, CheckCircle, LogIn, Trash2, AlertTriangle } from 'lucide-react';
import api from '../../../api/axios';

const AdminUserDetailModal = ({ isOpen, onClose, userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(0); // 0 = none, 1 = step 1, 2 = step 2
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Manual Subscription state variables
  const [isEditingSub, setIsEditingSub] = useState(false);
  const [subForm, setSubForm] = useState({ tier: 'free_trial', type: 'product', status: 'trialing', days: 30 });
  const [subFormLoading, setSubFormLoading] = useState(false);
  const [subFormError, setSubFormError] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) {
      setConfirmDelete(0);
      setIsEditingSub(false);
      return;
    }

    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/kasisalienceadministration/users/${userId}`);
        if (isMounted) {
          if (response.data?.status === 'success') {
            setData(response.data.data);
          } else {
            setError("Failed to fetch user details.");
          }
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || "An error occurred");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetail();
    
    return () => { isMounted = false; };
  }, [isOpen, userId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const res = await api.post(`/api/kasisalienceadministration/users/${userId}/status`, { account_status: newStatus });
      if (res.data.status === 'success') {
         setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${newStatus} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      setError(null);
      const res = await api.delete(`/api/kasisalienceadministration/users/${userId}`);
      if (res.data.status === 'success') {
        setConfirmDelete(0);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      setConfirmDelete(0);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImpersonate = async () => {
      try {
          const res = await api.post(`/api/kasisalienceadministration/users/${userId}/impersonate`);
          if (res.data.status === 'success') {
              // Server has set the impersonated user's cookies — hard-reload to pick up new session
              window.location.href = '/'; 
          }
      } catch (err) {
          setError(err.response?.data?.message || "Failed to impersonate user.");
      }
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubFormLoading(true);
      setSubFormError(null);
      const res = await api.post(`/api/kasisalienceadministration/users/${userId}/manual-subscription`, {
        tier: subForm.tier,
        type: subForm.type,
        status: subForm.status,
        days: subForm.days
      });
      if (res.data.status === 'success') {
        setIsEditingSub(false);
        // Direct state update so we see changes immediately without full modal refetch
        setData(prev => ({
          ...prev,
          subscription_tier: subForm.tier,
          subscription_type: subForm.type,
          subscription_status: subForm.status,
          subscription_expires_at: new Date(Date.now() + subForm.days * 24 * 60 * 60 * 1000).toISOString()
        }));
      }
    } catch (err) {
      setSubFormError(err.response?.data?.message || "Failed to update subscription");
    } finally {
      setSubFormLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto transform transition-transform duration-300 translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Intelligence</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-4" />
              <p className="text-gray-500">Compiling user records...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>
          ) : data ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Profile Card */}
              <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-800 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {data.business_name}
                    {data.account_status === 'suspended' && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase">Suspended</span>}
                    {data.account_status === 'banned' && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase">Banned</span>}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{data.email}</p>
                  <div className="mt-4 flex gap-4 text-sm font-medium flex-wrap">
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">ID: #{data.id}</span>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">Joined: {new Date(data.created_at).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full shadow-sm border font-bold ${data.kasi_credits < 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        Credits: {data.kasi_credits}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {data.account_status !== 'active' ? (
                    <button onClick={() => handleStatusChange('active')} className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-bold transition-colors">
                      <CheckCircle size={16} /> Activate
                    </button>
                  ) : null}
                  {data.account_status !== 'suspended' ? (
                    <button onClick={() => handleStatusChange('suspended')} className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-bold transition-colors">
                      <ShieldAlert size={16} /> Suspend
                    </button>
                  ) : null}
                  {data.account_status !== 'banned' ? (
                    <button onClick={() => handleStatusChange('banned')} className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition-colors">
                      <Ban size={16} /> Ban User
                    </button>
                  ) : null}
                  <button onClick={handleImpersonate} className="flex items-center justify-center gap-2 w-full mt-2 py-2 px-3 bg-gray-900 hover:bg-black text-white dark:bg-gray-100 dark:text-gray-900 rounded-lg text-sm font-bold transition-colors">
                    <LogIn size={16} /> Login As User
                  </button>
                  <button onClick={() => setConfirmDelete(1)} className="flex items-center justify-center gap-2 w-full mt-4 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">
                    <Trash2 size={16} /> Delete User
                  </button>
                </div>
              </div>

              {/* Subscription Management Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                  <h4 className="font-bold text-gray-905 dark:text-white flex items-center gap-2">
                    <Package className="text-green-600 animate-pulse" size={18} />
                    Subscription Plan Details
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    data.subscription_status === 'active' 
                      ? 'bg-green-150 text-green-750 dark:bg-green-950/30 dark:text-green-400' 
                      : data.subscription_status === 'trialing'
                      ? 'bg-blue-150 text-blue-750 dark:bg-blue-950/30 dark:text-blue-400'
                      : 'bg-red-150 text-red-750 dark:bg-red-950/30 dark:text-red-400'
                  }`}>
                    {data.subscription_status ? data.subscription_status.toUpperCase() : 'INACTIVE'}
                  </span>
                </div>

                {!isEditingSub ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs">Plan Tier</p>
                      <p className="font-semibold text-gray-850 dark:text-gray-200 capitalize">
                        {data.subscription_tier ? data.subscription_tier.replace('_', ' ') : 'Free Trial'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs">Plan Type</p>
                      <p className="font-semibold text-gray-850 dark:text-gray-200 capitalize">
                        {data.subscription_type || 'Product'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs">Expires At</p>
                      <p className="font-semibold text-gray-850 dark:text-gray-200">
                        {data.subscription_expires_at 
                          ? new Date(data.subscription_expires_at).toLocaleString() 
                          : 'Never'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs">Status</p>
                      <p className="font-semibold text-gray-850 dark:text-gray-200 capitalize">
                        {data.subscription_status || 'Trialing'}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setSubForm({
                          tier: data.subscription_tier || 'free_trial',
                          type: data.subscription_type || 'product',
                          status: data.subscription_status || 'trialing',
                          days: 30
                        });
                        setIsEditingSub(true);
                      }}
                      className="col-span-1 sm:col-span-2 mt-2 py-2 w-full text-center border border-green-600 hover:bg-green-700 hover:text-white dark:hover:bg-green-950/20 text-green-600 rounded-xl font-bold transition-all text-xs"
                    >
                      Modify Plan Override
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Tier</label>
                        <select 
                          value={subForm.tier} 
                          onChange={(e) => setSubForm({ ...subForm, tier: e.target.value })}
                          className="w-full p-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-750 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="free_trial">Free Trial</option>
                          <option value="starter">Starter Plan</option>
                          <option value="growth">Growth Plan</option>
                          <option value="premium">Premium Plan</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 mb-1">Type</label>
                        <select 
                          value={subForm.type} 
                          onChange={(e) => setSubForm({ ...subForm, type: e.target.value })}
                          className="w-full p-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-750 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Status</label>
                        <select 
                          value={subForm.status} 
                          onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
                          className="w-full p-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-750 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="active">Active</option>
                          <option value="trialing">Trialing</option>
                          <option value="past_due">Past Due</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Duration (Days)</label>
                        <input 
                          type="number" 
                          value={subForm.days} 
                          onChange={(e) => setSubForm({ ...subForm, days: parseInt(e.target.value) || 30 })}
                          className="w-full p-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-750 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                          min="1"
                        />
                      </div>
                    </div>

                    {subFormError && <p className="text-red-500 text-xs">{subFormError}</p>}

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsEditingSub(false)}
                        className="flex-1 py-2.5 text-center bg-gray-100 hover:bg-gray-200 text-gray-750 dark:bg-gray-800 dark:hover:bg-gray-750 dark:text-gray-300 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={subFormLoading}
                        className="flex-1 py-2.5 text-center bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex justify-center items-center gap-1 disabled:opacity-50"
                      >
                        {subFormLoading && <Loader2 size={12} className="animate-spin" />}
                        Apply Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Clients List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <Users size={18} className="text-green-600" />
                    Clients ({data.clients?.length || 0})
                  </div>
                  {data.clients?.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {data.clients.map(c => (
                        <div key={c.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No clients compiled.</p>
                  )}
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <Package size={18} className="text-green-600" />
                    Products ({data.products?.length || 0})
                  </div>
                  {data.products?.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {data.products.map(p => (
                        <div key={p.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex justify-between items-center">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate mr-4">{p.name}</p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">₦{p.price}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No products configured.</p>
                  )}
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <FileText size={18} className="text-green-600" />
                  Associated Invoices ({data.invoices?.length || 0})
                </div>
                {data.invoices?.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {data.invoices.map(inv => (
                      <div key={inv.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-green-200 transition-colors flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{inv.reference}</p>
                          <p className="text-xs text-gray-500 mt-1">{inv.customer?.name} &bull; {inv.date_issued}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-gray-900 dark:text-white text-sm">₦{inv.total_amount?.toLocaleString()}</p>
                           <p className={`text-[10px] uppercase font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{inv.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No invoices generated.</p>
                )}
              </div>

            </div>
          ) : null}
        </div>
      </div>

      {/* Double Confirmation Modal for Delete */}
      {confirmDelete > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(0)} />
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
              <h3 className="text-lg font-bold">
                {confirmDelete === 1 ? 'Step 1: Soft Delete Vendor?' : 'Step 2: Irreversible Social Cleanup'}
              </h3>
            </div>
            
            {confirmDelete === 1 ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  You are about to soft delete this vendor account (<span className="font-bold text-gray-900 dark:text-white">{data?.business_name}</span>).
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                  <strong>What stays:</strong> Financial/revenue history (for accounting) and conversation transcript logs (for AI training) are retained for 90 days.
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setConfirmDelete(0)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(2)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Continue to Step 2
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  <strong>CRITICAL WARNING:</strong> Proceeding will immediately and permanently destroy:
                </p>
                <ul className="list-disc pl-5 text-xs text-red-600 dark:text-red-400 space-y-1">
                  <li>WhatsApp Evolution API instances</li>
                  <li>Telegram Bot webhooks and associations</li>
                  <li>Facebook/Instagram Meta connection tokens</li>
                </ul>
                <p className="text-gray-500 text-xs italic">
                  This action is irreversible. All linked integrations are destroyed.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setConfirmDelete(0)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteUser}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Confirm Irreversible Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserDetailModal;
