import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";

function ApplicationScreenshotSheet({ screenshot, screenshotAlt, screenshotCaption, badge }) {
  return (
    <div>
      <div className="rounded-xl bg-white border border-[#141C17]/15 shadow-[0_4px_24px_-8px_rgba(20,28,23,0.12)] overflow-hidden">
        <div className="px-4 py-2.5 bg-[#FAFAF7] border-b border-[#141C17]/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#141C17]/20" />
            <span className="w-2 h-2 rounded-full bg-[#141C17]/20" />
            <span className="w-2 h-2 rounded-full bg-[#0D6E42]/60" />
          </div>
          {badge && (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#141C17]/65">
              {badge}
            </span>
          )}
        </div>

        <div className="max-h-[520px] overflow-hidden bg-[#F6F8F3]">
          <img
            src={screenshot}
            alt={screenshotAlt}
            className="w-full h-auto object-cover object-left-top"
            loading="eager"
          />
        </div>
      </div>

      {screenshotCaption && (
        <p className="mt-3 text-xs sm:text-sm text-[#141C17]/65 font-normal">
          {screenshotCaption}
        </p>
      )}
    </div>
  );
}

export function FeaturePageTemplate({
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
  movesTitle = "How it works in practice",
  moves = [],
  controlsTitle = "What you control",
  controls = [],
  ctaHeading,
  ctaSub,
  layoutVariant = "stacked",
}) {
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

      <main className="flex-1 pt-32 sm:pt-40 pb-24">
        {layoutVariant === "split" ? (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              <div className="lg:col-span-6 text-left">
                {badge && (
                  <span className="font-mono text-xs font-semibold tracking-wider text-[#0D6E42] uppercase block mb-3">
                    {badge}
                  </span>
                )}

                <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-[52px] text-[#141C17] tracking-tight leading-[1.08]">
                  {headlinePart1}{" "}
                  <span className="text-[#0D6E42]">{highlightText}</span>{" "}
                  {headlinePart2}
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#141C17]/80 font-normal leading-relaxed">
                  {sub}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    to="/signup"
                    className="px-7 py-3.5 rounded-xl bg-[#0D6E42] text-white font-semibold text-sm sm:text-base hover:bg-[#0A5835] transition-colors text-center"
                  >
                    Start free
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="px-6 py-3.5 rounded-xl bg-white text-[#141C17] font-semibold text-sm sm:text-base border border-[#141C17]/18 hover:border-[#141C17]/40 transition-colors text-center"
                  >
                    See how it works
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <ApplicationScreenshotSheet
                  screenshot={screenshot}
                  screenshotAlt={screenshotAlt}
                  screenshotCaption={screenshotCaption}
                  badge={badge}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pb-12 border-b border-[#141C17]/12">
              <div className="lg:col-span-7">
                {badge && (
                  <span className="font-mono text-xs font-semibold tracking-wider text-[#0D6E42] uppercase block mb-3">
                    {badge}
                  </span>
                )}
                <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-[54px] text-[#141C17] tracking-tight leading-[1.08]">
                  {headlinePart1}{" "}
                  <span className="text-[#0D6E42]">{highlightText}</span>{" "}
                  {headlinePart2}
                </h1>
              </div>

              <div className="lg:col-span-5">
                <p className="text-base sm:text-lg text-[#141C17]/80 font-normal leading-relaxed">
                  {sub}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/signup"
                    className="px-6 py-3 rounded-xl bg-[#0D6E42] text-white font-semibold text-sm hover:bg-[#0A5835] transition-colors"
                  >
                    Start free
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="px-6 py-3 rounded-xl bg-white text-[#141C17] font-semibold text-sm border border-[#141C17]/18 hover:border-[#141C17]/40 transition-colors"
                  >
                    See how it works
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <ApplicationScreenshotSheet
                screenshot={screenshot}
                screenshotAlt={screenshotAlt}
                screenshotCaption={screenshotCaption}
                badge={badge}
              />
            </div>
          </div>
        )}

        {/* Operational Problem Band */}
        {problemHeading && (
          <div className="mt-20 sm:mt-24 py-16 sm:py-20 bg-[#0D6E42] text-white selection:bg-[#DBF361] selection:text-[#141C17]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <h2 className="lg:col-span-6 font-display font-medium text-2xl sm:text-4xl tracking-tight leading-[1.12]">
                {problemHeading}
              </h2>
              <p className="lg:col-span-6 text-base sm:text-lg text-white/88 font-normal leading-relaxed border-l-2 border-[#DBF361] pl-5">
                {problemBody}
              </p>
            </div>
          </div>
        )}

        {/* Concrete 4-Step Sequence */}
        {moves.length > 0 && (
          <div className="mt-20 sm:mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight mb-10">
              {movesTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#141C17]/15">
              {moves.map((move, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-8 border-r border-b border-[#141C17]/15 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#0D6E42] block mb-3">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display font-medium text-xl text-[#141C17] tracking-tight mb-2">
                      {move.title}
                    </h3>
                    <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed">
                      {move.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls Ledger */}
        {controls.length > 0 && (
          <div className="mt-20 sm:mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight mb-10">
              {controlsTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {controls.map((item, idx) => {
                const controlLogos = [
                  <img key="c1" src="/logos/paystack.svg" alt="Paystack" className="h-4 w-auto object-contain" />,
                  <img key="c2" src="/logos/meta.svg" alt="Meta" className="h-4 w-auto object-contain" />,
                  <img key="c3" src="/logos/openai.svg" alt="OpenAI" className="h-4 w-auto object-contain" />,
                ];

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-6 border border-[#141C17]/12"
                  >
                    <div className="h-9 px-2.5 rounded-lg bg-[#F6F8F3] border border-[#141C17]/10 inline-flex items-center justify-center mb-4">
                      {controlLogos[idx] || (
                        <ShieldCheck size={20} weight="regular" className="text-[#0D6E42]" />
                      )}
                    </div>
                    <h3 className="font-display font-medium text-lg text-[#141C17] tracking-tight mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Supported Channels Strip */}
        <div className="mt-20 py-10 border-y border-[#141C17]/12 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                SUPPORTED CHANNELS
              </span>
              <p className="font-display font-medium text-lg text-[#141C17] mt-1">
                Same stock count and pricing rules across every connected inbox.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              {channels.map((chan) => (
                <div
                  key={chan.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6F8F3] border border-[#141C17]/12"
                >
                  <img src={chan.logo} alt={chan.name} className="w-4 h-4 object-contain" />
                  <span className="text-xs font-medium text-[#141C17]/85">{chan.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing Band */}
        <div className="mt-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141C17] text-white rounded-2xl p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight leading-[1.12]">
                {ctaHeading || "Put Kasi on your shop counter."}
              </h2>
              <p className="mt-3 text-base text-white/80 font-normal max-w-xl">
                {ctaSub || "Link your WhatsApp or Instagram account, add your price list, and take your first order today."}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-center gap-3.5">
              <Link
                to="/signup"
                className="px-7 py-3.5 rounded-xl bg-[#DBF361] text-[#141C17] font-semibold text-sm sm:text-base hover:brightness-98 transition-all text-center"
              >
                Start free
              </Link>
              <Link
                to="/pricing"
                className="px-7 py-3.5 rounded-xl bg-transparent text-white font-semibold text-sm sm:text-base border border-white/25 hover:bg-white/10 transition-colors text-center"
              >
                View pricing
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
