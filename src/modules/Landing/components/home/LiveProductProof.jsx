// spec 2.4
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";

export function LiveProductProof() {
  const copy = HOME_COPY["2.4"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F6F8F3] border-y border-[#141C17]/8 font-poppins overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
        {copy.rows.map((row, index) => {
          const isEven = index % 2 === 1;

          return (
            <div
              key={row.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center`}
            >
              {/* Text Column */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, x: isEven ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
              >
                <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-[#141C17] tracking-tight leading-snug">
                  {row.title}
                </h3>

                <p className="mt-4 font-light text-base sm:text-lg text-[#141C17]/80 leading-relaxed">
                  {row.caption}
                </p>

                <div className="mt-7">
                  <Link
                    to={row.href}
                    className="inline-flex items-center gap-2 font-semibold text-sm text-[#0D6E42] hover:text-[#1C774E] transition-colors group"
                  >
                    <span>Explore</span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </motion.div>

              {/* Clean Readable Screenshot Column (No fake browser window chrome) */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65 }}
                className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                <div className="relative rounded-2xl bg-white p-2.5 sm:p-3.5 shadow-xl border border-[#141C17]/10 overflow-hidden">
                  <div className="relative rounded-xl overflow-hidden bg-[#F6F8F3] max-h-[460px]">
                    <img
                      src={row.screenshot}
                      alt={row.title}
                      className="w-full h-auto object-cover object-left-top hover:scale-[1.01] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LiveProductProof;
