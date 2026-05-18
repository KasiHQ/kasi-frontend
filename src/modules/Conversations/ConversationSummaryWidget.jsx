import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, CreditCard, Truck, CheckCircle, AlertTriangle, VolumeX, ArrowRight } from 'lucide-react';
import { conversationAPI } from '../../api/conversations';

const ConversationSummaryWidget = () => {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState({});
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    'In Progress': {
      icon: MessageCircle,
      color: 'blue'
    },
    'Paid': {
      icon: CreditCard,
      color: 'green'
    },
    'In Transit': {
      icon: Truck,
      color: 'yellow'
    },
    'Delivered': {
      icon: CheckCircle,
      color: 'purple'
    },
    'Requires Attention': {
      icon: AlertTriangle,
      color: 'red'
    },
    'Muted': {
      icon: VolumeX,
      color: 'gray'
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const response = await conversationAPI.getPipeline();
      setPipeline(response.data);
    } catch (error) {
      console.error('Failed to fetch pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalConversations = Object.values(pipeline).reduce((sum, count) => sum + count, 0);
  const activeConversations = (pipeline['In Progress'] || 0) + (pipeline['Paid'] || 0) + (pipeline['In Transit'] || 0);
  const needsAttention = pipeline['Requires Attention'] || 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Conversations
          </h3>
          <button
            onClick={() => navigate('/conversations')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {totalConversations === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No conversations yet</p>
            <p className="text-sm text-gray-500">Conversations will appear here when customers message you</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalConversations}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeConversations}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${needsAttention > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {needsAttention}
                </div>
                <div className="text-sm text-gray-500">Need Attention</div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon;
                const count = pipeline[status] || 0;
                
                if (count === 0) return null;
                
                return (
                  <div
                    key={status}
                    onClick={() => navigate(`/conversations?status=${encodeURIComponent(status)}`)}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 text-${config.color}-500`} />
                      <span className="text-sm text-gray-700">{status}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Alert for Attention Required */}
            {needsAttention > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {needsAttention} conversation{needsAttention > 1 ? 's' : ''} need{needsAttention === 1 ? 's' : ''} your attention
                    </p>
                    <button
                      onClick={() => navigate('/conversations?status=Requires%20Attention')}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Review now →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationSummaryWidget;