// spec 2.6
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_COPY } from "../../../../content/home";
import { KasiLogo } from "../../../../components/common/KasiLogo";

export function HowItWorksTeaser() {
  const copy = HOME_COPY["2.6"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F6F8F3] border-t border-[#141C17]/8 font-poppins relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Spec 2.6 has NO section heading: directly renders 4-step horizontal flow */}
        <div className="relative">
          {/* Animated Connecting SVG Line on desktop */}
          <div className="hidden lg:block absolute top-[130px] left-[12%] right-[12%] h-[2px] -z-0 pointer-events-none">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {copy.steps.map((step, index) => {
              return (
                <motion.div
                  key={step.step}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-[22px] p-6 sm:p-7 border border-[#141C17]/10 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Step numeral */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-bold text-[#141C17]/25 group-hover:text-[#0D6E42] transition-colors">
                        0{step.step}
                      </span>
                    </div>

                    {/* Illustrated vignette container */}
                    <div className="w-full h-28 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 p-3 flex items-center justify-center relative overflow-hidden select-none">
                      {step.step === 1 && (
                        // Vignette 1: Connect (WhatsApp & IG to Kasi mark)
                        <div className="flex items-center gap-3">
                          <img
                            src="/logos/whatsapp.svg"
                            alt="WhatsApp"
                            className="w-7 h-7 object-contain opacity-85"
                          />
                          <div className="w-4 border-t-2 border-dashed border-[#0D6E42]/40" />
                          <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-[#141C17]/10 flex items-center justify-center p-1.5">
                            <KasiLogo variant="mark" size={24} />
                          </div>
                          <div className="w-4 border-t-2 border-dashed border-[#0D6E42]/40" />
                          <img
                            src="/logos/instagram.svg"
                            alt="Instagram"
                            className="w-7 h-7 object-contain opacity-85"
                          />
                        </div>
                      )}

                      {step.step === 2 && (
                        // Vignette 2: Load shop (3 skeleton product cards with prices)
                        <div className="flex gap-2 w-full justify-center">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-16 bg-white rounded-lg p-1.5 border border-[#141C17]/10 shadow-2xs flex flex-col gap-1"
                            >
                              <div className="w-full h-7 rounded bg-[#141C17]/8" />
                              <div className="w-3/4 h-1.5 rounded bg-[#141C17]/15" />
                              <div className="w-1/2 h-1.5 rounded bg-[#0D6E42]/30" />
                            </div>
                          ))}
                        </div>
                      )}

                      {step.step === 3 && (
                        // Vignette 3: Kasi sells (2 bubbles + typing dots)
                        <div className="flex flex-col gap-1.5 w-full max-w-[170px]">
                          <div className="self-end bg-[#DFF7E4] text-[#141C17] text-[10px] px-2.5 py-1 rounded-lg rounded-br-none shadow-2xs">
                            Is this in stock?
                          </div>
                          <div className="self-start bg-white border border-[#141C17]/10 text-[10px] px-2.5 py-1 rounded-lg rounded-bl-none shadow-2xs flex items-center gap-1 text-[#0D6E42]">
                            <span>Yes! Reserve now</span>
                            <span className="flex gap-0.5 ml-1">
                              <span className="w-1 h-1 rounded-full bg-[#0D6E42] animate-bounce" />
                              <span className="w-1 h-1 rounded-full bg-[#0D6E42] animate-bounce [animation-delay:0.15s]" />
                              <span className="w-1 h-1 rounded-full bg-[#0D6E42] animate-bounce [animation-delay:0.3s]" />
                            </span>
                          </div>
                        </div>
                      )}

                      {step.step === 4 && (
                        // Vignette 4: You fulfil (order card + PAID stamp)
                        <div className="w-full max-w-[160px] bg-white rounded-lg p-2 border border-[#141C17]/10 shadow-2xs relative flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-mono text-[#141C17]/50">Order #1042</div>
                            <div className="text-[11px] font-bold text-[#141C17]">₦45,000</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#DBF361] text-[#0D6E42] border border-[#0D6E42]/20 rotate-[-4deg]">
                            PAID
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-display font-medium text-xl text-[#141C17] tracking-tight mt-5 mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-14 sm:mt-18 text-center">
          <Link
            to={copy.href}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0D6E42] text-[#F6F8F3] font-semibold text-sm hover:bg-[#1C774E] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {copy.button}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksTeaser;
