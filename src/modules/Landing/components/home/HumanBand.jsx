// spec 2.7
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CaretLeft, CaretRight, Quotes } from "@phosphor-icons/react";
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
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[520px] h-[520px] bg-[#0D6E42]/22 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Authentic Nigerian merchant portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[28px] overflow-hidden shadow-2xl border border-white/12 bg-[#141C17]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.image || current.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full relative"
                >
                  {current.image ? (
                    <img
                      src={current.image}
                      alt={`${current.name} — ${current.business}, ${current.city}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = "block";
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#141C17]/85 via-black/25 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/15 text-xs font-mono text-white">
                      {current.business} · {current.city}
                    </span>
                  </div>

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

          {/* Right Column: Quote & Merchant Details */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#DBF361]/15 border border-[#DBF361]/30 text-[#DBF361] flex items-center justify-center mb-6">
                <Quotes size={22} weight="fill" />
              </div>

              <div className="min-h-[150px] sm:min-h-[175px] lg:min-h-[190px] flex items-center">
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
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
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

              {/* Pagination pills + prev/next controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {copy.testimonials.map((t, idx) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`View quote from ${t.name}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex
                          ? "w-6 bg-[#DBF361]"
                          : "w-2 bg-white/25 hover:bg-white/45"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <CaretLeft size={18} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <CaretRight size={18} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HumanBand;
