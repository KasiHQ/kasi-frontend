import React from 'react';
import { User, Check } from 'lucide-react';

export const PricingVsAgentsSection = () => {
  const rows = [
    {
      feature: 'Monthly cost',
      human: '₦50,000–₦120,000 salary',
      kasi: 'From ₦15,000/month'
    },
    {
      feature: 'Availability',
      human: '8 hours/day, 5 days/week',
      kasi: '24/7, no days off'
    },
    {
      feature: 'Simultaneous DMs',
      human: '1 at a time',
      kasi: 'Unlimited'
    },
    {
      feature: 'Missed messages',
      human: 'Happens regularly',
      kasi: 'Never'
    },
    {
      feature: 'Payment handling',
      human: 'Manual, error-prone',
      kasi: 'Automated to your account'
    }
  ];

  return (
    <section id="pricing-vs-agents" className="w-full py-[100px] bg-white border-b border-[#E5E5E5] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Main Grid: Text Left | Comparison Table Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Headline & Body Text */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E8F5EE] border border-[#1A7A4A]/20 text-[#1A7A4A] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
              <span>06_PRICING VS AGENTS</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
              Pay less.<br />
              Sell more.<br />
              No drama.
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed font-sans font-medium">
              A human sales agent needs a salary, a phone, data allowance — and still misses messages.
              Kasi starts at ₦15,000 a month, handles unlimited DMs simultaneously, and sends money straight to your account.
            </p>
          </div>

          {/* Right Column — Comparison Table */}
          <div className="lg:col-span-7 flex justify-center text-left">
            <div className="w-full max-w-[620px] bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              
              {/* Table Headers */}
              <div className="grid grid-cols-12 border-b border-gray-200 text-center select-none h-16">
                {/* Empty corner header on desktop */}
                <div className="hidden md:block md:col-span-4 bg-[#F8F9F7] border-r border-gray-200" />
                
                {/* Human Agent Header */}
                <div className="col-span-6 md:col-span-4 bg-[#F8F9F7] border-r border-gray-200 flex items-center justify-center gap-2 p-2">
                  <User size={16} className="text-gray-500 shrink-0" />
                  <span className="text-xs md:text-[13px] font-bold text-gray-600 uppercase tracking-wide">
                    Human Sales Agent
                  </span>
                </div>

                {/* Kasi AI Header */}
                <div className="col-span-6 md:col-span-4 bg-[#1A7A4A] text-white flex items-center justify-center gap-2 p-2">
                  <img src="/kasi.png" alt="Kasi" className="w-4 h-4 object-contain shrink-0 select-none" />
                  <span className="text-xs md:text-[13px] font-black uppercase tracking-widest text-[#FFFFFF]">
                    Kasi AI
                  </span>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100 font-sans">
                {rows.map((row, i) => (
                  <div 
                    key={i} 
                    className="grid grid-cols-12 min-h-[52px] items-center text-[15px] hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Row Feature Label */}
                    <div className="col-span-12 md:col-span-4 h-full border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-200 flex items-center px-4 py-2 font-bold text-gray-900 bg-gray-50/60 md:bg-transparent">
                      {row.feature}
                    </div>

                    {/* Human Value */}
                    <div className="col-span-6 md:col-span-4 h-full border-r border-gray-200 flex items-center px-4 py-3 font-normal text-gray-500 leading-snug">
                      <span className="block md:hidden text-[9px] font-black text-gray-400 uppercase mr-1.5 shrink-0">Human:</span>
                      <span>{row.human}</span>
                    </div>

                    {/* Kasi Value */}
                    <div className="col-span-6 md:col-span-4 h-full flex items-center px-4 py-3 font-bold text-[#1A7A4A] gap-1.5 leading-snug bg-emerald-50/30">
                      <span className="block md:hidden text-[9px] font-black text-[#1A7A4A]/60 uppercase mr-1.5 shrink-0">Kasi:</span>
                      <Check size={16} className="text-[#1A7A4A] shrink-0 stroke-[3]" />
                      <span>{row.kasi}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
