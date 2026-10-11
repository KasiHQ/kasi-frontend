// spec 2.2
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HOME_COPY } from "../../../../content/home";

export function PositioningBand() {
  const copy = HOME_COPY["2.2"];
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);

  // Scroll-linked progression across the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "center 0.45"],
  });

  const fullHeading = `${copy.headingPart1} ${copy.headingPart2}`;
  const words = fullHeading.split(" ");
  const splitIndex = copy.headingPart1.split(" ").length;

  return (
    <section
      ref={containerRef}
      className="bg-[#0D6E42] text-[#F6F8F3] py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#DBF361] selection:text-[#141C17]"
    >
      {/* Subtle ambient deep glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#DBF361]/10 blur-[150px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-[1020px] mx-auto text-center relative z-10">
        <h2 className="font-display font-medium text-3xl sm:text-5xl md:text-6xl lg:text-[62px] tracking-tight leading-[1.12]">
          {words.map((word, i) => {
            const isHighlight = i >= splitIndex;
            // Linear step for word reveal based on scroll
            const start = i / words.length;
            const end = (i + 1) / words.length;
            const wordOpacity = useTransform(scrollYProgress, [start, end], [0.22, 1]);
            const wordY = useTransform(scrollYProgress, [start, end], [10, 0]);

            if (shouldReduceMotion) {
              return (
                <span
                  key={i}
                  className={`inline-block mr-2.5 sm:mr-3.5 ${
                    isHighlight ? "text-[#DBF361]" : "text-[#F6F8F3]"
                  }`}
                >
                  {word}
                </span>
              );
            }

            return (
              <motion.span
                key={i}
                style={{ opacity: wordOpacity, y: wordY }}
                className={`inline-block mr-2.5 sm:mr-3.5 transition-colors duration-200 ${
                  isHighlight ? "text-[#DBF361]" : "text-[#F6F8F3]"
                }`}
              >
                {word}
              </motion.span>
            );
          })}
        </h2>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 text-base sm:text-lg md:text-xl text-[#F6F8F3]/85 leading-relaxed max-w-[780px] mx-auto font-light"
        >
          {copy.body}
        </motion.p>
      </div>
    </section>
  );
}

export default PositioningBand;
