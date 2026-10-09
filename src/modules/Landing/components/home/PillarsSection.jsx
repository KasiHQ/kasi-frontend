// spec 2.3
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, PackageCheck, TrendingUp } from "lucide-react";
import { HOME_COPY } from "../../../../content/home";

const PILLAR_ICONS = [Bot, PackageCheck, TrendingUp];

export function PillarsSection() {
  const copy = HOME_COPY["2.3"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins">
      <div className="text-center max-w-[760px] mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/15 mb-4">
          <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
            {copy.badge}
          </span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl lg:text-[44px] text-[#141C17] tracking-tight leading-[1.1]">
          {copy.heading}
        </h2>
        <p className="mt-4 font-light text-base sm:text-lg text-[#141C17]/75 max-w-xl mx-auto leading-relaxed">
          {copy.sub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {copy.pillars.map((pillar, index) => {
          const IconComponent = PILLAR_ICONS[index];

          return (
            <motion.div
              key={pillar.tag}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="bg-white rounded-[22px] border border-[#141C17]/10 p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono-labels text-xs font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full">
                    {pillar.tag}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 flex items-center justify-center text-[#0D6E42] group-hover:bg-[#0D6E42] group-hover:text-white transition-colors">
                    <IconComponent size={20} />
                  </div>
                </div>

                <h3 className="font-bold text-xl sm:text-2xl text-[#141C17] tracking-tight">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm text-[#141C17]/75 leading-relaxed">
                  {pillar.body}
                </p>

                {/* Overlapping ProductShot + HumanPhoto Stage */}
                <div className="mt-6 relative h-[210px] w-full rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 overflow-hidden p-3 flex items-center justify-center">
                  {/* Product Screenshot layer */}
                  <div className="absolute left-3 top-3 right-10 bottom-3 rounded-xl overflow-hidden shadow-sm border border-black/5 bg-white">
                    <img
                      src={pillar.screenshot}
                      alt={`${pillar.title} dashboard UI`}
                      className="w-full h-full object-cover object-left-top opacity-90 group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>

                  {/* Overlapping Human Photo pill */}
                  <div className="absolute right-3 bottom-3 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white z-10">
                    <img
                      data-swap="vendor-real"
                      src={pillar.humanPhoto}
                      alt={pillar.humanAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#141C17]/8">
                <Link
                  to={pillar.href}
                  className="inline-flex items-center gap-2 font-semibold text-sm text-[#0D6E42] group-hover:text-[#1C774E] transition-colors"
                >
                  <span>{pillar.cta}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
