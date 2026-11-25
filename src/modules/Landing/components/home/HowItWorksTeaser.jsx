// spec 2.6 / shared 4-step animated flow band
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { KasiLogo } from "../../../../components/common/KasiLogo";

export function HowItWorksTeaser({ showCta = true }) {
  const copy = HOME_COPY["2.6"];
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  // Smooth auto-progression across the 4 cards (Connect -> Load your shop -> Kasi sells -> You fulfil)
  useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % copy.steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, paused, copy.steps.length]);

  const progressPct = ((activeStep + 1) / copy.steps.length) * 100;

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="py-20 sm:py-26 bg-[#F6F8F3] border-y border-[#141C17]/8 font-poppins relative overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Expressive Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[44px] text-[#141C17] tracking-tight leading-[1.14]">
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

        {/* Continuous Flow Rail Above Cards (Desktop) */}
        <div className="hidden lg:block max-w-5xl mx-auto mb-8 px-12">
          <div className="relative flex items-center justify-between">
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[2.5px] bg-[#141C17]/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0D6E42] via-[#1C8C58] to-[#DBF361] rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            </div>

            {copy.steps.map((s, idx) => {
              const isCurrent = idx === activeStep;
              const isDone = idx < activeStep;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#141C17]/12 shadow-2xs cursor-pointer transition-all hover:border-[#0D6E42]/40"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-colors ${
                      isCurrent
                        ? "bg-[#0D6E42] text-[#DBF361]"
                        : isDone
                        ? "bg-[#EBF8EF] text-[#0D6E42]"
                        : "bg-[#141C17]/8 text-[#141C17]/60"
                    }`}
                  >
                    {isDone ? "✓" : `0${s.step}`}
                  </span>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isCurrent ? "text-[#141C17] font-semibold" : "text-[#141C17]/65"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative z-10">
          {copy.steps.map((step, index) => {
            const isFocused = index === activeStep;
            return (
              <motion.div
                key={step.step}
                onClick={() => setActiveStep(index)}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`rounded-[24px] p-6 border transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer ${
                  isFocused
                    ? "bg-white border-[#0D6E42]/40 shadow-[0_16px_38px_-14px_rgba(13,110,66,0.18)] -translate-y-1 ring-2 ring-[#DBF361]/60"
                    : "bg-white/90 border-[#141C17]/10 shadow-2xs hover:bg-white hover:border-[#141C17]/20 hover:-translate-y-0.5"
                }`}
              >
                <div>
                  {/* Step Numeral Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-mono text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full transition-colors ${
                        isFocused
                          ? "bg-[#0D6E42] text-[#DBF361]"
                          : "bg-[#0D6E42]/10 text-[#0D6E42]"
                      }`}
                    >
                      0{step.step}
                    </span>

                    {index < copy.steps.length - 1 && (
                      <ArrowRight
                        size={15}
                        weight="bold"
                        className={`transition-transform ${
                          isFocused
                            ? "text-[#0D6E42] translate-x-0.5"
                            : "text-[#141C17]/25"
                        }`}
                      />
                    )}
                  </div>

                  {/* Animated Stage Vignette */}
                  <div className="w-full h-32 rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 p-3 flex items-center justify-center relative overflow-hidden select-none">
                    {step.step === 1 && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#141C17]/10 flex items-center justify-center p-1.5">
                            <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 object-contain" />
                          </div>
                          <span className="w-4 h-[2px] bg-[#0D6E42]/40 rounded-full" />
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#0D6E42]/25 flex items-center justify-center p-2">
                            <KasiLogo variant="mark" size={22} />
                          </div>
                          <span className="w-4 h-[2px] bg-[#0D6E42]/40 rounded-full" />
                          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#141C17]/10 flex items-center justify-center p-1.5">
                            <img src="/logos/instagram.svg" alt="Instagram" className="w-5 h-5 object-contain" />
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#0D6E42] bg-[#EBF8EF] px-2.5 py-0.5 rounded-full font-semibold">
                          <CheckCircle size={11} weight="fill" />
                          Channels live
                        </span>
                      </div>
                    )}

                    {step.step === 2 && (
                      <div className="w-full space-y-1.5 px-1">
                        {[
                          { item: "Ankara Set", price: "₦18,500", tag: "In stock" },
                          { item: "Silk Boubou", price: "₦24,000", tag: "Floor ₦21k" },
                        ].map((row) => (
                          <div
                            key={row.item}
                            className="bg-white rounded-xl px-2.5 py-1.5 border border-[#141C17]/10 flex items-center justify-between text-[10px]"
                          >
                            <span className="font-semibold text-[#141C17]">{row.item}</span>
                            <span className="font-mono text-[#0D6E42] font-bold">{row.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.step === 3 && (
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="self-end bg-white border border-[#141C17]/10 text-[#141C17] text-[10px] px-2.5 py-1 rounded-xl rounded-br-xs">
                          Is size 14 available?
                        </div>
                        <div className="self-start bg-[#0D6E42] text-white text-[10px] px-2.5 py-1 rounded-xl rounded-bl-xs font-medium">
                          Yes! Paystack link ready ✓
                        </div>
                      </div>
                    )}

                    {step.step === 4 && (
                      <div className="w-full bg-white rounded-xl p-2.5 border border-[#141C17]/10 shadow-2xs flex items-center justify-between">
                        <div>
                          <div className="text-[9px] font-mono text-[#141C17]/55">Order #1042 · Lekki</div>
                          <div className="text-xs font-bold text-[#141C17] mt-0.5">₦18,500</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#DBF361] text-[#141C17]">
                          PAID ✓
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-display font-medium text-xl text-[#141C17] tracking-tight mt-5 mb-1.5">
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

        {/* Optional Action Button */}
        {showCta && (
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              to={copy.href}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0D6E42] text-[#F6F8F3] font-semibold text-sm hover:bg-[#1C774E] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>{copy.button}</span>
              <ArrowRight
                size={16}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default HowItWorksTeaser;
