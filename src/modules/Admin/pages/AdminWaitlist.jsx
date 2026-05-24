import React, { useState, useEffect } from 'react';
import { 
  Users, Search, X, Mail, Phone, Clock, 
  MessageSquare, Award, TrendingUp, AlertTriangle, 
  Crown, Lightbulb, Zap, BarChart3, Settings
} from 'lucide-react';
import api from '../../../api/axios';
import { useToast } from '../../../context/ToastContext';

const AdminWaitlist = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [filteredWaitlist, setFilteredWaitlist] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({ platforms: {}, struggles: {}, heard_about: {}, categories: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/kasisalienceadministration/waitlist');
      const data = response.data;
      if (data && data.entries) {
        setWaitlist(data.entries);
        setFilteredWaitlist(data.entries);
        setAnalyticsData(data.analytics || { platforms: {}, struggles: {}, heard_about: {}, categories: {} });
      } else {
        setWaitlist(data || []);
        setFilteredWaitlist(data || []);
        setAnalyticsData({ platforms: {}, struggles: {}, heard_about: {}, categories: {} });
      }
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      addToast('Failed to load waitlist entries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = waitlist.filter(entry => 
      entry.name?.toLowerCase().includes(term) ||
      entry.email?.toLowerCase().includes(term) ||
      entry.phone_number?.toLowerCase().includes(term) ||
      entry.category?.toLowerCase().includes(term) ||
      entry.commerce_platform?.toLowerCase().includes(term) ||
      entry.heard_about?.toLowerCase().includes(term)
    );
    setFilteredWaitlist(filtered);
  }, [searchTerm, waitlist]);

  // Aggregate platforms for podium
  const platforms = analyticsData?.platforms || {};
  const sortedPlatforms = Object.entries(platforms)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Pad to at least 3 elements for the podium
  const podiumData = [
    sortedPlatforms[1] || { name: 'N/A', count: 0 }, // 2nd Place
    sortedPlatforms[0] || { name: 'N/A', count: 0 }, // 1st Place
    sortedPlatforms[2] || { name: 'N/A', count: 0 }  // 3rd Place
  ];

  // Aggregate categories (bound as struggles fallback from backend)
  const struggles = analyticsData?.struggles || {};
  const totalEntries = waitlist.length || 1;
  const sortedStruggles = Object.entries(struggles)
    .map(([name, count]) => ({
      name: name || 'Other',
      count,
      percentage: Math.round((count / totalEntries) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#FCFAFA] dark:bg-gray-900 min-h-screen animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-250 dark:bg-gray-800 rounded-lg" />
          <div className="h-6 w-32 bg-gray-250 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-155 dark:border-gray-700 h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-155 dark:border-gray-700 h-[280px]" />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-155 dark:border-gray-700 h-[280px]" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-155 dark:border-gray-700 h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#FCFAFA] dark:bg-gray-955 min-h-[calc(100vh-theme(spacing.16))] relative text-gray-800 dark:text-gray-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-950/40 p-2 rounded-xl text-green-600">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-bricolage">Kasi Beta Waitlist</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Review prospects & details for the Kasi Beta waitlist campaign</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold rounded-xl border border-green-100 dark:border-green-900/30 flex items-center gap-2">
            <Users size={18} />
            {waitlist.length} Sign Ups
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 select-none font-sans">
        {/* KPI 1: Total Sign Ups */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Waitlist Size</span>
            <Users className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white font-bricolage">{waitlist.length}</div>
          <div className="mt-2 text-[10px] font-bold text-gray-400">Total interested signups</div>
        </div>

        {/* KPI 2: Top Selling Platform */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 dark:bg-green-950/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Primary Channel</span>
            <TrendingUp className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-bricolage truncate">
            {sortedPlatforms[0]?.name || 'None'}
          </div>
          <div className="mt-2 text-[10px] font-bold text-gray-400">
            {sortedPlatforms[0]?.count || 0} candidates ({Math.round(((sortedPlatforms[0]?.count || 0) / totalEntries) * 100)}%)
          </div>
        </div>

        {/* KPI 3: Top User Segment */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 relative overflow-hidden group hover:border-[#7A5AF8]/30 dark:hover:border-[#7A5AF8]/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/25 dark:bg-purple-950/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Key User Persona</span>
            <Crown className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-bricolage truncate">
            {sortedStruggles[0]?.name || 'None'}
          </div>
          <div className="mt-2 text-[10px] font-bold text-purple-500">
            {sortedStruggles[0]?.count || 0} signups ({sortedStruggles[0]?.percentage || 0}%)
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 select-none">
        
        {/* Podium for Platforms */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2 flex items-center gap-2 font-bricolage">
              <Award className="text-green-600" size={18} /> Top Selling Channels
            </h3>
            <p className="text-[11px] text-gray-400 mt-2 font-sans font-medium">Primary platforms candidates currently utilize for conducting commerce.</p>
          </div>

          <div className="flex items-end justify-center gap-4 h-[210px] mt-6 font-sans">
            {/* 2nd Place (Left) */}
            <div className="flex flex-col items-center w-28">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 text-center truncate w-full mb-1">
                {podiumData[0].name}
              </span>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2">
                {podiumData[0].count} signups
              </span>
              <div 
                className="w-full bg-gray-200 dark:bg-gray-800 border-[2px] border-black dark:border-gray-700 rounded-t-xl flex flex-col justify-end items-center pb-3 shadow-[2px_2px_0px_#000] dark:shadow-none" 
                style={{ height: '90px' }}
              >
                <span className="text-xl font-black text-gray-500 dark:text-gray-400">2</span>
              </div>
            </div>

            {/* 1st Place (Center) */}
            <div className="flex flex-col items-center w-32">
              <span className="text-sm font-black text-black dark:text-white text-center truncate w-full mb-1">
                {podiumData[1].name}
              </span>
              <span className="text-xs font-black text-green-600 dark:text-green-400 mb-2">
                {podiumData[1].count} signups
              </span>
              <div 
                className="w-full bg-[#D4F263] border-[2.5px] border-black rounded-t-2xl flex flex-col justify-end items-center pb-5 shadow-[4px_4px_0px_#000] relative" 
                style={{ height: '140px' }}
              >
                <Crown className="w-5 h-5 text-black absolute -top-5 fill-current animate-bounce" style={{ animationDuration: '3s' }} />
                <span className="text-3xl font-black text-black">1</span>
              </div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="flex flex-col items-center w-28">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center truncate w-full mb-1">
                {podiumData[2].name}
              </span>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2">
                {podiumData[2].count} signups
              </span>
              <div 
                className="w-full bg-gray-100 dark:bg-gray-850 border-[2px] border-black dark:border-gray-800 rounded-t-xl flex flex-col justify-end items-center pb-2 shadow-[1px_1px_0px_#000] dark:shadow-none" 
                style={{ height: '60px' }}
              >
                <span className="text-lg font-black text-gray-400 dark:text-gray-500">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Categories Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-850 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-2 flex items-center gap-2 font-bricolage">
              <Users className="text-purple-500" size={18} /> User Segment Distribution
            </h3>
            <p className="text-[11px] text-gray-400 mt-2 font-sans font-medium">Breakdown of registered waitlist candidates across different user personas.</p>
          </div>

          <div className="space-y-4.5 mt-6 font-sans">
            {sortedStruggles.length > 0 ? (
              sortedStruggles.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span className="truncate max-w-[70%]">{st.name}</span>
                    <span>{st.percentage}% ({st.count})</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${st.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-10">No segments aggregated yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-850 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, email, category, platform, or lead source..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none focus:outline-none flex-1 text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-850 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-850 flex justify-between items-center select-none">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight font-bricolage">Registered Beta Candidates</h2>
            <p className="text-xs text-gray-400">Click any row to examine detailed candidate profiles, shopping spend, and online biz orders.</p>
          </div>
          <span className="bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
            {filteredWaitlist.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 select-none">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate / Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Online Biz?</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Main Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredWaitlist.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No waitlist entries found.
                  </td>
                </tr>
              ) : (
                filteredWaitlist.map((entry, idx) => (
                  <tr 
                    key={entry.id} 
                    onClick={() => setSelectedEntry(entry)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-all animate-in fade-in"
                    style={{ animationDelay: `${idx * 20}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="font-bold">{new Date(entry.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(entry.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-extrabold text-gray-900 dark:text-white leading-none">
                        {entry.name}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-1">
                        {entry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
                        {entry.category ? {
                          'product_vendor': 'Product Vendor',
                          'service_provider': 'Service Provider',
                          'professional': 'Professional',
                          'investor': 'Investor',
                          'regular_user': 'Regular User'
                        }[entry.category] || entry.category : 'Regular User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        entry.runs_online_biz === 'Yes' 
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-850 dark:text-gray-400 dark:border-gray-800'
                      }`}>
                        {entry.runs_online_biz || 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                        {entry.commerce_platform || entry.primary_platform || 'None'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Offcanvas for Waitlist Entry Details */}
      {selectedEntry && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-[150] transition-opacity"
            onClick={() => setSelectedEntry(null)}
          />
          
          {/* Offcanvas Panel */}
          <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-gray-900 shadow-2xl z-[160] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 dark:border-gray-800 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-955">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 flex items-center justify-center shadow-inner">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white font-bricolage">Waitlist Assessment</h2>
                  <p className="text-xs text-gray-400">Prospect ID: #{selectedEntry.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEntry(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               
               {/* Identity Display */}
               <div className="text-center py-6 bg-gray-50 dark:bg-gray-955 rounded-2xl border border-gray-150 dark:border-gray-850 relative overflow-hidden select-none">
                 <div className="w-16 h-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center text-green-600 font-black text-2xl mx-auto mb-3 shadow-sm font-bricolage">
                   {selectedEntry.name.charAt(0).toUpperCase()}
                 </div>
                 <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none font-bricolage">
                   {selectedEntry.name}
                 </h1>
                 <p className="text-xs text-gray-500 font-medium mt-1.5">{selectedEntry.email}</p>
               </div>

               {/* Complete Data Details */}
               <div className="space-y-5 font-sans">
                 
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800 pb-1.5 select-none">Commerce Assessment</h4>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">User Category</p>
                     <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-955 dark:text-purple-400 dark:border-purple-900/30 mt-0.5">
                       {selectedEntry.category ? {
                         'product_vendor': 'Product Vendor',
                         'service_provider': 'Service Provider',
                         'professional': 'Professional',
                         'investor': 'Investor',
                         'regular_user': 'Regular User'
                       }[selectedEntry.category] || selectedEntry.category : 'Regular User'}
                     </span>
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Online Business?</p>
                     <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border mt-0.5 ${
                       selectedEntry.runs_online_biz === 'Yes' 
                         ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-955 dark:text-green-400 dark:border-green-900/30' 
                         : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-850 dark:text-gray-400 dark:border-gray-800'
                     }`}>
                       {selectedEntry.runs_online_biz || 'No'}
                     </span>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-800 pt-4">
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Commerce Channel</p>
                     <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-955 dark:text-blue-400 dark:border-blue-900/30 mt-0.5">
                       {selectedEntry.commerce_platform || selectedEntry.primary_platform || 'None'}
                     </span>
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Lead Source</p>
                     <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-955 dark:text-orange-400 dark:border-orange-900/30 mt-0.5">
                       {selectedEntry.heard_about || 'Other'}
                     </span>
                   </div>
                 </div>

                 <div className="border-t border-gray-50 dark:border-gray-800 pt-4">
                   {selectedEntry.business_orders && selectedEntry.business_orders !== 'None' ? (
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Monthly Volume (Orders/Bookings)</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{selectedEntry.business_orders}</p>
                     </div>
                   ) : (
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Monthly Online Shopping Spend</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{selectedEntry.customer_spend || 'Not provided'}</p>
                     </div>
                   )}
                 </div>

                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800 pt-4 pb-1.5 select-none">Contact Discovery</h4>

                 <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-955 p-4 rounded-xl border border-gray-150 dark:border-gray-850">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-green-50 dark:bg-green-950/40 text-green-600 rounded-lg">
                       <Phone size={18} />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">WhatsApp Contact</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedEntry.phone_number}</p>
                     </div>
                   </div>
                   <a 
                     href={`https://wa.me/${selectedEntry.phone_number.replace(/[^0-9]/g, '')}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer shadow-sm no-underline"
                   >
                     Message Candidate
                   </a>
                 </div>

               </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex gap-3">
               <button 
                 onClick={() => setSelectedEntry(null)}
                 className="flex-1 py-2.5 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-855 text-gray-700 dark:text-light font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center"
               >
                 Dismiss Panel
               </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminWaitlist;
