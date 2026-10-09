// spec 2.2
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_COPY } from "../../../../content/home";

export function PositioningBand() {
  const copy = HOME_COPY["2.2"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#0D6E42] text-[#F6F8F3] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#DBF361] selection:text-[#141C17]">
      {/* Animated subtle ambient waves */}
      <motion.div
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[#DBF361] blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Floating micro live response badge */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#DBF361] animate-ping" />
          <span className="font-mono text-[11px] tracking-wide">24/7 LIVE DM ENGINE</span>
        </motion.div>
      </div>

      <div className="max-w-[960px] mx-auto text-center relative z-10">
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-tight leading-[1.14]"
        >
          <span>{copy.headingPart1}</span>{" "}
          <span className="relative inline-block text-[#DBF361]">
            <span className="relative z-10">{copy.headingPart2}</span>
            <span
              className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-4 bg-[#DBF361]/25 -rotate-1 rounded-sm -z-0"
              aria-hidden="true"
            />
          </span>
        </motion.h2>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-7 text-base sm:text-[17px] text-[#F6F8F3]/90 leading-relaxed max-w-[760px] mx-auto font-light"
        >
          {copy.body}
        </motion.p>
      </div>
    </section>
  );
}

export default PositioningBand;
