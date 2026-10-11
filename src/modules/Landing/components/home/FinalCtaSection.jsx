// spec 2.9
import React from "react";
import { Link } from "react-router-dom";
import { HOME_COPY } from "../../../../content/home";

export function FinalCtaSection() {
  const copy = HOME_COPY["2.9"];

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins selection:bg-[#DBF361] selection:text-[#141C17]">
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#141C17] text-white p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl text-center flex flex-col items-center">
        {/* Ambient Lime Glow */}
        <div
          className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#DBF361]/12 blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle typing dots motif (no eyebrow text) */}
        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6"
          aria-hidden="true"
        >
          <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-bounce" />
        </div>

        {/* Bricolage display headline with marker on "already typing." */}
        <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Your next customer is{" "}
          <span className="relative inline-block text-[#DBF361]">
            <span className="relative z-10">already typing.</span>
            <span
              className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-4 bg-[#DBF361]/25 -rotate-1 rounded-sm -z-0"
              aria-hidden="true"
            />
          </span>
        </h2>

        {/* In-Spec Sub verbatim */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#F6F8F3]/85 font-light leading-relaxed max-w-2xl mx-auto">
          {copy.sub}
        </p>

        {/* In-Spec Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to={copy.hrefPrimary}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-base shadow-md hover:brightness-105 transition-all text-center"
          >
            {copy.ctaPrimary}
          </Link>
          <Link
            to={copy.hrefSecondary}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 text-white font-semibold text-base border border-white/20 hover:bg-white/20 transition-all text-center"
          >
            {copy.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
