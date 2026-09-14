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
    <section id="testimonials" className="py-28 bg-[#F8F9F7] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left">
          <div className="badge-section">
            06_Testimonials & Love
          </div>
          <h2 className="font-section-h2">
            Loved by merchants in <span className="text-brand">Nigeria.</span>
          </h2>
          <p className="font-body-large text-gray-600 max-w-xl font-sans">
            See how vendors across Lagos, Abuja, and Port Harcourt leverage Kasi's automated direct-selling agent to double conversions and free up precious hours.
          </p>
        </div>

        {/* Masonry Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch font-prompt">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xs hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 relative"
            >
              {/* Quote icon ornament */}
              <div className="absolute top-6 right-8 text-brand-light/60 select-none pointer-events-none">
                <Quote size={40} className="fill-current" />
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 text-amber-400 z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>

              <blockquote className="text-sm text-gray-600 font-medium leading-relaxed relative z-10 text-left font-sans">
                "{t.quote}"
              </blockquote>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                <div className="space-y-0.5 text-left">
                  <cite className="text-sm font-bold text-gray-900 not-italic block font-bricolage">{t.name}</cite>
                  <span className="text-[11px] text-gray-400 font-medium block font-sans">{t.role}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2.5 py-0.5 bg-[#E8F5EE] text-[#1A7A4A] text-[9px] font-bold tracking-wider uppercase border border-[#1A7A4A]/20 rounded-full font-sans shadow-xs">
                    {t.platform}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block font-sans mt-0.5">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small MessageSquare/Trust badge below */}
        <div className="flex items-center justify-center gap-2 mt-16 text-xs font-black text-grey-550 uppercase tracking-widest select-none font-prompt">
          <MessageSquare size={14} className="text-brand animate-pulse" />
          <span>Kasi helps automate 5,000+ DMs weekly</span>
        </div>

      </div>
    </section>
  );
};
