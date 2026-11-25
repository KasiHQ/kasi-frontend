import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Buildings } from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";
import { ABOUT_COPY } from "../../../content/about";

export function AboutPage() {
  useEffect(() => {
    document.title = "About Endogenous Technologies Limited";
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-hidden flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1080px] mx-auto">
          {/* Header & Thesis Statement */}
          <div className="text-left max-w-3xl pb-12 border-b border-[#141C17]/15">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42] block mb-3">
              {ABOUT_COPY.company}
            </span>

            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight leading-[1.06]">
              {ABOUT_COPY.thesisTitle}
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-[#0D6E42] font-normal leading-relaxed">
              {ABOUT_COPY.thesisDefinition}
            </p>
          </div>

          {/* Core Narrative Ledger (architectural rules, no glow blobs) */}
          <div className="divide-y divide-[#141C17]/12 border-b border-[#141C17]/15">
            <div className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                01 / Origin From Within
              </div>
              <div className="lg:col-span-8">
                <p className="text-lg sm:text-xl text-[#141C17]/88 font-normal leading-relaxed">
                  {ABOUT_COPY.mission}
                </p>
              </div>
            </div>

            <div className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                02 / Our First System
              </div>
              <div className="lg:col-span-8">
                <p className="text-lg sm:text-xl text-[#141C17]/88 font-normal leading-relaxed">
                  {ABOUT_COPY.product}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D6E42] hover:text-[#141C17] transition-colors group"
                  >
                    <span>Explore Kasi</span>
                    <ArrowRight
                      size={15}
                      weight="bold"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <span className="text-[#141C17]/25">/</span>
                  <Link
                    to="/how-it-works"
                    className="text-sm font-medium text-[#141C17]/70 hover:text-[#141C17] transition-colors"
                  >
                    See how Kasi works
                  </Link>
                </div>
              </div>
            </div>

            <div className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
                03 / The Horizon
              </div>
              <div className="lg:col-span-8">
                <p className="text-lg sm:text-xl text-[#141C17]/88 font-normal leading-relaxed">
                  {ABOUT_COPY.future}
                </p>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="mt-16 sm:mt-20">
            <div className="mb-10">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42] block mb-2">
                LEADERSHIP
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight">
                The founders behind Endogenous.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ABOUT_COPY.founders.map((founder) => (
                <div
                  key={founder.name}
                  className="bg-white rounded-xl border border-[#141C17]/12 overflow-hidden flex flex-col"
                >
                  <div className="w-full aspect-[4/4] bg-[#EAEEE5] overflow-hidden border-b border-[#141C17]/10">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <h3 className="font-display font-medium text-2xl text-[#141C17] tracking-tight">
                      {founder.name}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-[#0D6E42] mt-1 mb-4 block">
                      {founder.role}
                    </span>
                    <p className="text-sm text-[#141C17]/80 font-normal leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Registry Strip */}
          <div className="mt-16 pt-8 border-t border-[#141C17]/15 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#141C17]/65">
            <span className="inline-flex items-center gap-2">
              <Buildings size={16} className="text-[#0D6E42]" />
              {ABOUT_COPY.company}
            </span>
            <span>{ABOUT_COPY.meta.headquarters}</span>
            <span>{ABOUT_COPY.meta.founded} · {ABOUT_COPY.meta.registration}</span>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default AboutPage;
