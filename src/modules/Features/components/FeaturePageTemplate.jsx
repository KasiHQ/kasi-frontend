import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";

export function FeaturePageTemplate({
  specId,
  badge,
  headlinePart1,
  highlightText,
  headlinePart2,
  sub,
  screenshot,
  screenshotAlt,
  screenshotCaption,
  problemHeading,
  problemBody,
  movesTitle = "How it actually works",
  moves = [],
  controlsTitle = "What you stay in control of",
  controls = [],
  ctaHeading,
  ctaSub,
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = `${badge || "Feature"} | Kasi`;
  }, [badge]);

  const channels = [
    { name: "WhatsApp", logo: "/logos/whatsapp.svg" },
    { name: "Instagram", logo: "/logos/instagram.svg" },
    { name: "Facebook Messenger", logo: "/logos/messenger.svg" },
    { name: "Telegram", logo: "/logos/telegram.svg" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-hidden flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 pb-20">
        {/* Hero Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Feature Category Tag */}
          {badge && (
            <div className="mb-4">
              <span className="font-poppins text-xs font-semibold tracking-wider text-[#0D6E42] uppercase">
                {badge}
              </span>
            </div>
          )}

          {/* H1 with marker */}
          <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-[62px] text-[#141C17] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            {headlinePart1}{" "}
            <span className="relative inline-block text-[#0D6E42]">
              <span className="relative z-10">{highlightText}</span>
              <span
                className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-4 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>{" "}
            {headlinePart2}
          </h1>

          {/* Sub */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#141C17]/80 font-light max-w-2xl mx-auto leading-relaxed">
            {sub}
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-base shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all text-center"
            >
              Start free
            </Link>
            <Link
              to="/#demo-video"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#141C17] font-semibold text-base border border-[#141C17]/15 shadow-xs hover:border-[#0D6E42] hover:bg-[#0D6E42]/5 active:scale-95 transition-all text-center"
            >
              Watch demo video
            </Link>
          </div>

          {/* Hero Screenshot Showcase */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-12 sm:mt-16 max-w-[1100px] mx-auto relative"
          >
            {/* Ambient Lime Glow behind player */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#DBF361]/20 blur-[130px] rounded-full -z-10 pointer-events-none"
              aria-hidden="true"
            />

            <div className="rounded-[24px] sm:rounded-[32px] p-2.5 sm:p-4 bg-white border border-[#141C17]/10 shadow-2xl overflow-hidden">
              <div className="rounded-2xl overflow-hidden bg-[#F6F8F3] border border-[#141C17]/6">
                <img
                  src={screenshot}
                  alt={screenshotAlt}
                  className="w-full h-auto object-cover object-left-top hover:scale-[1.01] transition-transform duration-500"
                  loading="eager"
                />
              </div>
            </div>

            {screenshotCaption && (
              <p className="mt-4 text-center text-xs sm:text-sm text-[#141C17]/65 font-light">
                {screenshotCaption}
              </p>
            )}
          </motion.div>
        </div>

        {/* Problem It Kills Band (Optional) */}
        {problemHeading && (
          <div className="mt-20 sm:mt-28 py-16 sm:py-20 bg-[#0D6E42] text-white selection:bg-[#DBF361] selection:text-[#141C17]">
            <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-display font-medium text-2xl sm:text-4xl lg:text-[44px] tracking-tight leading-[1.14]">
                {problemHeading}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
                {problemBody}
              </p>
            </div>
          </div>
        )}

        {/* The Moves / Workflow */}
        {moves.length > 0 && (
          <div className="mt-20 sm:mt-28 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight">
                {movesTitle}
              </h2>
            </div>

            <div className="flex overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 snap-x snap-mandatory md:grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 scrollbar-none">
              {moves.map((move, idx) => {
                // Interactive micro-accent for each move
                const moveVisuals = [
                  // Move 1: Recommendation preview
                  <div key="v1" className="mt-4 p-3 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-4 h-4 object-contain" />
                      <span className="font-medium text-[#141C17]/90">Catalog Recommendation</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#0D6E42] bg-[#0D6E42]/10 px-2 py-0.5 rounded-full font-semibold">₦18,500</span>
                  </div>,
                  // Move 2: Negotiation band visual
                  <div key="v2" className="mt-4 p-3 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 text-xs">
                    <div className="flex justify-between text-[11px] font-mono text-[#141C17]/70 mb-1.5">
                      <span>Floor: ₦16,000</span>
                      <span className="text-[#0D6E42] font-semibold">Start: ₦18,500</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#141C17]/10 overflow-hidden relative">
                      <div className="h-full bg-[#0D6E42] rounded-full w-3/4" />
                    </div>
                  </div>,
                  // Move 3: Delivery / Location check
                  <div key="v3" className="mt-4 p-3 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0D6E42] animate-pulse" />
                      <span className="font-medium text-[#141C17]/90">Lekki Phase 1 delivery</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#141C17]/70 font-semibold">+₦2,500</span>
                  </div>,
                  // Move 4: Payment verification
                  <div key="v4" className="mt-4 p-3 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="/logos/paystack.svg" alt="Paystack" className="h-3.5 w-auto object-contain" />
                      <span className="font-medium text-[#141C17]/90">Paystack Webhook</span>
                    </div>
                    <span className="text-[10px] text-[#0D6E42] font-semibold bg-[#DBF361] px-2 py-0.5 rounded-full">CONFIRMED</span>
                  </div>,
                ];

                return (
                  <motion.div
                    key={idx}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center bg-white rounded-[24px] p-6 sm:p-7 border border-[#141C17]/10 shadow-xs hover:shadow-md hover:border-[#0D6E42]/30 transition-all flex flex-col justify-between shrink-0 md:shrink group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full">
                          MOVE 0{idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-3.5 h-3.5 object-contain" />
                          <img src="/logos/instagram.svg" alt="Instagram" className="w-3.5 h-3.5 object-contain" />
                        </div>
                      </div>
                      <h3 className="font-display font-medium text-lg sm:text-xl text-[#141C17] tracking-tight mb-2.5">
                        {move.title}
                      </h3>
                      <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed">
                        {move.desc}
                      </p>
                    </div>

                    {moveVisuals[idx] || null}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Controls / Why It Matters */}
        {controls.length > 0 && (
          <div className="mt-20 sm:mt-28 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight">
                {controlsTitle}
              </h2>
            </div>

            <div className="flex overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 snap-x snap-mandatory md:grid md:grid-cols-3 gap-5 sm:gap-6 scrollbar-none">
              {controls.map((item, idx) => {
                // Official brand & partner logos instead of generic icons
                const controlLogos = [
                  // Control 1: Prices & checkout protection (Paystack)
                  <img key="c1" src="/logos/paystack.svg" alt="Paystack Protected" className="h-5 w-auto object-contain" />,
                  // Control 2: Voice & tone across official platforms (Meta)
                  <img key="c2" src="/logos/meta.svg" alt="Meta Partner" className="h-5 w-auto object-contain" />,
                  // Control 3: Override & Intelligence (OpenAI)
                  <img key="c3" src="/logos/openai.svg" alt="OpenAI" className="h-5 w-auto object-contain" />,
                ];

                return (
                  <motion.div
                    key={idx}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className="min-w-[80vw] sm:min-w-[280px] md:min-w-0 snap-center bg-white rounded-[22px] p-6 border border-[#141C17]/10 shadow-xs hover:border-[#141C17]/20 transition-all shrink-0 md:shrink"
                  >
                    <div className="h-10 px-3 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 inline-flex items-center justify-center mb-4">
                      {controlLogos[idx] || (
                        <ShieldCheck size={22} weight="duotone" className="text-[#0D6E42]" />
                      )}
                    </div>
                    <h3 className="font-display font-medium text-lg text-[#141C17] tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Where It Runs Platform Strip */}
        <div className="mt-20 sm:mt-24 py-12 border-y border-[#141C17]/10 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                WHERE IT RUNS
              </span>
              <p className="font-display font-medium text-lg text-[#141C17] mt-1">
                Runs identically on every channel your customers message you on.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-4 sm:gap-6">
              {channels.map((chan) => (
                <div
                  key={chan.name}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F8F3] border border-[#141C17]/10"
                >
                  <img src={chan.logo} alt={chan.name} className="w-4 h-4 object-contain" />
                  <span className="text-xs font-medium text-[#141C17]/80">{chan.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final Feature CTA Section */}
        <div className="mt-20 sm:mt-24 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141C17] text-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
            <div
              className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-[#DBF361]/12 blur-[90px] pointer-events-none"
              aria-hidden="true"
            />
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] max-w-2xl mx-auto">
              {ctaHeading || "Ready to experience this?"}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80 font-light max-w-xl mx-auto">
              {ctaSub || "Connect your store today and start running on autonomous rails."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-base hover:brightness-105 transition-all text-center"
              >
                Start free
              </Link>
              <Link
                to="/#demo-video"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 text-white font-semibold text-base border border-white/20 hover:bg-white/20 transition-all text-center"
              >
                Watch demo video
              </Link>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default FeaturePageTemplate;
