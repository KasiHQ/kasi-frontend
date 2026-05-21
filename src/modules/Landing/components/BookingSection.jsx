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
              
              {/* Phone Screen Mockup */}
              <div className="w-[210px] h-[370px] bg-white rounded-[24px] border-[3px] border-black shadow-[3px_3px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 z-10 font-sans text-left">
                {/* Screen Header */}
                <div className="bg-white border-b-[1.5px] border-black px-4 py-2.5 flex justify-between items-center shrink-0">
                  <span className="text-[10px] font-black text-black font-bricolage">Today's Bookings</span>
                  <span className="text-[7.5px] font-bold text-white bg-[#1A7A4A] border border-black px-1.5 py-0.2 rounded-full uppercase leading-none">Live</span>
                </div>

                {/* Calendar list simulator */}
                <div className="flex-1 bg-white p-3.5 flex flex-col gap-2.5 overflow-y-auto">
                  {/* Calendar Mini Bar */}
                  <div className="flex justify-between items-center bg-[#F5F5F0] border border-black rounded-lg p-1.5 shrink-0">
                    {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                      <div key={i} className={`flex flex-col items-center justify-center w-6 h-8 rounded-md ${i === 2 ? 'bg-[#1A7A4A] text-white border border-black shadow-[1px_1px_0px_#000]' : 'text-grey-500'}`}>
                        <span className="text-[7px] font-black">{day}</span>
                        <span className="text-[9px] font-black leading-none mt-0.5">{20 + i}</span>
                      </div>
                    ))}
                  </div>

                  {/* Scheduled Slots */}
                  <div className="space-y-2 flex-1">
                    <span className="text-[8px] font-black text-grey-500 uppercase tracking-widest block">Confirmed Slots</span>
                    
                    {/* Slot 1 */}
                    <div className="bg-white border border-black rounded-lg p-2 flex flex-col gap-1 shadow-[1.5px_1.5px_0px_#000] relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-black">Skin Fade & Trim</span>
                        <span className="text-[7px] font-bold text-[#1A7A4A] bg-[#E8F5EE] border border-[#1A7A4A] px-1 rounded-full">Paid</span>
                      </div>
                      <div className="flex justify-between text-[7px] text-grey-500 font-bold">
                        <span>10:00 AM - 10:45 AM</span>
                        <span>Tobi Adebayo</span>
                      </div>
                    </div>

                    {/* Slot 2 */}
                    <div className="bg-white border border-black rounded-lg p-2 flex flex-col gap-1 shadow-[1.5px_1.5px_0px_#000]">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-black">Bridal Makeup Session</span>
                        <span className="text-[7px] font-bold text-[#1A7A4A] bg-[#E8F5EE] border border-[#1A7A4A] px-1 rounded-full">Paid</span>
                      </div>
                      <div className="flex justify-between text-[7px] text-grey-500 font-bold">
                        <span>12:15 PM - 1:45 PM</span>
                        <span>Chioma Okafor</span>
                      </div>
                    </div>

                    {/* Slot 3 */}
                    <div className="bg-[#F5F5F0] border border-dashed border-grey-450 rounded-lg p-2 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-grey-500">2 Empty Slots Available</span>
                    </div>
                  </div>
                </div>
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
