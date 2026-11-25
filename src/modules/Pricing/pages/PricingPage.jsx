import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ShieldCheck } from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";
import { PRICING_DATA } from "../../../content/pricing";

export function PricingPage() {
  const [activeTab, setActiveTab] = useState("product");

  useEffect(() => {
    document.title = "Pricing | Kasi";
  }, []);

  const plans = activeTab === "product" ? PRICING_DATA.productPlans : PRICING_DATA.servicePlans;

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] flex flex-col justify-between overflow-x-hidden">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          {/* Split Header + Segmented Switch */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-[#141C17]/15">
            <div className="max-w-2xl">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42] block mb-3">
                FLAT MONTHLY PLANS · 14-DAY FREE TRIAL
              </span>
              <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-[54px] text-[#141C17] tracking-tight leading-[1.06]">
                {PRICING_DATA.heading}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#141C17]/75 font-normal leading-relaxed">
                {PRICING_DATA.sub}
              </p>
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-white border border-[#141C17]/15 self-start lg:self-auto shrink-0">
              {PRICING_DATA.tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#141C17] text-white"
                      : "text-[#141C17]/70 hover:text-[#141C17]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Architectural 3-Column Pricing Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-12">
            {plans.map((plan) => {
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between relative ${
                    isPopular
                      ? "bg-[#141C17] text-white border-2 border-[#141C17]"
                      : "bg-white text-[#141C17] border border-[#141C17]/15"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-xs font-bold tracking-wider uppercase ${
                          isPopular ? "text-[#DBF361]" : "text-[#0D6E42]"
                        }`}
                      >
                        {plan.name}
                      </span>

                      {isPopular && (
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#DBF361] text-[#141C17] px-2.5 py-0.5 rounded-xs">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="mt-4 mb-6 flex items-baseline gap-1">
                      <span className="font-display font-medium text-4xl sm:text-5xl tracking-tight">
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm font-normal ${
                          isPopular ? "text-white/60" : "text-[#141C17]/60"
                        }`}
                      >
                        {plan.pricePeriod}
                      </span>
                    </div>

                    <Link
                      to="/signup"
                      className={`w-full py-3.5 rounded-xl text-center font-semibold text-sm transition-colors block mb-7 ${
                        isPopular
                          ? "bg-[#DBF361] text-[#141C17] hover:brightness-98"
                          : "bg-[#0D6E42] text-white hover:bg-[#0A5835]"
                      }`}
                    >
                      Start 14-day free trial
                    </Link>

                    <div className="space-y-3 pt-6 border-t border-current/12">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed">
                          <Check
                            size={15}
                            weight="bold"
                            className={`shrink-0 mt-0.5 ${
                              isPopular ? "text-[#DBF361]" : "text-[#0D6E42]"
                            }`}
                          />
                          <span className={isPopular ? "text-white/88" : "text-[#141C17]/80"}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settlement Note + FAQ */}
          <div className="mt-14 p-6 sm:p-8 rounded-xl bg-white border border-[#141C17]/12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <ShieldCheck size={26} weight="regular" className="text-[#0D6E42] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h3 className="font-display font-medium text-lg text-[#141C17]">
                  Direct Paystack bank settlements · 2% transaction processing
                </h3>
                <p className="text-sm text-[#141C17]/70 font-normal mt-0.5">
                  Buyer payments settle straight to your linked Nigerian bank account via Paystack subaccount split.
                </p>
              </div>
            </div>

            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-[#141C17] text-white font-semibold text-sm hover:bg-[#0D6E42] transition-colors shrink-0"
            >
              Create your store
            </Link>
          </div>

          {/* FAQ Ledger */}
          <div className="mt-16 pt-12 border-t border-[#141C17]/15 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-[#141C17] tracking-tight">
                Common questions
              </h2>
            </div>
            <div className="lg:col-span-8 divide-y divide-[#141C17]/12">
              {PRICING_DATA.faq.map((item) => (
                <div key={item.q} className="py-5 first:pt-0">
                  <h3 className="font-display font-medium text-lg text-[#141C17]">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm text-[#141C17]/75 leading-relaxed">
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
