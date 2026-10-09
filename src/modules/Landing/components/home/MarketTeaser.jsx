// spec 2.8
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { HOME_COPY } from "../../../../content/home";

export function MarketTeaser() {
  const copy = HOME_COPY["2.8"];

  return (
    <section className="py-14 sm:py-16 bg-[#F6F8F3] border-b border-[#141C17]/10 font-poppins">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] border border-[#141C17]/10 p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0D6E42]/10 text-[#0D6E42] flex items-center justify-center shrink-0">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="font-mono-labels text-[11px] font-bold uppercase tracking-wider text-[#0D6E42]">
                KASI MARKET · SHOPPERS
              </span>
              <h3 className="font-bold text-xl sm:text-2xl text-[#141C17] tracking-tight mt-1">
                {copy.heading}
              </h3>
              <p className="mt-1 text-sm sm:text-base text-[#141C17]/70 font-light max-w-xl">
                {copy.body}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              to="/market"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#141C17] text-white font-semibold text-sm hover:bg-[#141C17]/90 active:scale-95 transition-all group"
            >
              <span>{copy.button}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketTeaser;
