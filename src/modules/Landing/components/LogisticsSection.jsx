import React from 'react';
import { Truck, Check } from 'lucide-react';

export const LogisticsSection = () => {
  const steps = [
    { num: 1, label: 'First Message' },
    { num: 2, label: 'Product Discovery' },
    { num: 3, label: 'Price Negotiation' },
    { num: 4, label: 'Payment' },
    { num: 5, label: 'Address Collection' },
    { num: 6, label: 'Dispatch & Logistics', active: true },
    { num: 7, label: 'Delivery + Review' }
  ];

  return (
    <section id="logistics" className="py-24 bg-[#F5F5F0] border-b border-[#E5E5E5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
        
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          
          {/* Left Column: Phone Mockup Panel */}
          <div className="lg:col-span-6 flex justify-center relative select-none order-last lg:order-first">
            
            {/* Floating Prop 1: Delivery Box */}
            <div className="absolute top-8 left-4 md:left-12 z-20 bg-[#D4F263] text-black border border-black/10 p-3.5 rounded-2xl shadow-lg text-xl md:text-2xl animate-bounce">
              📦
            </div>

            {/* Floating Prop 2: Map Pin Circle Badge */}
            <div className="absolute bottom-12 right-4 md:right-12 z-20 bg-white/95 backdrop-blur-sm text-black border border-gray-100 p-3 rounded-full shadow-lg text-xl md:text-2xl animate-pulse">
              📍
            </div>

            {/* Brand Green Mockup Container */}
            <div className="w-full max-w-[500px] h-[460px] bg-[#1A7A4A] border border-emerald-600/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(26,122,74,0.22)] relative overflow-visible flex items-center justify-center">
              {/* White dot grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none rounded-3xl" />

              {/* Browser Mockup */}
              <div className="relative w-full bg-white rounded-2xl border border-gray-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col transform rotate-[2deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Browser Header */}
                <div className="bg-[#F8F9F7] border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                    <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-md px-4 py-0.5 text-[8px] font-bold text-gray-500 font-sans tracking-wide shadow-xs">
                    usekasi.com/logistics
                  </div>
                  <div className="w-6 h-6" /> {/* Spacer */}
                </div>
                {/* Image */}
                <img 
                  src="/logistic_desktop.png" 
                  alt="Kasi Logistics Desktop Dashboard" 
                  className="w-full h-auto object-cover select-none" 
                />
              </div>

              {/* Mobile Phone Mockup Overlay */}
              <div className="absolute -bottom-8 -right-6 w-[150px] h-[280px] bg-white rounded-[24px] border border-gray-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden transform rotate-[-4deg] hover:rotate-0 transition-transform duration-500 z-20 select-none">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-gray-900 rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/logistic_mobile.png" 
                  alt="Kasi Logistics Mobile View" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
              </div>
            </div>

          </div>

          {/* Right Column: Text & Headline */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-6">
              <div className="badge-section">
                04_LOGISTICS
              </div>
              <h2 className="font-section-h2 text-black">
                From 'Hello'<br />to delivered.
              </h2>
              <p className="font-body-large text-gray-600 max-w-xl font-sans">
                Kasi manages the complete customer journey — first message, product discovery, price negotiation, payment, address collection, logistics coordination, delivery update, and post-sale review.
              </p>
              <p className="font-body-normal text-gray-500 max-w-xl font-sans">
                You focus on your product. Kasi handles everything else.
              </p>
            </div>
          </div>

        </div>

        {/* Workflow Timeline (Horizontal on desktop, Vertical on mobile) */}
        <div className="border-t border-gray-200 pt-16">
          <h3 className="text-lg font-black text-black uppercase tracking-wider mb-10 text-left">
            The Complete Commerce Loop
          </h3>
          
          {/* Desktop Timeline: horizontal flex row */}
          <div className="hidden md:flex items-stretch justify-between relative pl-4 pr-4">
            
            {/* Connecting background line */}
            <div className="absolute top-[20px] left-[5%] right-[5%] h-0.5 bg-gray-200 z-0" />
            
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10">
                {/* Circle */}
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${
                  step.active 
                    ? 'bg-[#1A7A4A] border-[#1A7A4A] text-white shadow-md' 
                    : step.num < 6
                      ? 'bg-[#E8F5EE] border-[#1A7A4A]/40 text-[#1A7A4A]'
                      : 'bg-white border-gray-200 text-gray-500 shadow-xs'
                }`}>
                  {step.num < 6 ? <Check size={14} className="stroke-[3]" /> : step.num}
                </div>
                {/* Label */}
                <span className={`mt-4 text-[12px] font-semibold leading-tight max-w-[100px] text-center ${
                  step.active ? 'text-black font-black' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Timeline: vertical stacked list */}
          <div className="flex md:hidden flex-col gap-6 pl-2 relative">
            {/* Vertical connector line */}
            <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-gray-200 z-0" />

            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 relative z-10 text-left">
                {/* Circle */}
                <div className={`w-10 h-10 rounded-full border shrink-0 flex items-center justify-center font-bold text-[14px] ${
                  step.active
                    ? 'bg-[#1A7A4A] border-[#1A7A4A] text-white shadow-md'
                    : step.num < 6
                      ? 'bg-[#E8F5EE] border-[#1A7A4A]/40 text-[#1A7A4A]'
                      : 'bg-white border-gray-200 text-gray-500 shadow-xs'
                }`}>
                  {step.num < 6 ? <Check size={14} className="stroke-[3]" /> : step.num}
                </div>
                {/* Label */}
                <span className={`text-[13px] font-semibold ${
                  step.active ? 'text-black font-black' : 'text-[#3D3D3D]'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

