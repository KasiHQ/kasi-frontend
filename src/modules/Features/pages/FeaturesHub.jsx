// spec 04
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Robot,
  Package,
  MapPin,
  CreditCard,
  ChatTeardropDots,
  Users,
  ChartLineUp,
  ShareNetwork,
} from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";

const FEATURES_LIST = [
  {
    id: "sales-engine",
    title: "SALES ENGINE",
    tag: "Core",
    span: "lg:col-span-2",
    line: "The brain that sells: inquiry to recommendation to negotiation to closed, paid order.",
    href: "/features/sales-engine",
    icon: Robot,
    image: "/images/products & store.png",
    featured: true,
    pill: "3-Tier Price Guardrails",
  },
  {
    id: "fulfilment",
    title: "FULFILMENT CENTER",
    span: "lg:col-span-1",
    line: "Every paid order in one list, one next action each, customer pinged at every step.",
    href: "/features/fulfilment",
    icon: Package,
    image: "/images/fulfilment & orders.png",
    pill: "4-Step Phase Tracker",
  },
  {
    id: "delivery",
    title: "DELIVERY & PRICING",
    span: "lg:col-span-1",
    line: "Live location capture and distance-based fees that are right before checkout.",
    href: "/features/delivery",
    icon: MapPin,
    image: "/images/dashboard.png",
    pill: "GPS Road Distance",
  },
  {
    id: "payments",
    title: "PAYMENTS & CHECKOUT",
    span: "lg:col-span-1",
    line: "Paystack links, auto-confirmed by webhook. Kasi knows the moment money lands.",
    href: "/features/payments",
    icon: CreditCard,
    image: "/images/sales & finance.png",
    pill: "Cryptographic Webhook",
  },
  {
    id: "chats",
    title: "CHATS & CONTROL",
    span: "lg:col-span-1",
    line: "Watch every conversation live and steer Kasi with one instruction.",
    href: "/features/chats",
    icon: ChatTeardropDots,
    image: "/images/chats.png",
    pill: "AI Summary + Whisper",
  },
  {
    id: "customers",
    title: "CUSTOMERS / CRM",
    span: "lg:col-span-1",
    line: "Every chat becomes a saved customer and a lead stage you can work.",
    href: "/features/customers",
    icon: Users,
    image: "/images/customer database.png",
    pill: "Auto VIP Segments",
  },
  {
    id: "analytics",
    title: "ANALYTICS & BOOKINGS",
    span: "lg:col-span-1",
    line: "The numbers that matter, plus appointments and services for shops that book.",
    href: "/features/analytics",
    icon: ChartLineUp,
    image: "/images/analytics.png",
    pill: "Revenue & Conversion",
  },
  {
    id: "platforms",
    title: "PLATFORMS & INTEGRATIONS",
    span: "lg:col-span-2",
    line: "Every channel Kasi runs on and every tool it connects to.",
    href: "/platforms",
    icon: ShareNetwork,
    image: "/images/platforms.png",
    pill: "WhatsApp · IG · Telegram",
  },
];

export function FeaturesHub() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Features | Kasi Operating System";
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-hidden flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 pb-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Spec 4.1 Hero */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/20 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#0D6E42]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                CAPABILITIES · KASI OS
              </span>
            </div>

            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[62px] text-[#141C17] tracking-tight leading-[1.08]">
              Everything Kasi does,{" "}
              <span className="relative inline-block text-[#0D6E42]">
                <span className="relative z-10">in one place.</span>
                <span
                  className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-4 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#141C17]/80 font-light leading-relaxed max-w-2xl mx-auto">
              Kasi is not a chatbot bolted onto your shop. It is the system your shop runs on. Here is every part of it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-base shadow-sm hover:shadow-md hover:brightness-105 transition-all text-center"
              >
                Start free
              </Link>
              <Link
                to="/#demo-video"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#141C17] font-semibold text-base border border-[#141C17]/15 shadow-xs hover:border-[#0D6E42] hover:bg-[#0D6E42]/5 transition-all text-center"
              >
                Watch explainer video
              </Link>
            </div>
          </div>

          {/* Blended Master Overview Studio Frame */}
          <div className="mb-20 sm:mb-28 max-w-[1100px] mx-auto relative">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#DBF361]/22 blur-[130px] rounded-full -z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div className="rounded-[28px] sm:rounded-[34px] p-3 sm:p-5 bg-gradient-to-br from-[#EAF2E8] via-white to-[#E7F0E8] border border-[#141C17]/10 shadow-[0_24px_60px_-20px_rgba(13,110,66,0.18)] overflow-hidden">
              <div className="rounded-2xl overflow-hidden bg-white border border-[#141C17]/8">
                {/* Subtle studio chrome bar */}
                <div className="px-4 py-2.5 bg-[#FAFCF9] border-b border-[#141C17]/8 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141C17]/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#141C17]/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D6E42]/45" />
                  </div>
                  <span className="font-mono text-[10px] text-[#0D6E42] bg-[#EBF8EF] px-2.5 py-0.5 rounded-full font-semibold">
                    Live Operating Overview
                  </span>
                </div>
                <div className="relative">
                  <img
                    src="/images/dashboard.png"
                    alt="Kasi Master Overview"
                    className="w-full h-auto object-cover object-left-top"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spec 4.2 Bento Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {FEATURES_LIST.map((feat, idx) => {
              const IconComp = feat.icon;

              return (
                <motion.div
                  key={feat.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className={`bg-white rounded-[26px] border border-[#141C17]/10 p-6 sm:p-7 shadow-2xs hover:shadow-[0_18px_40px_-16px_rgba(13,110,66,0.16)] hover:-translate-y-1 hover:border-[#0D6E42]/30 transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                    feat.span
                  } ${feat.featured ? "ring-2 ring-[#0D6E42]/20 bg-gradient-to-br from-white via-white to-[#F2F7EE]" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0D6E42]/10 text-[#0D6E42] flex items-center justify-center group-hover:bg-[#0D6E42] group-hover:text-[#DBF361] transition-colors">
                          <IconComp size={22} weight="duotone" />
                        </div>
                        {feat.tag && (
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#141C17] bg-[#DBF361] px-2.5 py-0.5 rounded-full">
                            {feat.tag}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[#141C17]/35">
                        0{idx + 1}
                      </span>
                    </div>

                    <h2 className="font-display font-medium text-xl sm:text-2xl text-[#141C17] tracking-tight mb-2 group-hover:text-[#0D6E42] transition-colors">
                      {feat.title}
                    </h2>

                    <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed mb-5">
                      {feat.line}
                    </p>

                    {/* Softly Blended Studio Preview Frame */}
                    <div className="w-full h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#EDF4EB] to-[#F6F8F3] border border-[#141C17]/8 p-2 mb-6 relative">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-[#141C17]/6 relative">
                        <img
                          src={feat.image}
                          alt={`${feat.title} preview`}
                          className="w-full h-full object-cover object-left-top group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/55 to-transparent pointer-events-none"
                          aria-hidden="true"
                        />
                        <span className="absolute bottom-2 left-2.5 px-2.5 py-0.5 rounded-full bg-[#141C17]/85 backdrop-blur-xs text-[10px] font-mono font-medium text-[#DBF361]">
                          {feat.pill}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={feat.href}
                    className="inline-flex items-center justify-between font-semibold text-sm text-[#0D6E42] hover:text-[#1C774E] group/link pt-3.5 border-t border-[#141C17]/8"
                  >
                    <span>Explore feature</span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default FeaturesHub;
