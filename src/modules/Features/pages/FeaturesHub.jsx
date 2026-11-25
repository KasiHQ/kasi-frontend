// spec 04 — Architectural Feature Index (zero glow blobs, zero "not X, it's Y" AI slogans, clean ledger layout)
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Robot,
  Package,
  MapPin,
  CreditCard,
  ChatTeardropDots,
  Users,
  ChartLineUp,
  ShareNetwork,
} from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";

const FEATURES_LIST = [
  {
    id: "sales-engine",
    title: "Sales Engine",
    code: "01",
    span: "lg:col-span-2",
    line: "Answers product questions, negotiates within your 3-tier price anchors, and locks orders into checkout.",
    href: "/features/sales-engine",
    icon: Robot,
    image: "/images/products & store.png",
    specNote: "Starting price · Happy price · Floor lock",
  },
  {
    id: "fulfilment",
    title: "Fulfilment Center",
    code: "02",
    span: "lg:col-span-1",
    line: "Every verified paid order in one packing list. Advancing an order messages the buyer on WhatsApp.",
    href: "/features/fulfilment",
    icon: Package,
    image: "/images/fulfilment & orders.png",
    specNote: "Paid → Prepared → Ready → Picked up",
  },
  {
    id: "delivery",
    title: "Delivery & Pricing",
    code: "03",
    span: "lg:col-span-1",
    line: "Reads WhatsApp location pins, computes road distance via Google Maps, and quotes fees before payment.",
    href: "/features/delivery",
    icon: MapPin,
    image: "/images/dashboard.png",
    specNote: "Road km · ₦50 ceiling · ₦0 store pickup",
  },
  {
    id: "payments",
    title: "Payments & Checkout",
    code: "04",
    span: "lg:col-span-1",
    line: "Issues Paystack links inside the chat and advances orders strictly on cryptographic webhook confirmation.",
    href: "/features/payments",
    icon: CreditCard,
    image: "/images/sales & finance.png",
    specNote: "HMAC SHA-512 verified · Subaccount split",
  },
  {
    id: "chats",
    title: "Chats & Control",
    code: "05",
    span: "lg:col-span-1",
    line: "Read live conversations across channels, view a one-line summary, or whisper a quick instruction to Kasi.",
    href: "/features/chats",
    icon: ChatTeardropDots,
    image: "/images/chats.png",
    specNote: "Live inbox · 1-line whisper · Manual mute",
  },
  {
    id: "customers",
    title: "Customers & CRM",
    code: "06",
    span: "lg:col-span-1",
    line: "Saves names, phone numbers, addresses, and past orders automatically from incoming conversations.",
    href: "/features/customers",
    icon: Users,
    image: "/images/customer database.png",
    specNote: "New · Regular · VIP buyer segments",
  },
  {
    id: "analytics",
    title: "Analytics & Bookings",
    code: "07",
    span: "lg:col-span-1",
    line: "Daily revenue, conversion rates, top-selling SKUs, plus calendar slot booking and deposits for service shops.",
    href: "/features/analytics",
    icon: ChartLineUp,
    image: "/images/analytics.png",
    specNote: "Takings · Conversion · Deposit slots",
  },
  {
    id: "platforms",
    title: "Platforms & Channels",
    code: "08",
    span: "lg:col-span-2",
    line: "WhatsApp Cloud API, Instagram Direct, Facebook Messenger, and Telegram reading from one stock count.",
    href: "/platforms",
    icon: ShareNetwork,
    image: "/images/platforms.png",
    specNote: "Meta Graph v21 · Paystack · Telegram Bot",
  },
];

export function FeaturesHub() {
  useEffect(() => {
    document.title = "Features | Kasi";
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-hidden flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Asymmetric Split Hero (no "not X, it's Y" cliché, no glow blobs) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pb-14 border-b border-[#141C17]/15">
            <div className="lg:col-span-7">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42] block mb-3">
                SYSTEM MODULES
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[58px] text-[#141C17] tracking-tight leading-[1.06]">
                Everything Kasi runs for your shop.
              </h1>
            </div>

            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg text-[#141C17]/80 font-normal leading-relaxed">
                One connected workspace for your product catalog, social DMs, price rules, road-distance delivery fees, Paystack settlements, and order packing.
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

          {/* Crisp Framed Overview */}
          <div className="my-14 sm:my-18 rounded-xl bg-white border border-[#141C17]/15 shadow-[0_4px_24px_-8px_rgba(20,28,23,0.1)] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#FAFAF7] border-b border-[#141C17]/10 flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-[#141C17]/70">
                Merchant Workspace Overview
              </span>
              <span className="font-mono text-[11px] text-[#0D6E42] font-semibold">
                WhatsApp · Instagram · Paystack
              </span>
            </div>
            <img
              src="/images/dashboard.png"
              alt="Kasi Merchant Overview"
              className="w-full h-auto object-cover object-left-top"
            />
          </div>

          {/* Architectural Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES_LIST.map((feat) => {
              const IconComp = feat.icon;

              return (
                <Link
                  key={feat.id}
                  to={feat.href}
                  className={`bg-white rounded-xl border border-[#141C17]/12 p-6 hover:border-[#0D6E42] transition-colors flex flex-col justify-between group ${feat.span}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-semibold text-[#0D6E42]">
                        {feat.code}
                      </span>
                      <IconComp
                        size={20}
                        weight="regular"
                        className="text-[#141C17]/65 group-hover:text-[#0D6E42] transition-colors"
                      />
                    </div>

                    <h2 className="font-display font-medium text-2xl text-[#141C17] tracking-tight mb-2 group-hover:text-[#0D6E42] transition-colors">
                      {feat.title}
                    </h2>

                    <p className="text-sm text-[#141C17]/75 font-normal leading-relaxed mb-5">
                      {feat.line}
                    </p>

                    <div className="w-full h-36 rounded-lg overflow-hidden bg-[#F6F8F3] border border-[#141C17]/10 mb-4 relative">
                      <img
                        src={feat.image}
                        alt={`${feat.title} interface`}
                        className="w-full h-full object-cover object-left-top"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#141C17]/10 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-[#141C17]/60 truncate">
                      {feat.specNote}
                    </span>
                    <ArrowUpRight
                      size={15}
                      weight="bold"
                      className="text-[#0D6E42] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default FeaturesHub;
