import React from 'react';
import { ShieldCheck, Handshake, TrendingUp } from 'lucide-react';

export const NegotiationSection = () => {
  return (
    <section id="negotiation" className="py-24 bg-white border-b border-[#E5E5E5] relative overflow-hidden">
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
              <p className="font-body-large text-gray-600 max-w-xl font-sans">
                Kasi does not just answer questions — it negotiates.
                Using your set price range, Kasi pushes toward your target price the way a skilled salesperson would.
                You always know the minimum you'll accept. Kasi makes sure you get as close to your ideal as possible.
              </p>
            </div>

            {/* Feature Highlight Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Item 1 */}
              <div className="border-t border-gray-200 pt-6 bg-transparent text-left flex flex-col justify-start">
                <ShieldCheck size={28} className="text-brand mb-4 shrink-0" />
                <h4 className="text-[16px] font-black text-black leading-tight mb-2">
                  Floor Price Protection
                </h4>
                <p className="text-[15px] leading-relaxed text-gray-500 font-medium font-sans">
                  Set your minimum price. Kasi never goes below it — no matter how hard they push.
                </p>
              </div>

              {/* Item 2 */}
              <div className="border-t border-gray-200 pt-6 bg-transparent text-left flex flex-col justify-start">
                <Handshake size={28} className="text-brand mb-4 shrink-0" />
                <h4 className="text-[16px] font-black text-black leading-tight mb-2">
                  Smart Countering
                </h4>
                <p className="text-[15px] leading-relaxed text-gray-500 font-medium font-sans">
                  Kasi counters professionally, maintains tone, and moves the customer toward your ideal price naturally.
                </p>
              </div>

              {/* Item 3 */}
              <div className="border-t border-gray-200 pt-6 bg-transparent text-left flex flex-col justify-start">
                <TrendingUp size={28} className="text-brand mb-4 shrink-0" />
                <h4 className="text-[16px] font-black text-black leading-tight mb-2">
                  Deal Velocity
                </h4>
                <p className="text-[15px] leading-relaxed text-gray-500 font-medium font-sans">
                  More conversations close faster when no one has to wait hours for a counteroffer.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup Panel */}
          <div className="lg:col-span-6 flex justify-center relative select-none">
            
            {/* Floating Prop 1: Price Tag */}
            <div className="absolute top-8 left-4 md:left-12 z-20 bg-[#D4F263] text-black border border-black/10 px-4 py-2 rounded-xl shadow-lg font-black text-xs md:text-sm -rotate-6 animate-bounce">
              ₦950 → ₦1,100 🏷️
            </div>

            {/* Floating Prop 2: Handshake Emoji */}
            <div className="absolute bottom-12 right-4 md:right-12 z-20 bg-white/95 backdrop-blur-sm text-black border border-gray-100 p-3 rounded-2xl shadow-xl text-2xl md:text-3xl rotate-12 hover:scale-110 transition-transform cursor-pointer">
              🤝
            </div>

            {/* Browser Mockup */}
            <div className="w-full max-w-[500px] bg-white border border-gray-200/80 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col transform rotate-[1deg] hover:rotate-0 transition-transform duration-500 z-10">
              {/* Browser Header */}
              <div className="bg-[#F8F9F7] border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="bg-white border border-gray-200 rounded-md px-4 py-0.5 text-[9px] font-bold text-gray-500 font-sans tracking-wide shadow-xs">
                  usekasi.com/products/edit
                </div>
                <div className="w-6 h-6" /> {/* Spacer */}
              </div>
              {/* Image */}
              <img 
                src="/images/product-negotiation-limits-desktop.png" 
                alt="Kasi AI Auto-Negotiation Limits Configuration" 
                className="w-full h-auto object-cover select-none" 
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
