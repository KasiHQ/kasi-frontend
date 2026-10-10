import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Sparkle } from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";
import { PRICING_DATA } from "../../../content/pricing";

export function PricingPage() {
  const [activeTab, setActiveTab] = useState("product"); // "product" | "service"
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Pricing | Kasi — Simple Flat Monthly Plans";
  }, []);

  const plans = activeTab === "product" ? PRICING_DATA.productPlans : PRICING_DATA.servicePlans;

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] flex flex-col justify-between overflow-x-hidden">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight leading-[1.08]">
              {PRICING_DATA.heading}
            </h1>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#141C17]/75 font-light leading-relaxed max-w-2xl mx-auto">
              {PRICING_DATA.sub}
            </p>

            {/* Toggle Segmented Pill */}
            <div className="mt-10 inline-flex items-center p-1.5 rounded-full bg-[#141C17]/6 border border-[#141C17]/10">
              {PRICING_DATA.tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-[#141C17] shadow-sm font-bold"
                      : "text-[#141C17]/70 hover:text-[#141C17]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mt-12">
            {plans.map((plan, index) => {
              const isPopular = plan.isPopular;

              return (
                <motion.div
                  key={plan.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={`rounded-[30px] p-7 sm:p-9 flex flex-col justify-between relative transition-all ${
                    isPopular
                      ? "bg-[#141C17] text-white shadow-2xl border-2 border-[#DBF361]/40 md:-translate-y-2"
                      : "bg-white text-[#141C17] shadow-xs border border-[#141C17]/10 hover:border-[#141C17]/25"
                  }`}
                >
                  {/* Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#DBF361] text-[#141C17] px-3.5 py-1 rounded-full shadow-md">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Tier Name */}
                    <span
                      className={`font-mono text-xs font-bold tracking-wider uppercase ${
                        isPopular ? "text-[#DBF361]" : "text-[#141C17]/60"
                      }`}
                    >
                      {plan.name}
                    </span>

                    {/* Price */}
                    <div className="mt-4 mb-6 flex items-baseline gap-1">
                      <span className="font-display font-medium text-4xl sm:text-5xl tracking-tight">
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm font-light ${
                          isPopular ? "text-white/60" : "text-[#141C17]/60"
                        }`}
                      >
                        {plan.pricePeriod}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      to="/signup"
                      className={`w-full py-3.5 rounded-full text-center font-semibold text-sm transition-all block mb-8 ${
                        isPopular
                          ? "bg-[#0D6E42] text-white hover:bg-[#1C774E] shadow-md hover:brightness-105 active:scale-98"
                          : "bg-[#141C17] text-white hover:bg-[#2A342E] shadow-xs active:scale-98"
                      }`}
                    >
                      Get started
                    </Link>

                    {/* Features List */}
                    <div className="space-y-3.5 pt-6 border-t border-current/10">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-[13px] leading-relaxed">
                          <Check
                            size={16}
                            weight="bold"
                            className={`shrink-0 mt-0.5 ${
                              isPopular ? "text-[#DBF361]" : "text-[#0D6E42]"
                            }`}
                          />
                          <span className={isPopular ? "text-white/85" : "text-[#141C17]/80"}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantee / Zero Commission Banner */}
          <div className="mt-20 py-10 px-8 rounded-[28px] bg-white border border-[#141C17]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DBF361]/40 flex items-center justify-center text-[#0D6E42] shrink-0">
                <ShieldCheck size={28} weight="duotone" />
              </div>
              <div>
                <h3 className="font-display font-medium text-lg sm:text-xl text-[#141C17]">
                  Zero Commissions. Ever.
                </h3>
                <p className="text-sm text-[#141C17]/70 font-light mt-0.5">
                  Every naira you make goes straight into your Paystack balance. We never take a cut.
                </p>
              </div>
            </div>

            <Link
              to="/signup"
              className="px-7 py-3 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-sm hover:brightness-105 transition-all shrink-0"
            >
              Get started free
            </Link>
          </div>

          {/* FAQ Accordion Grid */}
          <div className="mt-20 sm:mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-[#141C17] tracking-tight">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              {PRICING_DATA.faq.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#141C17]/10 shadow-xs"
                >
                  <h4 className="font-display font-medium text-base text-[#141C17] mb-2">
                    {item.q}
                  </h4>
                  <p className="text-sm text-[#141C17]/75 font-light leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default PricingPage;
