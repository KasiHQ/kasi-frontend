import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { conversationAPI } from '../../../api/conversations';

const statusColors = {
  'Requires Attention': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Needs Attention' },
  'Paid': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'In Transit': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Delivered': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Muted': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const platformBadge = (platform) => {
  if (platform === 'whatsapp') return { label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-50', icon: '📱' };
  if (platform === 'instagram') return { label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50', icon: '📷' };
  if (platform === 'telegram') return { label: 'Telegram', color: 'text-blue-500', bg: 'bg-blue-50', icon: '✈️' };
  return { label: platform, color: 'text-gray-600', bg: 'bg-gray-50', icon: '💬' };
};

const timeAgo = (dateString) => {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

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

const Chats = () => {
  const [conversations, setConversations] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [detailedSummary, setDetailedSummary] = useState('');
  const [instructions, setInstructions] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [savingInstructions, setSavingInstructions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [convRes, pipeRes] = await Promise.all([
        conversationAPI.getConversations(),
        conversationAPI.getPipeline()
      ]);
      setConversations(convRes.data || []);
      setPipeline(pipeRes.data || {});
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pipeline counts — exclude "In Progress" from visible filters
  const attentionCount = pipeline['Requires Attention'] || 0;
  const paidCount = pipeline['Paid'] || 0;
  const transitCount = pipeline['In Transit'] || 0;
  const deliveredCount = pipeline['Delivered'] || 0;
  const totalCount = Object.values(pipeline).reduce((s, c) => s + c, 0);

  const filters = [
    { label: 'All', count: totalCount - (pipeline['In Progress'] || 0) },
    { label: 'In Progress', count: pipeline['In Progress'] || 0 },
    { label: 'Requires Attention', short: 'Attention', count: attentionCount },
    { label: 'Paid', count: paidCount },
    { label: 'In Transit', count: transitCount },
    { label: 'Delivered', count: deliveredCount },
  ];

  const filteredConversations = conversations.filter(c => {
    const matchesFilter = activeFilter === 'All' 
      ? c.status !== 'In Progress' 
      : c.status === activeFilter;
    const matchesSearch = !searchTerm ||
      (c.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.customer_phone || '').includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (conversationId, newStatus) => {
    try {
      await conversationAPI.updateStatus(conversationId, { status: newStatus });
      fetchData();
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedConversation) return;
    setGeneratingSummary(true);
    setSummaryModalOpen(true);
    try {
      const res = await conversationAPI.generateSummary(selectedConversation.id);
      setDetailedSummary(res.data.detailed_summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      setDetailedSummary('Failed to generate summary. Please try again.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSaveInstructions = async () => {
    if (!selectedConversation) return;
    setSavingInstructions(true);
    try {
      await conversationAPI.setInstructions(selectedConversation.id, instructions);
      setInstructionModalOpen(false);
      fetchData();
      // Update local state if needed
      setSelectedConversation(prev => ({ ...prev, vendor_instructions: instructions }));
    } catch (err) {
      console.error('Failed to save instructions:', err);
    } finally {
      setSavingInstructions(false);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      setInstructions(selectedConversation.vendor_instructions || '');
      setDetailedSummary(selectedConversation.detailed_summary || '');
    }
  }, [selectedConversation]);

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-dark">Chats</h1>
      </div>

      <div className="flex gap-0 h-[calc(100vh-180px)] min-h-[500px]">
        {/* Left Panel — Conversation List */}
        <div className="w-full md:w-[380px] lg:w-[400px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search customers or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-gray-200 focus:ring-0 transition-all"
              />
            </div>
          </div>

          {/* Filter Tabs — No "In Progress" */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-50">
            {filters.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === f.label
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.short || f.label} {f.count > 0 && `(${f.count})`}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-dark mb-1">No conversations</p>
                <p className="text-xs text-gray-400">Conversations will appear here when customers message you</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const sc = statusColors[conv.status] || statusColors['In Progress'];
                const pb = platformBadge(conv.platform);
                const isSelected = selectedConversation?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`px-4 py-3.5 cursor-pointer transition-all border-l-3 ${
                      isSelected
                        ? 'bg-primary/5 border-l-primary'
                        : 'hover:bg-gray-50 border-l-transparent'
                    }`}
                    style={{ borderLeftWidth: '3px' }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(conv.customer_name)} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                        {getInitials(conv.customer_name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-dark text-sm truncate">
                            {conv.customer_name || conv.customer_phone || 'Unknown Customer'}
                          </p>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                            {timeAgo(conv.last_message_at)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.ai_summary || conv.customer_phone || 'No messages yet'}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label || conv.status}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${pb.bg} ${pb.color}`}>
                            {pb.icon} {pb.label}
                          </span>
                        </div>

                        {/* Attention warning */}
                        {conv.status === 'Requires Attention' && conv.ai_summary && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-[11px] text-amber-700 line-clamp-2">
                              ⚠️ {conv.ai_summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel — Conversation Detail */}
        <div className="hidden md:flex flex-1 ml-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex-col overflow-hidden">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm">Select a conversation to view details</p>
              </div>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${getAvatarColor(selectedConversation.customer_name)} text-white flex items-center justify-center font-bold text-sm`}>
                      {getInitials(selectedConversation.customer_name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-lg">
                        {selectedConversation.customer_name || 'Unknown Customer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.customer_phone || ''}
                        {selectedConversation.ai_summary ? ` · ${selectedConversation.ai_summary.slice(0, 40)}...` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const sc = statusColors[selectedConversation.status] || statusColors['In Progress'];
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label || selectedConversation.status}
                        </span>
                      );
                    })()}
                    {(() => {
                      const pb = platformBadge(selectedConversation.platform);
                      return (
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${pb.bg} ${pb.color}`}>
                          {pb.icon} {pb.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-5">
                {/* Pricing Info */}
                {selectedConversation.status !== 'Muted' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Listed Price</p>
                      <p className="text-xl font-bold text-dark">
                        {selectedConversation.listed_price > 0 ? `₦${selectedConversation.listed_price.toLocaleString()}` : 'Negotiating...'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Agreed Price</p>
                      <p className="text-xl font-bold text-dark">
                        {selectedConversation.agreed_price > 0 ? `₦${selectedConversation.agreed_price.toLocaleString()}` : 'Negotiating...'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Vendor Instructions Display */}
                {selectedConversation.vendor_instructions && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-primary">Active AI Instructions</p>
                        <p className="text-xs text-gray-600 mt-1 italic">
                          "{selectedConversation.vendor_instructions}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attention Alert */}
                {selectedConversation.status === 'Requires Attention' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800">Kasi needs your help</p>
                          <p className="text-xs text-amber-700 mt-1">
                            {selectedConversation.ai_summary || 'This conversation requires manual review.'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setInstructions('');
                          setInstructionModalOpen(true);
                        }}
                        className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                      >
                        Give AI Instruction
                      </button>
                    </div>
                  </div>
                )}

                {/* Conversation Log */}
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Kasi's Conversation Log</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedConversation.ai_summary || 'No conversation log available yet.'}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(statusColors).filter(s => s !== selectedConversation.status && s !== 'In Progress').map(status => {
                      const sc = statusColors[status];
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedConversation.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sc.bg} ${sc.text} hover:opacity-80`}
                        >
                          {sc.label || status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-100 flex gap-3">
                 <button 
                  onClick={handleGenerateSummary}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Sparkles size={15} />
                  AI Summary
                </button>
                <button
                  onClick={() => setInstructionModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-dark border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare size={15} />
                  Instruct Kasi
                </button>
                <button
                  onClick={() => selectedConversation && handleStatusUpdate(selectedConversation.id, 'Delivered')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors ml-auto"
                >
                  <AlertTriangle size={15} />
                  Resolve
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Modal */}
      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                <h3 className="text-xl font-bold text-dark">Detailed AI Summary</h3>
              </div>
              <button onClick={() => setSummaryModalOpen(false)} className="text-gray-400 hover:text-dark">
                <Search size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {generatingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Analyzing conversation history...</p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {detailedSummary || 'No detailed summary available.'}
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-dark hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instruction Modal */}
      {instructionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-primary" size={20} />
                <h3 className="text-xl font-bold text-dark">Instruct Kasi</h3>
              </div>
              <button onClick={() => setInstructionModalOpen(false)} className="text-gray-400 hover:text-dark">
                <Search size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Tell Kasi exactly what to do next. These instructions will prioritize over its standard sales logic.
              </p>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., 'Tell the customer we can give them a 10% discount if they buy now' or 'Ask them for their preferred delivery time again.'"
                className="w-full h-40 p-4 bg-gray-50 border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary focus:ring-0 transition-all resize-none"
              />
            </div>
            <div className="p-6 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => setInstructionModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-dark hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                disabled={savingInstructions || !instructions.trim()}
                className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingInstructions ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                Give Instruction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;
