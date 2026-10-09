import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const INNER_NODES = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    logo: "/logos/whatsapp.svg",
    logoSize: 30,
    angleDeg: 0,
    tooltip: "Full sales engine",
    isInner: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    logo: "/logos/instagram.svg",
    logoSize: 30,
    angleDeg: 90,
    tooltip: "DMs and comment-to-DM",
    isInner: true,
  },
  {
    id: "messenger",
    name: "Messenger",
    logo: "/logos/messenger.svg",
    logoSize: 30,
    angleDeg: 180,
    tooltip: "Facebook buyers",
    isInner: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    logo: "/logos/telegram.svg",
    logoSize: 30,
    angleDeg: 270,
    tooltip: "Communities and channels",
    isInner: true,
  },
];

const OUTER_NODES = [
  {
    id: "paystack",
    name: "Paystack",
    logo: "/logos/paystack.svg",
    logoSize: 24,
    angleDeg: 30,
    tooltip: "Payments, auto-confirmed",
    isInner: false,
  },
  {
    id: "meta",
    name: "Meta",
    logo: "/logos/meta.svg",
    logoSize: 24,
    angleDeg: 150,
    tooltip: "Official WhatsApp and Instagram connection",
    isInner: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    logo: "/logos/openai.svg",
    logoSize: 24,
    angleDeg: 270,
    tooltip: "The AI behind the replies",
    isInner: false,
  },
];

export function ChannelOrbit() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [centerPulse, setCenterPulse] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

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
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#F6F8F3]"
    >
      <div className="absolute top-1/2 right-0 md:right-[10%] -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#0D6E42]/[0.06] blur-[120px] pointer-events-none -z-10" />

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DBF361]/30 border border-[#0D6E42]/20 shadow-xs mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E42]" />
              <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                ONE BRAIN, EVERY CHANNEL
              </span>
            </div>

            <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight text-[#141C17]">
              Wherever your customers message you, Kasi is already there.
            </h2>

            <p className="mt-4 sm:mt-5 font-poppins font-light text-base sm:text-lg text-[#141C17]/75 leading-relaxed max-w-[500px]">
              Your customers keep using the apps they know. You run it all from one
              place.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#141C17] text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md hover:bg-[#141C17]/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all group"
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

              <p className="font-poppins text-xs text-[#141C17]/55 tracking-wide pl-1">
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
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] flex items-center justify-center select-none">
              <div className="absolute w-[240px] sm:w-[290px] h-[240px] sm:h-[290px] rounded-full bg-[#0D6E42]/[0.03] pointer-events-none" />
              <div className="absolute w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] rounded-full bg-[#0D6E42]/[0.05] pointer-events-none" />
              <div className="absolute w-[130px] sm:w-[160px] h-[130px] sm:h-[160px] rounded-full bg-[#0D6E42]/[0.08] pointer-events-none" />

              {!shouldReduceMotion && (
                <>
                  <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#0D6E42]/30 animate-ripple-1 pointer-events-none" />
                  <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#0D6E42]/30 animate-ripple-2 pointer-events-none" />
                </>
              )}

              {/* Orbit Paths */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 480 480"
              >
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

              {/* Outer Orbit (Paystack, Meta, OpenAI) CCW ~90s */}
              <div
                className="absolute inset-0 pointer-events-none animate-orbit-ccw"
                style={{
                  animationPlayState: isPaused || shouldReduceMotion ? "paused" : "running",
                }}
              >
                {OUTER_NODES.map((node) => {
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
                      <div
                        className="animate-orbit-cw"
                        style={{
                          animationPlayState: isPaused || shouldReduceMotion ? "paused" : "running",
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
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center transition-transform focus:outline-none focus:ring-2 focus:ring-[#0D6E42] ${
                            isHovered ? "scale-115 z-30 shadow-md ring-2 ring-[#0D6E42]/40" : "hover:scale-110"
                          }`}
                        >
                          <img
                            src={node.logo}
                            alt={node.name}
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inner Orbit (WhatsApp, Instagram, Messenger, Telegram) CW ~60s */}
              <div
                className="absolute inset-0 pointer-events-none animate-orbit-cw"
                style={{
                  animationPlayState: isPaused || shouldReduceMotion ? "paused" : "running",
                }}
              >
                {INNER_NODES.map((node) => {
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
                      <div
                        className="animate-orbit-ccw"
                        style={{
                          animationPlayState: isPaused || shouldReduceMotion ? "paused" : "running",
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
                          className={`relative w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center transition-transform focus:outline-none focus:ring-2 focus:ring-[#0D6E42] ${
                            isHovered ? "scale-115 z-30 shadow-md ring-2 ring-[#0D6E42]/40" : "hover:scale-110"
                          }`}
                        >
                          <img
                            src={node.logo}
                            alt={node.name}
                            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Packets */}
              {!shouldReduceMotion && !isPaused && (
                <div className="absolute inset-0 pointer-events-none">
                  {INNER_NODES.map((node, index) => {
                    const angleRad = (node.angleDeg * Math.PI) / 180;
                    return (
                      <motion.div
                        key={`packet-${node.id}`}
                        className="absolute w-2 h-2 rounded-full bg-[#DBF361] shadow-[0_0_8px_#DBF361] -translate-x-1/2 -translate-y-1/2"
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

              {/* Center Mark (~112px white circle) */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-lg border border-black/8 p-4 flex items-center justify-center z-20 transition-transform duration-300 ${
                  centerPulse ? "scale-105" : "scale-100"
                }`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src="/brand/kasi-mark.svg"
                    alt="Kasi official mark"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                  />
                </div>
              </div>

              {/* Tooltip Pill */}
              {activeTooltip && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#141C17] text-white px-4 py-1.5 rounded-full shadow-lg border border-white/10 text-xs font-mono-labels font-medium tracking-wide whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-[#DBF361] mr-1.5 font-bold">{activeTooltip.name}:</span>
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
