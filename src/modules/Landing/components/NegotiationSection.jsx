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

            {/* Browser Mockup */}
            <div className="w-full max-w-[500px] bg-white border-[2.5px] border-black rounded-2xl shadow-[6px_6px_0px_#0A0A0A] overflow-hidden flex flex-col transform rotate-[1deg] hover:rotate-0 transition-transform duration-500 z-10">
              {/* Browser Header */}
              <div className="bg-[#F5F5F0] border-b-[2px] border-black px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/35" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/35" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/35" />
                </div>
                <div className="bg-white border border-black rounded-md px-4 py-0.5 text-[9px] font-bold text-grey-500 font-sans tracking-wide">
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
