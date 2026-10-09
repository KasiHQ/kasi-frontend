"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChannelId, CHANNEL_THEMES, CHANNEL_SEQUENCE } from "./channel-themes";
import { RotatingChannelHeadline } from "./RotatingChannelHeadline";
import { ChatStage } from "./ChatStage";
import { PartnerStrip } from "./PartnerStrip";

export function Hero() {
  const [activeChannel, setActiveChannel] = useState<ChannelId>("whatsapp");
  const [isHeroOffscreen, setIsHeroOffscreen] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);

  const heroRef = useRef<HTMLElement>(null);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // IntersectionObserver to pause when hero is scrolled out of view
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

  // WhatsApp click-to-chat link
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_DEMO_NUMBER || "2348000000000";
  const waDemoLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hi Kasi, I'd like to try the live demo."
  )}`;

  return (
    <section
      ref={heroRef}
      className={`relative min-h-[88vh] flex flex-col justify-between pt-28 sm:pt-36 lg:pt-40 overflow-hidden bg-dot-grid ${
        isPaused ? "is-paused" : ""
      }`}
    >
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none grain-overlay z-0" />

      {/* Crossfading stacked channel theme background layers */}
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
              {/* Blob A (main tint @ ~40%) */}
              <div
                className="absolute top-[-5%] right-[10%] sm:right-[15%] w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full blur-[100px] sm:blur-[130px] animate-drift-1"
                style={{ backgroundColor: theme.blobA }}
              />
              {/* Blob B (secondary subtle tint @ ~30%) */}
              <div
                className="absolute top-[35%] right-[-5%] sm:right-[2%] w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] rounded-full blur-[90px] sm:blur-[120px] animate-drift-2"
                style={{ backgroundColor: theme.blobB }}
              />
              {/* Blob C (subtle accent tint) */}
              <div
                className="absolute top-[20%] left-[5%] sm:left-[15%] w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-[90px] sm:blur-[110px] animate-drift-3"
                style={{ backgroundColor: theme.blobC }}
              />
            </div>
          );
        })}
      </div>

      {/* Main 12-Column Hero Grid */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy ≈ 7 cols (Desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Signature Rotating Headline */}
            <div className="min-h-[140px] sm:min-h-[180px] lg:min-h-[220px] flex items-center">
              <RotatingChannelHeadline activeChannel={activeChannel} />
            </div>

            {/* Subcopy */}
            <p className="mt-6 sm:mt-7 font-sans font-light text-base sm:text-[19px] lg:text-[20px] leading-relaxed text-ink/75 max-w-[580px]">
              Kasi is the operating system for businesses that sell on WhatsApp and
              Instagram. It answers every customer, negotiates, takes payment, and
              pushes the order to delivery. You just prepare it.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-[500px]">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-lime text-ink font-semibold text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all text-center"
              >
                Start free
              </Link>
              <a
                href={waDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white text-ink font-semibold text-base border border-forest/30 shadow-xs hover:border-forest hover:bg-forest/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all text-center"
              >
                Chat the live demo
              </a>
            </div>

            {/* Microcopy line */}
            <div className="mt-6 sm:mt-7 flex items-center flex-wrap gap-x-2 gap-y-1 font-sans text-xs sm:text-[13px] text-ink/65">
              <span>Works on WhatsApp, Instagram, Messenger & Telegram</span>
              <span className="text-ink/30">·</span>
              <span>Payments by Paystack</span>
              <span className="text-ink/30">·</span>
              <span>No app for your customers to download</span>
            </div>
          </div>

          {/* Right Column: Chat Stage ≈ 5 cols (Desktop) */}
          <div className="lg:col-span-5 flex justify-center items-center w-full mt-4 lg:mt-0">
            <ChatStage
              activeChannel={activeChannel}
              onChannelChange={setActiveChannel}
              isPausedExternal={isPaused}
            />
          </div>
        </div>
      </div>

      {/* Partner Strip below the hero grid with hairline divider */}
      <PartnerStrip />
    </section>
  );
}
