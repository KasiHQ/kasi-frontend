import React from "react";
import { Link } from "react-router-dom";
import KasiLogo from "../components/common/KasiLogo";

const LOGOS = [
  { name: "Meta", file: "/logos/meta.svg", viewBox: "0 0 100 80", usage: "Partner Strip, Integrations" },
  { name: "OpenAI", file: "/logos/openai.svg", viewBox: "0 0 24 24", usage: "Partner Strip (Powered by OpenAI)" },
  { name: "Paystack", file: "/logos/paystack.svg", viewBox: "0 0 100 80", usage: "Partner Strip, Checkout" },
  { name: "WhatsApp", file: "/logos/whatsapp.svg", viewBox: "0 0 24 24", usage: "Channel Orbit, Hero, Integrations" },
  { name: "Instagram", file: "/logos/instagram.svg", viewBox: "0 0 24 24", usage: "Channel Orbit, Hero, Integrations" },
  { name: "Messenger", file: "/logos/messenger.svg", viewBox: "0 0 24 24", usage: "Integrations, Partner Strip" },
  { name: "Telegram", file: "/logos/telegram.svg", viewBox: "0 0 24 24", usage: "Channel Orbit, Hero, Integrations" },
];

export default function DevLogos() {
  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] p-8 sm:p-12 font-poppins">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-8 border-b border-[#141C17]/10 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <KasiLogo variant="full" size={36} />
              <span className="text-xs font-mono font-semibold uppercase bg-[#0D6E42]/10 text-[#0D6E42] px-2.5 py-1 rounded-full">
                Dev Tool
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-3">Verified Vector Assets Test Suite (/dev/logos)</h1>
            <p className="text-sm text-[#141C17]/70 mt-1">
              Inspection page rendering all official third-party and Kasi brand vectors.
            </p>
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-[#0D6E42] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Kasi Brand Logos */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4 text-[#0D6E42]">Kasi Brand Vectors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#141C17]/10 shadow-xs flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center bg-[#F6F8F3] rounded-xl mb-4">
                <KasiLogo variant="mark" size={48} />
              </div>
              <span className="font-bold text-sm">Kasi Brand Mark</span>
              <span className="text-xs text-[#141C17]/60 font-mono mt-1">/kasi-icon.svg</span>
              <span className="text-xs text-[#141C17]/50 mt-1">200 × 200 viewBox</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#141C17]/10 shadow-xs flex flex-col items-center text-center">
              <div className="w-full h-20 flex items-center justify-center bg-[#F6F8F3] rounded-xl mb-4">
                <KasiLogo variant="full" size={36} />
              </div>
              <span className="font-bold text-sm">Kasi Full (Mark + Wordmark)</span>
              <span className="text-xs text-[#141C17]/60 font-mono mt-1">KasiLogo variant=&quot;full&quot;</span>
              <span className="text-xs text-[#141C17]/50 mt-1">Light Theme</span>
            </div>

            <div className="bg-[#141C17] rounded-2xl p-6 border border-white/10 shadow-xs flex flex-col items-center text-center text-white">
              <div className="w-full h-20 flex items-center justify-center bg-black/40 rounded-xl mb-4">
                <KasiLogo variant="full" theme="dark" size={36} />
              </div>
              <span className="font-bold text-sm">Kasi Full (Dark Theme)</span>
              <span className="text-xs text-white/60 font-mono mt-1">KasiLogo theme=&quot;dark&quot;</span>
              <span className="text-xs text-white/50 mt-1">Dark Footer & Nav</span>
            </div>
          </div>
        </section>

        {/* Third Party Logos */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-[#0D6E42]">Verified 3rd-Party Partner SVGs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {LOGOS.map((item) => (
              <div
                key={item.file}
                className="bg-white rounded-2xl p-6 border border-[#141C17]/10 shadow-xs flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-[#F6F8F3] rounded-xl mb-4">
                  <img
                    src={item.file}
                    alt={item.name}
                    className="max-w-[48px] max-h-[48px] object-contain"
                  />
                </div>
                <span className="font-bold text-base text-[#141C17]">{item.name}</span>
                <span className="text-xs text-[#141C17]/60 font-mono mt-1">{item.file}</span>
                <span className="text-xs text-[#141C17]/50 mt-1 font-mono">{item.viewBox}</span>
                <span className="text-[11px] text-[#0D6E42] mt-2 font-medium bg-[#0D6E42]/10 px-2 py-0.5 rounded-full">
                  {item.usage}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
