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

          {/* Founders Section */}
          <div className="mt-20 sm:mt-28">
            <div className="mb-10 sm:mb-14">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full inline-block mb-3">
                LEADERSHIP
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight">
                The people building it.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {ABOUT_COPY.founders.map((founder, idx) => (
                <motion.div
                  key={founder.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-[28px] p-7 sm:p-9 border border-[#141C17]/10 shadow-xs flex flex-col justify-between group hover:border-[#141C17]/20 transition-all"
                >
                  <div>
                    {/* Founder Portrait */}
                    <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden mb-6 bg-[#F6F8F3] border border-[#141C17]/8 relative">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Role & Name */}
                    <div className="flex flex-col mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0D6E42] mb-1">
                        {founder.role}
                      </span>
                      <h3 className="font-display font-medium text-2xl text-[#141C17] tracking-tight">
                        {founder.name}
                      </h3>
                    </div>

                    {/* Bio */}
                    <p className="text-sm sm:text-[15px] text-[#141C17]/80 font-light leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
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
