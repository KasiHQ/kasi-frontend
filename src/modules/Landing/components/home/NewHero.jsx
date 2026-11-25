import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CHANNEL_SEQUENCE } from "./channel-themes";
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

  return (
    <section
      ref={heroRef}
      className={`relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-4 overflow-hidden bg-[#F6F8F3] border-b border-[#141C17]/10 ${
        isPaused ? "is-paused" : ""
      }`}
    >
      {/* Clean architectural grid rule (no floating glow blobs) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,28,23,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,28,23,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Asymmetric Editorial Copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="min-h-[110px] sm:min-h-[140px] lg:min-h-[175px] flex items-center">
              <RotatingChannelHeadline activeChannel={activeChannel} />
            </div>

            <p className="mt-4 sm:mt-5 font-poppins font-normal text-[clamp(1rem,0.92rem+0.35vw,1.2rem)] leading-relaxed text-[#141C17]/80 max-w-[600px]">
              Kasi is the operating system for businesses that sell on WhatsApp and
              Instagram. It answers every customer, negotiates, takes payment, and
              pushes the order to delivery. You just prepare it.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[500px]">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-[#0D6E42] text-white font-semibold text-base hover:bg-[#0A5835] transition-colors text-center"
              >
                Start free
              </Link>
              <a
                href="#demo-video"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("demo-video")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#141C17] font-semibold text-base border border-[#141C17]/18 hover:border-[#141C17]/40 transition-colors text-center cursor-pointer"
              >
                <Play size={15} weight="fill" className="text-[#0D6E42]" />
                <span>Watch explainer video</span>
              </a>
            </div>

            <div className="mt-6 pt-5 border-t border-[#141C17]/10 flex items-center flex-wrap gap-x-3 gap-y-1.5 font-poppins text-xs sm:text-[13px] text-[#141C17]/70 max-w-[580px]">
              <span>Works on WhatsApp, Instagram, Messenger & Telegram</span>
              <span className="text-[#141C17]/30">/</span>
              <span>Payments by Paystack</span>
              <span className="text-[#141C17]/30">/</span>
              <span>No app for your customers to download</span>
            </div>
          </div>

          {/* Right Column: Live Chat Stage (5 cols) */}
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
