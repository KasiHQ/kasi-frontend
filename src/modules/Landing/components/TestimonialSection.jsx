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
    <section id="testimonials" className="py-28 bg-bg-subtle border-b-1.5 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left">
          <div className="badge-section">
            06_Testimonials & Love
          </div>
          <h2 className="font-section-h2">
            Loved by merchants in <span className="text-brand">Nigeria.</span>
          </h2>
          <p className="font-body-large text-grey-700 max-w-xl">
            See how vendors across Lagos, Abuja, and Port Harcourt leverage Kasi's automated direct-selling agent to double conversions and free up precious hours.
          </p>
        </div>

        {/* Masonry Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch font-prompt">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white border-hard rounded-2xl p-8 hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-300 flex flex-col justify-between space-y-6 relative shadow-hard"
            >
              {/* Quote icon ornament */}
              <div className="absolute top-6 right-8 text-brand-light select-none pointer-events-none">
                <Quote size={40} className="fill-current" />
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 text-yellow-550 z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>

              <blockquote className="text-xs text-grey-700 font-bold leading-relaxed relative z-10 text-left">
                "{t.quote}"
              </blockquote>

              <div className="border-t-1.5 border-black pt-4 flex justify-between items-end">
                <div className="space-y-0.5 text-left">
                  <cite className="text-xs font-black text-black not-italic block font-bricolage">{t.name}</cite>
                  <span className="text-[9px] text-grey-500 font-black block font-prompt">{t.role}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2.5 py-0.5 bg-brand-light text-brand text-[8px] font-black tracking-wider uppercase border border-brand rounded-full font-prompt">
                    {t.platform}
                  </span>
                  <span className="text-[8px] text-grey-500 font-black block font-prompt mt-0.5">{t.location}</span>
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
