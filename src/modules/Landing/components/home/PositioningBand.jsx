// spec 2.2
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { HOME_COPY } from "../../../../content/home";

export function CountUp({ to, suffix = "", duration = 1.6 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setCount(to);
      return;
    }

    let start = 0;
    const stepTime = Math.max(Math.floor((duration * 1000) / to), 15);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= to) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, to, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className="font-mono font-bold">
      {count}
      {suffix}
    </span>
  );
}

export function PositioningBand() {
  const copy = HOME_COPY["2.2"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#0D6E42] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-poppins selection:bg-[#DBF361] selection:text-[#141C17]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#DBF361]/12 blur-[120px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto text-center relative z-10">
        {/* Animated Headline Reveal */}
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-bold text-3xl sm:text-4xl lg:text-[46px] tracking-tight leading-[1.12]"
        >
          {copy.headingPart1}{" "}
          <span className="text-[#DBF361] underline decoration-[#DBF361]/40 underline-offset-8">
            {copy.headingPart2}
          </span>
        </motion.h2>

        {/* Supporting Paragraph */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-7 font-light text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-[800px] mx-auto"
        >
          {copy.body}
        </motion.p>

        {/* Stats Row with CountUp */}
        <div className="mt-14 pt-12 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {copy.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#DBF361] tracking-tight">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </div>
              <span className="mt-2 text-sm font-semibold text-white/90">
                {stat.label}
              </span>
              <span className="text-xs text-white/60 font-light mt-0.5">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PositioningBand;
