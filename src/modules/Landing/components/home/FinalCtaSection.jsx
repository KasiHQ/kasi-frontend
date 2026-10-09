// spec 2.9
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { HOME_COPY } from "../../../../content/home";

export function FinalCtaSection() {
  const copy = HOME_COPY["2.9"];
  const waNumber = import.meta.env.VITE_DEMO_WHATSAPP || "2348000000000";
  const waDemoLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hi Kasi, I'd like to book a walkthrough / live demo."
  )}`;

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins selection:bg-[#DBF361] selection:text-[#141C17]">
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#0D6E42] text-white p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl text-center flex flex-col items-center">
        {/* Ambient Lime Glow behind typing indicator */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#DBF361]/15 blur-[100px] pointer-events-none" />

        {/* Typing-indicator Motif Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-bounce" />
          </div>
          <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#DBF361]">
            TYPING RIGHT NOW
          </span>
        </div>

        {/* In-Spec H2 */}
        <h2 className="font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
          {copy.heading}
        </h2>

        {/* In-Spec Sub */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
          {copy.sub}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#DBF361] text-[#141C17] font-bold text-base shadow-lg hover:shadow-xl hover:brightness-105 active:scale-95 transition-all text-center"
          >
            <span>{copy.ctaPrimary}</span>
            <ArrowRight size={18} />
          </Link>
          <a
            href={waDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 text-white font-semibold text-base border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-center"
          >
            <MessageSquareText size={18} />
            <span>{copy.ctaSecondary}</span>
          </a>
        </div>

        <p className="mt-8 text-xs text-white/60 font-light">
          Setup takes less than 3 minutes · No credit card required · Keep your phone number
        </p>
      </div>
    </section>
  );
}

export default FinalCtaSection;
