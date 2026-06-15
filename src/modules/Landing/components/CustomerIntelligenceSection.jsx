import React from 'react';
import { Database, MessageSquare, Award, ArrowUpRight } from 'lucide-react';

export const CustomerIntelligenceSection = () => {
  const segments = [
    {
      dotColor: '#1A7A4A',
      label: 'Purchased',
      count: '1,240',
      sub: 'Ready for reorder nudge'
    },
    {
      dotColor: '#F5A623',
      label: 'Hot Leads',
      count: '380',
      sub: 'Dropped off at payment'
    },
    {
      dotColor: '#9B9B9B',
      label: 'Cold Leads',
      count: '2,110',
      sub: 'Said hi, never ordered'
    }
  ];

  const rows = [
    {
      handle: '@tunde_styles',
      platform: 'WhatsApp',
      status: 'Purchased',
      statusColor: 'bg-[#E8F5EE] text-[#1A7A4A] border-[#1A7A4A]',
      dotColor: '#1A7A4A',
      lastContact: '2 hours ago'
    },
    {
      handle: '@kemi.o',
      platform: 'Instagram',
      status: 'Hot Lead',
      statusColor: 'bg-[#FFF3E0] text-[#E65100] border-[#F5A623]',
      dotColor: '#F5A623',
      lastContact: 'Yesterday'
    },
    {
      handle: '@bolaji_duro',
      platform: 'Telegram',
      status: 'Cold Lead',
      statusColor: 'bg-[#F5F5F5] text-[#616161] border-[#9B9B9B]',
      dotColor: '#9B9B9B',
      lastContact: '3 days ago'
    }
  ];

  return (
    <section id="customer-intelligence" className="w-full py-[100px] bg-white border-b-[1.5px] border-[#0A0A0A] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Main Grid Layout: Text & Cards Left | CRM Table Mockup Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Text & Segment Cards */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="flex flex-col gap-1.5 items-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EE] border-[1.5px] border-[#1A7A4A] text-[#1A7A4A] text-xs font-black uppercase tracking-wider rounded-full">
                <span>08_CUSTOMER INTELLIGENCE</span>
              </div>
              <span className="text-[10px] font-black text-grey-550 uppercase tracking-widest pl-2">
                GROWTH & PREMIUM PLANS
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
                Know your customers.<br />
                Win them back.
              </h2>
              
              <p className="text-base md:text-lg text-grey-700 max-w-xl leading-relaxed font-sans font-medium">
                Kasi builds a database of every person who has ever contacted your store — those who bought, those who nearly bought, and those who just said hi. Retarget them all. Send broadcast messages, offer discounts, and bring them back with a single tap.
              </p>
            </div>

            {/* Segment Cards stack */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {segments.map((seg, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border-[1.5px] border-[#E5E5E5] rounded-xl p-5 text-left flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:border-black hover:shadow-[3px_3px_0px_#0A0A0A]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" 
                      style={{ backgroundColor: seg.dotColor }}
                    />
                    <span className="text-[13px] font-black text-[#0A0A0A] uppercase tracking-wide">
                      {seg.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl md:text-3.5xl font-black text-[#0A0A0A] block leading-none font-bricolage mb-1">
                      {seg.count}
                    </span>
                    <span className="text-[11px] text-grey-550 font-bold leading-tight block">
                      {seg.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — CRM Laptop / Desktop Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
                   {/* Browser Mockup */}
            <div className="w-full max-w-[540px] bg-white border-[2.5px] border-black rounded-2xl shadow-[6px_6px_0px_#0A0A0A] overflow-hidden flex flex-col transform rotate-[1.5deg] hover:rotate-0 transition-transform duration-500 z-10">
              {/* Browser Header */}
              <div className="bg-[#F5F5F0] border-b-[2px] border-black px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/35" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/35" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/35" />
                </div>
                <div className="bg-white border border-black rounded-md px-4 py-0.5 text-[9px] font-bold text-grey-500 font-sans tracking-wide">
                  usekasi.com/analytics
                </div>
                <div className="w-6 h-6" /> {/* Spacer */}
              </div>
              {/* Image */}
              <img 
                src="/images/analytics-dashboard-desktop.png" 
                alt="Kasi AI Analytics Dashboard" 
                className="w-full h-auto object-cover select-none" 
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
