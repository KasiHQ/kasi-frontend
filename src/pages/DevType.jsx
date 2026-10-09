import React from "react";
import { Link } from "react-router-dom";
import KasiLogo from "../components/common/KasiLogo";

export default function DevType() {
  const sampleHeadings = [
    {
      section: "2.2 Positioning Band",
      text: "Selling on social was never the problem. Keeping up with it was.",
    },
    {
      section: "2.3 Three Pillars",
      text: "One assistant. The whole shop.",
    },
    {
      section: "2.5 Audience Strip",
      text: "Made for shops with real volume.",
    },
    {
      section: "2.8 Market Teaser",
      text: "Not here to sell? Come shop instead.",
    },
    {
      section: "2.9 Final CTA",
      text: "Your next customer is already typing.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-[#141C17]/10 mb-8">
          <div className="flex items-center gap-3">
            <KasiLogo variant="full" size={32} />
            <span className="font-mono text-xs uppercase px-2.5 py-1 bg-[#0D6E42]/10 text-[#0D6E42] rounded-full font-bold">
              Typography Comparison (/dev/type)
            </span>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#0D6E42] hover:underline">
            ← Back to Home
          </Link>
        </div>

        <p className="text-sm text-[#141C17]/70 mb-10 max-w-xl">
          Side-by-side evaluation of section headlines set in <strong>Bricolage Grotesque</strong> (new display font, weight 500) vs <strong>Poppins</strong> (previous font).
        </p>

        <div className="space-y-12">
          {sampleHeadings.map((item) => (
            <div key={item.section} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#141C17]/10 shadow-xs">
              <span className="font-mono text-xs font-semibold text-[#0D6E42] uppercase tracking-wider block mb-4">
                {item.section}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bricolage Grotesque (New Display Font) */}
                <div className="p-5 rounded-xl bg-[#F6F8F3]/60 border border-[#141C17]/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#141C17]/50 uppercase">
                      Bricolage Grotesque (Display · 500)
                    </span>
                    <span className="text-[11px] font-mono text-[#0D6E42] font-semibold bg-[#0D6E42]/10 px-2 py-0.5 rounded">
                      NEW DISPLAY
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#141C17] tracking-tight leading-[1.12]">
                    {item.text}
                  </h3>
                </div>

                {/* Poppins (Baseline) */}
                <div className="p-5 rounded-xl bg-white border border-[#141C17]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#141C17]/50 uppercase">
                      Poppins (Display · 700)
                    </span>
                    <span className="text-[11px] font-mono text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                      PREVIOUS
                    </span>
                  </div>
                  <h3 className="font-poppins font-bold text-2xl sm:text-3xl text-[#141C17] tracking-tight leading-[1.12]">
                    {item.text}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
