import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Fulfilment() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Filter to PICKUP orders only
      const pickupOrders = (data.conversations || data || []).filter(c => {
        const addr = (c.delivery_address || '').toUpperCase();
        return addr === 'PICKUP' && ['Paid', 'In Transit', 'Delivered'].includes(c.status);
      });
      setOrders(pickupOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (conversationId, newStatus) => {
    try {
      await fetch(`${API_BASE}/api/conversations/${conversationId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(q) ||
      (o.invoice_reference || '').toLowerCase().includes(q)
    );
  });

  const readyOrders = filteredOrders.filter(o => o.status === 'Paid');
  const inProgressOrders = filteredOrders.filter(o => o.status === 'In Transit');
  const completedOrders = filteredOrders.filter(o => o.status === 'Delivered');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const OrderCard = ({ order, actions }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300">
            {(order.customer_name || '?')[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{order.customer_name || 'Unknown'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer_phone}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-gray-400">#{order.invoice_reference || '—'}</span>
      </div>

      {order.invoice_items && order.invoice_items.length > 0 && (
        <div className="mb-3 text-xs text-gray-600 dark:text-gray-300">
          {order.invoice_items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.quantity}× {item.description}</span>
              <span>₦{(item.total_price || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {order.agreed_price > 0 && (
        <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-3">
          ₦{order.agreed_price.toLocaleString()}
        </p>
      )}

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 mb-3 text-xs text-gray-600 dark:text-gray-300">
        <p className="font-medium">📍 Store Pickup</p>
        {user?.address && <p className="mt-1">{user.address}</p>}
        {user?.general_enquiry_phone && <p>📞 {user.general_enquiry_phone}</p>}
      </div>

      {actions}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fulfilment</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage pickup orders — customers coming to collect their products
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by customer name, phone, or invoice ref..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No pickup orders yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            When customers choose to pick up their orders, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ready for Pickup */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📦</span>
              <h2 className="font-bold text-gray-900 dark:text-white">Ready for Pickup</h2>
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {readyOrders.length}
              </span>
            </div>
            {readyOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <button
                    onClick={() => updateStatus(order.id, 'In Transit')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    📋 Mark In Progress
                  </button>
                }
              />
            ))}
            {readyOrders.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No orders ready</p>
            )}
          </div>

          {/* In Progress */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⏳</span>
              <h2 className="font-bold text-gray-900 dark:text-white">In Progress</h2>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {inProgressOrders.length}
              </span>
            </div>
            {inProgressOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <button
                    onClick={() => updateStatus(order.id, 'Delivered')}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    ✅ Mark as Picked Up
                  </button>
                }
              />
            ))}
            {inProgressOrders.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No orders in progress</p>
            )}
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✅</span>
              <h2 className="font-bold text-gray-900 dark:text-white">Completed</h2>
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {completedOrders.length}
              </span>
            </div>
            {completedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ Picked Up & Complete
                  </span>
                }
              />
            ))}
            {completedOrders.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No completed pickups</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Fulfilment;
