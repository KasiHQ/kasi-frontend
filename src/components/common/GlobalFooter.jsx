import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import KasiLogo from "./KasiLogo";

export function GlobalFooter() {
  const waNumber = import.meta.env.VITE_DEMO_WHATSAPP || "2348000000000";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hi Kasi, I'd like to chat with the live demo."
  )}`;

  return (
    <footer className="bg-[#141C17] text-white/70 py-16 sm:py-20 font-poppins text-sm border-t border-white/10 select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <Link to="/" className="inline-block">
              <KasiLogo variant="full" theme="dark" size={34} />
            </Link>
            <p className="text-sm text-white/60 font-light max-w-sm leading-relaxed mt-2">
              The social commerce operating system for businesses that sell on WhatsApp, Instagram, and Telegram.
            </p>

            {/* Official Meta Tech Provider Badge */}
            <div className="mt-2 p-2.5 bg-white rounded-xl shadow-xs border border-white/20 inline-block">
              <img
                src="/official-meta-tech-provider.jpg"
                alt="Official Meta Tech Provider"
                className="h-10 w-auto object-contain rounded"
              />
            </div>
          </div>

          {/* Col 1: PRODUCT */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-mono-labels text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
              PRODUCT
            </span>
            <Link to="/how-it-works" className="hover:text-white transition-colors">
              How it works
            </Link>
            <Link to="/features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/try" className="hover:text-white transition-colors">
              Try it
            </Link>
            <Link to="/market" className="hover:text-white transition-colors">
              Market
            </Link>
            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/platforms" className="hover:text-white transition-colors">
              Platforms
            </Link>
          </div>

          {/* Col 2: COMPANY */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-mono-labels text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
              COMPANY
            </span>
            <Link to="/about" className="hover:text-white transition-colors">
              About Endogenous
            </Link>
            <a
              href="https://blog.usekasi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Blog
            </a>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              Careers
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#DBF361] transition-colors"
            >
              WhatsApp us
            </a>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-white/40">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/data-deletion" className="hover:text-white transition-colors">
                Data Deletion
              </Link>
            </div>
          </div>

          {/* Col 3: GET STARTED */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-mono-labels text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
              GET STARTED
            </span>
            <Link to="/signup" className="hover:text-white transition-colors">
              Create a store
            </Link>
            <Link to="/try#book" className="hover:text-white transition-colors">
              Book a demo
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Chat the live demo
            </a>
            <Link to="/login" className="hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        {/* Bottom Bar with official spec copy */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p className="leading-relaxed text-center md:text-left">
            Kasi is a product of Endogenous Technologies. Built in Nigeria, for the businesses that run on WhatsApp. © 2026 Endogenous Technologies Ltd.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/kasi.official_ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:text-white hover:border-white transition-colors"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://x.com/hq_kasi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:text-white hover:border-white transition-colors"
            >
              <Twitter size={15} />
            </a>
            <a
              href="https://www.linkedin.com/company/122863967/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:text-white hover:border-white transition-colors"
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default GlobalFooter;
