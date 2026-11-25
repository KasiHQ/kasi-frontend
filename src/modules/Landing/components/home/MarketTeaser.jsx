// spec 2.8
import React from "react";
import { Link } from "react-router-dom";
import { Storefront, ArrowRight } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";

export function MarketTeaser() {
  const copy = HOME_COPY["2.8"];

  return (
    <section className="py-16 sm:py-20 bg-[#F6F8F3] border-b border-[#141C17]/10 font-poppins">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-white via-white to-[#EDF4EA] rounded-[28px] border border-[#141C17]/10 p-6 sm:p-9 md:p-11 shadow-[0_14px_34px_-18px_rgba(13,110,66,0.14)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 overflow-hidden">
          <div
            className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#DBF361]/30 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/15 mb-4">
              <Storefront size={14} weight="duotone" className="text-[#0D6E42]" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0D6E42]">
                Kasi Market
              </span>
            </div>

            <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-[#141C17] tracking-tight">
              Not here to sell?{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Come shop instead.</span>
                <span
                  className="absolute left-0 bottom-1 w-full h-3 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                  aria-hidden="true"
                />
              </span>
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-[#141C17]/75 font-light leading-relaxed">
              {copy.body}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto relative z-10">
            <Link
              to={copy.href}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#141C17] text-[#F6F8F3] font-semibold text-sm hover:bg-[#0D6E42] transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <span>{copy.button.replace(/\s*→$/, "")}</span>
              <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketTeaser;
