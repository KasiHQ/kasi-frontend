import React from 'react';
import { MessageSquare, Instagram, Send, CheckCircle2 } from 'lucide-react';

export const AutomationSection = () => {
  return (
    <section id="automation" className="py-24 bg-[#FAFAF8] text-gray-900 border-b border-[#E5E5E5] relative overflow-hidden select-none">
      {/* Subtle dotted background */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      {/* Clock Watermark Background (Soft, refined) */}
      <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
        <span className="font-sans font-black text-[100px] md:text-[180px] text-gray-950/[0.03] leading-none tracking-tight block text-center">
          3:00 AM
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans relative z-10">
        
        {/* Centered Content Block */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E8F5EE] border border-[#1A7A4A]/20 text-[#1A7A4A] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
            <span>05_24/7 Automation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-bricolage text-[#0A0A0A] tracking-tight leading-tight max-w-2xl mx-auto">
            3 AM. You are fast asleep.<br />
            Kasi just closed <span className="text-[#1A7A4A] underline decoration-[#D4F263] decoration-4 underline-offset-4">₦45,000</span> worth of orders.
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed font-medium">
            Your customers do not wait. Whether it is midnight, a holiday, or when your phone battery is dead — Kasi stays online, responds in seconds, and captures revenue.
          </p>
        </div>

        {/* 3 Stat Callouts (Clean elevated card strip) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 items-center justify-center border border-gray-100 rounded-2xl p-6 bg-white shadow-xs hover:shadow-md transition-shadow mb-16 relative">
          {/* Stat 1 */}
          <div className="text-center px-4 md:border-r border-gray-100 py-3">
            <div className="text-4xl md:text-5xl font-black text-[#1A7A4A] leading-none mb-2 font-bricolage">
              100 DMs
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Handled simultaneously
            </div>
          </div>

          {/* Stat 2 */}
          <div className="text-center px-4 md:border-r border-gray-100 py-3">
            <div className="text-4xl md:text-5xl font-black text-[#1A7A4A] leading-none mb-2 font-bricolage">
              0 sec
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Average reply time
            </div>
          </div>

          {/* Stat 3 */}
          <div className="text-center px-4 py-3">
            <div className="text-4xl md:text-5xl font-black text-[#1A7A4A] leading-none mb-2 font-bricolage">
              24/7
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Always-on autonomous sales
            </div>
          </div>
        </div>

        {/* 3 Phone Mockups Side-by-Side (Clean, modern bezel cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-2 select-none">
          
          {/* Mockup 1: WhatsApp */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[340px] bg-white rounded-[32px] p-3 border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 relative">
              {/* WhatsApp Indicator Icon */}
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-md z-20">
                <MessageSquare size={14} className="text-white fill-white" />
              </div>

              {/* Screen */}
              <div className="w-full bg-[#ECE5DD] rounded-2xl h-[380px] relative overflow-hidden border border-gray-100">
                <img 
                  src="/whatsapp.jpeg" 
                  alt="WhatsApp Pay Autopilot" 
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Pay Autopilot</span>
          </div>

          {/* Mockup 2: Instagram */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[340px] bg-white rounded-[32px] p-3 border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 relative">
              {/* Instagram Indicator Icon */}
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#E1306C] flex items-center justify-center shadow-md z-20">
                <Instagram size={14} className="text-white" />
              </div>

              {/* Screen */}
              <div className="w-full bg-white rounded-2xl h-[380px] relative overflow-hidden border border-gray-100">
                <img 
                  src="/instagram.jpeg" 
                  alt="Instagram Auto-Haggle" 
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram Auto-Haggle</span>
          </div>

          {/* Mockup 3: Telegram */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[340px] bg-white rounded-[32px] p-3 border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 relative">
              {/* Telegram Indicator Icon */}
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center shadow-md z-20">
                <Send size={12} className="text-white -ml-0.5" />
              </div>

              {/* Screen */}
              <div className="w-full bg-[#182533] rounded-2xl h-[380px] relative overflow-hidden border border-gray-100">
                <img 
                  src="/telegram.jpeg" 
                  alt="Telegram Store Assistant" 
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
            <span className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Telegram Store Assistant</span>
          </div>

        </div>

      </div>
    </section>
  );
};
