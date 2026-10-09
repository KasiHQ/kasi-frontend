// spec 2.3
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChatTeardropDots,
  Package,
  ChartLineUp,
  ArrowRight,
} from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { DesignedPlaceholder } from "../../../../components/common/DesignedPlaceholder";

const ICONS = [ChatTeardropDots, Package, ChartLineUp];

export function PillarsSection() {
  const copy = HOME_COPY["2.3"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins">
      {/* 2-col header: left title with marker, right sub copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-14 sm:mb-18">
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] text-[#141C17] tracking-tight leading-[1.12]">
            One assistant.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">The whole shop.</span>
              <span
                className="absolute left-0 bottom-1.5 sm:bottom-2 w-full h-3 sm:h-3.5 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-base sm:text-lg text-[#141C17]/75 leading-relaxed font-light">
            {copy.sub}
          </p>
        </div>
      </div>

      {/* 3 bento cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {copy.pillars.map((pillar, index) => {
          const IconComponent = ICONS[index];
          const verb = pillar.tag.replace("IT ", "").toLowerCase();
          const labelTitle = `It ${verb.charAt(0).toUpperCase() + verb.slice(1)}`;

          return (
            <motion.div
              key={pillar.tag}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="bg-white rounded-[22px] border border-[#141C17]/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-[#141C17]/20 transition-colors"
            >
              <div>
                {/* Top: Real Vendor Photo or Designed Placeholder */}
                <div className="w-full h-44 rounded-xl overflow-hidden mb-6 border border-[#141C17]/8 shadow-inner bg-[#F6F8F3] relative">
                  {pillar.photo ? (
                    <img
                      src={pillar.photo}
                      alt={pillar.placeholderCaption || `${labelTitle} vendor in shop`}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <div style={{ display: pillar.photo ? 'none' : 'block' }} className="w-full h-full">
                    <DesignedPlaceholder
                      aspect="16/9"
                      caption={pillar.placeholderCaption}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Phosphor duotone icon bare over offset lime disc */}
                <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                  <div
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#DBF361] -z-0"
                    aria-hidden="true"
                  />
                  <IconComponent
                    size={32}
                    weight="duotone"
                    className="text-[#0D6E42] relative z-10"
                  />
                </div>

                {/* Display label with lime marker under verb */}
                <h3 className="font-display font-medium text-2xl text-[#141C17] tracking-tight mb-3">
                  It{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">{verb}</span>
                    <span
                      className="absolute left-0 bottom-0.5 w-full h-2 bg-[#DBF361] rounded-xs -z-0"
                      aria-hidden="true"
                    />
                  </span>
                </h3>

                <p className="text-sm text-[#141C17]/80 leading-relaxed font-normal mb-6">
                  {pillar.body}
                </p>

                {/* Real screenshot crop lower container */}
                <div className="w-full h-36 rounded-xl overflow-hidden border border-[#141C17]/10 bg-[#F6F8F3] relative mb-6">
                  <img
                    src={pillar.screenshot}
                    alt={`${labelTitle} product view`}
                    className="w-full h-full object-cover object-left-top group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Plain explore link */}
              <div className="pt-2 border-t border-[#141C17]/6 flex items-center justify-between">
                <Link
                  to={pillar.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D6E42] hover:text-[#1C774E] transition-colors group/link"
                >
                  <span>{pillar.cta}</span>
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default PillarsSection;
