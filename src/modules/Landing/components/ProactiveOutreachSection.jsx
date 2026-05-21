import React from 'react';
import { Eye, Rocket } from 'lucide-react';

export const ProactiveOutreachSection = () => {
  return (
    <section id="proactive-outreach" className="w-full py-[100px] bg-[#1A7A4A] border-b-[1.5px] border-[#0A0A0A] relative select-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 text-center space-y-12">
        
        {/* Section Header Content */}
        <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border-[1.5px] border-white/30 text-white text-xs font-black uppercase tracking-wider rounded-full select-none">
            <span>PREMIUM FEATURE</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white font-bricolage text-center max-w-2xl">
            Kasi finds your next customer<br />before they find you.
          </h2>
          
          <p className="text-base md:text-lg text-white/80 leading-relaxed font-sans font-medium max-w-xl text-center">
            Kasi scans people who liked or commented on your social media posts and reaches out to them on your behalf — with the full context of your brand. You approve the approach. Kasi handles the conversation.
          </p>
        </div>

        {/* 2 Large feature cards (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[960px] mx-auto text-left pt-4">
          
          {/* Card 1: Social Listening (Dark transparent) */}
          <div className="bg-black/35 border-[1.5px] border-white/20 rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:border-white/40 hover:translate-y-[-4px]">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center shrink-0 text-white">
              <Eye size={22} className="text-[#D4F263]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white font-bricolage">Social Listening</h3>
              <p className="text-[15px] font-medium text-white/70 leading-relaxed">
                Kasi monitors who engaged with your posts — likes, comments, shares — and flags them as warm leads.
              </p>
            </div>
          </div>

          {/* Card 2: Outreach on Autopilot (White) */}
          <div className="bg-white border-[1.5px] border-[#0A0A0A] rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-[6px_6px_0px_#0A0A0A] hover:translate-y-[-4px]">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5EE] border border-black flex items-center justify-center shrink-0 text-[#1A7A4A] shadow-[2px_2px_0px_#0A0A0A]">
              <Rocket size={22} className="text-[#1A7A4A]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#0A0A0A] font-bricolage">Outreach on Autopilot</h3>
              <p className="text-[15px] font-medium text-grey-550 leading-relaxed">
                Kasi reaches out to warm leads on the right platform with a personalised message based on their engagement.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
