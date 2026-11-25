// spec 2.6 — 4-Step Operational Sequence (clean architectural ledger, zero glow blobs)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { KasiLogo } from "../../../../components/common/KasiLogo";

export function HowItWorksTeaser({ showCta = true }) {
  const copy = HOME_COPY["2.6"];
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % copy.steps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, paused, copy.steps.length]);

  const progressPct = ((activeStep + 1) / copy.steps.length) * 100;

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="py-20 sm:py-24 bg-[#F6F8F3] border-y border-[#141C17]/12 font-poppins"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12">
          <div className="lg:col-span-7">
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[44px] text-[#141C17] tracking-tight leading-[1.1]">
              {copy.heading}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#141C17]/75 font-normal leading-relaxed">
              {copy.sub}
            </p>
          </div>
        </div>

        {/* Continuous Progress Track */}
        <div className="w-full h-1 bg-[#141C17]/10 mb-8 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-[#0D6E42]"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

        {/* 4 Connected Architectural Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {copy.steps.map((step, index) => {
            const isFocused = index === activeStep;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStep(index)}
                className={`rounded-xl p-5 sm:p-6 border transition-colors flex flex-col justify-between cursor-pointer ${
                  isFocused
                    ? "bg-white border-[#0D6E42] shadow-[0_4px_20px_-8px_rgba(20,28,23,0.12)]"
                    : "bg-white/70 border-[#141C17]/12 hover:bg-white hover:border-[#141C17]/25"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs ${
                        isFocused
                          ? "bg-[#0D6E42] text-[#DBF361]"
                          : "bg-[#141C17]/8 text-[#141C17]/70"
                      }`}
                    >
                      0{step.step}
                    </span>

                    {index < copy.steps.length - 1 && (
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className={isFocused ? "text-[#0D6E42]" : "text-[#141C17]/25"}
                      />
                    )}
                  </div>

                  {/* Clean Vignette */}
                  <div className="w-full h-28 rounded-lg bg-[#F6F8F3] border border-[#141C17]/10 p-3 flex items-center justify-center select-none">
                    {step.step === 1 && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#141C17]/10 flex items-center justify-center p-1.5">
                          <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-full h-full object-contain" />
                        </div>
                        <span className="w-4 h-[1.5px] bg-[#0D6E42]/45" />
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#0D6E42]/30 flex items-center justify-center p-1.5">
                          <KasiLogo variant="mark" size={20} />
                        </div>
                        <span className="w-4 h-[1.5px] bg-[#0D6E42]/45" />
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#141C17]/10 flex items-center justify-center p-1.5">
                          <img src="/logos/instagram.svg" alt="Instagram" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}

                    {step.step === 2 && (
                      <div className="w-full space-y-1.5">
                        {[
                          { item: "Ankara Set", price: "₦18,500" },
                          { item: "Silk Boubou", price: "₦24,000" },
                        ].map((row) => (
                          <div
                            key={row.item}
                            className="bg-white rounded-md px-2.5 py-1.5 border border-[#141C17]/10 flex items-center justify-between text-[11px]"
                          >
                            <span className="font-medium text-[#141C17]">{row.item}</span>
                            <span className="font-mono text-[#0D6E42] font-semibold">{row.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.step === 3 && (
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="self-end bg-white border border-[#141C17]/10 text-[#141C17] text-[10px] px-2.5 py-1 rounded-md">
                          Is size 14 available?
                        </div>
                        <div className="self-start bg-[#0D6E42] text-white text-[10px] px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1">
                          <Check size={10} weight="bold" />
                          <span>In stock · Paystack sent</span>
                        </div>
                      </div>
                    )}

                    {step.step === 4 && (
                      <div className="w-full bg-white rounded-md p-2.5 border border-[#141C17]/10 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] font-mono text-[#141C17]/55">Order #1042 · Lekki</div>
                          <div className="text-xs font-bold text-[#141C17] mt-0.5">₦18,500</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold bg-[#DBF361] text-[#141C17]">
                          PAID
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-display font-medium text-xl text-[#141C17] tracking-tight mt-4 mb-1">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {showCta && (
          <div className="mt-12 text-left">
            <Link
              to={copy.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D6E42] text-white font-semibold text-sm hover:bg-[#0A5835] transition-colors group"
            >
              <span>{copy.button}</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default HowItWorksTeaser;
