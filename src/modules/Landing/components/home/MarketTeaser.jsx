// spec 2.8
import React from "react";
import { Link } from "react-router-dom";
import { HOME_COPY } from "../../../../content/home";

export function MarketTeaser() {
  const copy = HOME_COPY["2.8"];

  return (
    <section className="py-14 sm:py-16 bg-[#F6F8F3] border-b border-[#141C17]/10 font-poppins">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] border border-[#141C17]/10 p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#141C17] tracking-tight">
              Not here to sell?{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Come shop instead.</span>
                <span
                  className="absolute left-0 bottom-1 w-full h-3 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                  aria-hidden="true"
                />
              </span>
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#141C17]/75 font-light leading-relaxed">
              {copy.body}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              to={copy.href}
              className="w-full md:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full border-2 border-[#141C17] text-[#141C17] font-semibold text-sm hover:bg-[#141C17] hover:text-[#F6F8F3] transition-colors cursor-pointer"
            >
              {copy.button}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketTeaser;
