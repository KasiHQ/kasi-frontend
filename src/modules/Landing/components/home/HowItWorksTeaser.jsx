// spec 2.6
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { KasiLogo } from "../../../../components/common/KasiLogo";

export function HowItWorksTeaser() {
  const copy = HOME_COPY["2.6"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F6F8F3] border-t border-[#141C17]/8 font-poppins relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Expressive Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] text-[#141C17] tracking-tight leading-[1.14]">
            Connect once.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#0D6E42]">Let Kasi run the counter.</span>
              <span
                className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-3.5 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#141C17]/75 font-light leading-relaxed">
            {copy.sub}
          </p>
        </div>

        {/* 4-Step Flow with Animated Connecting SVG Line */}
        <div className="relative">
          {/* Animated Connecting Line on desktop */}
          <div className="hidden lg:block absolute top-[135px] left-[12%] right-[12%] h-[2px] -z-0 pointer-events-none">
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
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {copy.steps.map((step, index) => {
              return (
                <motion.div
                  key={step.step}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#141C17]/10 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
                >
                  {/* Subtle top ambient glow on hover */}
                  <div
                    className="absolute top-0 right-0 w-28 h-28 bg-[#DBF361]/15 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden="true"
                  />

                  <div>
                    {/* Step Numeral Pill */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-xs font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#0D6E42]/10 text-[#0D6E42] border border-[#0D6E42]/15">
                        STEP 0{step.step}
                      </span>
                    </div>

                    {/* Rich, Detailed Illustrated Vignette Container */}
                    <div className="w-full h-32 rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 p-3 flex items-center justify-center relative overflow-hidden select-none">
                      {step.step === 1 && (
                        // Vignette 1: Connect (WhatsApp & IG linked to Kasi mark with sync indicator)
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-[#141C17]/10 flex items-center justify-center p-1.5">
                              <img
                                src="/logos/whatsapp.svg"
                                alt="WhatsApp"
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                            <div className="w-5 border-t-2 border-dashed border-[#0D6E42]/40" />
                            <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-[#0D6E42]/20 flex items-center justify-center p-2 relative">
                              <KasiLogo variant="mark" size={24} />
                            </div>
                            <div className="w-5 border-t-2 border-dashed border-[#0D6E42]/40" />
                            <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-[#141C17]/10 flex items-center justify-center p-1.5">
                              <img
                                src="/logos/instagram.svg"
                                alt="Instagram"
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#0D6E42] bg-[#DBF361]/35 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                            Sync active
                          </span>
                        </div>
                      )}

                      {step.step === 2 && (
                        // Vignette 2: Load shop (Rich miniature product cards with prices and stock tags)
                        <div className="flex gap-2.5 w-full justify-center">
                          <div className="w-24 bg-white rounded-xl p-2 border border-[#141C17]/10 shadow-xs flex flex-col gap-1">
                            <div className="w-full h-8 rounded-lg bg-[#0D6E42]/10 flex items-center justify-center text-[9px] font-medium text-[#0D6E42]">
                              Ankara Set
                            </div>
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="font-bold text-[#141C17]">₦18,500</span>
                              <span className="text-[8px] text-[#0D6E42] font-semibold">Ready</span>
                            </div>
                          </div>
                          <div className="w-24 bg-white rounded-xl p-2 border border-[#141C17]/10 shadow-xs flex flex-col gap-1">
                            <div className="w-full h-8 rounded-lg bg-[#DBF361]/25 flex items-center justify-center text-[9px] font-medium text-[#141C17]">
                              Silk Boubou
                            </div>
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="font-bold text-[#141C17]">₦24,000</span>
                              <span className="text-[8px] text-[#0D6E42] font-semibold">2 left</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {step.step === 3 && (
                        // Vignette 3: Kasi sells (Realistic WhatsApp chat thread with typing indicators)
                        <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
                          <div className="self-end bg-[#DFF7E4] text-[#141C17] text-[10px] px-2.5 py-1 rounded-xl rounded-br-xs shadow-2xs font-normal">
                            Is size 14 available?
                          </div>
                          <div className="self-start bg-white border border-[#141C17]/10 text-[10px] px-2.5 py-1 rounded-xl rounded-bl-xs shadow-2xs flex items-center gap-1.5 text-[#0D6E42] font-medium">
                            <span>Yes! Reserve now?</span>
                            <span className="flex gap-0.5 ml-0.5">
                              <span className="w-1 h-1 rounded-full bg-[#0D6E42] animate-bounce" />
                              <span className="w-1 h-1 rounded-full bg-[#0D6E42] animate-bounce [animation-delay:0.15s]" />
                              <span className="w-1 h-1 rounded-full bg-[#0D6E42] animate-bounce [animation-delay:0.3s]" />
                            </span>
                          </div>
                        </div>
                      )}

                      {step.step === 4 && (
                        // Vignette 4: You fulfil (Order summary slip with vibrant PAID stamp)
                        <div className="w-full max-w-[180px] bg-white rounded-xl p-2.5 border border-[#141C17]/10 shadow-xs relative flex items-center justify-between">
                          <div>
                            <div className="text-[9px] font-mono text-[#141C17]/55">Order #1042 · Lekki</div>
                            <div className="text-[11px] font-bold text-[#141C17] mt-0.5">₦18,500</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-[#DBF361] text-[#0D6E42] border border-[#0D6E42]/20 shadow-2xs rotate-[-5deg]">
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

        {/* Action Button */}
        <div className="mt-14 sm:mt-18 text-center">
          <Link
            to={copy.href}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0D6E42] text-[#F6F8F3] font-semibold text-sm hover:bg-[#1C774E] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
          >
            <span>{copy.button}</span>
            <ArrowRight
              size={16}
              weight="bold"
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksTeaser;
