"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Nav() {
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
    { title: "Delivery & Pricing", desc: "Rules and automated fee calc", href: "/features/delivery-pricing" },
    { title: "Payments & Checkout", desc: "Instant Paystack verification", href: "/features/payments" },
    { title: "Chats & Control", desc: "Take over whenever you want", href: "/features/chats" },
    { title: "Customers & CRM", desc: "Every contact automatically saved", href: "/features/customers" },
    { title: "Analytics & Bookings", desc: "Sales numbers that make sense", href: "/features/analytics" },
    { title: "Platforms", desc: "WhatsApp, Instagram, Telegram", href: "/platforms" },
  ];

  const companyLinks = [
    { title: "About Endogenous", desc: "Why we build for social commerce", href: "/about" },
    { title: "Blog", desc: "Guides, seller stories and playbooks", href: "/blog" },
    { title: "Contact", desc: "Talk to our team in Lagos", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-ink/8 shadow-xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs border border-ink/10 bg-white p-0.5 transition-transform group-hover:scale-105">
              <Image
                src="/brand/kasi-mark.svg"
                alt="Kasi logo mark"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-ink">
              Kasi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
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
                className="flex items-center gap-1 text-sm font-medium text-ink/80 hover:text-ink transition-colors py-1"
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
                    <div className="bg-white rounded-card shadow-lg border border-ink/10 p-3 grid grid-cols-2 gap-1">
                      {featureLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="p-2.5 rounded-lg hover:bg-paper transition-colors block group"
                        >
                          <div className="text-xs font-semibold text-ink group-hover:text-forest transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-ink/60 line-clamp-1 mt-0.5">
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
              href="/try"
              className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
            >
              Try it
            </Link>

            <Link
              href="/market"
              className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
            >
              Market
            </Link>

            <Link
              href="/pricing"
              className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
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
                className="flex items-center gap-1 text-sm font-medium text-ink/80 hover:text-ink transition-colors py-1"
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
                    <div className="bg-white rounded-card shadow-lg border border-ink/10 p-2 flex flex-col gap-1">
                      {companyLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="p-2.5 rounded-lg hover:bg-paper transition-colors block group"
                        >
                          <div className="text-xs font-semibold text-ink group-hover:text-forest transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-ink/60 line-clamp-1 mt-0.5">
                            {item.desc}
                          </div>
                        </Link>
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
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-ink/80 hover:text-ink transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/get-started"
              className="px-5 py-2.5 rounded-full bg-lime text-ink font-semibold text-sm shadow-xs hover:shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/get-started"
              className="px-3.5 py-1.5 rounded-full bg-lime text-ink font-semibold text-xs shadow-xs"
            >
              Start free
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink hover:bg-black/5"
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

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-paper/98 backdrop-blur-xl border-b border-ink/10 px-6 py-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-4 text-base font-medium">
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink"
              >
                How it works
              </Link>
              <Link
                href="/features/sales-engine"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink"
              >
                Features
              </Link>
              <Link
                href="/try"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink"
              >
                Try it
              </Link>
              <Link
                href="/market"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink"
              >
                Market
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink"
              >
                About
              </Link>

              <div className="pt-4 border-t border-ink/10 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold text-ink border border-ink/15 rounded-full"
                >
                  Sign in
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold bg-lime text-ink rounded-full shadow-sm"
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
