import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Search, AlertTriangle, Sparkles, Phone, ArrowRight, ArrowLeft, Send, User, Shield, Tag, History, CheckCircle2 } from 'lucide-react';
import { conversationAPI } from '../../../api/conversations';
import api from '../../../api/axios';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';

// Dynamic Color Mapping for Avatars (B -> Green, T -> Pink, O -> Purple)
const getAvatarTheme = (name) => {
  if (!name) return { bg: 'bg-[#1A7A4A]', text: 'text-white' };
  const initial = name.trim().charAt(0).toUpperCase();
  if (initial === 'B') return { bg: 'bg-[#1A7A4A]', text: 'text-white' };
  if (initial === 'T') return { bg: 'bg-[#EC4899]', text: 'text-white' };
  if (initial === 'O') return { bg: 'bg-[#7A5AF8]', text: 'text-white' };
  
  const themes = [
    { bg: 'bg-[#1A7A4A]', text: 'text-white' }, // Green
    { bg: 'bg-[#EC4899]', text: 'text-white' }, // Pink
    { bg: 'bg-[#7A5AF8]', text: 'text-white' }, // Purple
    { bg: 'bg-[#175CD3]', text: 'text-white' }, // Blue
    { bg: 'bg-[#F97316]', text: 'text-white' }, // Orange
  ];
  return themes[name.charCodeAt(0) % themes.length];
};

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const timeAgo = (dateString) => {
  if (!dateString) return '';
  const cleanDateString = dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-')
    ? dateString
    : `${dateString}Z`;
  const diff = Date.now() - new Date(cleanDateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// Clean Product Semantic Status Colors
const statusConfig = {
  'In Progress': { bg: 'bg-[#EFF8FF]', text: 'text-[#175CD3]', label: 'In Progress' },
  'Paid': { bg: 'bg-[#ECFDF3]', text: 'text-[#027A48]', label: 'Paid' },
  'Requires Attention': { bg: 'bg-[#FFFAEB]', text: 'text-[#B54708]', label: 'Needs Attention' },
  'Delivered': { bg: 'bg-[#ECFDF3]', text: 'text-[#027A48]', label: 'Delivered' },
  'In Transit': { bg: 'bg-[#F0F9FF]', text: 'text-[#026AA2]', label: 'In Transit' },
};

// Custom Status Badge with Semantic Dot
const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { bg: 'bg-[#EFF8FF]', text: 'text-[#175CD3]', label: status };
  const dotColor = {
    'bg-[#EFF8FF]': 'bg-[#2E90FA]',
    'bg-[#ECFDF3]': 'bg-[#12B76A]',
    'bg-[#FFFAEB]': 'bg-[#F79009]',
    'bg-[#F0F9FF]': 'bg-[#0284C7]'
  }[config.bg] || 'bg-[#2E90FA]';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5`} />
      {config.label || status}
    </span>
  );
};

// Platform badge config
const getPlatformBadge = (platform) => {
  const cleanPlatform = (platform || '').toLowerCase();
  if (cleanPlatform === 'whatsapp') {
    return {
      bg: 'bg-emerald-50 border border-emerald-100',
      color: 'text-emerald-700',
      label: 'WhatsApp',
      icon: (
        <svg className="w-3 h-3 fill-emerald-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.289 3.507 8.494-.004 6.66-5.338 11.997-11.95 11.997-2.005-.001-3.973-.503-5.714-1.46L0 24zm6.59-20.347c-.186-.412-.384-.42-.562-.427-.146-.006-.314-.006-.482-.006-.168 0-.441.063-.672.314-.23.251-.879.859-.879 2.094 0 1.235.9 2.428 1.025 2.595.126.167 1.767 2.699 4.284 3.782.598.258 1.065.412 1.428.527.6.19 1.15.163 1.583.099.483-.072 1.482-.605 1.691-1.19.209-.584.209-1.086.146-1.19-.063-.105-.23-.167-.481-.293-.251-.126-1.482-.731-1.712-.815-.23-.084-.397-.126-.564.126-.167.251-.648.815-.794.982-.146.167-.293.188-.543.063-.25-.126-.98-.362-1.868-1.154-.69-.616-1.157-1.378-1.293-1.611-.136-.234-.015-.361.11-.486.112-.112.251-.293.376-.44.126-.146.167-.25.251-.418.084-.167.042-.314-.021-.44-.063-.125-.562-1.355-.77-1.854z"/>
        </svg>
      )
    };
  }
  if (cleanPlatform === 'telegram') {
    return {
      bg: 'bg-sky-50 border border-sky-100',
      color: 'text-sky-700',
      label: 'Telegram',
      icon: (
        <svg className="w-3 h-3 fill-sky-600 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.92 9.07c-.14.63-.52.79-1.05.49l-2.93-2.16-1.41 1.36c-.16.16-.29.29-.6.29l.21-2.98 5.43-4.91c.24-.21-.05-.33-.37-.12L8.2 13.98l-2.89-.9c-.63-.2-.64-.63.13-.93l11.27-4.34c.52-.19.98.12.85.37z"/>
        </svg>
      )
    };
  }
  if (cleanPlatform === 'instagram') {
    return {
      bg: 'bg-pink-50 border border-pink-100',
      color: 'text-pink-700',
      label: 'Instagram',
      icon: (
        <svg className="w-3 h-3 stroke-pink-600 fill-none shrink-0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    };
  }
  return {
    bg: 'bg-gray-50 border border-gray-100',
    color: 'text-gray-600',
    label: platform || 'Unknown',
    icon: (
      <svg className="w-3 h-3 fill-gray-500 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    )
  };
};

const Chats = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [invoices, setInvoices] = useState([]);
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingChat, setDeletingChat] = useState(false);

  // Direct chat messaging states
  const [directMessageText, setDirectMessageText] = useState('');
  const [sendingDirectMessage, setSendingDirectMessage] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(false);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoading = true) => {
    try {
      const [convRes, pipeRes, invoicesRes] = await Promise.all([
        conversationAPI.getConversations(),
        conversationAPI.getPipeline(),
        api.get('/api/invoices/').catch(() => ({ data: [] }))
      ]);
      const newConvs = convRes.data || [];
      setConversations(newConvs);
      setPipeline(pipeRes.data || {});
      setInvoices(invoicesRes.data || []);

      // Real-time synchronization: keep selected chat thread updated live
      setSelectedConversation(prev => {
        if (!prev) return null;
        const updated = newConvs.find(c => c.id === prev.id);
        return updated || prev;
      });
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const consolidatedList = React.useMemo(() => {
    const groups = {};
    conversations.forEach(c => {
      const key = c.customer_phone || c.customer_name || `unknown-${c.id}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(c);
    });

    return Object.values(groups).map(group => {
      group.sort((a, b) => {
        const timeA = new Date(a.last_message_at || a.created_at || 0).getTime();
        const timeB = new Date(b.last_message_at || b.created_at || 0).getTime();
        return timeB - timeA;
      });
      const latest = { ...group[0] };
      latest.groupConversations = group;
      return latest;
    }).sort((a, b) => {
      const timeA = new Date(a.last_message_at || a.created_at || 0).getTime();
      const timeB = new Date(b.last_message_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });
  }, [conversations]);

  // URL Query Param pre-selection (e.g., from Customer Database click)
  useEffect(() => {
    const targetCust = searchParams.get('customer') || searchParams.get('phone');
    if (targetCust && consolidatedList.length > 0) {
      const norm = (s) => (s || '').toString().toLowerCase().replace(/\D/g, '');
      const match = consolidatedList.find(c => {
        const phoneMatch = c.customer_phone && targetCust && norm(c.customer_phone) === norm(targetCust);
        const nameMatch = c.customer_name && (c.customer_name.toLowerCase().includes(targetCust.toLowerCase()) || targetCust.toLowerCase().includes(c.customer_name.toLowerCase()));
        return phoneMatch || nameMatch;
      });
      if (match) setSelectedConversation(match);
    }
  }, [searchParams, consolidatedList]);

  const handleSendDirectMessage = async (e) => {
    e?.preventDefault?.();
    if (!directMessageText.trim() || !selectedConversation || sendingDirectMessage) return;
    const textToSend = directMessageText.trim();
    setDirectMessageText('');
    setSendingDirectMessage(true);

    try {
      await conversationAPI.sendMessage(selectedConversation.id, textToSend);
      setSelectedConversation(prev => {
        if (!prev) return null;
        const newSummary = prev.ai_summary ? `${prev.ai_summary}\n[Merchant]: ${textToSend}` : `[Merchant]: ${textToSend}`;
        return { ...prev, ai_summary: newSummary, last_message_at: new Date().toISOString() };
      });
      fetchData();
    } catch (err) {
      console.error('Failed to send direct message:', err);
    } finally {
      setSendingDirectMessage(false);
    }
  };

  const filteredConversations = consolidatedList.filter(c => {
    const matchesFilter = activeFilter === 'All' 
      ? true 
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

  const handleDeleteConfirm = async () => {
    if (!selectedConversation) return;
    setDeletingChat(true);
    try {
      await conversationAPI.deleteConversation(selectedConversation.id);
      setSelectedConversation(null);
      fetchData();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    } finally {
      setDeletingChat(false);
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

  // Filters setup: Simplified to All and Attention Needed
  const filters = [
    { label: 'All', count: consolidatedList.length },
    { label: 'Requires Attention', short: 'Attention Needed', count: consolidatedList.filter(c => c.status === 'Requires Attention').length },
  ];

  return (
    <div className="kasi-app flex h-[calc(100vh-64px)] overflow-hidden -m-6 md:-m-8">
      
      {/* COLUMN 2 — CHAT LIST (340px) */}
      <div className={`w-full md:w-[340px] shrink-0 border-r border-[#EAECF0] bg-white h-full flex flex-col overflow-hidden ${
        selectedConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Top search */}
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" size={16} />
            <input
              type="text"
              placeholder="Search customers or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F2F4F7] border-0 rounded-lg text-xs outline-none text-[#101828] placeholder-[#98A2B3] focus:bg-white focus:ring-1 focus:ring-[#1A7A4A] transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3 border-b border-[#EAECF0] shrink-0 select-none">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all outline-none cursor-pointer ${
                activeFilter === f.label
                  ? 'bg-[#0A0A0A] text-white'
                  : 'bg-transparent text-[#344054] hover:bg-[#F2F4F7]'
              }`}
            >
              <span>{f.short || f.label}</span>
              {f.count > 0 && (
                <span className={`text-[11px] ml-0.5 px-1.5 py-0.2 rounded-full ${activeFilter === f.label ? 'bg-white/20 text-white' : 'bg-[#F2F4F7] text-[#667085]'}`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-[#667085] text-xs font-medium">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={32} className="mx-auto text-[#D0D5DD] mb-3" />
              <p className="text-sm font-semibold text-[#101828] mb-1">No conversations</p>
              <p className="text-xs text-[#667085]">Conversations will appear here when customers message you</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedConversation?.id === conv.id;
              const avatarTheme = getAvatarTheme(conv.customer_name);
              const pb = getPlatformBadge(conv.platform);

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`py-[14px] px-4 cursor-pointer transition-all flex gap-3 relative border-b border-[#F2F4F7] border-r-[3px] select-none ${
                    isSelected
                      ? 'bg-[#E8F5EE] border-r-[#1A7A4A]'
                      : 'hover:bg-[#F9FAFB] border-r-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${avatarTheme.bg} ${avatarTheme.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                    {getInitials(conv.customer_name)}
                  </div>

                  {/* Content details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-[#101828] text-sm truncate">
                        {conv.customer_name || conv.customer_phone || 'Unknown Customer'}
                      </p>
                      <span className="text-xs text-[#98A2B3] whitespace-nowrap shrink-0">
                        {timeAgo(conv.last_message_at)}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#667085] truncate mt-0.5">
                      {conv.ai_summary || conv.customer_phone || 'No messages yet'}
                    </p>

                    {/* Status & Platform Tags */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <StatusBadge status={conv.status} />
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${pb.bg} ${pb.color}`}>
                        {pb.icon} {pb.label}
                      </span>
                    </div>

                    {/* Attention alert panel inside list item */}
                    {conv.status === 'Requires Attention' && conv.ai_summary && (
                      <div className="mt-2.5 py-2 px-3 bg-[#FFFDF5] border border-[#FEC84B] rounded-[6px]">
                        <p className="text-xs text-[#92400E] leading-normal font-medium">
                          ⚠️ {conv.ai_summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMN 3 — CONVERSATION DETAIL (Fills remaining) */}
      <div className={`flex-1 bg-[#F7F8FA] h-full overflow-hidden flex flex-col relative ${
        selectedConversation ? 'flex' : 'hidden md:flex'
      }`}>
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-[#D0D5DD] mb-4" />
              <p className="text-[#667085] text-sm font-semibold">Select a conversation to view details</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header bar */}
            <div className="h-16 bg-white border-b border-[#EAECF0] px-4 md:px-6 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 -ml-2 text-[#667085] hover:text-[#101828] hover:bg-[#F2F4F7] rounded-xl transition-all cursor-pointer mr-1"
                  title="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className={`w-10 h-10 rounded-full ${getAvatarTheme(selectedConversation.customer_name).bg} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                  {getInitials(selectedConversation.customer_name)}
                </div>
                <div>
                  <h3 className="font-bold text-[#101828] text-[18px] leading-tight">
                    {selectedConversation.customer_name || 'Unknown Customer'}
                  </h3>
                  <p className="text-[13px] text-[#667085] flex items-center gap-1 mt-0.5">
                    <Phone size={10} />
                    {selectedConversation.customer_phone || ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mute/Unmute Kasi Button */}
                <button
                  onClick={() => {
                    const newStatus = selectedConversation.status === 'Muted' ? 'In Progress' : 'Muted';
                    handleStatusUpdate(selectedConversation.id, newStatus);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedConversation.status === 'Muted'
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-750'
                  }`}
                >
                  {selectedConversation.status === 'Muted' ? '🔇 Unmute Kasi' : '🔇 Mute Kasi'}
                </button>

                {/* Delete Chat Button */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-750 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Delete Chat
                </button>

                {/* Order History Toggle */}
                <button
                  onClick={() => setHistoryOpen(!historyOpen)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyOpen
                      ? 'bg-primary text-white border-primary hover:bg-green-700 dark:bg-emerald-600 dark:border-emerald-600 dark:hover:bg-emerald-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-750'
                  }`}
                >
                  Order History
                </button>

                <StatusBadge status={selectedConversation.status} />
                {(() => {
                  const pb = getPlatformBadge(selectedConversation.platform);
                  return (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${pb.bg} ${pb.color}`}>
                      {pb.icon} {pb.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Scrollable Content wrapper */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-24">
              
              {/* Price block */}
              <div className="grid grid-cols-2 gap-4 px-6 py-5 bg-white border-b border-[#EAECF0] select-none">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#98A2B3] uppercase">LISTED PRICE</p>
                  <p className="text-[24px] font-bold text-[#101828] mt-1">
                    {selectedConversation.listed_price > 0 ? `₦${selectedConversation.listed_price.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#98A2B3] uppercase">AGREED PRICE</p>
                  <p className={`text-[24px] font-bold mt-1 ${
                    selectedConversation.agreed_price < selectedConversation.listed_price && selectedConversation.agreed_price > 0 
                      ? 'text-[#F97316]' 
                      : 'text-[#101828]'
                  }`}>
                    {selectedConversation.agreed_price > 0 ? `₦${selectedConversation.agreed_price.toLocaleString()}` : 'Negotiating...'}
                  </p>
                </div>
              </div>

              {/* AI Instructions card */}
              {selectedConversation.vendor_instructions && (
                <div className="bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#D1FAE5] dark:border-emerald-900/50 rounded-xl py-4 px-5 my-4 mx-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A7A4A] dark:text-emerald-400 flex items-center gap-1.5">
                        <span>✦</span> Active AI Instructions
                      </p>
                      <p className="text-[13px] text-[#344054] dark:text-slate-300 mt-1.5 italic font-medium leading-relaxed">
                        "{selectedConversation.vendor_instructions}"
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await conversationAPI.clearInstructions(selectedConversation.id);
                          setSelectedConversation(prev => ({ ...prev, vendor_instructions: null }));
                          setInstructions('');
                          fetchData();
                        } catch (err) {
                          console.error('Failed to clear instructions:', err);
                        }
                      }}
                      className="text-xs font-bold text-[#b42318] hover:text-[#912018] bg-[#fef3f2] hover:bg-[#fee4e2] px-2.5 py-1 rounded-md transition-all cursor-pointer border border-[#fda29b]/35 shrink-0"
                      title="Clear Active Instruction"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Kasi Needs Help card (when status is Attention) */}
              {selectedConversation.status === 'Requires Attention' && (
                <div className="bg-[#FFFAEB] border border-[#FEC84B] rounded-xl py-4 px-5 mx-6 mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#B54708] text-sm mt-0.5">⚠️</span>
                      <div>
                        <p className="text-sm font-semibold text-[#B54708]">Kasi needs your help</p>
                        <p className="text-[13px] text-[#344054] mt-1.5 leading-relaxed">
                          {selectedConversation.ai_summary || 'This conversation requires manual review.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setInstructions('');
                        setInstructionModalOpen(true);
                      }}
                      className="text-[13px] font-semibold text-[#1A7A4A] hover:underline whitespace-nowrap cursor-pointer"
                    >
                      Give AI Instruction
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Social Chat Stream */}
              <div className="px-6 space-y-3">
                <h4 className="text-[11px] font-semibold tracking-[0.08em] text-[#98A2B3] uppercase select-none">
                  CHAT MESSAGES
                </h4>
                <div className="space-y-3">
                  {(() => {
                    const summaryText = selectedConversation.ai_summary || '';
                    if (!summaryText.trim()) {
                      return (
                        <div className="bg-white border border-[#EAECF0] rounded-2xl p-8 text-center text-[#667085] text-xs">
                          No messages in this chat thread yet. Send a message below to start chatting.
                        </div>
                      );
                    }
                    
                    const lines = summaryText.split('\n').filter(l => l.trim().length > 0);
                    return lines.map((line, idx) => {
                      const isMerchant = line.startsWith('[Merchant]:') || line.startsWith('[Kasi]:') || line.startsWith('[Kasi AI]:');
                      const cleanContent = line.replace(/^\[(Merchant|Customer|Kasi|Kasi AI|Agent)\]:\s*/, '');

                      return (
                        <div key={idx} className={`flex flex-col ${isMerchant ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xs text-xs md:text-sm leading-relaxed ${
                            isMerchant 
                              ? 'bg-[#1A7A4A] text-white rounded-br-none' 
                              : 'bg-white border border-[#EAECF0] text-[#101828] rounded-bl-none'
                          }`}>
                            <div className="text-[10px] opacity-75 font-semibold mb-1">
                              {isMerchant ? 'Merchant / Kasi AI' : (selectedConversation.customer_name || 'Customer')}
                            </div>
                            <p className="whitespace-pre-wrap">{cleanContent}</p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Bottom Direct Social Chat Input & Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EAECF0] p-3 md:p-4 flex flex-col gap-2 shrink-0 z-20">
              <form onSubmit={handleSendDirectMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Type a message to ${selectedConversation.customer_name || 'customer'}...`}
                  value={directMessageText}
                  onChange={(e) => setDirectMessageText(e.target.value)}
                  disabled={sendingDirectMessage}
                  className="flex-1 px-4 py-2.5 bg-[#F2F4F7] border border-transparent rounded-xl text-xs md:text-sm outline-none text-[#101828] placeholder-[#98A2B3] focus:bg-white focus:border-[#1A7A4A] transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={!directMessageText.trim() || sendingDirectMessage}
                  className="px-5 py-2.5 bg-[#1A7A4A] hover:bg-[#0F5533] text-white rounded-xl text-xs md:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                >
                  {sendingDirectMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      Send
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleGenerateSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5EE] text-[#1A7A4A] rounded-lg text-xs font-semibold hover:bg-[#D1FAE5] transition-colors cursor-pointer"
                  >
                    <span>✦</span>
                    <span>AI Summary</span>
                  </button>
                  <button
                    onClick={() => setInstructionModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-[#344054] border border-[#D0D5DD] rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Instruct Kasi</span>
                  </button>
                </div>

                <button
                  onClick={() => selectedConversation && handleStatusUpdate(selectedConversation.id, 'In Progress')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFAEB] text-[#B54708] border border-[#FEC84B] rounded-lg text-xs font-semibold hover:bg-[#FEF3C7] transition-colors cursor-pointer"
                >
                  <span>Resolve</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* COLUMN 4 — ORDER HISTORY (320px) */}
      {selectedConversation && historyOpen && (
        <div className="w-80 shrink-0 border-l border-[#EAECF0] bg-white h-full flex flex-col overflow-hidden select-none">
          {/* Header */}
          <div className="h-16 border-b border-[#EAECF0] px-4 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-[#101828] text-sm uppercase tracking-wider">Order History</h3>
            <button 
              onClick={() => setHistoryOpen(false)} 
              className="text-gray-450 hover:text-dark text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(() => {
              const customerInvoices = invoices.filter(inv => {
                const invPhone = inv.customer?.phone || '';
                const invName = inv.customer?.name || '';
                const convPhone = selectedConversation.customer_phone || '';
                const convName = selectedConversation.customer_name || '';
                
                const normalize = (p) => p ? p.toString().replace(/\D/g, '') : '';
                
                const phoneMatch = convPhone && invPhone && (normalize(invPhone) === normalize(convPhone));
                const nameMatch = convName && invName && (invName.toLowerCase().trim() === convName.toLowerCase().trim());
                
                return phoneMatch || nameMatch;
              }).sort((a, b) => {
                const dateA = new Date(a.date_issued || a.created_at || 0).getTime();
                const dateB = new Date(b.date_issued || b.created_at || 0).getTime();
                return dateB - dateA;
              });

              return (
                <>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
                    <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">Customer Profile</p>
                    <p className="text-xs font-bold text-gray-850 mt-1">{selectedConversation.customer_name || 'Walk-in Customer'}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{selectedConversation.customer_phone || 'No Phone'}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Total Invoices: {customerInvoices.length}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">Deals & Invoices</p>
                    {customerInvoices.map((item, idx) => (
                      <div key={idx} className="bg-white border border-[#EAECF0] rounded-xl p-3 shadow-xs hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-gray-800">
                            #{item.reference}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Paid'
                              ? 'bg-green-50 text-green-700'
                              : item.status === 'In Transit'
                              ? 'bg-blue-50 text-blue-700'
                              : item.status === 'Delivered'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="mt-2 text-[11px] text-gray-550">
                          Issued: {new Date(item.date_issued || item.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>

                        {item.rider_name && (
                          <div className="mt-1.5 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100/60 truncate font-semibold">
                            🚚 Rider: {item.rider_name} {item.rider_phone ? `(${item.rider_phone})` : ''}
                          </div>
                        )}

                        {item.items && item.items.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                            {item.items.map((it, i_idx) => (
                              <div key={i_idx} className="flex justify-between items-center text-[10px] text-gray-600">
                                <span className="truncate mr-2 font-medium">{it.description}</span>
                                <span className="shrink-0 font-bold text-gray-400">x{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-800">
                          <span>Amount:</span>
                          <span>₦{(item.total_amount || item.amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-[#EAECF0]">
            <div className="p-6 border-b border-[#EAECF0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#1A7A4A] text-sm">✦</span>
                <h3 className="text-lg font-bold text-[#101828]">Detailed AI Summary</h3>
              </div>
              <button onClick={() => setSummaryModalOpen(false)} className="text-gray-400 hover:text-dark cursor-pointer text-sm font-bold">
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {generatingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#1A7A4A] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-[#667085] text-sm font-medium">Analyzing conversation history...</p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-[#344054] leading-relaxed whitespace-pre-wrap text-sm font-medium">
                  {detailedSummary || 'No detailed summary available.'}
                </div>
              )}
            </div>
            <div className="p-6 bg-[#F8F9FC] border-t border-[#EAECF0] flex justify-end">
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-xs font-bold text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-[#EAECF0]">
            <div className="p-6 border-b border-[#EAECF0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-[#1A7A4A]" size={18} />
                <h3 className="text-lg font-bold text-[#101828]">Instruct Kasi</h3>
              </div>
              <button onClick={() => setInstructionModalOpen(false)} className="text-gray-400 hover:text-dark cursor-pointer text-sm font-bold">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs text-[#667085] mb-4 leading-relaxed font-semibold">
                Tell Kasi exactly what to do next. These instructions will prioritize over its standard sales logic.
              </p>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., 'Tell the customer we can give them a 10% discount if they buy now' or 'Ask them for their preferred delivery time again.'"
                className="w-full h-36 p-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs font-semibold focus:bg-white focus:border-[#1A7A4A] focus:ring-0 transition-all resize-none outline-none text-[#101828]"
              />
            </div>
            <div className="p-6 bg-[#F8F9FC] border-t border-[#EAECF0] flex gap-3 justify-end">
              <button
                onClick={() => setInstructionModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-xs font-bold text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                disabled={savingInstructions || !instructions.trim()}
                className="px-6 py-2.5 bg-[#1A7A4A] text-white rounded-lg text-xs font-bold hover:bg-[#0F5533] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                {savingInstructions && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Give Instruction
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete this chat?"
        message="Are you sure you want to delete this chat? This will remove the conversation log and messages permanently."
        loading={deletingChat}
      />
    </div>
  );
};

export default Chats;
