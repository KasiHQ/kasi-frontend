// spec 2.7
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../../../data/testimonials";

export function HumanBand() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = TESTIMONIALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#141C17] text-white font-poppins relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#0D6E42]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Col: Authentic Nigerian Vendor Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[26px] overflow-hidden shadow-2xl border border-white/10 group">
              <img
                data-swap="vendor-real"
                src={current.avatar}
                alt={`${current.author} — ${current.business}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#DBF361] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/15">
                  VERIFIED MERCHANT · {current.city.toUpperCase()}
                </span>
                <h4 className="font-bold text-xl text-white mt-3">{current.author}</h4>
                <p className="text-xs text-white/70 font-light mt-0.5">
                  {current.role}, {current.business}
                </p>
              </div>
            </div>
          </div>

          {/* Right Col: Rotating Quote & Story */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#DBF361]/15 text-[#DBF361] flex items-center justify-center mb-6">
                <Quote size={24} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-bold text-2xl sm:text-3xl lg:text-[38px] text-white tracking-tight leading-snug">
                    &ldquo;{current.quote}&rdquo;
                  </h2>

                  <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base text-white">{current.author}</div>
                      <div className="text-xs text-[#DBF361] font-mono mt-0.5">
                        {current.business} · {current.city}, Nigeria
                      </div>
                    </div>

                    {/* Testimonial Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous quote"
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next quote"
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HumanBand;
