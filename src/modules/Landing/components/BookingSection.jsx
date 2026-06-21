import React from 'react';
import { Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export const BookingSection = () => {
  return (
    <section id="bookings" className="w-full py-[100px] bg-[#F5F5F0] border-b-[1.5px] border-[#0A0A0A] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Main Grid: Phone Mockup Left | Text Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Phone Mockup Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-[#1A7A4A] rounded-2xl flex items-center justify-center p-8 border-[1.5px] border-black shadow-[6px_6px_0px_#0A0A0A] overflow-visible">
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none rounded-2xl" />
              
              {/* Browser Mockup */}
              <div className="relative w-full bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#0A0A0A] overflow-hidden flex flex-col transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Browser Header */}
                <div className="bg-[#F5F5F0] border-b-[2px] border-black px-4 py-2 flex items-center justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/35" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/35" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/35" />
                  </div>
                  <div className="bg-white border border-black rounded-md px-4 py-0.5 text-[9px] font-bold text-grey-500 font-sans tracking-wide">
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
              <div className="absolute -bottom-10 -left-6 w-[150px] h-[280px] bg-white rounded-[24px] border-[3px] border-black shadow-[4px_4px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[4deg] hover:rotate-0 transition-transform duration-500 z-20 select-none">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-black rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/booking.jpeg" 
                  alt="Kasi AI Booking Mobile View" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
              </div>

              {/* Floating Props */}
              {/* 1. Calendar Widget */}
              <div className="absolute -top-6 -left-6 bg-white border-[1.5px] border-black rounded-xl p-3 shadow-[4px_4px_0px_#0A0A0A] flex flex-col items-center z-20 transform -rotate-[4deg] w-24">
                <div className="bg-[#1A7A4A] text-[#D4F263] text-[8px] font-black py-0.5 px-2 rounded-md border border-black uppercase tracking-wider mb-1.5">
                  May
                </div>
                <span className="text-2xl font-black text-black font-bricolage leading-none">22</span>
                <span className="text-[8px] font-bold text-grey-500 mt-1">Thursday</span>
              </div>

              {/* 2. Clock Reminder Widget */}
              <div className="absolute top-[40%] -right-8 bg-white border-[1.5px] border-black rounded-full p-2.5 shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center z-20 animate-spin" style={{ animationDuration: '20s' }}>
                <Clock size={20} className="text-[#1A7A4A]" />
              </div>

              {/* 3. Deposit Badge */}
              <div className="absolute -bottom-6 -right-2 bg-[#D4F263] border-[1.5px] border-black rounded-lg py-2 px-3 shadow-[4px_4px_0px_#0A0A0A] text-left text-[10px] font-black text-black z-20 transform rotate-[3deg] flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#1A7A4A]" />
                <span>₦5,000 deposit confirmed</span>
              </div>

            </div>
          </div>

          {/* Right Column — Text & Section Headers */}
          <div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2">
            <div className="flex flex-col gap-1.5 items-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EE] border-[1.5px] border-[#1A7A4A] text-[#1A7A4A] text-xs font-black uppercase tracking-wider rounded-full">
                <span>07_BOOKINGS & SCHEDULING</span>
              </div>
              <span className="text-[10px] font-black text-grey-500 uppercase tracking-widest pl-2">
                FOR SERVICE VENDORS
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
              No more<br />
              'who booked me?'<br />
              chaos.
            </h2>
            
            <p className="text-base md:text-lg text-grey-700 max-w-xl leading-relaxed font-sans font-medium">
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
                  className="bg-[#E8F5EE] text-[#1A7A4A] border-[1.5px] border-[#1A7A4A] rounded-full px-[18px] py-[8px] text-[14px] font-semibold flex items-center gap-3 shadow-[2px_2px_0px_rgba(26,122,74,0.2)] hover:shadow-[3px_3px_0px_#1A7A4A] transition-all cursor-default"
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
