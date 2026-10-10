import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkle, Buildings, Compass } from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";
import { ABOUT_COPY } from "../../../content/about";

export function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "About Endogenous Technologies Limited | Building Africa's Next Systems From Within";
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-hidden flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1040px] mx-auto">
          {/* Header & Thesis Statement */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0D6E42]" />
              <span className="font-poppins text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                {ABOUT_COPY.company}
              </span>
            </div>

            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight leading-[1.08]">
              {ABOUT_COPY.thesisTitle}
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-[#0D6E42] font-normal leading-relaxed">
              {ABOUT_COPY.thesisDefinition}
            </p>
          </motion.div>

          {/* Core Philosophy & Narrative Sections */}
          <div className="mt-16 sm:mt-20 space-y-12 sm:space-y-16">
            {/* The African Tech Perspective */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="bg-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-12 border border-[#141C17]/10 shadow-xs relative overflow-hidden"
            >
              <div className="max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full inline-block mb-4">
                  01 · ORIGIN FROM WITHIN
                </span>
                <p className="text-lg sm:text-xl text-[#141C17]/85 font-light leading-relaxed">
                  {ABOUT_COPY.mission}
                </p>
              </div>

              {/* Decorative Subtle Geometry Accent */}
              <div
                className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#DBF361]/20 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>

            {/* Our First Product: Kasi */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="bg-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-12 border border-[#141C17]/10 shadow-xs relative overflow-hidden"
            >
              <div className="max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full inline-block mb-4">
                  02 · THE PATTERN
                </span>
                <p className="text-lg sm:text-xl text-[#141C17]/85 font-light leading-relaxed">
                  {ABOUT_COPY.product}
                </p>

                <div className="mt-8 pt-6 border-t border-[#141C17]/8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D6E42] hover:text-[#1C774E] transition-colors group"
                  >
                    <span>Explore Kasi OS</span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <span className="text-[#141C17]/25">·</span>
                  <Link
                    to="/how-it-works"
                    className="text-sm font-medium text-[#141C17]/70 hover:text-[#141C17] transition-colors"
                  >
                    See how Kasi works
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* The Horizon */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="bg-[#141C17] text-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-xl"
            >
              <div className="max-w-2xl relative z-10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#DBF361] bg-white/10 px-3 py-1 rounded-full inline-block mb-4">
                  03 · THE HORIZON
                </span>
                <p className="text-lg sm:text-xl text-white/90 font-light leading-relaxed">
                  {ABOUT_COPY.future}
                </p>
              </div>

              {/* Ambient Glow */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#DBF361]/10 blur-[90px] pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>
          </div>

          {/* Corporate Metadata & Foundation Block */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-16 sm:mt-20 pt-10 border-t border-[#141C17]/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-[#141C17]/70"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 font-mono text-xs">
              <span className="font-semibold text-[#141C17]">{ABOUT_COPY.meta.founded}</span>
              <span className="hidden sm:inline text-[#141C17]/30">·</span>
              <span>{ABOUT_COPY.meta.headquarters}</span>
              <span className="hidden sm:inline text-[#141C17]/30">·</span>
              <span className="bg-[#141C17]/6 px-2.5 py-1 rounded text-[#141C17]/80">
                {ABOUT_COPY.meta.registration}
              </span>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D6E42] hover:text-[#1C774E] transition-colors"
            >
              <span>Talk to our team</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default AboutPage;
