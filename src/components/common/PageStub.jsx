import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { NewNav } from "../../modules/Landing/components/home/NewNav";
import { GlobalFooter } from "./GlobalFooter";

/**
 * Reusable PageStub component for zero-404 site navigation.
 * Renders real layout, exact spec H1 & sub, "Coming in Wave 2" badge, and noindex robots meta.
 */
export function PageStub({ route }) {
  useEffect(() => {
    // Set document title & noindex meta
    document.title = `${route.name} | Kasi`;

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    const originalRobots = metaRobots.getAttribute("content");
    metaRobots.setAttribute("content", "noindex, nofollow");

    return () => {
      if (originalRobots) {
        metaRobots.setAttribute("content", originalRobots);
      } else {
        metaRobots.removeAttribute("content");
      }
    };
  }, [route]);

  const waNumber = import.meta.env.VITE_DEMO_WHATSAPP || "2348000000000";
  const waDemoLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Kasi, I'm checking out the ${route.name} feature.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins flex flex-col justify-between selection:bg-[#DBF361] selection:text-[#141C17]">
      <NewNav />

      <main className="flex-1 pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto w-full flex flex-col justify-center text-center">
        {/* Spec Badge */}
        <div className="inline-flex items-center gap-2 self-center px-3.5 py-1.5 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#0D6E42] animate-pulse" />
          <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
            Coming in Wave 2 · Spec {route.specSectionId || "01"}
          </span>
        </div>

        {/* In-Spec H1 */}
        <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141C17] tracking-tight leading-[1.1] max-w-3xl mx-auto">
          {route.h1}
        </h1>

        {/* In-Spec Sub */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#141C17]/75 font-light max-w-2xl mx-auto leading-relaxed">
          {route.sub}
        </p>

        {/* Action CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-sm sm:text-base shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            Start free
          </Link>
          <a
            href={waDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-[#141C17] font-semibold text-sm sm:text-base border border-[#141C17]/15 shadow-xs hover:border-[#0D6E42] hover:bg-[#0D6E42]/5 active:scale-95 transition-all"
          >
            Chat the live demo
          </a>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-3.5 text-sm font-medium text-[#141C17]/70 hover:text-[#0D6E42] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Secondary Note */}
        <div className="mt-14 pt-8 border-t border-[#141C17]/10 max-w-md mx-auto text-xs text-[#141C17]/50 font-mono">
          This section is actively in development as part of the Kasi Social Commerce OS Wave 2 rollout.
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default PageStub;
