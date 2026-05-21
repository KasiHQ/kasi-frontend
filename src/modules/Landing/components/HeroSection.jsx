import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="w-full pt-[160px] pb-[80px] bg-white overflow-hidden relative"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN — 50% (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* H1 headline (3 lines) */}
            <h1 className="text-4xl md:text-5.5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[#0A0A0A] font-bricolage select-none">
              <span className="block text-[#0A0A0A]">AI-Powered</span>
              <span className="block text-[#1A7A4A] mt-1">Direct Sales</span>
              <span className="block text-[#0A0A0A] mt-1">
                From DMs to Paid fast.
              </span>
            </h1>

            {/* Body text */}
            <p className="text-base md:text-lg text-grey-700 max-w-[480px] leading-relaxed font-sans font-medium">
              Simply connect your WhatsApp, Instagram, or Telegram. Kasi handles
              every customer inquiry, negotiates pricing, collects payment, and
              coordinates delivery — 24/7, automatically.
            </p>

            {/* CTA Row */}
            <div className="flex flex-row items-center gap-4 pt-2 font-sans select-none">
              <Link
                to="/signup"
                className="text-[15px] font-bold text-white bg-black px-6 py-3.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.15)] flex items-center gap-1 cursor-pointer"
              >
                Get Kasi for Free →
              </Link>
              <a
                href="#dms"
                className="text-[15px] font-bold text-black border-[1.5px] border-black bg-white px-6 py-3.5 rounded-full hover:bg-bg-subtle active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={14} className="fill-current text-black" />
                See how it works
              </a>
            </div>

            {/* Trust Stats Row */}
            <div className="flex items-center gap-8 pt-8 max-w-lg select-none border-t-[1.5px] border-[#E5E5E5]">
              {/* Stat 1 */}
              <div className="space-y-1 text-left">
                <div className="text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  10×
                </div>
                <div className="text-[12px] font-bold tracking-wider text-grey-500 uppercase font-sans">
                  Faster Replies
                </div>
              </div>

              {/* Divider */}
              <div className="h-10 w-[1.5px] bg-[#E5E5E5]" />

              {/* Stat 2 */}
              <div className="space-y-1 text-left">
                <div className="text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  99%
                </div>
                <div className="text-[12px] font-bold tracking-wider text-grey-500 uppercase font-sans">
                  Direct Paid
                </div>
              </div>

              {/* Divider */}
              <div className="h-10 w-[1.5px] bg-[#E5E5E5]" />

              {/* Stat 3 */}
              <div className="space-y-1 text-left">
                <div className="text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  ₦0
                </div>
                <div className="text-[12px] font-bold tracking-wider text-grey-500 uppercase font-sans">
                  Gateway Fee
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — 50% (lg:col-span-6) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-10 lg:mt-0 select-none">
            {/* Green Panel wrapper */}
            <div className="relative w-full max-w-[520px] h-[560px] bg-[#1A7A4A] rounded-[24px] p-8 flex items-center justify-center overflow-visible shadow-[8px_8px_0px_#0A0A0A] border-[1.5px] border-black">
              {/* White dot grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none rounded-[24px]" />

              {/* Phone Mockup (Rotated +4deg) */}
              <div className="relative w-[250px] h-[460px] bg-white rounded-[32px] border-[3.5px] border-black shadow-[4px_4px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[4deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center" />

                {/* Status Bar */}
                <div className="h-8 bg-white border-b border-black px-6 pt-3 flex justify-between items-center z-20 text-[9px] font-bold text-black font-sans">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-black rounded-xs p-0.5 flex items-center">
                      <div className="h-full w-2 bg-black rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Chat App Header */}
                <div className="bg-white border-b border-black px-4 py-2.5 flex items-center gap-2 z-20 text-left">
                  <div className="w-7 h-7 rounded-full bg-[#1A7A4A] border border-black flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 bg-[#D4F263] rounded-full animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black text-black leading-none flex items-center gap-1 font-bricolage">
                      Kasi AI
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </h3>
                    <p className="text-[8px] font-bold text-grey-500 mt-0.5 font-sans">
                      Autonomous Commerce Agent
                    </p>
                  </div>
                </div>

                {/* Chat Stream Body */}
                <div className="flex-1 bg-bg-subtle p-3 flex flex-col gap-3 overflow-y-auto no-scrollbar">
                  {/* Customer bubble */}
                  <div className="self-end max-w-[85%] bg-black text-white border border-black px-3.5 py-2.5 rounded-[16px] rounded-tr-none text-[9.5px] font-bold leading-normal font-sans text-left shadow-sm">
                    How much for 2 packs of Bitter Kola?
                  </div>

                  {/* Kasi automated reply */}
                  <div className="self-start max-w-[85%] bg-white text-black border border-black px-3.5 py-2.5 rounded-[16px] rounded-tl-none text-[9.5px] font-bold leading-normal font-sans text-left shadow-sm">
                    Bitter Kola is ₦1,250 a pack. Since you are ordering 2
                    packs, I can apply a bulk discount and do <b>₦2,100</b>.{" "}
                    <br />
                    <br />
                    Should I confirm this order?
                  </div>
                </div>

                {/* Input simulator */}
                <div className="p-3 bg-white border-t border-black flex items-center gap-2">
                  <div className="flex-1 bg-bg-subtle border border-black rounded-full px-3 py-1.5 text-[8.5px] text-grey-500 font-bold flex items-center text-left">
                    Ask Kasi about your order...
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#D4F263] text-black border border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#0A0A0A]">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 fill-current transform rotate-45"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* FLOATING PROPS */}

              {/* 1. Gold Naira Coin — top-left of panel, partly overlapping edge */}
              <div
                className="absolute -top-6 -left-6 z-20 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="30"
                    cy="33"
                    rx="24"
                    ry="19"
                    fill="#D97706"
                    stroke="#0A0A0A"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="30"
                    cy="29"
                    rx="24"
                    ry="19"
                    fill="#FBBF24"
                    stroke="#0A0A0A"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="30"
                    cy="29"
                    rx="18"
                    ry="13"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x="30"
                    y="35"
                    fill="#0A0A0A"
                    fontSize="20"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="Bricolage Grotesque, sans-serif"
                  >
                    ₦
                  </text>
                </svg>
              </div>

              {/* 2. Chat bubble with "SALE CONFIRMED ₦2,100" — bottom-left, below panel */}
              <div className="absolute -bottom-6 -left-8 bg-white border-[1.5px] border-black rounded-[16px] p-3 shadow-[4px_4px_0px_#0A0A0A] flex items-center gap-3 z-20 transform -rotate-[3deg]">
                <div className="w-8 h-8 rounded-lg bg-[#D4F263] border border-black flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[8px] font-black text-grey-500 uppercase tracking-widest leading-none">
                    Sale Confirmed
                  </div>
                  <div className="text-xs font-black text-black leading-none mt-1 font-bricolage">
                    ₦2,100.00
                  </div>
                </div>
              </div>

              {/* 3. Green checkmark badge — top-right of panel */}
              <div className="absolute -top-4 -right-4 bg-[#D4F263] border-[1.5px] border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A] z-20">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* 4. Receipt paper — top-right corner, rotated 15deg */}
              <div className="absolute -top-12 right-12 bg-white border-[1.5px] border-black p-2.5 w-24 rounded-lg shadow-[3px_3px_0px_#0A0A0A] z-10 transform rotate-[15deg] text-black text-[7.5px] font-mono leading-tight text-left">
                <div className="text-center font-bold border-b border-dashed border-black pb-1 mb-1">
                  RECEIPT
                </div>
                <div className="flex justify-between">
                  <span>Bitter Kola</span>
                  <span>x2</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Total</span>
                  <span>₦2,100</span>
                </div>
                <div className="text-center bg-[#E8F5EE] text-[#1A7A4A] border border-[#1A7A4A] py-0.5 rounded-[4px] font-bold text-[6.5px] uppercase">
                  PAID
                </div>
              </div>

              {/* 5. "100% Autonomous" badge floating top-right of phone */}
              <div className="absolute top-[80px] right-2 bg-[#0A0A0A] text-white border-[1.5px] border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#D4F263] z-20 text-[8.5px] font-black uppercase tracking-wider transform rotate-[6deg] hover:scale-105 transition-transform duration-200">
                100% Autonomous
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
