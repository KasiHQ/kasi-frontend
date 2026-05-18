import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, CreditCard, Truck, CheckCircle, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { conversationAPI } from '../../api/conversations';

const ConversationPipeline = () => {
  const [pipeline, setPipeline] = useState({});
  const [conversations, setConversations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const statusConfig = {
    'In Progress': {
      icon: MessageCircle,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    },
    'Paid': {
      icon: CreditCard,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    },
    'In Transit': {
      icon: Truck,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800'
    },
    'Delivered': {
      icon: CheckCircle,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800'
    },
    'Requires Attention': {
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800'
    },
    'Muted': {
      icon: VolumeX,
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800'
    }
  };

  useEffect(() => {
    fetchPipeline();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      fetchConversations(selectedStatus);
    }
  }, [selectedStatus]);

  const fetchPipeline = async () => {
    try {
      const response = await conversationAPI.getPipeline();
      setPipeline(response.data);
    } catch (error) {
      console.error('Failed to fetch pipeline:', error);
    }
  };

  const fetchConversations = async (status = '') => {
    setLoading(true);
    try {
      const response = await conversationAPI.getConversations(status);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(selectedStatus === status ? '' : status);
    setSelectedConversations([]);
  };

  const handleConversationSelect = (conversationId) => {
    setSelectedConversations(prev => 
      prev.includes(conversationId)
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedConversations.length === 0) return;

    setBulkActionLoading(true);
    try {
      await conversationAPI.bulkUpdateStatus({
        conversation_ids: selectedConversations,
        status: newStatus
      });
      
      // Refresh data
      await fetchPipeline();
      await fetchConversations(selectedStatus);
      setSelectedConversations([]);
    } catch (error) {
      console.error('Failed to update conversations:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSingleStatusUpdate = async (conversationId, newStatus) => {
    try {
      await conversationAPI.updateStatus(conversationId, { status: newStatus });
      
      // Refresh data
      await fetchPipeline();
      await fetchConversations(selectedStatus);
    } catch (error) {
      console.error('Failed to update conversation:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Conversation Pipeline
        </h1>
        <p className="text-gray-600">
          Track and manage customer conversations through your sales pipeline
        </p>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = pipeline[status] || 0;
          const isSelected = selectedStatus === status;
          
          return (
            <div
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected 
                  ? `${config.bgColor} ${config.borderColor} shadow-md` 
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${
                  isSelected ? config.textColor : 'text-gray-500'
                }`} />
                <span className={`text-2xl font-bold ${
                  isSelected ? config.textColor : 'text-gray-900'
                }`}>
                  {count}
                </span>
              </div>
              <div className={`text-sm font-medium ${
                isSelected ? config.textColor : 'text-gray-700'
              }`}>
                {status}
              </div>
              {status === 'Requires Attention' && count > 0 && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Needs Review
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selectedConversations.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedConversations.length} conversation(s) selected
            </span>
            <div className="flex space-x-2">
              {Object.keys(statusConfig).map(status => (
                <button
                  key={status}
                  onClick={() => handleBulkStatusUpdate(status)}
                  disabled={bulkActionLoading}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${statusConfig[status].bgColor} ${statusConfig[status].textColor} hover:opacity-80 disabled:opacity-50`}
                >
                  Move to {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      {selectedStatus && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedStatus} Conversations ({conversations.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No conversations in {selectedStatus.toLowerCase()} status
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversations.includes(conversation.id)}
                  onSelect={() => handleConversationSelect(conversation.id)}
                  onStatusUpdate={handleSingleStatusUpdate}
                  statusConfig={statusConfig}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedStatus && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a status to view conversations
          </h3>
          <p className="text-gray-500">
            Click on any status card above to see the conversations in that stage
          </p>
        </div>
      )}
    </div>
  );
};

const ConversationCard = ({ conversation, isSelected, onSelect, onStatusUpdate, statusConfig }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    await onStatusUpdate(conversation.id, newStatus);
    setUpdating(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'whatsapp':
        return '📱';
      case 'instagram':
        return '📷';
      case 'telegram':
        return '✈️';
      default:
        return '💬';
    }
  };

  return (
    <div className={`p-4 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">{getPlatformIcon(conversation.platform)}</span>
              <h3 className="text-sm font-medium text-gray-900">
                {conversation.customer_name || conversation.customer_phone || 'Unknown Customer'}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                statusConfig[conversation.status]?.bgColor
              } ${statusConfig[conversation.status]?.textColor}`}>
                {conversation.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p>Platform: {conversation.platform}</p>
              <p>Last activity: {formatDate(conversation.last_message_at)}</p>
              {conversation.customer_phone && (
                <p>Phone: {conversation.customer_phone}</p>
              )}
            </div>

            {conversation.ai_summary && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <strong>AI Summary:</strong> {conversation.ai_summary}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          
          <div className="relative">
            <select
              value={conversation.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(statusConfig).map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {updating && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pl-7 border-l-2 border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Conversation ID:</strong> {conversation.id}
            </div>
            <div>
              <strong>Customer ID:</strong> {conversation.customer_id || 'Not linked'}
            </div>
            <div>
              <strong>Created:</strong> {formatDate(conversation.created_at)}
            </div>
            <div>
              <strong>Updated:</strong> {formatDate(conversation.updated_at)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPipeline;