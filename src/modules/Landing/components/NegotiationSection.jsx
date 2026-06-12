import React from 'react';
import { ShieldCheck, Handshake, TrendingUp } from 'lucide-react';

export const NegotiationSection = () => {
  return (
    <section id="negotiation" className="py-24 bg-white border-b-1.5 border-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Features Strip */}
          <div className="lg:col-span-6 space-y-10 text-left">
            <div className="space-y-6">
              <div className="badge-section">
                03_NEGOTIATIONS
              </div>
              <h2 className="font-section-h2 text-black">
                Your price.<br />Every time.
              </h2>
              <p className="font-body-large text-grey-700 max-w-xl">
                Kasi does not just answer questions — it negotiates.
                Using your set price range, Kasi pushes toward your target price the way a skilled salesperson would.
                You always know the minimum you'll accept. Kasi makes sure you get as close to your ideal as possible.
              </p>
            </div>

            {/* Feature Highlight Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Item 1 */}
              <div className="border-t-2 border-black pt-6 bg-transparent text-left flex flex-col justify-start">
                <ShieldCheck size={28} className="text-brand mb-4 shrink-0" />
                <h4 className="text-[16px] font-black text-black leading-tight mb-2">
                  Floor Price Protection
                </h4>
                <p className="text-[15px] leading-relaxed text-grey-550 font-bold">
                  Set your minimum price. Kasi never goes below it — no matter how hard they push.
                </p>
              </div>

              {/* Item 2 */}
              <div className="border-t-2 border-black pt-6 bg-transparent text-left flex flex-col justify-start">
                <Handshake size={28} className="text-brand mb-4 shrink-0" />
                <h4 className="text-[16px] font-black text-black leading-tight mb-2">
                  Smart Countering
                </h4>
                <p className="text-[15px] leading-relaxed text-grey-550 font-bold">
                  Kasi counters professionally, maintains tone, and moves the customer toward your ideal price naturally.
                </p>
              </div>

              {/* Item 3 */}
              <div className="border-t-2 border-black pt-6 bg-transparent text-left flex flex-col justify-start">
                <TrendingUp size={28} className="text-brand mb-4 shrink-0" />
                <h4 className="text-[16px] font-black text-black leading-tight mb-2">
                  Deal Velocity
                </h4>
                <p className="text-[15px] leading-relaxed text-grey-550 font-bold">
                  More conversations close faster when no one has to wait hours for a counteroffer.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup Panel */}
          <div className="lg:col-span-6 flex justify-center relative select-none">
            
            {/* Floating Prop 1: Price Tag */}
            <div className="absolute top-8 left-4 md:left-12 z-20 bg-accent text-black border-hard px-4 py-2 rounded-xl shadow-hard font-black text-xs md:text-sm -rotate-6 animate-bounce">
              ₦950 → ₦1,100 🏷️
            </div>

            {/* Floating Prop 2: Handshake Emoji */}
            <div className="absolute bottom-12 right-4 md:right-12 z-20 bg-white text-black border-hard p-3 rounded-2xl shadow-hard text-2xl md:text-3xl rotate-12 hover:scale-110 transition-transform cursor-pointer">
              🤝
            </div>

            {/* Dark Mockup Container */}
            <div className="w-full max-w-[380px] bg-[#0A0A0A] border-hard rounded-[40px] p-6 shadow-hard relative overflow-hidden flex flex-col items-center">
              
              {/* Speaker & Camera notch */}
              <div className="w-32 h-4 bg-black border-b border-gray-800 rounded-full mb-6 flex items-center justify-center">
                <span className="w-12 h-1 bg-gray-800 rounded-full inline-block mr-2" />
                <span className="w-2 h-2 bg-gray-800 rounded-full inline-block" />
              </div>

              {/* Chat screen */}
              <div className="w-full bg-white border-hard rounded-3xl p-4 flex flex-col h-[400px] justify-between relative overflow-hidden font-prompt">
                
                {/* Chat Header */}
                <div className="flex items-center gap-2 border-b-1.5 border-black pb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-light border border-black flex items-center justify-center">
                    <span className="text-[14px] font-black text-brand">K</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-black">Kasi Negotiation Agent</div>
                    <div className="text-[9px] text-brand font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                      Online • Auto-Negotiating
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 flex flex-col gap-3.5 py-4 overflow-y-auto scrollbar-hide text-left">
                  {/* Msg 1: Customer */}
                  <div className="self-end max-w-[85%] bg-black text-white border border-black px-3.5 py-2.5 rounded-2xl rounded-tr-none text-[11px] font-bold leading-relaxed shadow-[2px_2px_0px_#0A0A0A]">
                    <p className="text-[9px] text-gray-400 font-black mb-0.5">CUSTOMER • 02:44 PM</p>
                    Hey, can I get the Premium Hibiscus Tea? But ₦1,200 is too high. Can you do ₦900?
                  </div>

                  {/* Msg 2: Kasi counter */}
                  <div className="self-start max-w-[85%] bg-brand-light border border-black text-black px-3.5 py-2.5 rounded-2xl rounded-tl-none text-[11px] font-bold leading-relaxed shadow-[2px_2px_0px_#1A7A4A] flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand border border-black flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-black text-white">K</span>
                    </div>
                    <div className="text-black">
                      <p className="text-[9px] text-brand font-black mb-0.5">KASI AGENT</p>
                      I'd love to help, but ₦900 is a bit low, dear. The best I can do is ₦1,100. Let me know if that works for you!
                    </div>
                  </div>

                  {/* Msg 3: Customer Accepted */}
                  <div className="self-end max-w-[85%] bg-black text-white border border-black px-3.5 py-2.5 rounded-2xl rounded-tr-none text-[11px] font-bold leading-relaxed shadow-[2px_2px_0px_#0A0A0A]">
                    <p className="text-[9px] text-gray-400 font-black mb-0.5">CUSTOMER • 02:45 PM</p>
                    Okay, that works! I'll take it at ₦1,100.
                  </div>
                </div>

                {/* Final Agreed Price Banner */}
                <div className="bg-[#1A7A4A] border-hard rounded-xl p-3 shadow-[2px_2px_0px_#0A0A0A] text-center flex items-center justify-between">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">
                    Deal Agreed 🎉
                  </span>
                  <span className="text-[13px] font-black text-[#D4F263] bg-[#0A0A0A] border border-black px-2 py-0.5 rounded-md">
                    ₦1,100
                  </span>
                </div>

              </div>
              
              {/* Home Indicator */}
              <div className="w-24 h-1 bg-gray-800 rounded-full mt-4" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
