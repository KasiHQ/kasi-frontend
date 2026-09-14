import React from 'react';
import { ShoppingBag, PieChart, TrendingUp } from 'lucide-react';

export const DmSection = () => {
  return (
    <section id="dms" className="w-full py-[100px] bg-white border-b-[1.5px] border-[#E5E5E5] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Top 2-Column Split: Text Left | Mockup Panel Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          
          {/* Left Column — Text & Section Headers */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E8F5EE] border border-[#1A7A4A]/20 text-[#1A7A4A] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
              <span>01_Direct Messages (DMs)</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
              Conversations in,<br />cash out.
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed font-sans font-medium">
              Whether your customers find you on WhatsApp, Telegram, or Instagram, Kasi connects to their favourite channels, answers FAQs, takes orders, and collects payment details smoothly. No missed messages. No cold leads. Ever.
            </p>
          </div>

          {/* Right Column — Phone Mockup Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Rectangular green panel */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-[#1A7A4A] rounded-3xl flex items-center justify-center p-8 border border-emerald-600/30 shadow-[0_20px_50px_rgba(26,122,74,0.22)] overflow-visible">
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none rounded-3xl" />
              
              {/* Phone screen showing real WhatsApp conversation */}
              <div className="w-[220px] h-[380px] bg-white rounded-[28px] border border-gray-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 z-10 relative">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-30" />
                {/* Video */}
                <video 
                  src="/images/KASI_CAKEY_RESTAURANT.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  controlsList="nodownload"
                  disablePictureInPicture
                  disableRemotePlayback
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-cover select-none pointer-events-none" 
                />
              </div>

              {/* Floating Props */}
              
              {/* 1. Small Naira coin top-right */}
              <div className="absolute -top-4 -right-4 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                  <ellipse cx="24" cy="26" rx="18" ry="14" fill="#D97706" />
                  <ellipse cx="24" cy="22" rx="18" ry="14" fill="#FBBF24" />
                  <text x="24" y="27" fill="#0A0A0A" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif">₦</text>
                </svg>
              </div>

              {/* 2. Chat bubble bottom-left */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-3.5 shadow-xl text-left text-[11px] font-bold leading-normal text-gray-900 max-w-[200px] z-20 transform -rotate-[2deg] font-sans">
                Hey there! How much for 2 packs?
              </div>

            </div>
          </div>
        </div>

        {/* 3 Feature Cards underneath in 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          {/* Card 1: Catalog Management */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-accent/30 border border-accent/60 flex items-center justify-center shrink-0 shadow-xs">
              <ShoppingBag size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-bricolage">Catalog Management</h3>
              <p className="text-[15px] font-normal text-gray-500 leading-relaxed">
                Instantly create and edit products, set price thresholds, and customise descriptions for auto-negotiation.
              </p>
            </div>
          </div>

          {/* Card 2: Sales Channels */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-accent/30 border border-accent/60 flex items-center justify-center shrink-0 shadow-xs">
              <PieChart size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-bricolage">Sales Channels</h3>
              <p className="text-[15px] font-normal text-gray-500 leading-relaxed">
                Monitor your sales breakdown by platform and see exactly where your customers buy from most.
              </p>
            </div>
          </div>

          {/* Card 3: Order Analytics */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-accent/30 border border-accent/60 flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-bricolage">Order Analytics</h3>
              <p className="text-[15px] font-normal text-gray-500 leading-relaxed">
                Track conversion trends, successful checkouts, and customer haggling habits over time.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
