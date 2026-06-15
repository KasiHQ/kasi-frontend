import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const FAQS = [
    {
      q: "How exactly does Kasi's pricing work?",
      a: "Kasi offers simple, predictable pricing. You start with a free trial to explore our automation tools, and can upgrade to a flat monthly subscription tier that best fits your business. Kasi does not take a sales commission from your transactions."
    },
    {
      q: "Can I connect my own Naira bank details directly?",
      a: "Yes! You can link your Naira bank account details directly in settings. Through our Paystack integration, earnings from your customers' secure checkout links are routed straight to your linked bank account."
    },
    {
      q: "Is there support for WhatsApp Business and other social channels?",
      a: "Absolutely. You can connect your WhatsApp Business line, Telegram bot, or Instagram Direct Messages straight from the onboarding wizard in your dashboard. Our AI agent will manage customer chats on these platforms."
    },
    {
      q: "Are there transaction fees or hidden charges?",
      a: "Kasi does not charge any setup fees or sales commission on transactions. Your flat monthly subscription covers all Kasi AI features. Please note that standard payment gateway processing fees (such as Paystack processing fees) apply to transactions processed through customer checkout links."
    }
  ];

  return (
    <section id="faq" className="py-28 bg-white border-b-1.5 border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
        
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="badge-section">
            07_FAQ & Support
          </div>
          <h2 className="font-section-h2">
            Frequently asked <span className="text-brand">questions.</span>
          </h2>
          <p className="font-body-large text-grey-700 max-w-xl mx-auto mt-2">
            Everything you need to know about Kasi AI's subscription pricing, direct bank integrations, and social chat channel connections.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border-hard rounded-2xl overflow-hidden transition-all duration-300 shadow-hard hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-sm font-black text-black pl-1 flex items-center gap-2">
                    <span>{faq.q}</span>
                  </span>
                  <div className="p-1.5 rounded-lg bg-bg-subtle text-black border-hard transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Animated expandable panel */}
                <div 
                  className={clsx(
                    'transition-all duration-300 ease-in-out overflow-hidden pl-7 pr-12',
                    isOpen ? 'max-h-48 border-t-1.5 border-black py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                  )}
                >
                  <p className="text-xs text-grey-700 font-bold leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help block below */}
        <div className="bg-brand-light border-hard rounded-2xl p-6 md:p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-hard">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-accent border-hard text-black flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle size={18} />
            </div>
            <div className="space-y-0.5 text-left">
              <h4 className="text-sm font-black text-black">Still have questions?</h4>
              <p className="text-[10px] text-grey-700 font-bold leading-relaxed">We are here to help you get integrated and running smoothly.</p>
            </div>
          </div>
          <a
            href="mailto:support@usekasi.com"
            className="px-5 py-2.5 btn-primary shrink-0 select-none"
          >
            Contact Support
          </a>
        </div>

      </div>
    </section>
  );
};

