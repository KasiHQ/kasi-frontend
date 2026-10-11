import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import KasiLogo from "../../../../components/common/KasiLogo";

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
    { title: "Sales Engine", desc: "Automate selling in every DM", href: "/features/sales-engine" },
    { title: "Fulfilment Center", desc: "Paid orders straight to packing", href: "/features/fulfilment" },
    { title: "Delivery & Pricing", desc: "Rules and automated fee calc", href: "/features/delivery" },
    { title: "Payments & Checkout", desc: "Instant Paystack verification", href: "/features/payments" },
    { title: "Chats & Control", desc: "Take over whenever you want", href: "/features/chats" },
    { title: "Customers & CRM", desc: "Every contact automatically saved", href: "/features/customers" },
    { title: "Analytics & Bookings", desc: "Sales numbers that make sense", href: "/features/analytics" },
    { title: "Platforms", desc: "WhatsApp, Instagram, Telegram", href: "/platforms" },
  ];

  const companyLinks = [
    { title: "About Endogenous", desc: "Why we build for social commerce", href: "/about" },
    { title: "Blog", desc: "Guides, seller stories and playbooks", href: "https://blog.usekasi.com" },
    { title: "Contact", desc: "Talk to our team", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F6F8F3]/92 backdrop-blur-md border-b border-[#141C17]/8 shadow-xs py-3"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with official KasiLogo */}
          <Link to="/" className="flex items-center group">
            <KasiLogo variant="full" size={32} />
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
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[430px]"
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
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-50 bg-[#F6F8F3] flex flex-col justify-between px-6 pt-6 pb-8 overflow-y-auto sm:hidden"
          >
            {/* Top Bar inside Fullscreen Nav */}
            <div className="flex items-center justify-between pb-6 border-b border-[#141C17]/10">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <KasiLogo variant="full" size={32} />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white border border-[#141C17]/10 flex items-center justify-center text-[#141C17]"
                aria-label="Close navigation menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Links */}
            <nav className="flex-1 py-8 flex flex-col justify-center gap-6">
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
              >
                How it works
              </Link>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
              >
                Features
              </Link>
              <Link
                to="/market"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
              >
                Market
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
              >
                Pricing
              </Link>

              {/* Company Section in Mobile */}
              <div className="pt-4 border-t border-[#141C17]/10">
                <div className="text-xs font-mono uppercase tracking-wider text-[#141C17]/50 mb-3">
                  Company
                </div>
                <div className="flex flex-col gap-3 pl-1">
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
                  >
                    About Endogenous
                  </Link>
                  <a
                    href="https://blog.usekasi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
                  >
                    Blog
                  </a>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-[#141C17] hover:text-[#0D6E42] transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#141C17]/10 flex flex-col gap-3">
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 text-center font-semibold bg-[#DBF361] text-[#141C17] rounded-full text-base shadow-sm active:scale-95 transition-all"
              >
                Start free
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center font-medium text-sm text-[#141C17]/80 hover:text-[#141C17] border border-[#141C17]/15 rounded-full"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
