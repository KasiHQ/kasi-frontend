// spec 2.6
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Link2, Store, Sparkles, CheckCircle } from "lucide-react";
import { HOME_COPY } from "../../../../content/home";

const STEP_ICONS = [Link2, Store, Sparkles, CheckCircle];

export function HowItWorksTeaser() {
  const copy = HOME_COPY["2.6"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F6F8F3] border-t border-[#141C17]/8 font-poppins relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[720px] mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/15 mb-4">
            <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
              {copy.badge}
            </span>
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#141C17] tracking-tight leading-[1.12]">
            {copy.heading}
          </h2>
        </div>

        {/* 4-Step Flow with animated connecting line */}
        <div className="relative">
          {/* Animated Connecting SVG Line */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] -z-0">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="#141C17"
                strokeOpacity="0.12"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <motion.line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="#0D6E42"
                strokeWidth="2.5"
                initial={shouldReduceMotion ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {copy.steps.map((step, index) => {
              const IconComp = STEP_ICONS[index];

              return (
                <motion.div
                  key={step.step}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-[#141C17]/10 shadow-xs flex flex-col items-start relative group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0D6E42]/10 border border-[#0D6E42]/15 flex items-center justify-center text-[#0D6E42] group-hover:bg-[#0D6E42] group-hover:text-white transition-colors">
                      <IconComp size={22} />
                    </div>
                    <span className="font-mono text-2xl font-black text-[#141C17]/20">
                      0{step.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#141C17] tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#141C17]/75 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-14 text-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#141C17] text-white font-semibold text-base shadow-sm hover:bg-[#141C17]/90 hover:-translate-y-0.5 active:scale-95 transition-all group"
          >
            <span>{copy.button}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksTeaser;
