import React, { useState } from 'react';
import { Bot, HelpCircle, ChevronRight, Sliders, MessageSquare, Check } from 'lucide-react';

export const NegotiationSection = () => {
  const [userOffer, setUserOffer] = useState(2500);

  // Negotiation parameters
  const REGULAR_PRICE = 3500;
  const FLOOR_PRICE = 2850;

  // Dynamic Bot response based on user offer slider
  const getBotResponse = (offer) => {
    if (offer < FLOOR_PRICE) {
      return {
        status: 'rejected',
        text: `I'd love to help you, but ₦${offer.toLocaleString()} is below our minimum cost. The absolute lowest I can go for this premium batch is ₦2,900. Let me know if that works for you?`
      };
    } else if (offer >= FLOOR_PRICE && offer < REGULAR_PRICE) {
      return {
        status: 'accepted',
        text: `Deal! Since you're ordering right now, I can let it go for ₦${offer.toLocaleString()}. Shall I generate your payment invoice?`
      };
    } else {
      return {
        status: 'perfect',
        text: `Excellent! ₦${offer.toLocaleString()} is perfect. Generating your custom receipt and securing your items right away!`
      };
    }
  };

  const response = getBotResponse(userOffer);

  return (
    <section id="negotiation" className="py-24 bg-white dark:bg-bg-main border-b border-gray-50 dark:border-gray-850/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left reveal">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            03_Smart Negotiation
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-none">
            AI Haggles, <span className="text-green-600">you profit.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl">
            Configure floor limits for your products and let Kasi bargain with customers inside social chats autonomously—saving you from endless price haggles.
          </p>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Explainer and Interactive Slider */}
          <div className="lg:col-span-5 space-y-8 text-left reveal delay-100">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3.5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-tight">
                Try the Live AI Haggling Simulator
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                Drag the customer offer slider below to see how Kasi handles bargaining dynamically in real time. We strictly protect your floor prices while keeping replies warm and conversational.
              </p>
            </div>

            {/* Slider Workspace */}
            <div className="bg-gray-50/50 dark:bg-bg-surface/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-6">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-0.5">
                <span>Configure Product</span>
                <span className="text-green-500 font-extrabold flex items-center gap-1"><Sliders size={12}/> FLOOR: ₦2,850</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Zobo Tonic Premium</h4>
                  <span className="text-[10px] font-bold text-gray-455 block mt-0.5">Retail Value: ₦3,500</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Customer Offer</span>
                  <div className="text-xl font-black text-green-600 dark:text-green-400">₦{userOffer.toLocaleString()}</div>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="2000" 
                  max="3800" 
                  step="50"
                  value={userOffer} 
                  onChange={(e) => setUserOffer(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-[9px] font-extrabold text-gray-400 px-0.5 select-none">
                  <span>₦2,000 (Low)</span>
                  <span>₦3,500 (Retail)</span>
                  <span>₦3,800 (Tip)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom live response chatbot mockup */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end text-left reveal reveal-right delay-200">
            <div className="w-full max-w-[460px] bg-gray-50/50 dark:bg-bg-surface/50 border border-gray-100 dark:border-gray-850 rounded-[32px] p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4">
              
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 border-b border-gray-100 dark:border-gray-800 pb-3">
                <span className="flex items-center gap-1.5"><Bot size={14} className="text-green-600"/> Haggle Simulator</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold ${
                  response.status === 'rejected' ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' :
                  response.status === 'accepted' ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' :
                  'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                }`}>
                  {response.status.toUpperCase()}
                </span>
              </div>

              {/* Chat thread stream */}
              <div className="space-y-4 py-2 min-h-[220px] flex flex-col justify-end">
                {/* 1. Customer Message */}
                <div className="self-end max-w-[85%] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-2xl rounded-tr-none text-xs font-semibold leading-relaxed shadow-sm">
                  Hey! I want Zobo Tonic Special. Can you sell it to me for ₦{userOffer.toLocaleString()}?
                </div>

                {/* 2. Kasi Response */}
                <div className="self-start max-w-[85%] bg-white dark:bg-bg-main border border-gray-100 dark:border-gray-850 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs font-semibold leading-relaxed shadow-xs flex gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-white" />
                  </div>
                  <p>{response.text}</p>
                </div>
              </div>

              {/* Quick Info block */}
              <div className="bg-white dark:bg-bg-main border border-gray-100 dark:border-gray-850 rounded-2xl p-3 shadow-2xs text-[10px] text-gray-450 leading-relaxed font-semibold">
                <strong>How it works:</strong> If customers offer below your min floor limit (₦2,850), Kasi counter-offers automatically to protect your margin while keeping the client happy. Try adjusting the slider to test!
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
