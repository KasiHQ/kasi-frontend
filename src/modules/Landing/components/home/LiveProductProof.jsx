// spec 2.4 — Clean Architectural Application Sheets (zero AI sparkles, zero blurred glow blobs, concrete Nigerian order math)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  PaperPlaneRight,
  Check,
  Storefront,
  ShieldCheck,
  SlidersHorizontal,
  NotePencil,
} from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";

const INSTRUCT_PRESETS = [
  {
    id: "express",
    command: "Tell her Wuse 2 rider leaves in 25 mins for ₦2,650",
    kasiReply:
      "Our dispatch rider heads toward Wuse 2 in 25 minutes — delivery is ₦2,650, bringing your Chocolate Fudge Cake ×2 (₦550) and Samosa ×5 (₦500) total to ₦3,700. Ready for your Paystack link?",
    summary: "Cart: Fudge Cake ×2, Samosa ×5 (₦1,050) · Quoted Wuse 2 delivery (₦2,650)",
  },
  {
    id: "bonus",
    command: "Add 2 extra Samosas on the house since she's a regular",
    kasiReply:
      "Since this is your third order this month, we're packing 2 extra hot Samosas free in your box! Should we send to your Wuse address or will you pick up at Jabi?",
    summary: "Cart: Fudge Cake ×2, Samosa ×5 (+2 complimentary) · Awaiting delivery vs pickup",
  },
  {
    id: "pickup",
    command: "Offer Jabi pickup in 15 mins at ₦0 delivery fee",
    kasiReply:
      "If you want to swing by 14B Mike Akhigbe Way, Jabi, your box will be packed hot in 15 minutes with ₦0 delivery fee (total stays ₦1,050). Pickup or rider?",
    summary: "Cart: ₦1,050 · Jabi 15-min pickup (₦0 fee) offered",
  },
];

const FULFILMENT_PHASES = [
  {
    id: "Paid",
    label: "Paid",
    actionLabel: "Mark Prepared →",
    badgeStyle: "bg-[#EBF8EF] text-[#0D6E42] border-[#0D6E42]/20",
    pingText: "Paystack charge.success verified (₦1,050). Order added to packing list.",
    time: "11:45 AM",
  },
  {
    id: "Prepared",
    label: "Prepared",
    actionLabel: "Mark Ready →",
    badgeStyle: "bg-[#DBF361] text-[#141C17] border-[#141C17]/15",
    pingText: "Sent to Temi on WhatsApp: “Your Samosa ×5 & Fudge Cake ×2 are freshly packed.”",
    time: "11:51 AM",
  },
  {
    id: "Ready",
    label: "Ready",
    actionLabel: "Confirm Picked up →",
    badgeStyle: "bg-[#0D6E42] text-white border-[#0D6E42]",
    pingText: "Sent to Temi on WhatsApp: “Ready for pickup at 14B Mike Akhigbe Way, Jabi.”",
    time: "11:54 AM",
  },
  {
    id: "Picked up",
    label: "Picked up",
    actionLabel: "Reset demo ↻",
    badgeStyle: "bg-[#141C17] text-[#DBF361] border-[#141C17]",
    pingText: "Sent to Temi on WhatsApp: “Order picked up. Receipt saved to your profile.”",
    time: "12:08 PM",
  },
];

function LiveChatsSheet({ shouldReduceMotion }) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || isHovered) return;
    const timer = setInterval(() => {
      setSelectedPresetIdx((prev) => (prev + 1) % INSTRUCT_PRESETS.length);
    }, 5600);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, isHovered]);

  const preset = INSTRUCT_PRESETS[selectedPresetIdx];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-xl bg-white border border-[#141C17]/15 shadow-[0_2px_8px_rgba(20,28,23,0.05),0_18px_36px_-18px_rgba(20,28,23,0.12)] overflow-hidden"
    >
      {/* Top Application Header */}
      <div className="px-4 py-3 bg-[#FAFAF7] border-b border-[#141C17]/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-md bg-[#0D6E42] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
            FG
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-[#141C17] truncate">
                FGA · +234 805 ••• 0517
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EBF8EF] text-[10px] font-mono font-medium text-[#0D6E42]">
                WhatsApp
              </span>
            </div>
          </div>
        </div>

        <span className="font-mono text-[11px] text-[#141C17]/60 shrink-0">
          Kay&apos;s Sweet Confections
        </span>
      </div>

      {/* Split Workspace: Thread List + Active Conversation */}
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="hidden sm:flex sm:col-span-4 border-r border-[#141C17]/10 bg-[#F7F8F4] p-3 flex-col gap-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#141C17]/45 px-1.5 pb-1">
            Inbox · 3 Open
          </div>
          {[
            { name: "FGA", preview: "How fast to Wuse 2?", active: true, tag: "Active" },
            { name: "Temi", preview: "Paid ₦1,050 · Jabi", active: false, tag: "Paid" },
            { name: "Prince Lawal", preview: "Meat pie ×10 bulk?", active: false, tag: "Negotiating" },
          ].map((thread) => (
            <div
              key={thread.name}
              className={`p-2.5 rounded-lg border ${
                thread.active
                  ? "bg-white border-[#141C17]/15"
                  : "bg-transparent border-transparent opacity-65"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#141C17] truncate">
                  {thread.name}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs ${
                    thread.tag === "Paid"
                      ? "bg-[#DBF361] text-[#141C17] font-semibold"
                      : "bg-[#141C17]/8 text-[#141C17]/75"
                  }`}
                >
                  {thread.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#141C17]/60 truncate mt-0.5">
                {thread.preview}
              </p>
            </div>
          ))}
        </div>

        <div className="sm:col-span-8 p-4 flex flex-col justify-between gap-3.5 bg-white">
          {/* One-line Summary Strip (no AI sparkle icon) */}
          <div className="rounded-lg bg-[#F6F8F3] border border-[#141C17]/10 px-3 py-2.5 flex items-start gap-2.5">
            <NotePencil size={15} weight="bold" className="text-[#0D6E42] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0D6E42] block">
                Thread Summary
              </span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={preset.summary}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="text-xs text-[#141C17] font-medium leading-snug mt-0.5"
                >
                  {preset.summary}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Buyer + Kasi Messages */}
          <div className="space-y-2.5">
            <div className="max-w-[84%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-xl rounded-tl-xs px-3.5 py-2.5">
              <p className="text-xs text-[#141C17] leading-relaxed">
                I need Chocolate Fudge Cake ×2 and Samosa ×5. How soon can I get it in Wuse 2?
              </p>
              <span className="text-[9px] font-mono text-[#141C17]/45 mt-1 block">
                FGA · 2:14 PM
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={preset.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="ml-auto max-w-[90%] bg-[#0D6E42] text-white rounded-xl rounded-tr-xs px-3.5 py-2.5"
              >
                <p className="text-xs leading-relaxed text-white/95">
                  {preset.kasiReply}
                </p>
                <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-[#DBF361]">
                  <span>KASI · FOLLOWING YOUR NOTE</span>
                  <span>2:14 PM ✓✓</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive "Instruct Kasi" Control */}
          <div className="rounded-lg bg-[#141C17] text-white p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#DBF361]">
                <SlidersHorizontal size={12} weight="bold" />
                Instruct Kasi — tap an instruction
              </span>
              <PaperPlaneRight size={12} weight="fill" className="text-white/60" />
            </div>

            <div className="flex flex-col gap-1.5">
              {INSTRUCT_PRESETS.map((item, idx) => {
                const active = idx === selectedPresetIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPresetIdx(idx)}
                    className={`text-left text-[11px] px-2.5 py-1.5 rounded transition-colors cursor-pointer border ${
                      active
                        ? "bg-[#DBF361] text-[#141C17] border-[#DBF361] font-semibold"
                        : "bg-white/6 text-white/80 border-white/10 hover:bg-white/12 hover:text-white"
                    }`}
                  >
                    “{item.command}”
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FulfilmentSheet({ shouldReduceMotion }) {
  const [phaseIdx, setPhaseIdx] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || isHovered) return;
    const timer = setInterval(() => {
      setPhaseIdx((prev) => (prev + 1) % FULFILMENT_PHASES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, isHovered]);

  const currentPhase = FULFILMENT_PHASES[phaseIdx];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-xl bg-white border border-[#141C17]/15 shadow-[0_2px_8px_rgba(20,28,23,0.05),0_18px_36px_-18px_rgba(20,28,23,0.12)] overflow-hidden"
    >
      {/* Top Bar */}
      <div className="px-4 py-3 bg-[#FAFAF7] border-b border-[#141C17]/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Storefront size={17} weight="regular" className="text-[#0D6E42]" />
          <span className="text-xs sm:text-sm font-semibold text-[#141C17]">
            Orders & Fulfilment
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF8EF] text-[#0D6E42] text-[10px] font-mono font-semibold">
          <ShieldCheck size={13} weight="fill" />
          Paystack Verified
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Order Record */}
        <div className="rounded-lg bg-[#F6F8F3] border border-[#141C17]/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#141C17]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-base text-[#141C17]">
                  Temi
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-white border border-[#141C17]/12 font-mono text-[10px] text-[#141C17]/80">
                  Pickup · Jabi
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#141C17]/60 block mt-0.5">
                KAS-CART-32-43D9 · Samosa ×5, Chocolate Fudge Cake ×2
              </span>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-base text-[#141C17] block">
                ₦1,050
              </span>
              <span
                className={`inline-block mt-0.5 px-2 py-0.5 rounded-xs border text-[10px] font-mono font-semibold ${currentPhase.badgeStyle}`}
              >
                {currentPhase.label}
              </span>
            </div>
          </div>

          {/* 4-Step Phase Tracker */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#141C17]/55 uppercase tracking-wider mb-2">
              <span>Phase Tracker</span>
              <span>{phaseIdx + 1} / 4</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {FULFILMENT_PHASES.map((phase, idx) => {
                const isDone = idx < phaseIdx;
                const isCurrent = idx === phaseIdx;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setPhaseIdx(idx)}
                    className={`py-2 px-1.5 rounded-md text-center font-mono text-[10px] sm:text-xs transition-colors cursor-pointer border ${
                      isCurrent
                        ? "bg-[#0D6E42] text-white border-[#0D6E42] font-semibold"
                        : isDone
                        ? "bg-[#EBF8EF] text-[#0D6E42] border-[#0D6E42]/20 font-medium"
                        : "bg-white text-[#141C17]/50 border-[#141C17]/12 hover:border-[#141C17]/30"
                    }`}
                  >
                    <span className="inline-flex items-center justify-center gap-1">
                      {isDone && <Check size={11} weight="bold" />}
                      <span className="truncate">{phase.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-[#141C17]/10">
            <span className="text-xs text-[#141C17]/70">
              Advancing updates the buyer on WhatsApp immediately.
            </span>

            <button
              type="button"
              onClick={() => setPhaseIdx((prev) => (prev + 1) % FULFILMENT_PHASES.length)}
              className="px-4 py-2 rounded-lg bg-[#141C17] text-[#DBF361] font-mono font-semibold text-xs hover:bg-[#0D6E42] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {currentPhase.actionLabel}
            </button>
          </div>
        </div>

        {/* Outbound WhatsApp Status Log */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase.id}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="rounded-lg bg-[#F6F8F3] border border-[#141C17]/12 px-3.5 py-2.5 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/logos/whatsapp.svg"
                alt="WhatsApp"
                className="w-4 h-4 object-contain shrink-0"
              />
              <p className="text-xs text-[#141C17]/85 leading-snug truncate sm:whitespace-normal">
                {currentPhase.pingText}
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#141C17]/55 shrink-0">
              {currentPhase.time}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LiveProductProof() {
  const copy = HOME_COPY["2.4"];
  const shouldReduceMotion = useReducedMotion();

  const specDetails = [
    [
      "Reads every open WhatsApp, Instagram, and Telegram thread in one list.",
      "Summarizes cart items, price stage, and delivery choice in one line.",
      "Whisper a single instruction; Kasi phrases it naturally to the customer.",
    ],
    [
      "Unpaid chats stay out — only Paystack-verified orders enter the queue.",
      "Separate tracks for store pickup vs road dispatch.",
      "Every tap sends the buyer their packing status, pickup pin, or rider phone.",
    ],
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F6F8F3] border-y border-[#141C17]/12 font-poppins overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-[#141C17]/12">
        {copy.rows.map((row, index) => {
          const isEven = index % 2 === 1;
          const bullets = specDetails[index] || [];

          return (
            <div
              key={row.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                index === 0 ? "pb-20 sm:pb-24" : "pt-20 sm:pt-24"
              }`}
            >
              {/* Copy Column (no AI eyebrow badges, no identical float-up motion) */}
              <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <span className="font-mono text-xs font-semibold text-[#0D6E42] block mb-3">
                  0{index + 1}
                </span>

                <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-[36px] text-[#141C17] tracking-tight leading-[1.15]">
                  {row.title}
                </h3>

                <p className="mt-3.5 font-normal text-base sm:text-lg text-[#141C17]/80 leading-relaxed">
                  {row.caption}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-[#141C17]/10 pt-5">
                  {bullets.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm text-[#141C17]/75 leading-relaxed"
                    >
                      <Check size={15} weight="bold" className="text-[#0D6E42] shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <Link
                    to={row.href}
                    className="inline-flex items-center gap-2 font-semibold text-sm text-[#0D6E42] hover:text-[#141C17] transition-colors group"
                  >
                    <span>Explore</span>
                    <ArrowRight
                      size={15}
                      weight="bold"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>

              {/* Interactive Application Sheet Column */}
              <div className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                {index === 0 ? (
                  <LiveChatsSheet shouldReduceMotion={shouldReduceMotion} />
                ) : (
                  <FulfilmentSheet shouldReduceMotion={shouldReduceMotion} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LiveProductProof;
