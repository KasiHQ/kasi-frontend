// spec 2.2 — Left-Aligned Editorial Manifesto Band (no glow blobs)
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HOME_COPY } from "../../../../content/home";

export function PositioningBand() {
  const copy = HOME_COPY["2.2"];
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);

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
      className="bg-[#0D6E42] text-[#F6F8F3] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 selection:bg-[#DBF361] selection:text-[#141C17]"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <div className="lg:col-span-8">
          <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-[56px] tracking-tight leading-[1.08]">
            {words.map((word, i) => {
              const isHighlight = i >= splitIndex;
              const start = i / words.length;
              const end = (i + 1) / words.length;
              const wordOpacity = useTransform(scrollYProgress, [start, end], [0.28, 1]);

              if (shouldReduceMotion) {
                return (
                  <span
                    key={i}
                    className={`inline-block mr-2.5 sm:mr-3 ${
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
                  style={{ opacity: wordOpacity }}
                  className={`inline-block mr-2.5 sm:mr-3 ${
                    isHighlight ? "text-[#DBF361]" : "text-[#F6F8F3]"
                  }`}
                >
                  {word}
                </motion.span>
              );
            })}
          </h2>
        </div>

        <div className="lg:col-span-4 border-l-2 border-[#DBF361] pl-5 sm:pl-6">
          <p className="text-base sm:text-lg text-[#F6F8F3]/90 leading-relaxed font-normal">
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PositioningBand;
