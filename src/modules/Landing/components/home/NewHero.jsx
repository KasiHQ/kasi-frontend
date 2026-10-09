import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CHANNEL_THEMES, CHANNEL_SEQUENCE } from "./channel-themes";
import { RotatingChannelHeadline } from "./RotatingChannelHeadline";
import { ChatStage } from "./ChatStage";
import { PartnerStrip } from "./PartnerStrip";
import { Play } from "@phosphor-icons/react";

export function NewHero() {
  const [activeChannel, setActiveChannel] = useState("whatsapp");
  const [isHeroOffscreen, setIsHeroOffscreen] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  const heroRef = useRef(null);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroOffscreen(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const isPaused = isTabHidden || isHeroOffscreen;

  const waNumber = import.meta.env.VITE_DEMO_WHATSAPP || "2348000000000";
  const waDemoLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hi Kasi, I'd like to try the live demo."
  )}`;

  return (
    <section
      ref={heroRef}
      className={`relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-4 overflow-hidden bg-dot-grid ${
        isPaused ? "is-paused" : ""
      }`}
    >
      <div className="absolute inset-0 pointer-events-none grain-overlay z-0" />

      {/* Crossfading theme background layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {CHANNEL_SEQUENCE.map((cId) => {
          const theme = CHANNEL_THEMES[cId];
          const isCurrent = cId === activeChannel;

          return (
            <div
              key={cId}
              className={`absolute inset-0 transition-opacity duration-900 ease-in-out ${
                isCurrent ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="absolute top-[-5%] right-[10%] sm:right-[15%] w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full blur-[100px] sm:blur-[130px] animate-drift-1"
                style={{ backgroundColor: theme.blobA }}
              />
              <div
                className="absolute top-[35%] right-[-5%] sm:right-[2%] w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] rounded-full blur-[90px] sm:blur-[120px] animate-drift-2"
                style={{ backgroundColor: theme.blobB }}
              />
              <div
                className="absolute top-[20%] left-[5%] sm:left-[15%] w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-[90px] sm:blur-[110px] animate-drift-3"
                style={{ backgroundColor: theme.blobC }}
              />
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Copy ≈ 7 cols */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="min-h-[110px] sm:min-h-[140px] lg:min-h-[175px] flex items-center">
              <RotatingChannelHeadline activeChannel={activeChannel} />
            </div>

            {/* Spec sub: clamp(1rem, 0.9rem + 0.4vw, 1.25rem) */}
            <p className="mt-4 sm:mt-5 font-poppins font-light text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] leading-relaxed text-[#141C17]/80 max-w-[620px]">
              Kasi is the operating system for businesses that sell on WhatsApp and
              Instagram. It answers every customer, negotiates, takes payment, and
              pushes the order to delivery. You just prepare it.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[500px]">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-base shadow-sm hover:shadow-md hover:bg-[#d2eb57] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all text-center"
              >
                Start free
              </Link>
              <a
                href="#demo-video"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("demo-video")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#141C17] font-semibold text-base border border-[#0D6E42]/25 shadow-xs hover:border-[#0D6E42] hover:bg-[#0D6E42]/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all text-center cursor-pointer group"
              >
                <Play size={16} weight="fill" className="text-[#0D6E42] group-hover:scale-110 transition-transform" />
                <span>Watch demo video</span>
              </a>
            </div>

            <div className="mt-5 sm:mt-6 flex items-center flex-wrap gap-x-2 gap-y-1 font-poppins text-xs sm:text-[13px] text-[#141C17]/70">
              <span>Works on WhatsApp, Instagram, Messenger & Telegram</span>
              <span className="text-[#141C17]/30">·</span>
              <span>Payments by Paystack</span>
              <span className="text-[#141C17]/30">·</span>
              <span>No app for your customers to download</span>
            </div>
          </div>

          {/* Right Column: Chat Stage ≈ 5 cols */}
          <div className="lg:col-span-5 flex justify-center items-center w-full mt-2 lg:mt-0">
            <ChatStage
              activeChannel={activeChannel}
              onChannelChange={setActiveChannel}
              isPausedExternal={isPaused}
            />
          </div>
        </div>
      </div>

      <PartnerStrip />
    </section>
  );
}
