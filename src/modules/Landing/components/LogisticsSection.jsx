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
    <section id="logistics" className="py-24 bg-[#F5F5F0] border-b-1.5 border-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
        
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          
          {/* Left Column: Phone Mockup Panel */}
          <div className="lg:col-span-6 flex justify-center relative select-none order-last lg:order-first">
            
            {/* Floating Prop 1: Delivery Box */}
            <div className="absolute top-8 left-4 md:left-12 z-20 bg-[#D4F263] text-black border-hard p-3.5 rounded-2xl shadow-hard text-xl md:text-2xl animate-bounce">
              📦
            </div>

            {/* Floating Prop 2: Map Pin Circle Badge */}
            <div className="absolute bottom-12 right-4 md:right-12 z-20 bg-white text-black border-hard p-3 rounded-full shadow-hard text-xl md:text-2xl animate-pulse">
              📍
            </div>

            {/* Brand Green Mockup Container */}
            <div className="w-full max-w-[380px] bg-[#1A7A4A] border-hard rounded-[40px] p-6 shadow-hard relative overflow-hidden flex flex-col items-center">
              
              {/* Speaker & Notch */}
              <div className="w-32 h-4 bg-black/85 rounded-full mb-6 flex items-center justify-center border-b border-white/10">
                <span className="w-12 h-1 bg-white/20 rounded-full inline-block mr-2" />
                <span className="w-2 h-2 bg-white/20 rounded-full inline-block" />
              </div>

              {/* Phone screen */}
              <div className="w-full bg-white border-hard rounded-3xl p-4 flex flex-col h-[400px] justify-between relative overflow-hidden font-prompt">
                
                {/* Chat Header / App Dashboard Header */}
                <div className="flex items-center justify-between border-b-1.5 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#1A7A4A] border border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
                      <Truck size={14} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-black">Kasi Dispatch Hub</div>
                      <div className="text-[9px] text-grey-550 font-bold">Fulfillment Autopilot</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#D4F263] border border-black text-[8px] font-black rounded-md text-black">
                    LIVE
                  </span>
                </div>

                {/* Dashboard Body */}
                <div className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto scrollbar-hide text-left">
                  
                  {/* Order Card */}
                  <div className="bg-[#F5F5F0] border-hard rounded-2xl p-3.5 shadow-[2px_2px_0px_#0A0A0A]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-black uppercase">Order #KASI-8920</span>
                      <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black rounded-full">
                        ₦12,500 Paid
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-black text-black">Zobo Tonic Pack (x3)</div>
                      <div className="text-[9px] text-grey-700 font-bold">Deliver to: 14 Joel Ogunnaike, Ikeja GRA, Lagos</div>
                    </div>
                  </div>

                  {/* Status Logs Badges */}
                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-black uppercase tracking-wider pl-1">
                      Fulfillment Roadmap
                    </div>
                    
                    {/* Badge List */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-black bg-brand-light px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[1px_1px_0px_#000]">
                        <div className="w-2 h-2 rounded-full bg-[#1A7A4A] shrink-0" />
                        <span className="text-[10px] font-black text-black">Paid</span>
                      </div>

                      <div className="border border-black bg-[#D4F263] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[1px_1px_0px_#000]">
                        <div className="w-2 h-2 rounded-full bg-black shrink-0 animate-ping" />
                        <span className="text-[10px] font-black text-black">In Progress</span>
                      </div>

                      <div className="border border-black bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[1px_1px_0px_#000] opacity-60">
                        <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                        <span className="text-[10px] font-black text-black">In Transit</span>
                      </div>

                      <div className="border border-black bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[1px_1px_0px_#000] opacity-60">
                        <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                        <span className="text-[10px] font-black text-black">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Dispatch Tracker */}
                  <div className="border-t border-dashed border-black pt-3">
                    <div className="flex justify-between text-[9px] font-bold text-grey-700">
                      <span>Logistics Engine:</span>
                      <span className="font-black text-[#1A7A4A] uppercase">Kasi Rate Sheet Engine</span>
                    </div>
                  </div>

                </div>

                {/* Secure Lock Badge */}
                <div className="bg-[#0A0A0A] border-hard rounded-xl p-2.5 text-center flex items-center justify-center gap-2">
                  <Truck size={12} className="text-[#D4F263]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-wider">
                    Delivery Fee Auto-Calculated 🚀
                  </span>
                </div>

              </div>

              {/* Home indicator */}
              <div className="w-24 h-1 bg-white/20 rounded-full mt-4" />
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
              <p className="font-body-large text-grey-700 max-w-xl">
                Kasi manages the complete customer journey — first message, product discovery, price negotiation, payment, address collection, logistics coordination, delivery update, and post-sale review.
              </p>
              <p className="font-body-normal text-grey-700 max-w-xl">
                You focus on your product. Kasi handles everything else.
              </p>
            </div>
          </div>

        </div>

        {/* Workflow Timeline (Horizontal on desktop, Vertical on mobile) */}
        <div className="border-t border-black pt-16">
          <h3 className="text-lg font-black text-black uppercase tracking-wider mb-10 text-left">
            The Complete Commerce Loop
          </h3>
          
          {/* Desktop Timeline: horizontal flex row */}
          <div className="hidden md:flex items-stretch justify-between relative pl-4 pr-4">
            
            {/* Connecting background line */}
            <div className="absolute top-[20px] left-[5%] right-[5%] h-0.5 bg-[#E5E5E5] z-0" />
            
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10">
                {/* Circle */}
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${
                  step.active 
                    ? 'bg-[#1A7A4A] border-[#1A7A4A] text-white shadow-[2px_2px_0px_#0A0A0A]' 
                    : step.num < 6
                      ? 'bg-[#E8F5EE] border-[#1A7A4A] text-[#1A7A4A]'
                      : 'bg-white border-[#E5E5E5] text-[#3D3D3D]'
                }`}>
                  {step.num < 6 ? <Check size={14} className="stroke-[3]" /> : step.num}
                </div>
                {/* Label */}
                <span className={`mt-4 text-[12px] font-semibold leading-tight max-w-[100px] text-center ${
                  step.active ? 'text-black font-black' : 'text-[#3D3D3D]'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Timeline: vertical stacked list */}
          <div className="flex md:hidden flex-col gap-6 pl-2 relative">
            {/* Vertical connector line */}
            <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-[#E5E5E5] z-0" />

            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 relative z-10 text-left">
                {/* Circle */}
                <div className={`w-10 h-10 rounded-full border-2 shrink-0 flex items-center justify-center font-bold text-[14px] ${
                  step.active
                    ? 'bg-[#1A7A4A] border-[#1A7A4A] text-white shadow-[2px_2px_0px_#0A0A0A]'
                    : step.num < 6
                      ? 'bg-[#E8F5EE] border-[#1A7A4A] text-[#1A7A4A]'
                      : 'bg-white border-[#E5E5E5] text-[#3D3D3D]'
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

