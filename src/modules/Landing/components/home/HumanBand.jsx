// spec 2.7
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { DesignedPlaceholder } from "../../../../components/common/DesignedPlaceholder";

export function HumanBand() {
  const copy = HOME_COPY["2.7"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = copy.testimonials[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % copy.testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + copy.testimonials.length) % copy.testimonials.length
    );
  };

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#141C17] text-[#F6F8F3] font-poppins relative overflow-hidden select-none">
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#0D6E42]/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Authentic Nigerian merchant portrait with dark overlay */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl border border-white/10 bg-[#141C17]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.image || current.name}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  {current.image ? (
                    <img
                      src={current.image}
                      alt={`${current.name} — ${current.business}, ${current.city}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = "block";
                        }
                      }}
                    />
                  ) : null}

                  {/* Dark overlay for clean contrast and cinematic tone */}
                  <div
                    className="absolute inset-0 bg-black/40 pointer-events-none"
                    aria-hidden="true"
                  />

                  <div style={{ display: current.image ? "none" : "block" }} className="w-full h-full">
                    <DesignedPlaceholder
                      aspect="4/5"
                      caption={`${current.name} — ${current.business}, ${current.city}`}
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Spec Headline & rotating vendor details */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={current.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="font-display font-medium text-2xl sm:text-3xl lg:text-[38px] text-white tracking-tight leading-[1.24]"
                >
                  "{String(current.quote || copy.headline || "").replace(/^["']|["']$/g, "")}"
                </motion.h2>
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="font-display font-medium text-xl text-white">
                    {current.name}
                  </div>
                  <div className="text-sm text-[#DBF361] font-mono mt-1">
                    {current.business} · {current.city}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial slider controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HumanBand;
