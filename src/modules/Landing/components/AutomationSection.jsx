import React from 'react';
import { MessageSquare, Instagram, Send, CheckCircle2 } from 'lucide-react';

export const AutomationSection = () => {
  return (
    <section id="automation" className="py-24 bg-[#0F1F0F] text-white border-b-1.5 border-black relative overflow-hidden">
      
      {/* Clock Watermark Background (Behind the text & stats) */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
        <span className="font-sans font-black text-[120px] md:text-[180px] text-white/[0.04] leading-none tracking-tight block text-center">
          3:00 AM
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt relative z-10">
        
        {/* Centered Content Block */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-block bg-[#1A7A4A] text-white border border-[#D4F263] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            05_24/7 AUTOMATION
          </div>
          <h2 className="text-[36px] md:text-[56px] font-black font-bricolage text-white tracking-tight leading-tight max-w-2xl mx-auto">
            3 AM. You are asleep.<br />
            Kasi just closed <span className="text-[#D4F263] underline decoration-[#D4F263] underline-offset-4">₦45,000</span> worth of orders.
          </h2>
          <p className="text-base md:text-lg text-white/65 max-w-xl mx-auto leading-relaxed font-medium">
            Your customers do not wait. Whether it is midnight, a public holiday, or when your phone is off — Kasi is always online, always replying, always selling.
          </p>
        </div>

        {/* 3 Stat Callouts (Flex row on desktop, stacked on mobile) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 items-center justify-center border border-white/15 rounded-3xl p-6 bg-black/25 backdrop-blur-xs mb-20 shadow-hard relative">
          
          {/* Stat 1 */}
          <div className="text-center px-4 md:border-r border-white/15 py-4">
            <div className="text-[48px] font-black text-[#D4F263] leading-none mb-2 font-bricolage">
              100 DMs
            </div>
            <div className="text-[14px] font-bold text-white/50 uppercase tracking-wider">
              handled simultaneously
            </div>
          </div>

          {/* Stat 2 */}
          <div className="text-center px-4 md:border-r border-white/15 py-4">
            <div className="text-[48px] font-black text-[#D4F263] leading-none mb-2 font-bricolage">
              0 seconds
            </div>
            <div className="text-[14px] font-bold text-white/50 uppercase tracking-wider">
              average reply time
            </div>
          </div>

          {/* Stat 3 */}
          <div className="text-center px-4 py-4">
            <div className="text-[48px] font-black text-[#D4F263] leading-none mb-2 font-bricolage">
              24/7
            </div>
            <div className="text-[14px] font-bold text-white/50 uppercase tracking-wider">
              no days off, ever
            </div>
          </div>

        </div>

        {/* 3 Phone Mockups Side-by-Side (WhatsApp, Instagram, Telegram) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4 select-none">
          
          {/* Mockup 1: WhatsApp */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[340px] bg-[#0A0A0A] border-hard rounded-[36px] p-4 shadow-hard hover:translate-y-[-4px] transition-transform duration-300 relative">
              
              {/* WhatsApp Indicator Icon on Mockup */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#25D366] border border-black flex items-center justify-center shadow-md z-25">
                <MessageSquare size={14} className="text-white fill-white" />
              </div>

              {/* Screen */}
              <div className="w-full bg-[#ECE5DD] border-hard rounded-2xl h-[380px] relative overflow-hidden">
                <img 
                  src="/whatsapp.jpeg" 
                  alt="WhatsApp Pay Autopilot" 
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
            <span className="mt-4 text-xs font-black text-white/50 uppercase tracking-widest">WhatsApp Pay autopilot</span>
          </div>

          {/* Mockup 2: Instagram */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[340px] bg-[#0A0A0A] border-hard rounded-[36px] p-4 shadow-hard hover:translate-y-[-4px] transition-transform duration-300 relative">
              
              {/* Instagram Indicator Icon */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#E1306C] border border-black flex items-center justify-center shadow-md z-25">
                <Instagram size={14} className="text-white" />
              </div>

              {/* Screen */}
              <div className="w-full bg-[#FFFFFF] border-hard rounded-2xl h-[380px] relative overflow-hidden">
                <img 
                  src="/instagram.jpeg" 
                  alt="Instagram Auto-Haggle" 
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
            <span className="mt-4 text-xs font-black text-white/50 uppercase tracking-widest">Instagram auto-haggle</span>
          </div>

          {/* Mockup 3: Telegram */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[340px] bg-[#0A0A0A] border-hard rounded-[36px] p-4 shadow-hard hover:translate-y-[-4px] transition-transform duration-300 relative">
              
              {/* Telegram Indicator Icon */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#0088cc] border border-black flex items-center justify-center shadow-md z-25">
                <Send size={12} className="text-white -ml-0.5" />
              </div>

              {/* Screen */}
              <div className="w-full bg-[#DEE8F1] border-hard rounded-2xl h-[380px] relative overflow-hidden">
                <img 
                  src="/telegram.jpeg" 
                  alt="Telegram Delivery Dispatch" 
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
            <span className="mt-4 text-xs font-black text-white/50 uppercase tracking-widest">Telegram delivery dispatch</span>
          </div>

        </div>

      </div>
    </section>
  );
};
