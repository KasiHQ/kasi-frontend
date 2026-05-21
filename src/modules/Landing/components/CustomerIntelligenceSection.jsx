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
            
            {/* Desktop Dashboard Mockup */}
            <div className="w-full max-w-[540px] bg-white border-[1.5px] border-[#0A0A0A] rounded-2xl shadow-[6px_6px_0px_#0A0A0A] overflow-hidden select-none">
              
              {/* Window Header */}
              <div className="bg-[#F5F5F0] border-b-[1.5px] border-black px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/30" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/30" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/30" />
                </div>
                <span className="text-[10px] font-black text-grey-500 uppercase tracking-widest">
                  KASI CUSTOMER MANAGER
                </span>
                <span className="w-4 h-4" /> {/* Spacer */}
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-white border-b-[1.5px] border-black">
                      <th className="px-4 py-3 text-[10px] font-black text-grey-500 uppercase tracking-wider">Handle</th>
                      <th className="px-4 py-3 text-[10px] font-black text-grey-500 uppercase tracking-wider">Platform</th>
                      <th className="px-4 py-3 text-[10px] font-black text-grey-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-[10px] font-black text-grey-500 uppercase tracking-wider">Last Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] bg-white">
                    {rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F5F0]/40 transition-colors">
                        <td className="px-4 py-4 font-black text-[#0A0A0A]">{row.handle}</td>
                        <td className="px-4 py-4 font-semibold text-grey-600">{row.platform}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase rounded-full border ${row.statusColor}`}>
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: row.dotColor }}
                            />
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-grey-500 font-bold">{row.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CRM Footer controls */}
              <div className="bg-[#F5F5F0]/50 border-t border-[#E5E5E5] px-4 py-3.5 flex justify-between items-center text-xs font-bold text-grey-700">
                <div className="flex items-center gap-1">
                  <Database size={13} className="text-[#1A7A4A]" />
                  <span>3,730 profiles synced</span>
                </div>
                <div className="flex items-center gap-1 text-[#1A7A4A] cursor-pointer hover:underline">
                  <span>Send retargeting nudge</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
