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
import { ExplainerVideoSection } from "../components/ExplainerVideoSection";
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
  const { user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const openWaitlist = () => setIsWaitlistOpen(true);

  const handleGoogleLogin = async (response) => {
    try {
      const loggedInUser = await loginWithGoogle(response.credential);
      if (loggedInUser?.is_admin) {
        navigate("/kasisalienceadministration");
      } else {
        if (!loggedInUser.onboarding_completed) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Google auto-login failed on landing page:", err);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google && !user && !loading) {
      try {
        google.accounts.id.initialize({
          client_id: "418652112968-i6bv554036fq1p6stf6ujhsf5qkste3q.apps.googleusercontent.com",
          callback: handleGoogleLogin,
          auto_select: true,
        });

        // Trigger One Tap overlay
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap not displayed on landing:", notification.getNotDisplayedReason());
          }
        });
      } catch (err) {
        console.error("Google One Tap init failed on landing:", err);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && !loading) {
      if (user.is_admin) {
        navigate("/kasisalienceadministration");
      } else {
        navigate("/dashboard");
      }
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

      <ExplainerVideoSection />

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
      <section className="py-24 bg-[#1A7A4A] text-white relative overflow-hidden select-none">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center flex flex-col items-center space-y-8 font-sans">
          {/* White Pill Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/20 text-white text-[12px] font-bold uppercase tracking-wider rounded-full shadow-xs">
            <span>READY FOR AUTOPILOT?</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5.5xl font-black font-bricolage tracking-tight max-w-3xl mx-auto leading-none text-white text-center">
            Turn social conversations
            <br />
            into predictable profit.
          </h2>

          {/* Body */}
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed text-center font-medium">
            Deploy an AI employee that handles your customer conversation from first DM to final delivery. Scale sales, protect profit margins, build customer retention, and organize your business for credit and long-term growth.
          </p>

          {/* 3 Centered Feature Chips */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 pt-4 max-w-4xl w-full">
            {[
              "✓ Omnichannel Autopilot — Zero missed leads on WhatsApp, Instagram & TikTok.",
              "✓ Margin-Protected Bargaining — AI negotiates within your bottom floor thresholds.",
              "✓ End-to-End Fulfilment — Instant bank transfer verification & automated delivery dispatch.",
            ].map((chip, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-white/15 rounded-xl px-5 py-2.5 text-white/95 text-[13.5px] font-medium text-center select-none backdrop-blur-xs"
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
                className="px-10 py-4 bg-white hover:bg-gray-50 text-[#1A7A4A] font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 stroke-[2.5]"
                />
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-10 py-4 bg-white hover:bg-gray-50 text-[#1A7A4A] font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Get Started with Kasi</span>
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 stroke-[2.5]"
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

              {/* Official Meta Tech Provider Card - Prominent & Tall */}
              <div className="pt-4">
                <div className="p-3.5 bg-white rounded-2xl border border-white/20 shadow-md inline-block max-w-[210px] select-none hover:shadow-lg transition-all">
                  <img 
                    src="/official-meta-tech-provider.jpg" 
                    alt="Official Meta Tech Provider" 
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
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
                  <a href="https://blog.usekasi.com" className="hover:text-white transition-colors">
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
