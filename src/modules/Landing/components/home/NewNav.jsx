import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function NewNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featureLinks = [
    { title: "Sales Engine", desc: "Automate selling in every DM", href: "/features" },
    { title: "Fulfilment Center", desc: "Paid orders straight to packing", href: "/features" },
    { title: "Delivery & Pricing", desc: "Rules and automated fee calc", href: "/features" },
    { title: "Payments & Checkout", desc: "Instant Paystack verification", href: "/features" },
    { title: "Chats & Control", desc: "Take over whenever you want", href: "/features" },
    { title: "Customers & CRM", desc: "Every contact automatically saved", href: "/features" },
    { title: "Analytics & Bookings", desc: "Sales numbers that make sense", href: "/features" },
    { title: "Platforms", desc: "WhatsApp, Instagram, Telegram", href: "/platforms" },
  ];

  const companyLinks = [
    { title: "About Endogenous", desc: "Why we build for social commerce", href: "/about" },
    { title: "Blog", desc: "Guides, seller stories and playbooks", href: "https://blog.usekasi.com" },
    { title: "Contact", desc: "Talk to our team in Lagos", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F6F8F3]/90 backdrop-blur-md border-b border-[#141C17]/8 shadow-xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs border border-[#141C17]/10 bg-white p-0.5 transition-transform group-hover:scale-105">
              <img
                src="/brand/kasi-mark.svg"
                alt="Kasi logo mark"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-poppins font-bold text-xl sm:text-2xl tracking-tight text-[#141C17]">
              Kasi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-[#141C17]/80 hover:text-[#141C17] transition-colors"
            >
              How it works
            </Link>

            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-[#141C17]/80 hover:text-[#141C17] transition-colors py-1 cursor-pointer"
                aria-expanded={featuresOpen}
              >
                <span>Features</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    featuresOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[420px]"
                  >
                    <div className="bg-white rounded-[18px] shadow-lg border border-[#141C17]/10 p-3 grid grid-cols-2 gap-1">
                      {featureLinks.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="p-2.5 rounded-lg hover:bg-[#F6F8F3] transition-colors block group"
                        >
                          <div className="text-xs font-semibold text-[#141C17] group-hover:text-[#0D6E42] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#141C17]/60 line-clamp-1 mt-0.5">
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/try"
              className="text-sm font-medium text-[#141C17]/80 hover:text-[#141C17] transition-colors"
            >
              Try it
            </Link>

            <Link
              to="/market"
              className="text-sm font-medium text-[#141C17]/80 hover:text-[#141C17] transition-colors"
            >
              Market
            </Link>

            <Link
              to="/pricing"
              className="text-sm font-medium text-[#141C17]/80 hover:text-[#141C17] transition-colors"
            >
              Pricing
            </Link>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-[#141C17]/80 hover:text-[#141C17] transition-colors py-1 cursor-pointer"
                aria-expanded={companyOpen}
              >
                <span>Company</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    companyOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[240px]"
                  >
                    <div className="bg-white rounded-[18px] shadow-lg border border-[#141C17]/10 p-2 flex flex-col gap-1">
                      {companyLinks.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          className="p-2.5 rounded-lg hover:bg-[#F6F8F3] transition-colors block group"
                        >
                          <div className="text-xs font-semibold text-[#141C17] group-hover:text-[#0D6E42] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#141C17]/60 line-clamp-1 mt-0.5">
                            {item.desc}
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-[#141C17]/80 hover:text-[#141C17] transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-sm shadow-xs hover:shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/signup"
              className="px-3.5 py-1.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-xs shadow-xs"
            >
              Start free
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#141C17] hover:bg-black/5"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-[#F6F8F3]/98 backdrop-blur-xl border-b border-[#141C17]/10 px-6 py-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-4 text-base font-medium">
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#141C17]">
                How it works
              </Link>
              <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#141C17]">
                Features
              </Link>
              <Link to="/try" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#141C17]">
                Try it
              </Link>
              <Link to="/market" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#141C17]">
                Market
              </Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#141C17]">
                Pricing
              </Link>

              <div className="pt-4 border-t border-[#141C17]/10 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold text-[#141C17] border border-[#141C17]/15 rounded-full"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold bg-[#DBF361] text-[#141C17] rounded-full shadow-sm"
                >
                  Start free
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
