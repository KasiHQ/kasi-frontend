// spec 2.4
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkle,
  PaperPlaneRight,
  CheckCircle,
  Clock,
  Storefront,
  ShieldCheck,
  ChatCircleDots,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";

const INSTRUCT_PRESETS = [
  {
    id: "express",
    command: "Offer express 30-min Abuja delivery at ₦2,500",
    kasiReply:
      "Good news! Our rider is nearby in Wuse — we can get your Chocolate Fudge Cake ×2 & Samosa ×5 to you in 30 mins for ₦2,500. Should I send your payment link?",
    summary: "Buyer ready · Express Abuja delivery offered (₦2,500)",
  },
  {
    id: "bonus",
    command: "Add 2 free Samosas if she checks out now",
    kasiReply:
      "Since it's your second order this week, my boss says I should add 2 extra hot Samosas on the house if we lock it in now! Ready for the Paystack link?",
    summary: "VIP perk applied (+2 Samosas) · Closing order",
  },
  {
    id: "pickup",
    command: "Let her know Jabi store pickup is ready in 15m",
    kasiReply:
      "If you prefer to swing by our Jabi kitchen, your box will be freshly packed in 15 minutes with ₦0 delivery fee! Pickup or delivery?",
    summary: "Jabi 15-min pickup option shared · Awaiting choice",
  },
];

const FULFILMENT_PHASES = [
  {
    id: "Paid",
    label: "Paid",
    actionLabel: "Mark Prepared →",
    badgeBg: "bg-[#EBF8EF] text-[#0D6E42]",
    pingText: "Payment of ₦12,500 verified via Paystack. Order queued for packing.",
    time: "11:45 AM",
  },
  {
    id: "Prepared",
    label: "Prepared",
    actionLabel: "Mark Ready →",
    badgeBg: "bg-[#DBF361]/55 text-[#141C17]",
    pingText: "WhatsApp sent to Temi: “Your order is freshly packed and being double-checked!”",
    time: "11:51 AM",
  },
  {
    id: "Ready",
    label: "Ready",
    actionLabel: "Confirm Picked up →",
    badgeBg: "bg-[#0D6E42] text-white",
    pingText: "WhatsApp sent to Temi: “Ready for pickup at Jabi! Store pin & hours attached.”",
    time: "11:54 AM",
  },
  {
    id: "Picked up",
    label: "Picked up",
    actionLabel: "Replay flow ↻",
    badgeBg: "bg-[#141C17] text-[#DBF361]",
    pingText: "WhatsApp sent to Temi: “Order picked up — thank you for shopping with us!”",
    time: "12:08 PM",
  },
];

function LiveChatsShowcase({ screenshot, shouldReduceMotion }) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || isHovered) return;
    const timer = setInterval(() => {
      setSelectedPresetIdx((prev) => (prev + 1) % INSTRUCT_PRESETS.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, isHovered]);

  const preset = INSTRUCT_PRESETS[selectedPresetIdx];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-[28px] p-4 sm:p-6 lg:p-7 bg-gradient-to-br from-[#EAF2E8] via-[#F2F6EE] to-[#E5EFE6] border border-[#141C17]/10 shadow-[0_20px_50px_-20px_rgba(13,110,66,0.16),0_2px_8px_rgba(20,28,23,0.05)] overflow-hidden"
    >
      {/* Subtle blended real-product texture in deep background (softly feathered, zero harsh borders) */}
      <img
        src={screenshot}
        alt="Live Chats Workspace Backdrop"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-left-top opacity-[0.14] blur-[2px] scale-105 pointer-events-none select-none"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#EAF2E8] via-[#F2F6EE]/80 to-[#EAF2E8]/70 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#DBF361]/35 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Crisp Interactive Foreground App Window */}
      <div className="relative z-10 rounded-[22px] bg-white/95 backdrop-blur-md border border-[#141C17]/10 shadow-[0_12px_32px_-12px_rgba(20,28,23,0.14)] overflow-hidden">
        {/* Top App Chrome + Active Thread Header */}
        <div className="px-4 sm:px-5 py-3 bg-[#FAFCF9] border-b border-[#141C17]/8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-[#141C17]/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#141C17]/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#141C17]/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D6E42]/45" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0D6E42] text-white font-display text-xs font-semibold flex items-center justify-center shrink-0">
              FG
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-[#141C17] truncate">
                  FGA · Abuja
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF8EF] border border-[#0D6E42]/15 text-[10px] font-medium text-[#0D6E42]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  WhatsApp
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-[#F6F8F3] border border-[#141C17]/10 text-[10px] font-mono font-medium text-[#141C17]/70">
              AI Active
            </span>
          </div>
        </div>

        {/* Body: Compact Sidebar + Focused Conversation & Instruct Kasi */}
        <div className="grid grid-cols-1 sm:grid-cols-12">
          {/* Mini Left Thread Rail (Hidden on tiny screens so chat stays 100% legible) */}
          <div className="hidden sm:flex sm:col-span-4 border-r border-[#141C17]/8 bg-[#F9FBF7] p-3 flex-col gap-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#141C17]/45 px-1.5">
              Live Inbox (3)
            </div>
            {[
              { initials: "FG", name: "FGA", preview: "Do you deliver in Abuja?", active: true, tag: "Negotiating" },
              { initials: "TM", name: "Temi", preview: "Paid ₦12,500 · Jabi", active: false, tag: "Paid" },
              { initials: "PM", name: "Prince Lawal", preview: "Checking cake sizes", active: false, tag: "Browsing" },
            ].map((thread) => (
              <div
                key={thread.name}
                className={`p-2.5 rounded-xl border transition-all ${
                  thread.active
                    ? "bg-white border-[#0D6E42]/25 shadow-2xs"
                    : "bg-transparent border-transparent opacity-70"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-[#141C17] truncate">
                    {thread.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      thread.tag === "Paid"
                        ? "bg-[#DBF361] text-[#141C17] font-semibold"
                        : "bg-[#0D6E42]/10 text-[#0D6E42]"
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

          {/* Right Main Conversation + AI Summary + Instruct Kasi */}
          <div className="sm:col-span-8 p-3.5 sm:p-4 flex flex-col justify-between gap-3 bg-white">
            {/* Highlighted AI Summary Banner */}
            <div className="rounded-xl bg-gradient-to-r from-[#EBF8EF] to-[#F6FBE9] border border-[#0D6E42]/20 px-3 py-2.5 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#0D6E42] text-[#DBF361] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkle size={13} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D6E42]">
                    AI Summary
                  </span>
                  <span className="font-mono text-[9px] text-[#0D6E42]/75">
                    Live sync
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={preset.summary}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-[#141C17]/90 font-medium leading-snug mt-0.5"
                  >
                    {preset.summary}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Crisp Legible Chat Messages */}
            <div className="space-y-2.5 py-1">
              <div className="max-w-[82%] bg-[#F6F8F3] border border-[#141C17]/8 rounded-2xl rounded-tl-xs px-3.5 py-2.5">
                <p className="text-xs text-[#141C17] leading-relaxed">
                  I want Chocolate Fudge Cake ×2 and Samosa ×5. How fast can I get it in Abuja?
                </p>
                <span className="text-[9px] font-mono text-[#141C17]/45 mt-1 block">
                  CUSTOMER · 2:14 PM
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={preset.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="ml-auto max-w-[90%] bg-[#0D6E42] text-white rounded-2xl rounded-tr-xs px-3.5 py-2.5 shadow-sm"
                >
                  <p className="text-xs leading-relaxed text-white/95">
                    {preset.kasiReply}
                  </p>
                  <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-[#DBF361]">
                    <span>KASI AI · STEERED BY YOU</span>
                    <span>2:14 PM ✓✓</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive "Instruct Kasi" Bar */}
            <div className="rounded-xl bg-[#141C17] text-white p-3 border border-[#141C17]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#DBF361]">
                  <SlidersHorizontal size={12} weight="bold" />
                  Instruct Kasi (click to test)
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-white/60 font-mono">
                  <PaperPlaneRight size={11} weight="fill" className="text-[#DBF361]" />
                  1-line whisper
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {INSTRUCT_PRESETS.map((item, idx) => {
                  const active = idx === selectedPresetIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPresetIdx(idx)}
                      className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border ${
                        active
                          ? "bg-[#DBF361] text-[#141C17] border-[#DBF361] font-semibold shadow-xs"
                          : "bg-white/8 text-white/80 border-white/10 hover:bg-white/15 hover:text-white"
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
    </div>
  );
}

function FulfilmentShowcase({ screenshot, shouldReduceMotion }) {
  const [phaseIdx, setPhaseIdx] = useState(1); // Start at "Prepared"
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || isHovered) return;
    const timer = setInterval(() => {
      setPhaseIdx((prev) => (prev + 1) % FULFILMENT_PHASES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, isHovered]);

  const currentPhase = FULFILMENT_PHASES[phaseIdx];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-[28px] p-4 sm:p-6 lg:p-7 bg-gradient-to-br from-[#EDF3EA] via-[#F4F7F0] to-[#E6F0E7] border border-[#141C17]/10 shadow-[0_20px_50px_-20px_rgba(13,110,66,0.16),0_2px_8px_rgba(20,28,23,0.05)] overflow-hidden"
    >
      {/* Softly blended background texture without harsh grey modal split */}
      <img
        src={screenshot}
        alt="Orders and Fulfilment Workspace Backdrop"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-right-top opacity-[0.12] blur-[2px] scale-105 pointer-events-none select-none"
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-[#EAF2E8]/95 via-[#F4F7F0]/85 to-[#EBF4EA]/85 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#0D6E42]/12 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Crisp Foreground Fulfilment Pipeline Surface */}
      <div className="relative z-10 rounded-[22px] bg-white/95 backdrop-blur-md border border-[#141C17]/10 shadow-[0_12px_32px_-12px_rgba(20,28,23,0.14)] overflow-hidden">
        {/* Top Bar */}
        <div className="px-4 sm:px-5 py-3 bg-[#FAFCF9] border-b border-[#141C17]/8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0D6E42]/10 text-[#0D6E42] flex items-center justify-center">
              <Storefront size={16} weight="duotone" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-[#141C17] block leading-none">
                Orders & Fulfilment
              </span>
              <span className="text-[10px] font-mono text-[#141C17]/55">
                Only verified paid orders enter your queue
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF8EF] text-[#0D6E42] text-[10px] font-mono font-semibold">
            <ShieldCheck size={13} weight="fill" />
            Paystack Verified
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Active Order Card */}
          <div className="rounded-2xl bg-[#F6F8F3] border border-[#141C17]/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#141C17]/8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-base text-[#141C17]">
                    Temi
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-semibold">
                    Store Pickup · Jabi
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#141C17]/55 block mt-0.5">
                  REF: KAS-CART-32-43D9 · Samosa Box & Fudge Cake
                </span>
              </div>

              <div className="text-right">
                <span className="font-display font-bold text-base text-[#0D6E42] block">
                  ₦12,500
                </span>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${currentPhase.badgeBg}`}
                >
                  {currentPhase.label}
                </span>
              </div>
            </div>

            {/* Interactive 4-Phase Tracker */}
            <div className="mt-3.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#141C17]/55 uppercase tracking-wider mb-2">
                <span>Pathway Progress (click any step)</span>
                <span className="text-[#0D6E42] font-semibold">
                  Step {phaseIdx + 1} of 4
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {FULFILMENT_PHASES.map((phase, idx) => {
                  const isDone = idx < phaseIdx;
                  const isCurrent = idx === phaseIdx;
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => setPhaseIdx(idx)}
                      className={`py-2 px-1.5 rounded-xl text-center font-mono text-[10px] sm:text-xs transition-all cursor-pointer border ${
                        isCurrent
                          ? "bg-[#0D6E42] text-white border-[#0D6E42] font-semibold shadow-sm scale-[1.02]"
                          : isDone
                          ? "bg-[#EBF8EF] text-[#0D6E42] border-[#0D6E42]/20 font-medium"
                          : "bg-white text-[#141C17]/45 border-[#141C17]/10 hover:border-[#141C17]/25"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center gap-1">
                        {isDone && <CheckCircle size={12} weight="fill" />}
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DBF361] animate-pulse" />
                        )}
                        <span className="truncate">{phase.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Action Bar */}
            <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-[#141C17]/8">
              <div className="flex items-center gap-2 text-xs text-[#141C17]/75">
                <Clock size={15} weight="duotone" className="text-[#0D6E42] shrink-0" />
                <span>One tap advances the order & pings customer</span>
              </div>

              <button
                type="button"
                onClick={() => setPhaseIdx((prev) => (prev + 1) % FULFILMENT_PHASES.length)}
                className="px-4 py-2 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-xs hover:brightness-105 active:scale-98 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                {currentPhase.actionLabel}
              </button>
            </div>
          </div>

          {/* Live Automatic Customer WhatsApp Notification Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
              className="rounded-xl bg-[#141C17] text-white px-3.5 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
                  <img
                    src="/logos/whatsapp.svg"
                    alt="WhatsApp"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <p className="text-xs text-white/90 leading-snug truncate sm:whitespace-normal">
                  {currentPhase.pingText}
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#DBF361] shrink-0">
                {currentPhase.time}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function LiveProductProof() {
  const copy = HOME_COPY["2.4"];
  const shouldReduceMotion = useReducedMotion();

  const rowPills = [
    ["Unified DM Inbox", "1-Line AI Summary", "Live Whisper Control"],
    ["Paystack-Verified Queue", "4-Step Phase Tracker", "Auto WhatsApp Pings"],
  ];

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F6F8F3] border-y border-[#141C17]/8 font-poppins overflow-hidden relative">
      {/* Soft subtle center ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[520px] rounded-full bg-[#0D6E42]/[0.04] blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 relative z-10">
        {copy.rows.map((row, index) => {
          const isEven = index % 2 === 1;
          const pills = rowPills[index] || [];

          return (
            <div
              key={row.title}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
            >
              {/* Editorial Copy Column */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, x: isEven ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6E42]/8 border border-[#0D6E42]/15 mb-5">
                  <ChatCircleDots size={14} weight="duotone" className="text-[#0D6E42]" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0D6E42]">
                    0{index + 1} · {index === 0 ? "Oversight & Control" : "Order Pipeline"}
                  </span>
                </div>

                <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-[38px] text-[#141C17] tracking-tight leading-[1.15]">
                  {row.title}
                </h3>

                <p className="mt-4 font-light text-base sm:text-lg text-[#141C17]/80 leading-relaxed">
                  {row.caption}
                </p>

                {/* Feature capability micro-pills */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {pills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#141C17]/10 text-xs font-medium text-[#141C17]/80 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E42]" />
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    to={row.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#141C17]/15 font-semibold text-sm text-[#0D6E42] hover:bg-[#0D6E42] hover:text-white hover:border-[#0D6E42] transition-all shadow-2xs group"
                  >
                    <span>Explore</span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </motion.div>

              {/* Blended Interactive Studio Product Column */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65 }}
                className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                {index === 0 ? (
                  <LiveChatsShowcase
                    screenshot={row.screenshot}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ) : (
                  <FulfilmentShowcase
                    screenshot={row.screenshot}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LiveProductProof;
