import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, MessageSquare, ShoppingBag } from "lucide-react";
import KasiLogo from "../common/KasiLogo";
import { GlobalFooter } from "../common/GlobalFooter";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] flex flex-col justify-between font-poppins selection:bg-[#DBF361] selection:text-[#141C17]">
      {/* Minimal Top Bar */}
      <header className="py-6 px-6 sm:px-10 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/">
          <KasiLogo variant="full" size={32} />
        </Link>
        <Link
          to="/"
          className="text-xs sm:text-sm font-semibold text-[#0D6E42] hover:underline"
        >
          Return Home →
        </Link>
      </header>

      {/* Main 404 Stage */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0D6E42]" />
            <span className="font-mono-labels text-xs font-semibold uppercase tracking-wider text-[#0D6E42]">
              Error 404 · Page Not Found
            </span>
          </div>

          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight leading-[1.05]">
            Lost in the chat?
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#141C17]/75 font-light leading-relaxed max-w-md mx-auto">
            The page you were looking for doesn&apos;t exist or was moved. Let&apos;s get you back on track.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              to="/"
              className="p-4 bg-white rounded-2xl border border-[#141C17]/10 shadow-xs hover:border-[#0D6E42] hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <Home size={20} className="text-[#0D6E42] mb-3" />
              <div>
                <span className="font-bold text-sm text-[#141C17] block">Home</span>
                <span className="text-xs text-[#141C17]/60 block mt-0.5">Explore Kasi OS</span>
              </div>
              <ArrowRight size={14} className="text-[#0D6E42] mt-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/try"
              className="p-4 bg-white rounded-2xl border border-[#141C17]/10 shadow-xs hover:border-[#0D6E42] hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <MessageSquare size={20} className="text-[#0D6E42] mb-3" />
              <div>
                <span className="font-bold text-sm text-[#141C17] block">Try Demo</span>
                <span className="text-xs text-[#141C17]/60 block mt-0.5">Test live chat</span>
              </div>
              <ArrowRight size={14} className="text-[#0D6E42] mt-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/market"
              className="p-4 bg-white rounded-2xl border border-[#141C17]/10 shadow-xs hover:border-[#0D6E42] hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <ShoppingBag size={20} className="text-[#0D6E42] mb-3" />
              <div>
                <span className="font-bold text-sm text-[#141C17] block">Market</span>
                <span className="text-xs text-[#141C17]/60 block mt-0.5">Browse sellers</span>
              </div>
              <ArrowRight size={14} className="text-[#0D6E42] mt-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-sm shadow-xs hover:shadow-sm hover:brightness-105 transition-all"
            >
              Take me to the homepage
            </Link>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default NotFound;
