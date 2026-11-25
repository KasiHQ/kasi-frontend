// spec 2.9 — Direct Architectural Closing Band (no glow blobs, no bouncing dots)
import React from "react";
import { Link } from "react-router-dom";
import { HOME_COPY } from "../../../../content/home";

export function FinalCtaSection() {
  const copy = HOME_COPY["2.9"];

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins selection:bg-[#DBF361] selection:text-[#141C17]">
      <div className="rounded-2xl bg-[#141C17] text-white p-8 sm:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
            {copy.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#F6F8F3]/80 font-normal leading-relaxed max-w-xl">
            {copy.sub}
          </p>
        </div>

        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-center gap-3.5">
          <Link
            to={copy.hrefPrimary}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-[#DBF361] text-[#141C17] font-semibold text-base hover:brightness-98 transition-all text-center"
          >
            {copy.ctaPrimary}
          </Link>
          <Link
            to={copy.hrefSecondary}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-transparent text-white font-semibold text-base border border-white/25 hover:bg-white/10 transition-colors text-center"
          >
            {copy.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
