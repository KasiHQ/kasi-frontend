import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, MessageSquare, Send, Check } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section id="hero" className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-green-50/10 via-white to-white dark:from-bg-main dark:via-bg-main dark:to-bg-main">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-green-200/10 dark:bg-green-950/5 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/10 dark:bg-emerald-950/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Heading and copy */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <h1 className="text-[40px] max-md:leading-10 md:text-5xl lg:text-6xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-[1.08] max-w-xl">
              AI-Powered <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Direct Sales</span> <br />
              From DMs to Paid fast.
            </h1>

            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-md leading-relaxed font-medium font-prompt">
              Simply connect your social chat accounts (WhatsApp, Instagram, Telegram) and let Kasi handle active customer inquiries, negotiate pricing with floor-limits, schedule bookings, and generate invoices automatically 24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 font-prompt">
              <Link
                to="/signup"
                className="px-7 py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full font-bold text-sm shadow-xl shadow-gray-900/10 dark:shadow-white/5 transition-all hover:scale-103 active:scale-97 flex items-center justify-center gap-2 group"
              >
                <span>Get Kasi for Free</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#dms"
                className="px-6 py-3.5 bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800/80 hover:bg-gray-55 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play size={14} className="fill-current text-gray-400 dark:text-gray-500" />
                <span>Explore Features</span>
              </a>
            </div>

            {/* Key Trust Badges */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 dark:border-gray-800/80 pt-8 max-w-md font-prompt">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">10x</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">Faster Replies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">Direct Paid</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₦0</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">Gateway Fee</div>
              </div>
            </div>
          </div>

          {/* Right Column: Beautiful background card & 3D interactive CSS phone mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
            {/* Ambient Background Plate matching Image 1 */}
            <div className="relative w-full max-w-[440px] aspect-square bg-[#00B05C] rounded-[48px] shadow-2xl p-8 flex items-center justify-center overflow-visible group hover:scale-[1.01] transition-transform duration-500">
              {/* White dot grid pattern overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none rounded-[48px]" />
              
              {/* Phone Mockup Frame (Image 1 Style - White border & white screens) */}
              <div className="relative w-[260px] h-[480px] bg-white rounded-[42px] border-4 border-[#131b26] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden select-none transform rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500 z-10">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-800/60 ml-auto mr-4" />
                </div>

                {/* Status Bar */}
                <div className="h-8 bg-white border-b border-gray-100 px-6 pt-3 flex justify-between items-center z-20 text-[9px] font-bold text-gray-400 select-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-4.5 h-2.5 border border-gray-300 rounded-sm p-0.5 flex items-center">
                      <div className="h-full w-2.5 bg-gray-400 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Chat App Header */}
                <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2.5 z-20">
                  {/* Clean Kasi Circular Icon (No Sparkle or Star) */}
                  <div className="w-8 h-8 rounded-full bg-[#00B05C] flex items-center justify-center shadow-inner shrink-0">
                    <div className="w-3.5 h-3.5 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-[11px] font-bold text-gray-900 leading-none flex items-center gap-1 font-prompt">
                      <span>Kasi AI</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </h3>
                    <p className="text-[8px] font-semibold text-green-600 mt-0.5 font-prompt">Automated Sales Assistant</p>
                  </div>
                </div>

                {/* Chat Stream Body */}
                <div className="flex-1 bg-white p-3 flex flex-col gap-2 overflow-y-auto no-scrollbar scroll-smooth">
                  {/* Message Bubble: Customer/Merchant inquiry */}
                  <div className="self-end max-w-[85%] bg-[#131b26] text-white px-4 py-3 rounded-3xl rounded-tr-none text-[10px] font-semibold leading-relaxed shadow-sm font-prompt text-left">
                    Hey there! How much for 2 packs of Bitter Kola?
                  </div>
                </div>

                {/* Input simulator */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-150 rounded-full px-4 py-2 text-[8px] text-gray-400 font-semibold flex items-center text-left">
                    Ask Kasi about your order...
                  </div>
                  <button className="w-6.5 h-6.5 rounded-full bg-[#00B05C] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current transform rotate-45 -translate-x-0.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Floating stickers / components around the phone mockup as requested in design */}
              
              {/* Sticker 1: Yellow Coin with Naira symbol */}
              <div className="absolute top-[8%] left-[-8%] w-12 h-12 bg-[#FFCC00] rounded-full flex items-center justify-center font-bold text-white shadow-xl text-xl select-none border-2 border-white/20 animate-bounce">
                ₦
              </div>

              {/* Sticker 2: 100% Autonomous Pill */}
              <div className="absolute top-[16%] right-[-10%] bg-white border border-gray-100 rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-center transform rotate-6 z-20 select-none pointer-events-none hover:scale-105 transition-transform duration-300">
                <span className="text-[10px] font-bold text-gray-900 font-prompt">100% Autonomous</span>
              </div>

              {/* Sticker 3: Sale Confirmed Card */}
              <div className="absolute bottom-[8%] left-[-12%] bg-white border border-gray-100 rounded-3xl p-3.5 shadow-2xl flex items-center gap-3.5 select-none pointer-events-none transform -rotate-[5deg] z-20 hover:scale-105 transition-transform duration-300 text-left">
                <div className="w-8 h-8 rounded-xl bg-green-50/80 border border-green-100 text-[#00B05C] flex items-center justify-center shrink-0">
                  <MessageSquare size={14} className="fill-current text-green-500/10" />
                </div>
                <div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Sale Confirmed</div>
                  <div className="text-[11px] font-black text-gray-900 leading-none mt-0.5 font-prompt">₦2,100.00</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
