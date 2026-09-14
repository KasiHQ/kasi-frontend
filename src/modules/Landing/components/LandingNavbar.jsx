import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  MessageSquare,
  FileText,
  Scale,
  Truck,
  Calendar,
  Sparkles,
  Users,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { PRELAUNCH_WAITLIST_MODE } from "../../../config";

// Categorized features for mega dropdown
const FEATURE_GROUPS = [
  {
    title: "SALES & AUTOMATION",
    items: [
      {
        id: "dms",
        title: "Omnichannel DMs",
        desc: "24/7 AI employee answering queries across WhatsApp & Instagram.",
        icon: MessageSquare,
      },
      {
        id: "negotiation",
        title: "Smart Bargaining",
        desc: "Autonomous negotiations governed by your strict bottom floor prices.",
        icon: Scale,
      },
      {
        id: "invoices",
        title: "Instant Invoicing",
        desc: "Automated Nigerian payment links, USSD & bank transfer confirmation.",
        icon: FileText,
      },
      {
        id: "logistics",
        title: "Delivery & Dispatch",
        desc: "Calibrated logistics pricing, auto-dispatch and live package tracking.",
        icon: Truck,
      },
    ],
  },
  {
    title: "GROWTH & OPERATIONS",
    items: [
      {
        id: "booking",
        title: "Bookings & Calendar",
        desc: "Automated schedule coordination for service & appointment vendors.",
        icon: Calendar,
      },
      {
        id: "customer-intelligence",
        title: "Customer Intelligence",
        desc: "Know high-LTV buyers, repeat purchasing cycles, and risk profiles.",
        icon: Users,
      },
      {
        id: "proactive-outreach",
        title: "Proactive Outreach",
        desc: "Targeted broadcast nudges for re-orders, restocks and abandoned carts.",
        icon: Send,
      },
      {
        id: "pricing-vs-agents",
        title: "AI vs Traditional Agents",
        desc: "Why automated intelligence out-converts manual human support teams.",
        icon: Zap,
      },
    ],
  },
];

export const LandingNavbar = ({ activeSection, scrolled, onJoinWaitlistClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleLinkClick = (e, id) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 64; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full h-16 flex items-center justify-center",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 flex justify-between items-center h-full">
        {/* Logo and Brand */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, "hero")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <img
            src="/kasi.png"
            alt="Kasi AI Logo"
            className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="text-xl font-black text-black tracking-tight select-none">
            Kasi <span className="text-[#1A7A4A] font-black">AI</span>
          </span>
        </a>

        {/* Desktop Nav - Streamlined core links with Upwork-style Features mega-dropdown */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
          {/* Features Mega Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={clsx(
                "inline-flex items-center gap-1.5 text-[14px] font-medium tracking-tight transition-colors py-1 cursor-pointer select-none",
                dropdownOpen
                  ? "text-[#1A7A4A] font-semibold"
                  : "text-gray-700 hover:text-black",
              )}
            >
              <span>Features</span>
              <ChevronDown
                size={14}
                className={clsx(
                  "transition-transform duration-200 text-gray-500",
                  dropdownOpen && "rotate-180 text-[#1A7A4A]",
                )}
              />
            </button>

            {/* Mega Dropdown Panel */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[740px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column: Overview / Spotlight */}
                  <div className="col-span-4 bg-gray-50 rounded-xl p-5 flex flex-col justify-between border border-gray-100/80">
                    <div>
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1A7A4A]/10 text-[#1A7A4A] text-[11px] font-bold tracking-wide uppercase mb-3">
                        The Commerce Suite
                      </div>
                      <h4 className="text-base font-bold text-gray-950 leading-snug tracking-tight">
                        Autonomous Commerce Engine
                      </h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Your 24/7 AI employee closing orders, bargaining with floor limits, and verifying bank transfers on WhatsApp & IG.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200/60 mt-4">
                      <a
                        href="#video"
                        onClick={(e) => handleLinkClick(e, "video")}
                        className="text-xs font-bold text-[#1A7A4A] hover:text-[#15603A] flex items-center gap-1 group/demo cursor-pointer"
                      >
                        Watch 1-min demo video
                        <ArrowRight size={12} className="group-hover/demo:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  {/* Right Columns: Feature Grids with Brand Green Icons */}
                  <div className="col-span-8 grid grid-cols-2 gap-x-6 gap-y-4">
                    {FEATURE_GROUPS.map((group) => (
                      <div key={group.title} className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                          {group.title}
                        </p>
                        <div className="space-y-2">
                          {group.items.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => handleLinkClick(e, item.id)}
                                className="group flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#1A7A4A] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#15603A] transition-all">
                                  <IconComponent size={15} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#1A7A4A] transition-colors leading-snug">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
                                    {item.desc}
                                  </p>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dropdown Footer Bar */}
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500">
                  <a
                    href="#faq"
                    onClick={(e) => handleLinkClick(e, "faq")}
                    className="font-medium text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    Merchant FAQ <ArrowRight size={11} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Pricing link */}
          <a
            href="#pricing"
            onClick={(e) => handleLinkClick(e, "pricing")}
            className={clsx(
              "text-[14px] font-medium tracking-tight transition-colors select-none cursor-pointer",
              activeSection === "pricing"
                ? "text-[#1A7A4A] font-semibold"
                : "text-gray-700 hover:text-black",
            )}
          >
            Pricing
          </a>

          {/* Marketplace link (internal route) */}
          <Link
            to="/market"
            className="text-[14px] font-medium tracking-tight transition-colors select-none text-gray-700 hover:text-black"
          >
            Marketplace
          </Link>

          {/* Blog link (external) */}
          <a
            href="https://blog.usekasi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium tracking-tight transition-colors select-none text-gray-700 hover:text-black"
          >
            Blog
          </a>
        </div>

        {/* Desktop Right Side CTAs */}
        <div className="hidden md:flex items-center gap-3.5">
          {PRELAUNCH_WAITLIST_MODE ? (
            <button
              onClick={onJoinWaitlistClick}
              className="text-[14px] font-bold text-white bg-[#1A7A4A] hover:bg-[#15603A] px-5 py-2.5 rounded-xl active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Join Waitlist
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[14px] font-semibold text-gray-600 hover:text-black transition-colors px-2 py-1"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="text-[14px] font-bold text-white bg-black px-4.5 py-2.5 rounded-xl hover:bg-neutral-800 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Get started →
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] overflow-y-auto animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col min-h-[100dvh] p-6 pb-12 justify-between">
            <div className="flex flex-col gap-5">
              {/* Header inside the overlay */}
              <div className="flex justify-between items-center h-12">
                <a
                  href="#hero"
                  onClick={(e) => {
                    handleLinkClick(e, "hero");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <img
                    src="/kasi.png"
                    alt="Kasi AI Logo"
                    className="w-8 h-8 object-contain shrink-0"
                  />
                  <span className="text-xl font-black text-black tracking-tight select-none">
                    Kasi <span className="text-[#1A7A4A] font-black">AI</span>
                  </span>
                </a>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex flex-col gap-3 mt-4">
                {/* Collapsible Features Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileFeaturesOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between text-2xl font-bold py-2 text-left text-gray-900 cursor-pointer"
                  >
                    <span>Features</span>
                    <ChevronDown
                      size={20}
                      className={clsx(
                        "transition-transform text-gray-400",
                        mobileFeaturesOpen && "rotate-180 text-[#1A7A4A]",
                      )}
                    />
                  </button>

                  {mobileFeaturesOpen && (
                    <div className="py-2 pl-1 pr-2 space-y-2.5">
                      {FEATURE_GROUPS.flatMap((g) => g.items).map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => handleLinkClick(e, item.id)}
                            className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#1A7A4A] flex items-center justify-center shrink-0">
                              <IconComponent size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.title}</p>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{item.desc}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                <a
                  href="#pricing"
                  onClick={(e) => handleLinkClick(e, "pricing")}
                  className="text-2xl font-bold py-2 text-left text-gray-900 hover:text-[#1A7A4A] transition-colors"
                >
                  Pricing
                </a>

                <Link
                  to="/market"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold py-2 text-left text-gray-900 hover:text-[#1A7A4A] transition-colors"
                >
                  Marketplace
                </Link>

                <a
                  href="https://blog.usekasi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold py-2 text-left text-gray-900 hover:text-[#1A7A4A] transition-colors"
                >
                  Blog
                </a>
              </div>
            </div>

            {/* Bottom Actions inside Full Screen menu */}
            <div className="flex flex-col gap-3 mt-8">
              {PRELAUNCH_WAITLIST_MODE ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onJoinWaitlistClick();
                  }}
                  className="w-full text-center py-4 font-bold text-base text-white bg-[#1A7A4A] hover:bg-[#15603A] rounded-xl transition-all duration-150 shadow-sm cursor-pointer"
                >
                  Join Waitlist
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 font-bold text-base text-gray-800 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-150"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 font-bold text-base text-white bg-black rounded-xl hover:bg-neutral-800 transition-all duration-150 shadow-sm"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
