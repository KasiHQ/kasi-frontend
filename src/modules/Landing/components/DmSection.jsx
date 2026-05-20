import React from 'react';
import { ShoppingBag, PieChart, TrendingUp, Edit3, Trash2, Plus, Check } from 'lucide-react';

export const DmSection = () => {
  return (
    <section id="dms" className="py-24 bg-white dark:bg-bg-main border-b border-gray-50 dark:border-gray-850/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            01_Direct Messages (DMs)
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-none">
            Conversations in, <span className="text-green-650">cash out.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl">
            Whether your customers find you on WhatsApp, Telegram, or Instagram, Kasi connects to their favorite channels, answers FAQs, takes orders, and collects payment details smoothly.
          </p>
        </div>

        {/* Three-Column Thin-Line Phone Grid (Image 2 style) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch font-prompt">
          
          {/* Column 1: Catalog Management */}
          <div className="flex flex-col items-center text-center space-y-6 bg-white dark:bg-bg-main p-6 rounded-[32px] hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-850 hover:scale-[1.01]">
            <div className="space-y-4 flex flex-col items-center">
              {/* Outline Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-bg-surface border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0 text-gray-500 shadow-2xs">
                <ShoppingBag size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white font-bricolage">Catalog Management</h3>
              <p className="text-xs text-gray-450 dark:text-gray-450 font-semibold leading-relaxed max-w-[280px]">
                Instantly create and edit products, set price thresholds, and customize descriptions for auto-negotiation.
              </p>
            </div>

            {/* Thin-line CSS Phone Mockup of Product Edit Screen */}
            <div className="w-full max-w-[240px] bg-white dark:bg-bg-surface rounded-[32px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col overflow-hidden select-none shadow-2xs mt-4 text-left">
              {/* Fake screen header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-gray-800 mb-3">
                <span className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-wider font-bricolage">Bitter Kola</span>
                <div className="flex gap-2">
                  <Edit3 size={10} className="text-gray-400" />
                  <Trash2 size={10} className="text-gray-400" />
                </div>
              </div>

              {/* Minimal Forms Fields (Thin-line design) */}
              <div className="space-y-2">
                {[
                  { label: 'Product Name', value: 'Bitter Kola Premium' },
                  { label: 'Retail Price (₦)', value: '1,200' },
                  { label: 'Floor Price (₦)', value: '950' },
                  { label: 'Description', value: 'Organic Bitter Kola packs.' },
                ].map((field, idx) => (
                  <div key={idx} className="space-y-0.5 pb-2 border-b border-gray-100 dark:border-gray-850">
                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{field.label}</span>
                    <div className="text-[9px] font-bold text-gray-800 dark:text-gray-200">{field.value}</div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-3 flex justify-between items-center pt-1">
                <span className="text-[7px] font-bold text-green-500 flex items-center gap-0.5"><Check size={8} strokeWidth={3}/> Saved</span>
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Active catalog</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sales Channels */}
          <div className="flex flex-col items-center text-center space-y-6 bg-white dark:bg-bg-main p-6 rounded-[32px] hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-850 hover:scale-[1.01]">
            <div className="space-y-4 flex flex-col items-center">
              {/* Outline Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-bg-surface border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0 text-gray-500 shadow-2xs">
                <PieChart size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white font-bricolage">Sales Channels</h3>
              <p className="text-xs text-gray-450 dark:text-gray-450 font-semibold leading-relaxed max-w-[280px]">
                Monitor your sales breakdown by platform to see where your customers buy from most.
              </p>
            </div>

            {/* Thin-line CSS Phone Mockup of Sales Channels Pie Chart */}
            <div className="w-full max-w-[240px] bg-white dark:bg-bg-surface rounded-[32px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col overflow-hidden select-none shadow-2xs mt-4 text-left">
              {/* Fake screen header */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
                <span className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-wider font-bricolage">Channels</span>
                <div className="flex gap-1 bg-gray-50 dark:bg-bg-main p-0.5 rounded-md border border-gray-100 dark:border-gray-800">
                  <span className="text-[6px] font-bold px-1.5 py-0.5 bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800 rounded-sm">NGN</span>
                  <span className="text-[6px] font-bold px-1.5 py-0.5 text-gray-400">USD</span>
                </div>
              </div>

              {/* Crisp thin-line SVG pie chart */}
              <div className="flex flex-col items-center justify-center my-1.5">
                <div className="relative flex items-center justify-center w-20 h-20">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E5E7EB" strokeWidth="6" />
                    {/* WhatsApp: 55% (Green) - strokeDasharray=251, strokeDashoffset=113 */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="113.04" />
                    {/* Telegram: 30% (Blue) - offset by 55%, length 75.3 */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="188.4" className="origin-center rotate-[198deg]" />
                    {/* Instagram: 15% (Pink) - offset by 85%, length 37.6 */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EC4899" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="226.08" className="origin-center rotate-[306deg]" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest leading-none">WhatsApp</span>
                    <span className="text-[9px] font-black text-gray-900 dark:text-white leading-none mt-0.5">55%</span>
                  </div>
                </div>
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-3 gap-1 mt-2 text-[7px] font-extrabold text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>WA: 55%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span>TG: 30%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                  <span>IG: 15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Order Analytics */}
          <div className="flex flex-col items-center text-center space-y-6 bg-white dark:bg-bg-main p-6 rounded-[32px] hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-850 hover:scale-[1.01]">
            <div className="space-y-4 flex flex-col items-center">
              {/* Outline Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-bg-surface border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0 text-gray-500 shadow-2xs">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white font-bricolage">Order Analytics</h3>
              <p className="text-xs text-gray-450 dark:text-gray-450 font-semibold leading-relaxed max-w-[280px]">
                Track conversion trends, successful checkouts, and customer haggling habits over time.
              </p>
            </div>

            {/* Thin-line CSS Phone Mockup of Order Analytics Line Chart */}
            <div className="w-full max-w-[240px] bg-white dark:bg-bg-surface rounded-[32px] border border-gray-200 dark:border-gray-800 p-4 flex flex-col overflow-hidden select-none shadow-2xs mt-4 text-left">
              {/* Fake screen header */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
                <span className="text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-wider font-bricolage">Sales Velocity</span>
                <span className="text-[7px] font-bold text-green-500">+18%</span>
              </div>

              {/* Summary Stats */}
              <div className="space-y-0.5 mb-2">
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Total Sales Value</span>
                <h4 className="text-xs font-black text-gray-950 dark:text-white">₦258,400.00</h4>
              </div>

              {/* Crisp thin-line SVG line chart */}
              <div className="my-1">
                <svg viewBox="0 0 100 40" className="w-full h-11">
                  <path d="M 0 35 Q 20 20 40 28 T 80 12 T 100 6" fill="none" stroke="#00B05C" strokeWidth="1.5" />
                  <path d="M 0 35 Q 20 20 40 28 T 80 12 T 100 6 L 100 40 L 0 40 Z" fill="url(#green-grad)" opacity="0.08" />
                  <defs>
                    <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B05C" />
                      <stop offset="100%" stopColor="#00B05C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Micro stats table */}
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-850 grid grid-cols-3 gap-1 text-[7px] font-extrabold text-gray-400">
                <div>
                  <span className="block text-gray-900 dark:text-white text-[8px]">1,240</span>
                  <span>Checkouts</span>
                </div>
                <div>
                  <span className="block text-gray-900 dark:text-white text-[8px]">94%</span>
                  <span>Closed</span>
                </div>
                <div>
                  <span className="block text-gray-900 dark:text-white text-[8px]">₦15k</span>
                  <span>Avg Order</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
