// spec 2.3
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChatTeardropDots,
  Package,
  ChartLineUp,
  ArrowRight,
  CheckCircle,
  TrendUp,
  ShieldCheck,
} from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { DesignedPlaceholder } from "../../../../components/common/DesignedPlaceholder";

const ICONS = [ChatTeardropDots, Package, ChartLineUp];

function PillarMicroPreview({ index }) {
  if (index === 0) {
    // IT SELLS: Live negotiation guardrail & instant Paystack lock
    return (
      <div className="w-full rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 p-3.5 mb-6 space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-[#141C17]/60">Price Floor Guardrail</span>
          <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#0D6E42] bg-[#EBF8EF] px-2 py-0.5 rounded-full text-[10px]">
            <ShieldCheck size={12} weight="fill" />
            Protected
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#141C17]/10 overflow-hidden relative">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#0D6E42] to-[#25D366]" />
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
          <span className="text-[#141C17]/55">Floor ₦30,000</span>
          <span className="font-semibold text-[#141C17]">Closed @ ₦32,500 ✓</span>
        </div>
      </div>
    );
  }

  if (index === 1) {
    // IT FULFILS: Live 3-step order progression & auto customer ping
    return (
      <div className="w-full rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 p-3.5 mb-6 space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#141C17]">Order #1048 · Paid</span>
          <span className="font-mono text-[10px] text-[#0D6E42] font-semibold">
            WhatsApp pinged
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
          <div className="py-1.5 rounded-lg bg-[#EBF8EF] text-[#0D6E42] font-medium text-center flex items-center justify-center gap-1">
            <CheckCircle size={11} weight="fill" />
            Paid
          </div>
          <div className="py-1.5 rounded-lg bg-[#0D6E42] text-white font-semibold text-center flex items-center justify-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DBF361] animate-pulse" />
            Packed
          </div>
          <div className="py-1.5 rounded-lg bg-white border border-[#141C17]/10 text-[#141C17]/45 text-center">
            Sent
          </div>
        </div>
      </div>
    );
  }

  // IT GROWS: Saved CRM customer segment + repeat revenue pulse
  return (
    <div className="w-full rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 p-3.5 mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] text-[#141C17]/55 uppercase block">
            Repeat VIP Buyers
          </span>
          <span className="font-display font-semibold text-base text-[#141C17]">
            +38% this month
          </span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DBF361] text-[#141C17] font-mono text-[10px] font-bold">
          <TrendUp size={12} weight="bold" />
          Auto-saved
        </div>
      </div>
      <div className="flex items-end gap-1 h-6 pt-1">
        {[35, 48, 42, 62, 58, 78, 96].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t-sm transition-all ${
              i === 6 ? "bg-[#0D6E42]" : "bg-[#0D6E42]/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function PillarsSection() {
  const copy = HOME_COPY["2.3"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins">
      {/* 2-col header: left title with marker, right sub copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-14 sm:mb-18">
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] text-[#141C17] tracking-tight leading-[1.12]">
            One assistant.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">The whole shop.</span>
              <span
                className="absolute left-0 bottom-1.5 sm:bottom-2 w-full h-3 sm:h-3.5 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-base sm:text-lg text-[#141C17]/75 leading-relaxed font-light">
            {copy.sub}
          </p>
        </div>
      </div>

      {/* 3 bento cards: side-by-side swipeable track on mobile, 3-column grid on desktop */}
      <div className="flex overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 scrollbar-none">
        {copy.pillars.map((pillar, index) => {
          const IconComponent = ICONS[index];
          const verb = pillar.tag.replace("IT ", "").toLowerCase();
          const labelTitle = `It ${verb.charAt(0).toUpperCase() + verb.slice(1)}`;

          return (
            <motion.div
              key={pillar.tag}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="w-[82vw] max-w-[330px] sm:w-[340px] lg:w-auto lg:max-w-none snap-center bg-white rounded-[26px] border border-[#141C17]/10 p-5 sm:p-6 shadow-[0_2px_10px_rgba(20,28,23,0.03)] hover:shadow-[0_18px_40px_-16px_rgba(13,110,66,0.14)] hover:-translate-y-1 flex flex-col justify-between overflow-hidden group hover:border-[#0D6E42]/25 transition-all duration-300 shrink-0 lg:shrink"
            >
              <div>
                {/* Top: Real Vendor Photo with refined editorial gradient + subtle tag */}
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-[#141C17]/8 bg-[#F6F8F3] relative">
                  {pillar.photo ? (
                    <>
                      <img
                        src={pillar.photo}
                        alt={pillar.placeholderCaption || `${labelTitle} vendor in shop`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="eager"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = "block";
                          }
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#141C17]/55 via-black/10 to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono font-bold tracking-wider text-[#141C17] uppercase shadow-2xs">
                        0{index + 1} · {pillar.tag}
                      </span>
                    </>
                  ) : null}
                  <div style={{ display: pillar.photo ? "none" : "block" }} className="w-full h-full">
                    <DesignedPlaceholder
                      aspect="16/9"
                      caption={pillar.placeholderCaption}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Phosphor duotone icon + Display label with lime marker under verb */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative inline-flex items-center justify-center w-11 h-11 shrink-0">
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-[#DBF361] -z-0 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    <IconComponent
                      size={28}
                      weight="duotone"
                      className="text-[#0D6E42] relative z-10"
                    />
                  </div>

                  <h3 className="font-display font-medium text-2xl text-[#141C17] tracking-tight">
                    It{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10">{verb}</span>
                      <span
                        className="absolute left-0 bottom-0.5 w-full h-2 bg-[#DBF361] rounded-xs -z-0"
                        aria-hidden="true"
                      />
                    </span>
                  </h3>
                </div>

                <p className="text-sm text-[#141C17]/78 leading-relaxed font-normal mb-5">
                  {pillar.body}
                </p>

                {/* Crisp Micro-UI Widget replacing cramped cropped screenshot */}
                <PillarMicroPreview index={index} />
              </div>

              {/* Explore link */}
              <div className="pt-3 border-t border-[#141C17]/8 flex items-center justify-between">
                <Link
                  to={pillar.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D6E42] hover:text-[#1C774E] transition-colors group/link"
                >
                  <span>{pillar.cta}</span>
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default PillarsSection;
