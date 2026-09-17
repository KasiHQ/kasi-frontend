import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { PRELAUNCH_WAITLIST_MODE } from "../../../config";

export const HeroSection = ({ onJoinWaitlistClick }) => {
  const handleWatchDemoClick = () => {
    const element = document.getElementById("explainer-video-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Dispatch custom event to trigger play & unmute on the inline player
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("play-explainer-video"));
      }, 500);
    }
  };

  return (
    <section
      id="hero"
      className="w-full pt-[160px] pb-[80px] bg-white overflow-hidden relative"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN — 50% (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {PRELAUNCH_WAITLIST_MODE && (
              <div className="space-y-4 pb-2 animate-in fade-in slide-in-from-top duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4F263] text-black text-[11px] font-black uppercase tracking-wider rounded-xl shadow-sm">
                  Launching June 12, 2026
                </div>
                <div>
                  <CountdownTimer />
                </div>
              </div>
            )}



            {/* H1 headline */}
            <div>
              <h1 className="text-4xl md:text-5.5xl lg:text-[58px] font-black tracking-tight leading-[1.06] text-[#0A0A0A] font-bricolage select-none">
                From First DM to Paid & Delivered.
                <span className="block text-[#1A7A4A] mt-1">100% Autonomously.</span>
              </h1>
            </div>

            {/* Body text */}
            <p className="text-base md:text-[17px] text-gray-600 max-w-[500px] leading-relaxed font-sans font-medium">
              Kasi is your AI sales and support employee on WhatsApp, Instagram, and Telegram. It handles the full customer journey — answers, negotiates, verifies payment, coordinates delivery — so you grow revenue without a support team.
            </p>

            {/* CTA Row */}
            <div className="flex flex-row items-center gap-4 pt-2 font-sans select-none">
              {PRELAUNCH_WAITLIST_MODE ? (
                <button
                  onClick={onJoinWaitlistClick}
                  className="text-[15px] font-bold text-white bg-[#1A7A4A] hover:bg-[#15603A] px-6 py-3.5 rounded-xl active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  Join Beta Waitlist →
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="text-[15px] font-bold text-white bg-black px-6 py-3.5 rounded-xl hover:bg-neutral-800 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  Get Started Free →
                </Link>
              )}
              <button
                onClick={handleWatchDemoClick}
                className="text-[15px] font-bold text-gray-800 border border-gray-200 bg-white hover:bg-gray-50 px-6 py-3.5 rounded-xl active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={14} className="fill-current text-[#1A7A4A]" />
                Watch Demo
              </button>
            </div>

            {/* Trust Stats Row */}
            <div className="flex items-center gap-6 sm:gap-8 pt-6 max-w-lg select-none border-t border-gray-100">
              {/* Stat 1 */}
              <div className="space-y-1 text-left">
                <div className="text-[28px] md:text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  10×
                </div>
                <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase font-sans">
                  Faster DM Replies
                </div>
              </div>

              {/* Divider */}
              <div className="h-9 w-px bg-gray-200" />

              {/* Stat 2 */}
              <div className="space-y-1 text-left">
                <div className="text-[28px] md:text-[32px] font-black text-[#1A7A4A] leading-none font-bricolage">
                  100%
                </div>
                <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase font-sans">
                  Margin Protection
                </div>
              </div>

              {/* Divider */}
              <div className="h-9 w-px bg-gray-200" />

              {/* Stat 3 */}
              <div className="space-y-1 text-left">
                <div className="text-[28px] md:text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  24/7
                </div>
                <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase font-sans">
                  Always-On Sales
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — 50% (lg:col-span-6) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-10 lg:mt-0 select-none">
            {/* Green Panel wrapper */}
            <div className="relative w-full max-w-[520px] h-[560px] bg-[#1A7A4A] rounded-3xl p-8 flex items-center justify-center overflow-visible shadow-[0_20px_50px_rgba(26,122,74,0.22)] border border-emerald-600/30">
              {/* White dot grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none rounded-3xl" />

              {/* Browser Mockup */}
              <div className="relative w-full bg-white rounded-2xl border border-gray-100 shadow-[0_16px_40px_rgba(0,0,0,0.16)] overflow-hidden flex flex-col transform rotate-[2deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Browser Header */}
                <div className="bg-[#F8F9F7] border-b border-gray-200/80 px-4 py-2.5 flex items-center justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-md px-4 py-0.5 text-[9px] font-bold text-gray-500 font-sans tracking-wide shadow-xs">
                    usekasi.com/dashboard
                  </div>
                  <div className="w-6 h-6" /> {/* Spacer */}
                </div>
                {/* Image */}
                <img 
                  src="/images/hero-dashboard-desktop.png" 
                  alt="Kasi AI Dashboard Overview" 
                  className="w-full h-auto object-cover select-none" 
                />
              </div>

              {/* Mobile Phone Mockup Overlay */}
              <div className="absolute -bottom-10 -right-8 w-[160px] h-[300px] bg-white rounded-[28px] border border-gray-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden transform rotate-[-4deg] hover:rotate-0 transition-transform duration-500 z-20 select-none">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-gray-900 rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/images/hero-dashboard-mobile.jpg" 
                  alt="Kasi AI Dashboard Mobile View" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
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
                  className="drop-shadow-md"
                >
                  <ellipse
                    cx="30"
                    cy="33"
                    rx="24"
                    ry="19"
                    fill="#D97706"
                  />
                  <ellipse
                    cx="30"
                    cy="29"
                    rx="24"
                    ry="19"
                    fill="#FBBF24"
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
              <div className="absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-3 shadow-xl flex items-center gap-3 z-20 transform -rotate-[2deg]">
                <div className="w-8 h-8 rounded-xl bg-[#D4F263]/30 border border-[#D4F263]/80 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-[#1A7A4A]"
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
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Sale Confirmed
                  </div>
                  <div className="text-xs font-black text-gray-900 leading-none mt-1 font-bricolage">
                    ₦2,100.00
                  </div>
                </div>
              </div>

              {/* 3. Green checkmark badge — top-right of panel */}
              <div className="absolute -top-4 -right-4 bg-[#D4F263] border border-black/10 rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-20">
                <svg
                  className="w-6 h-6 text-[#1A7A4A]"
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
              <div className="absolute -top-12 right-12 bg-white border border-gray-100 p-2.5 w-24 rounded-xl shadow-xl z-10 transform rotate-[15deg] text-black text-[7.5px] font-mono leading-tight text-left">
                <div className="text-center font-bold border-b border-dashed border-gray-200 pb-1 mb-1 text-gray-600">
                  RECEIPT
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Fried Rice</span>
                  <span>Suya</span>
                  <span>x2</span>
                </div>
                <div className="flex justify-between mb-1 font-bold">
                  <span>Total</span>
                  <span>₦8,000</span>
                </div>
                <div className="text-center bg-[#E8F5EE] text-[#1A7A4A] py-0.5 rounded-[4px] font-bold text-[6.5px] uppercase">
                  PAID
                </div>
              </div>

              {/* 5. "100% Autonomous" badge floating top-right of phone */}
              <div className="absolute top-[80px] right-2 bg-gray-950/90 backdrop-blur-sm text-[#D4F263] border border-white/15 rounded-full px-3 py-1 shadow-lg z-20 text-[8.5px] font-black uppercase tracking-wider transform rotate-[4deg] hover:scale-105 transition-transform duration-200">
                100% Autonomous
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
