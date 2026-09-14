import React from 'react';
import { Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export const BookingSection = () => {
  return (
    <section id="bookings" className="w-full py-[100px] bg-[#F5F5F0] border-b border-[#E5E5E5] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Main Grid: Phone Mockup Left | Text Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Phone Mockup Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-[#1A7A4A] rounded-3xl flex items-center justify-center p-8 border border-emerald-600/30 shadow-[0_20px_50px_rgba(26,122,74,0.22)] overflow-visible">
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none rounded-3xl" />
              
              {/* Browser Mockup */}
              <div className="relative w-full bg-white rounded-2xl border border-gray-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Browser Header */}
                <div className="bg-[#F8F9F7] border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-md px-4 py-0.5 text-[9px] font-bold text-gray-500 font-sans tracking-wide shadow-xs">
                    usekasi.com/bookings/schedule
                  </div>
                  <div className="w-6 h-6" /> {/* Spacer */}
                </div>
                {/* Image */}
                <img 
                  src="/images/booking-schedule-hours-desktop.png" 
                  alt="Kasi AI Calendar & Bookings Schedule" 
                  className="w-full h-auto object-cover select-none" 
                />
              </div>

              {/* Mobile Phone Mockup Overlay */}
              <div className="absolute -bottom-10 -left-6 w-[150px] h-[280px] bg-white rounded-[24px] border border-gray-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden transform rotate-[4deg] hover:rotate-0 transition-transform duration-500 z-20 select-none">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-gray-900 rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/booking.jpeg" 
                  alt="Kasi AI Booking Mobile View" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
              </div>

              {/* Floating Props */}
              {/* 1. Calendar Widget */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-3 shadow-xl flex flex-col items-center z-20 transform -rotate-[4deg] w-24">
                <div className="bg-[#1A7A4A] text-[#D4F263] text-[8px] font-black py-0.5 px-2 rounded-md uppercase tracking-wider mb-1.5 shadow-xs">
                  May
                </div>
                <span className="text-2xl font-black text-black font-bricolage leading-none">22</span>
                <span className="text-[8px] font-bold text-gray-400 mt-1">Thursday</span>
              </div>

              {/* 2. Clock Reminder Widget */}
              <div className="absolute top-[40%] -right-8 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-full p-2.5 shadow-xl flex items-center justify-center z-20 animate-spin" style={{ animationDuration: '20s' }}>
                <Clock size={20} className="text-[#1A7A4A]" />
              </div>

              {/* 3. Deposit Badge */}
              <div className="absolute -bottom-6 -right-2 bg-[#D4F263] border border-black/10 rounded-xl py-2 px-3.5 shadow-lg text-left text-[11px] font-black text-black z-20 transform rotate-[3deg] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#1A7A4A]" />
                <span>₦5,000 deposit confirmed</span>
              </div>

            </div>
          </div>

          {/* Right Column — Text & Section Headers */}
          <div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2">
            <div className="flex flex-col gap-1.5 items-start">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E8F5EE] border border-[#1A7A4A]/20 text-[#1A7A4A] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
                <span>07_BOOKINGS & SCHEDULING</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">
                FOR SERVICE VENDORS
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
              No more<br />
              'who booked me?'<br />
              chaos.
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed font-sans font-medium">
              For nail technicians, photographers, makeup artists, and barbers — Kasi manages your entire booking schedule. Customers book directly in the DM, Kasi slots them in based on your availability, collects deposits, and sends both of you reminders before every appointment.
            </p>

            {/* 4 Feature Badges (Flex wrap) */}
            <div className="flex flex-wrap gap-3 pt-4 max-w-xl">
              {[
                "📅 DM-based booking",
                "💳 Deposit collection",
                "🔔 Auto-reminders",
                "📆 Google Calendar sync"
              ].map((badge, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#E8F5EE] text-[#1A7A4A] border border-[#1A7A4A]/30 rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-xs hover:shadow-sm transition-all cursor-default"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
