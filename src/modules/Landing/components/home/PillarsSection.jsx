// spec 2.3 — Architectural 3-Column Ledger (no generic SaaS card bubbles, no fake metrics)
import React from "react";
import { Link } from "react-router-dom";
import {
  ChatTeardropDots,
  Package,
  ChartLineUp,
  ArrowUpRight,
  Check,
} from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { DesignedPlaceholder } from "../../../../components/common/DesignedPlaceholder";

const ICONS = [ChatTeardropDots, Package, ChartLineUp];

function PillarLedgerDetail({ index }) {
  if (index === 0) {
    // IT SELLS: Concrete 3-tier price anchor rule from actual Kasi engine
    return (
      <div className="mt-5 pt-4 border-t border-[#141C17]/10 font-mono text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-[#141C17]/60">
          <span>Quoted</span>
          <span className="text-[#141C17] font-medium">₦35,000</span>
        </div>
        <div className="flex items-center justify-between text-[#141C17]/60">
          <span>Agreed after 3 turns</span>
          <span className="text-[#0D6E42] font-semibold">₦32,500</span>
        </div>
        <div className="flex items-center justify-between text-[#141C17]/50">
          <span>Vendor floor (never crossed)</span>
          <span>₦30,000</span>
        </div>
      </div>
    );
  }

  if (index === 1) {
    // IT FULFILS: Concrete order state sequence
    return (
      <div className="mt-5 pt-4 border-t border-[#141C17]/10 font-mono text-[11px] space-y-1.5">
        {[
          { step: "01 Paid", detail: "Paystack webhook verified", done: true },
          { step: "02 Packed", detail: "Buyer notified on WhatsApp", active: true },
          { step: "03 Handed off", detail: "Pickup pin or rider contact sent", done: false },
        ].map((row) => (
          <div key={row.step} className="flex items-center justify-between gap-2">
            <span
              className={
                row.active
                  ? "text-[#0D6E42] font-semibold"
                  : row.done
                  ? "text-[#141C17]"
                  : "text-[#141C17]/45"
              }
            >
              {row.done ? "✓ " : row.active ? "→ " : "· "}
              {row.step}
            </span>
            <span className="text-[#141C17]/60 truncate">{row.detail}</span>
          </div>
        ))}
      </div>
    );
  }

  // IT GROWS: Concrete saved buyer records (no invented +38% percentages!)
  return (
    <div className="mt-5 pt-4 border-t border-[#141C17]/10 font-mono text-[11px] space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[#141C17] font-medium">Folake A. · Lagos</span>
        <span className="px-1.5 py-0.5 bg-[#DBF361] text-[#141C17] rounded-xs text-[10px] font-semibold">
          4 orders · VIP
        </span>
      </div>
      <div className="flex items-center justify-between text-[#141C17]/65">
        <span>Chinedu O. · Wuse 2</span>
        <span>Asked size 43 · Open</span>
      </div>
      <div className="flex items-center justify-between text-[#141C17]/65">
        <span>Halima B. · Jabi</span>
        <span>Paid ₦18,500 · Delivered</span>
      </div>
    </div>
  );
}

export function PillarsSection() {
  const copy = HOME_COPY["2.3"];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins">
      {/* Editorial 2-column header with clean typographic contrast (no repeated marker gimmick) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end pb-12 sm:pb-14 border-b border-[#141C17]/15">
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] text-[#141C17] tracking-tight leading-[1.1]">
            {copy.heading}
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-base sm:text-lg text-[#141C17]/75 leading-relaxed font-normal">
            {copy.sub}
          </p>
        </div>
      </div>

      {/* Architectural Hairline Ledger Grid (replaces cookie-cutter 3 rounded SaaS cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#141C17]/12 border-b border-[#141C17]/15">
        {copy.pillars.map((pillar, index) => {
          const IconComponent = ICONS[index];
          const verb = pillar.tag.replace("IT ", "").toLowerCase();
          const labelTitle = `It ${verb}`;

          return (
            <article
              key={pillar.tag}
              className={`py-8 sm:py-10 flex flex-col justify-between group ${
                index === 0
                  ? "lg:pr-8 xl:pr-10"
                  : index === 1
                  ? "lg:px-8 xl:px-10"
                  : "lg:pl-8 xl:pl-10"
              }`}
            >
              <div>
                {/* Index + Tag + Phosphor Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs font-semibold tracking-wider text-[#0D6E42]">
                    0{index + 1} / {pillar.tag}
                  </span>
                  <IconComponent
                    size={22}
                    weight="regular"
                    className="text-[#141C17]/70 group-hover:text-[#0D6E42] transition-colors"
                  />
                </div>

                {/* Documentary Vendor Photo */}
                <div className="w-full aspect-[16/10] rounded-lg overflow-hidden mb-6 border border-[#141C17]/10 bg-[#EAEee5] relative">
                  {pillar.photo ? (
                    <img
                      src={pillar.photo}
                      alt={pillar.placeholderCaption || `${labelTitle} vendor in shop`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = "block";
                        }
                      }}
                    />
                  ) : null}
                  <div style={{ display: pillar.photo ? "none" : "block" }} className="w-full h-full">
                    <DesignedPlaceholder
                      aspect="16/10"
                      caption={pillar.placeholderCaption}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <h3 className="font-display font-medium text-2xl sm:text-[26px] text-[#141C17] tracking-tight mb-2.5">
                  {labelTitle}
                </h3>

                <p className="text-sm sm:text-[15px] text-[#141C17]/78 leading-relaxed font-normal">
                  {pillar.body}
                </p>

                {/* Concrete Operational Breakdown */}
                <PillarLedgerDetail index={index} />
              </div>

              <div className="mt-7 pt-4 border-t border-[#141C17]/8">
                <Link
                  to={pillar.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D6E42] hover:text-[#141C17] transition-colors group/link"
                >
                  <span>{pillar.cta}</span>
                  <ArrowUpRight
                    size={15}
                    weight="bold"
                    className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PillarsSection;
