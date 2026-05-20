import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const FAQS = [
    {
      q: "How exactly does the Credit System work?",
      a: "Kasi uses success-based credits. Load your account with tokens (e.g. 50 Credits for ₦1,000, which works out to just ₦20 per successfully closed sale). Answering customer questions, AI haggling, and catalog browsing inside DMs are 100% free. Credits are ONLY deducted when Kasi closes the deal and delivers a paid invoice."
    },
    {
      q: "Can I connect my own Naira bank details directly?",
      a: "Yes! You do not need expensive payment gateways. You can configure Kasi to display your direct GTBank, Zenith, or Access bank details. Kasi creates invoice PDFs showing your account, and uses secure bank callback checks to verify when transfers clear."
    },
    {
      q: "Is there support for WhatsApp Business and Instagram DMs?",
      a: "Absolutely. You can link your WhatsApp Business line, Telegram bot, or Instagram comments panel straight from the onboarding wizard in your dashboard in under 5 minutes."
    },
    {
      q: "Do you charge setup fees or custom onboarding expenses?",
      a: "No. Creating your Kasi account and setting up integrations is completely free. We do not charge setup fees or recurring monthly subscription rates. You only purchase credits when you are ready to automate your orders."
    }
  ];

  return (
    <section id="faq" className="py-28 bg-white dark:bg-bg-main border-b border-gray-50 dark:border-gray-850/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            07_FAQ & Support
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight">
            Frequently asked <span className="text-green-600">questions.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl mx-auto">
            Everything you need to know about Kasi AI's credit features, direct bank integrations, and social chat channel connections.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-gray-50/50 dark:bg-bg-surface/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white pl-1 flex items-center gap-2">
                    <span>{faq.q}</span>
                  </span>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-bg-main text-gray-400 hover:text-gray-950 dark:hover:text-white border border-gray-100 dark:border-gray-800/80 transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Animated expandable panel */}
                <div 
                  className={clsx(
                    'transition-all duration-300 ease-in-out overflow-hidden pl-7 pr-12',
                    isOpen ? 'max-h-48 border-t border-gray-50 dark:border-gray-850 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                  )}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help block below */}
        <div className="bg-green-500/5 border border-green-500/10 rounded-[32px] p-6 md:p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xs transition-shadow">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 shadow-2xs">
              <MessageCircle size={18} />
            </div>
            <div className="space-y-0.5 text-left">
              <h4 className="text-sm font-extrabold text-gray-950 dark:text-white">Still have questions?</h4>
              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">We are here to help you get integrated and running smoothly.</p>
            </div>
          </div>
          <a
            href="mailto:support@usekasi.com"
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-50 text-white dark:text-gray-900 rounded-full font-bold text-xs shadow-md transition-all hover:scale-101 active:scale-99 shrink-0"
          >
            Contact Support
          </a>
        </div>

      </div>
    </section>
  );
};
