import React from 'react';
import { Star, Quote, MessageSquare } from 'lucide-react';

export const TestimonialSection = () => {
  const TESTIMONIALS = [
    {
      quote: "We used to get hundreds of 'how much' comments daily. Since connecting Kasi to our Instagram and WhatsApp, 80% of our orders close themselves while we focus on packing. It is a complete lifesaver.",
      name: "Folake Adebayo",
      role: "Founder, Organic Bites Lagos",
      location: "Lekki, Lagos",
      platform: "Instagram + WhatsApp"
    },
    {
      quote: "Customers love the instant PDF receipts Kasi generates. No more cross-checking fake transfer screenshots; the bank callback verifies the payment and updates the invoice status instantly!",
      name: "Emeka Obi",
      role: "CEO, Zobo Tonic Beverages",
      location: "Garki, Abuja",
      platform: "Telegram + WhatsApp"
    },
    {
      quote: "The AI price negotiation is pure magic. We configured our floor price and let Kasi bargain with customers in chats. Average order values went up by 15% and we saved hours of back-and-forth haggling.",
      name: "Kenechukwu O.",
      role: "Director, Shea Glow Cosmetics",
      location: "Port Harcourt",
      platform: "WhatsApp Business API"
    }
  ];

  return (
    <section id="testimonials" className="py-28 bg-gray-50/50 dark:bg-bg-main/50 border-b border-gray-50 dark:border-gray-850/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            06_Testimonials & Love
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight">
            Loved by merchants in <span className="text-green-600">Nigeria.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl">
            See how vendors across Lagos, Abuja, and Port Harcourt leverage Kasi's automated direct-selling agent to double conversions and free up precious hours.
          </p>
        </div>

        {/* Masonry Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative hover:scale-[1.01]"
            >
              {/* Quote icon ornament */}
              <div className="absolute top-6 right-8 text-gray-100 dark:text-gray-805 select-none pointer-events-none">
                <Quote size={40} className="fill-current" />
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>

              <blockquote className="text-xs text-gray-500 dark:text-gray-300 font-semibold leading-relaxed relative z-10">
                "{t.quote}"
              </blockquote>

              <div className="border-t border-gray-50 dark:border-gray-850 pt-4 flex justify-between items-end">
                <div className="space-y-0.5">
                   <cite className="text-xs font-bold text-gray-900 dark:text-white not-italic block font-bricolage">{t.name}</cite>
                  <span className="text-[9px] text-gray-400 font-bold block font-prompt">{t.role}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[8px] font-black tracking-wider uppercase rounded-full font-prompt">
                    {t.platform}
                  </span>
                  <span className="text-[8px] text-gray-400 font-bold block font-prompt">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small MessageSquare/Trust badge below */}
        <div className="flex items-center justify-center gap-2 mt-16 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest select-none font-prompt">
          <MessageSquare size={14} className="text-green-500 animate-pulse" />
          <span>Kasi helps automate 5,000+ DMs weekly</span>
        </div>

      </div>
    </section>
  );
};
