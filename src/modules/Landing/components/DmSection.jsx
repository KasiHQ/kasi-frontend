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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EE] border-[1.5px] border-[#1A7A4A] text-[#1A7A4A] text-xs font-black uppercase tracking-wider rounded-full">
              <span>01_Direct Messages (DMs)</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
              Conversations in,<br />cash out.
            </h2>
            
            <p className="text-base md:text-lg text-grey-700 max-w-xl leading-relaxed font-sans font-medium">
              Whether your customers find you on WhatsApp, Telegram, or Instagram, Kasi connects to their favourite channels, answers FAQs, takes orders, and collects payment details smoothly. No missed messages. No cold leads. Ever.
            </p>
          </div>

          {/* Right Column — Phone Mockup Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Rectangular green panel */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-[#1A7A4A] rounded-2xl flex items-center justify-center p-8 border-[1.5px] border-black shadow-[6px_6px_0px_#0A0A0A] overflow-visible">
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none rounded-2xl" />
              
              {/* Phone screen showing catalog management UI */}
              <div className="w-[210px] h-[370px] bg-white rounded-[24px] border-[3px] border-black shadow-[3px_3px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Screen Header */}
                <div className="bg-white border-b-[1.5px] border-black px-4 py-2.5 flex justify-between items-center shrink-0 text-left">
                  <span className="text-[10px] font-black text-black font-bricolage">Add Product</span>
                  <span className="text-[7.5px] font-bold text-brand bg-brand-light border border-brand px-1.5 py-0.2 rounded-full uppercase leading-none font-sans">Active</span>
                </div>

                {/* Form fields simulator */}
                <div className="flex-1 bg-bg-subtle p-3.5 flex flex-col gap-2.5 text-left font-sans">
                  <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-grey-500 uppercase tracking-widest block">Product Name</label>
                    <div className="bg-white border border-black rounded-[6px] px-2 py-1 text-[9px] font-bold text-black leading-none">Bitter Kola Premium</div>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-grey-500 uppercase tracking-widest block">Retail Price (₦)</label>
                    <div className="bg-white border border-black rounded-[6px] px-2 py-1 text-[9px] font-bold text-black leading-none">₦1,250</div>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-grey-500 uppercase tracking-widest block">Floor Price (₦)</label>
                    <div className="bg-white border border-black rounded-[6px] px-2 py-1 text-[9px] font-bold text-[#1A7A4A] leading-none">₦950</div>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-grey-500 uppercase tracking-widest block">Auto-Negotiation Limits</label>
                    <div className="bg-[#E8F5EE] border border-[#1A7A4A] rounded-[6px] p-1.5 text-[7.5px] font-bold text-[#1A7A4A] leading-tight">
                      Accept offers ≥ ₦950. Reject offers below automatically.
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Props */}
              
              {/* 1. Small Naira coin top-right */}
              <div className="absolute -top-4 -right-4 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="24" cy="26" rx="18" ry="14" fill="#D97706" stroke="#0A0A0A" strokeWidth="1.5" />
                  <ellipse cx="24" cy="22" rx="18" ry="14" fill="#FBBF24" stroke="#0A0A0A" strokeWidth="1.5" />
                  <text x="24" y="27" fill="#0A0A0A" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif">₦</text>
                </svg>
              </div>

              {/* 2. Chat bubble bottom-left */}
              <div className="absolute -bottom-6 -left-6 bg-white border-[1.5px] border-black rounded-[16px] p-3.5 shadow-[4px_4px_0px_#0A0A0A] text-left text-[10px] font-bold leading-normal text-black max-w-[200px] z-20 transform -rotate-[2deg] font-sans">
                Hey there! How much for 2 packs?
              </div>

            </div>
          </div>
        </div>

        {/* 3 Feature Cards underneath in 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          {/* Card 1: Catalog Management */}
          <div className="bg-white border-[1.5px] border-[#E5E5E5] rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-300 hover:translate-y-[-4px] hover:border-black hover:shadow-[4px_4px_0px_#0A0A0A]">
            <div className="w-12 h-12 rounded-xl bg-accent border-[1.5px] border-black flex items-center justify-center shrink-0 text-black shadow-[2px_2px_0px_#0A0A0A]">
              <ShoppingBag size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-bricolage">Catalog Management</h3>
              <p className="text-[15px] font-normal text-[#6B6B6B] leading-relaxed">
                Instantly create and edit products, set price thresholds, and customise descriptions for auto-negotiation.
              </p>
            </div>
          </div>

          {/* Card 2: Sales Channels */}
          <div className="bg-white border-[1.5px] border-[#E5E5E5] rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-300 hover:translate-y-[-4px] hover:border-black hover:shadow-[4px_4px_0px_#0A0A0A]">
            <div className="w-12 h-12 rounded-xl bg-accent border-[1.5px] border-black flex items-center justify-center shrink-0 text-black shadow-[2px_2px_0px_#0A0A0A]">
              <PieChart size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-bricolage">Sales Channels</h3>
              <p className="text-[15px] font-normal text-[#6B6B6B] leading-relaxed">
                Monitor your sales breakdown by platform and see exactly where your customers buy from most.
              </p>
            </div>
          </div>

          {/* Card 3: Order Analytics */}
          <div className="bg-white border-[1.5px] border-[#E5E5E5] rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-300 hover:translate-y-[-4px] hover:border-black hover:shadow-[4px_4px_0px_#0A0A0A]">
            <div className="w-12 h-12 rounded-xl bg-accent border-[1.5px] border-black flex items-center justify-center shrink-0 text-black shadow-[2px_2px_0px_#0A0A0A]">
              <TrendingUp size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A0A0A] font-bricolage">Order Analytics</h3>
              <p className="text-[15px] font-normal text-[#6B6B6B] leading-relaxed">
                Track conversion trends, successful checkouts, and customer haggling habits over time.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
