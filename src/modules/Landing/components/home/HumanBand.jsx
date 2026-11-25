// spec 2.7 — Documentary Merchant Portrait & Quote (zero glow blobs)
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
    <section className="py-20 sm:py-28 bg-[#141C17] text-[#F6F8F3] font-poppins select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-xl overflow-hidden border border-white/15 bg-[#1C2620]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.image || current.name}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.22 }}
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

          {/* Quote & Attribution */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="min-h-[150px] sm:min-h-[175px] lg:min-h-[190px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={current.name}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="font-display font-medium text-2xl sm:text-3xl lg:text-[38px] text-white tracking-tight leading-[1.24]"
                >
                  “{String(current.quote || copy.headline || "").replace(/^["']|["']$/g, "")}”
                </motion.h2>
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-display font-medium text-xl text-white">
                  {current.name}
                </div>
                <div className="text-sm text-[#DBF361] font-mono mt-0.5">
                  {current.business} · {current.city}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/50">
                  0{currentIndex + 1} / 0{copy.testimonials.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <CaretLeft size={18} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
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
