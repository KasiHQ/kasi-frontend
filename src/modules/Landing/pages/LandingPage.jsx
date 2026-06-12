import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";
import { WaitlistModal } from "../components/WaitlistModal";
import { PRELAUNCH_WAITLIST_MODE } from "../../../config";

// Import Modular Components
import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { DmSection } from "../components/DmSection";
import { InvoiceSection } from "../components/InvoiceSection";
import { NegotiationSection } from "../components/NegotiationSection";
import { LogisticsSection } from "../components/LogisticsSection";
import { AutomationSection } from "../components/AutomationSection";
import { PricingVsAgentsSection } from "../components/PricingVsAgentsSection";
import { BookingSection } from "../components/BookingSection";
import { CustomerIntelligenceSection } from "../components/CustomerIntelligenceSection";
import { ProactiveOutreachSection } from "../components/ProactiveOutreachSection";
import { PricingSection } from "../components/PricingSection";
import { TestimonialSection } from "../components/TestimonialSection";
import { FAQSection } from "../components/FAQSection";

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const openWaitlist = () => setIsWaitlistOpen(true);

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Scroll Tracking & Intersection Observer
  useEffect(() => {
    const sections = [
      "hero",
      "dms",
      "invoices",
      "negotiation",
      "logistics",
      "automation",
      "pricing-vs-agents",
      "bookings",
      "customer-intelligence",
      "proactive-outreach",
      "pricing",
      "testimonials",
      "faq",
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Custom Animate on Scroll (AOS) Intersection Observer
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans tracking-tight antialiased selection:bg-green-500/10 selection:text-green-600 overflow-x-hidden w-full relative">
      {/* Dynamic Header */}
      <LandingNavbar
        activeSection={activeSection}
        scrolled={scrolled}
        onJoinWaitlistClick={openWaitlist}
      />

      {/* Main Core Sections */}
      <HeroSection onJoinWaitlistClick={openWaitlist} />

      <DmSection />

      <InvoiceSection />

      <NegotiationSection />

      <LogisticsSection />

      <AutomationSection />

      <PricingVsAgentsSection />

      <BookingSection />

      <CustomerIntelligenceSection />

      <ProactiveOutreachSection />

      <PricingSection onJoinWaitlistClick={openWaitlist} />

      <TestimonialSection />

      <FAQSection />

      {/* PART 5 — High-Impact Bottom Call to Action Section (Pre-footer) */}
      <section className="py-24 bg-[#1A7A4A] text-white relative overflow-hidden select-none border-b-[1.5px] border-black">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center flex flex-col items-center space-y-8 font-sans">
          {/* White Pill Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border-[1.5px] border-white/30 text-white text-[12px] font-black uppercase tracking-wider rounded-full">
            <span>READY FOR AUTOPILOT?</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5.5xl font-black font-bricolage tracking-tight max-w-3xl mx-auto leading-none text-white text-center">
            Launch your autonomous
            <br />
            commerce agent in minutes.
          </h2>

          {/* Body */}
          <p className="text-base md:text-lg text-white/75 max-w-xl mx-auto leading-relaxed text-center font-medium">
            Deploy your 24/7 AI employee today. Automatically handle inquiries,
            negotiate deals with floor limits, and reconcile payments
            seamlessly.
          </p>

          {/* 3 Centered Feature Chips */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 pt-4 max-w-4xl w-full">
            {[
              "✓ 24/7 Social Automation — No more missed inquiries or cold leads in DMs.",
              "✓ Floor-Limit Bargaining — AI negotiates prices inside your safe thresholds.",
              "✓ Naira Instant Reconciles — Automatic callback verification directly on bank receipts.",
            ].map((chip, idx) => (
              <div
                key={idx}
                className="bg-white/12 border-[1.5px] border-white/25 rounded-full px-6 py-3 text-white text-[15px] font-semibold text-center select-none"
              >
                {chip}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            {PRELAUNCH_WAITLIST_MODE ? (
              <button
                onClick={openWaitlist}
                className="px-12 py-5 bg-white hover:bg-green-50 text-[#1A7A4A] font-black text-[18px] rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group border-[1.5px] border-black cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 stroke-[3]"
                />
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-12 py-5 bg-white hover:bg-green-50 text-[#1A7A4A] font-black text-[18px] rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group border-[1.5px] border-black"
              >
                <span>Create Your Kasi Storefront</span>
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 stroke-[3]"
                />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* PART 6 — Neubrutalist Rebranded Dark-Mode Footer */}
      <footer className="bg-[#0A0A0A] text-[#9ca3af] py-20 font-sans select-none text-left">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 items-start">
            {/* Column 1 — Brand */}
            <div className="lg:col-span-4 space-y-5">
              <span className="text-2xl font-black tracking-tight text-white font-bricolage flex items-center gap-2">
                <img
                  src="/kasi.png"
                  alt="Kasi"
                  className="w-6 h-6 object-contain shrink-0 select-none"
                />
                <span>Kasi AI</span>
              </span>
              <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-xs mt-4">
                Your AI sales agent that never sleeps.
              </p>
            </div>

            {/* Column 2 — PRODUCT */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest">
                PRODUCT
              </h4>
              <ul className="space-y-3 text-[15px] font-medium">
                <li>
                  <a
                    href="#dms"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Direct Messages
                  </a>
                </li>
                <li>
                  <a
                    href="#invoices"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Invoices & Payments
                  </a>
                </li>
                <li>
                  <a
                    href="#negotiation"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Negotiations
                  </a>
                </li>
                <li>
                  <a
                    href="#logistics"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Logistics
                  </a>
                </li>
                <li>
                  <a
                    href="#bookings"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Booking & Scheduling
                  </a>
                </li>
                <li>
                  <a
                    href="#customer-intelligence"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Customer Intelligence
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 — INTEGRATIONS */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest">
                INTEGRATIONS
              </h4>
              <ul className="space-y-3 text-[15px] font-medium text-white/70">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    WhatsApp API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram DMs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook Messenger
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Paystack
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Google Calendar
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 — COMPANY */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[12px] font-bold text-white/40 uppercase tracking-widest">
                COMPANY
              </h4>
              <ul className="space-y-3 text-[15px] font-medium text-white/70">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Endogenous
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/data-deletion" className="hover:text-white transition-colors">
                    Data Deletion
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@usekasi.com"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[13px] text-white/40 font-medium">
              © 2026 Endogenous Technologies. All rights reserved.
            </span>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram size={16} />, url: "https://www.instagram.com/official_kasi247/" },
                { icon: <Twitter size={16} />, url: "https://x.com/hq_kasi" },
                { icon: <Linkedin size={16} />, url: "https://www.linkedin.com/company/122863967/" },
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
