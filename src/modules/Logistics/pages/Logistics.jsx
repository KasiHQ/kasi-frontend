import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, MapPin, Phone, User } from 'lucide-react';
import { conversationAPI } from '../../../api/conversations';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

const Logistics = () => {
  const { user, fetchUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingRider, setSavingRider] = useState(false);
  const [riders, setRiders] = useState([]);
  const [newRider, setNewRider] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (user?.logistics_phone) {
      setRiders(user.logistics_phone.split(',').map(r => r.trim()).filter(Boolean));
    } else {
      setRiders([]);
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const res = await conversationAPI.getConversations();
      setConversations(res.data || []);
    } catch (err) {
      console.error('Failed to fetch logistics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveRidersList = async (list) => {
    setSavingRider(true);
    try {
      const listString = list.join(', ');
      await api.patch('/api/auth/profile', { logistics_phone: listString });
      await fetchUser();
    } catch (err) {
      console.error('Failed to save riders list:', err);
      alert('Failed to save rider settings');
    } finally {
      setSavingRider(false);
    }
  };

  const handleAddRider = async (e) => {
    e.preventDefault();
    if (!newRider.trim()) return;
    const updatedRiders = [...riders, newRider.trim()];
    setRiders(updatedRiders);
    setNewRider('');
    await saveRidersList(updatedRiders);
  };

  const handleDeleteRider = async (indexToDelete) => {
    const updatedRiders = riders.filter((_, index) => index !== indexToDelete);
    setRiders(updatedRiders);
    await saveRidersList(updatedRiders);
  };

  const handleStatusUpdate = async (conversationId, newStatus) => {
    try {
      await conversationAPI.updateStatus(conversationId, { status: newStatus });
      fetchConversations();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const readyToPack = conversations.filter(c => c.status === 'Paid');
  const inTransit = conversations.filter(c => c.status === 'In Transit');
  const delivered = conversations.filter(c => c.status === 'Delivered');

  const columns = [
    {
      title: 'Ready to Pack',
      icon: Package,
      items: readyToPack,
      count: readyToPack.length,
      color: 'amber',
      emptyText: 'No orders to pack',
      action: { label: '🚚 Dispatch & Notify', status: 'In Transit' },
    },
    {
      title: 'In Transit',
      icon: Truck,
      items: inTransit,
      count: inTransit.length,
      color: 'blue',
      emptyText: 'No orders in transit',
      action: { label: '✓ Mark Delivered', status: 'Delivered' },
    },
    {
      title: 'Delivered',
      icon: CheckCircle,
      items: delivered,
      count: delivered.length,
      color: 'green',
      emptyText: 'No delivered orders',
      action: null,
    },
  ];

  const avatarColors = [
    'bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500'
  ];

  const getAvatarColor = (name) => {
    if (!name) return avatarColors[0];
    return avatarColors[name.charCodeAt(0) % avatarColors.length];
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header & Rider Quick Config */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-1">Logistics</h1>
          <p className="text-gray-500 text-sm">Track paid orders from packing to customer delivery</p>
        </div>
        
        <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100 max-w-sm w-full gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary" />
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Manage Riders List</label>
            </div>
            {savingRider && <span className="text-[10px] text-primary animate-pulse font-semibold">Saving...</span>}
          </div>
          
          {/* Riders Badges List */}
          <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto pr-1">
            {riders.length === 0 ? (
              <span className="text-[10px] text-gray-400 italic">No riders added yet</span>
            ) : (
              riders.map((rider, index) => (
                <div key={index} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold text-dark shadow-sm">
                  <span>{rider}</span>
                  <button 
                    type="button"
                    onClick={() => handleDeleteRider(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-[10px] ml-0.5 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Rider Form */}
          <form onSubmit={handleAddRider} className="flex gap-2 mt-1">
            <input
              type="text"
              value={newRider}
              onChange={(e) => setNewRider(e.target.value)}
              placeholder="Add rider phone (e.g. 080...)"
              className="w-full px-2.5 py-1 rounded-lg bg-white border border-gray-200 focus:border-green-500 focus:ring-0 transition-all text-xs font-semibold"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-primary hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const Icon = col.icon;
          const colorMap = {
            amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
            green: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700', border: 'border-green-200' },
          };
          const cm = colorMap[col.color];

          return (
            <div key={col.title} className="flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={cm.text} />
                  <h3 className="font-bold text-dark text-sm">{col.title}</h3>
                </div>
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${cm.badge}`}>
                  {col.count}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 space-y-3 min-h-[200px]">
                {loading ? (
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ) : col.items.length === 0 ? (
                  <div className={`${cm.bg} rounded-xl p-6 text-center border ${cm.border}`}>
                    <p className="text-sm text-gray-400">{col.emptyText}</p>
                  </div>
                ) : (
                  col.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      {/* Customer + Price */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full ${getAvatarColor(item.customer_name)} text-white flex items-center justify-center font-bold text-xs`}>
                            {getInitials(item.customer_name)}
                          </div>
                          <div>
                            <p className="font-semibold text-dark text-sm">{item.customer_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[140px]">
                              {item.ai_summary?.slice(0, 30) || item.customer_phone || '—'}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-dark text-sm">—</p>
                      </div>

                      {/* Details */}
                      {item.customer_phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Phone size={12} />
                          <span>{item.customer_phone}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      {col.action && (
                        <button
                          onClick={() => handleStatusUpdate(item.id, col.action.status)}
                          className={`w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                            col.color === 'amber'
                              ? 'bg-primary hover:bg-green-700 shadow-sm shadow-green-200'
                              : 'bg-blue-500 hover:bg-blue-600 shadow-sm shadow-blue-200'
                          }`}
                        >
                          {col.action.label}
                        </button>
                      )}

                      {/* Delivered — Complete */}
                      {col.title === 'Delivered' && (
                        <div className="mt-2 text-center">
                          <span className="text-xs font-semibold text-green-600">✓ Complete</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Logistics;
