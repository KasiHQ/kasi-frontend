"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface OrbitNodeData {
  id: string;
  name: string;
  logo: string;
  logoSize: number;
  nodeSize: number; // in px
  angleDeg: number; // initial position angle
  tooltip: string;
  isInner: boolean;
}

const INNER_NODES: OrbitNodeData[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    logo: "/logos/whatsapp.svg",
    logoSize: 30,
    nodeSize: 60,
    angleDeg: 0,
    tooltip: "Full sales engine",
    isInner: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    logo: "/logos/instagram.svg",
    logoSize: 30,
    nodeSize: 60,
    angleDeg: 90,
    tooltip: "DMs and comment-to-DM",
    isInner: true,
  },
  {
    id: "messenger",
    name: "Messenger",
    logo: "/logos/messenger.svg",
    logoSize: 30,
    nodeSize: 60,
    angleDeg: 180,
    tooltip: "Facebook buyers",
    isInner: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    logo: "/logos/telegram.svg",
    logoSize: 30,
    nodeSize: 60,
    angleDeg: 270,
    tooltip: "Communities and channels",
    isInner: true,
  },
];

const OUTER_NODES: OrbitNodeData[] = [
  {
    id: "paystack",
    name: "Paystack",
    logo: "/logos/paystack.svg",
    logoSize: 24,
    nodeSize: 48,
    angleDeg: 30,
    tooltip: "Payments, auto-confirmed",
    isInner: false,
  },
  {
    id: "meta",
    name: "Meta",
    logo: "/logos/meta.svg",
    logoSize: 24,
    nodeSize: 48,
    angleDeg: 150,
    tooltip: "Official WhatsApp and Instagram connection",
    isInner: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    logo: "/logos/openai.svg",
    logoSize: 24,
    nodeSize: 48,
    angleDeg: 270,
    tooltip: "The AI behind the replies",
    isInner: false,
  },
];

export function ChannelOrbit() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTooltip, setActiveTooltip] = useState<OrbitNodeData | null>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [centerPulse, setCenterPulse] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  // Tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // IntersectionObserver to observe visibility and pause when scrolled away
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Message packet pulse timer: pulses the center mark when message packets arrive
  useEffect(() => {
    if (shouldReduceMotion || !isSectionVisible || isTabHidden) return;
    const pulseInterval = setInterval(() => {
      setCenterPulse(true);
      const t = setTimeout(() => setCenterPulse(false), 350);
      return () => clearTimeout(t);
    }, 2400);

    return () => clearInterval(pulseInterval);
  }, [shouldReduceMotion, isSectionVisible, isTabHidden]);

  const isPaused = !isSectionVisible || isTabHidden || Boolean(activeTooltip);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-paper"
    >
      {/* Very soft radial Forest-mint wash behind the diagram */}
      <div className="absolute top-1/2 right-0 md:right-[10%] -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-forest/[0.06] blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/30 border border-forest/20 shadow-xs mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                ONE BRAIN, EVERY CHANNEL
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight text-ink">
              Wherever your customers message you, Kasi is already there.
            </h2>

            {/* Subcopy */}
            <p className="mt-4 sm:mt-5 font-sans font-light text-base sm:text-lg text-ink/75 leading-relaxed max-w-[500px]">
              Your customers keep using the apps they know. You run it all from one
              place.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-start gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-ink text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md hover:bg-ink/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all group"
              >
                <span>Connect your first channel</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>

              {/* Small channel list text under CTA */}
              <p className="font-sans text-xs text-ink/55 tracking-wide pl-1">
                WhatsApp · Instagram · Messenger · Telegram
              </p>
            </div>
          </motion.div>

          {/* Right Column: Orbit Diagram */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center items-center w-full"
          >
            {/* Square diagram container: max 500px desktop, ~340px mobile */}
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] flex items-center justify-center select-none">
              {/* Concentric mint discs behind center */}
              <div className="absolute w-[240px] sm:w-[290px] h-[240px] sm:h-[290px] rounded-full bg-forest/[0.03] pointer-events-none" />
              <div className="absolute w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] rounded-full bg-forest/[0.05] pointer-events-none" />
              <div className="absolute w-[130px] sm:w-[160px] h-[130px] sm:h-[160px] rounded-full bg-forest/[0.08] pointer-events-none" />

              {/* Center Ripple Rings (4s loop with 2s offset) */}
              {!shouldReduceMotion && (
                <>
                  <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-forest/30 animate-ripple-1 pointer-events-none" />
                  <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-forest/30 animate-ripple-2 pointer-events-none" />
                </>
              )}

              {/* SVG Dashed Orbit Rings */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 480 480"
              >
                {/* Inner Orbit Ring (radius = 135) */}
                <circle
                  cx="240"
                  cy="240"
                  r="135"
                  fill="none"
                  stroke="#0D6E42"
                  strokeOpacity="0.25"
                  strokeWidth="1.2"
                  strokeDasharray="2 6"
                />
                {/* Outer Orbit Ring (radius = 205) */}
                <circle
                  cx="240"
                  cy="240"
                  r="205"
                  fill="none"
                  stroke="#0D6E42"
                  strokeOpacity="0.25"
                  strokeWidth="1.2"
                  strokeDasharray="2 6"
                />
              </svg>

              {/* Outer Orbit (Paystack, Meta, OpenAI) - Rotates CCW ~90s */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  animation: shouldReduceMotion
                    ? "none"
                    : "orbit-ccw 90s linear infinite",
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              >
                {OUTER_NODES.map((node) => {
                  // Coordinate calculation on radius 205px around center (240, 240)
                  const rad = (node.angleDeg * Math.PI) / 180;
                  const leftPct = 50 + (205 / 240) * 50 * Math.cos(rad);
                  const topPct = 50 + (205 / 240) * 50 * Math.sin(rad);

                  const isHovered = activeTooltip?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                      }}
                    >
                      {/* Counter-rotation container: rotates CW ~90s to stay upright */}
                      <div
                        style={{
                          animation: shouldReduceMotion
                            ? "none"
                            : "orbit-cw 90s linear infinite",
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`${node.name}: ${node.tooltip}`}
                          onMouseEnter={() => setActiveTooltip(node)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          onFocus={() => setActiveTooltip(node)}
                          onBlur={() => setActiveTooltip(null)}
                          onClick={() =>
                            setActiveTooltip(activeTooltip?.id === node.id ? null : node)
                          }
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-ink/10 shadow-sm flex items-center justify-center transition-transform focus:outline-none focus:ring-2 focus:ring-forest ${
                            isHovered ? "scale-115 z-30 shadow-md ring-2 ring-forest/40" : "hover:scale-110"
                          }`}
                        >
                          <Image
                            src={node.logo}
                            alt={node.name}
                            width={node.logoSize}
                            height={node.logoSize}
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inner Orbit (WhatsApp, Instagram, Messenger, Telegram) - Rotates CW ~60s */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  animation: shouldReduceMotion
                    ? "none"
                    : "orbit-cw 60s linear infinite",
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              >
                {INNER_NODES.map((node) => {
                  // Coordinate calculation on radius 135px around center (240, 240)
                  const rad = (node.angleDeg * Math.PI) / 180;
                  const leftPct = 50 + (135 / 240) * 50 * Math.cos(rad);
                  const topPct = 50 + (135 / 240) * 50 * Math.sin(rad);

                  const isHovered = activeTooltip?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                      }}
                    >
                      {/* Counter-rotation container: rotates CCW ~60s to stay upright */}
                      <div
                        style={{
                          animation: shouldReduceMotion
                            ? "none"
                            : "orbit-ccw 60s linear infinite",
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`${node.name}: ${node.tooltip}`}
                          onMouseEnter={() => setActiveTooltip(node)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          onFocus={() => setActiveTooltip(node)}
                          onBlur={() => setActiveTooltip(null)}
                          onClick={() =>
                            setActiveTooltip(activeTooltip?.id === node.id ? null : node)
                          }
                          className={`relative w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full bg-white border border-ink/10 shadow-sm flex items-center justify-center transition-transform focus:outline-none focus:ring-2 focus:ring-forest ${
                            isHovered ? "scale-115 z-30 shadow-md ring-2 ring-forest/40" : "hover:scale-110"
                          }`}
                        >
                          <Image
                            src={node.logo}
                            alt={node.name}
                            width={node.logoSize}
                            height={node.logoSize}
                            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtle Message Packets flowing from inner nodes toward center */}
              {!shouldReduceMotion && !isPaused && (
                <div className="absolute inset-0 pointer-events-none">
                  {INNER_NODES.map((node, index) => {
                    const angleRad = (node.angleDeg * Math.PI) / 180;
                    return (
                      <motion.div
                        key={`packet-${node.id}`}
                        className="absolute w-2 h-2 rounded-full bg-lime shadow-[0_0_8px_#DBF361] -translate-x-1/2 -translate-y-1/2"
                        initial={{
                          left: `${50 + (135 / 240) * 50 * Math.cos(angleRad)}%`,
                          top: `${50 + (135 / 240) * 50 * Math.sin(angleRad)}%`,
                          opacity: 0,
                          scale: 0.6,
                        }}
                        animate={{
                          left: ["50%", `${50 + (135 / 240) * 50 * Math.cos(angleRad)}%`, "50%"],
                          top: ["50%", `${50 + (135 / 240) * 50 * Math.sin(angleRad)}%`, "50%"],
                          opacity: [0, 1, 0],
                          scale: [0.6, 1.2, 0.4],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.6,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Center Mark (~112px white circle with official Kasi mark) */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-lg border border-ink/8 p-4 flex items-center justify-center z-20 transition-transform duration-300 ${
                  centerPulse ? "scale-105" : "scale-100"
                }`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/brand/kasi-mark.svg"
                    alt="Kasi official mark"
                    width={80}
                    height={80}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                  />
                </div>
              </div>

              {/* Tooltip Pill overlaid when node is hovered/focused */}
              {activeTooltip && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-ink text-white px-4 py-1.5 rounded-full shadow-lg border border-white/10 text-xs font-mono font-medium tracking-wide whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-lime mr-1.5 font-bold">{activeTooltip.name}:</span>
                  <span>{activeTooltip.tooltip}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
