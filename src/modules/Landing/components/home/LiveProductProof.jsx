// spec 2.4
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HOME_COPY } from "../../../../content/home";

export function LiveProductProof() {
  const copy = HOME_COPY["2.4"];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F6F8F3] border-y border-[#141C17]/8 font-poppins overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[720px] mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/15 mb-4">
            <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
              {copy.badge}
            </span>
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#141C17] tracking-tight leading-[1.12]">
            {copy.heading}
          </h2>
          <p className="mt-3 font-light text-base sm:text-lg text-[#141C17]/75">
            {copy.sub}
          </p>
        </div>

        <div className="space-y-24 sm:space-y-32">
          {copy.rows.map((row, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={row.title}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Col */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, x: isEven ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <span className="font-mono-labels text-xs font-bold uppercase tracking-wider text-[#0D6E42] bg-[#DBF361]/40 px-3 py-1 rounded-full">
                    {row.tag}
                  </span>

                  <h3 className="mt-4 font-bold text-2xl sm:text-3xl text-[#141C17] tracking-tight leading-snug">
                    {row.title}
                  </h3>

                  <p className="mt-4 font-light text-base sm:text-lg text-[#141C17]/80 leading-relaxed">
                    {row.caption}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm text-[#141C17]/70">
                    <CheckCircle2 size={18} className="text-[#0D6E42]" />
                    <span>Real-time dashboard updates with zero browser refreshes</span>
                  </div>

                  <div className="mt-8">
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 font-semibold text-sm text-[#0D6E42] hover:text-[#1C774E] group"
                    >
                      <span>Try this in your workspace</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>

                {/* Tilted Browser Frame Col (4-6° perspective) */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7 }}
                  className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"} flex justify-center`}
                >
                  <div
                    className="relative w-full max-w-[620px] rounded-2xl bg-white p-2.5 sm:p-3.5 shadow-2xl border border-[#141C17]/10 transition-transform duration-500 hover:rotate-0"
                    style={{
                      transform: shouldReduceMotion
                        ? "none"
                        : isEven
                        ? "perspective(1000px) rotateY(-4deg) rotateX(2deg)"
                        : "perspective(1000px) rotateY(4deg) rotateX(2deg)",
                    }}
                  >
                    {/* Browser Chrome Header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#141C17]/8 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      </div>
                      <div className="mx-auto px-4 py-0.5 rounded-md bg-[#F6F8F3] text-[11px] font-mono text-[#141C17]/60">
                        app.usekasi.com
                      </div>
                    </div>

                    {/* Dashboard Screenshot */}
                    <div className="rounded-xl overflow-hidden border border-black/5 bg-[#F6F8F3]">
                      <img
                        src={row.screenshot}
                        alt={row.alt}
                        className="w-full h-auto object-cover max-h-[380px]"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LiveProductProof;
