import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Envelope,
  Copy,
  Check,
  PaperPlaneTilt,
  Headset,
  Code,
  Handshake,
  MapPin,
  Clock,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";

export function ContactPage() {
  const shouldReduceMotion = useReducedMotion();
  const [copiedEmail, setCopiedEmail] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    recipient: "support@usekasi.com",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | Kasi — AI Agent for Social Commerce";
  }, []);

  const handleCopy = (email) => {
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail("");
    }, 2500);
  };

  const contacts = [
    {
      name: "Kasi Support",
      email: "support@usekasi.com",
      role: "Merchant Support & Setup",
      description:
        "For product walkthroughs, WhatsApp connection troubleshooting, catalog configuration, and day-to-day merchant help.",
      badge: "Fastest response",
      icon: Headset,
      color: "#0D6E42",
      bgLight: "bg-[#0D6E42]/5",
      borderLight: "border-[#0D6E42]/20",
    },
    {
      name: "Bolaji",
      email: "bolaji@usekasi.com",
      role: "Engineering & Architecture",
      description:
        "For API integrations, custom technical workflows, system reliability, and architecture discussions.",
      badge: "Direct Line",
      icon: Code,
      color: "#141C17",
      bgLight: "bg-[#141C17]/5",
      borderLight: "border-[#141C17]/15",
    },
    {
      name: "Temidayo",
      email: "temidayo@usekasi.com",
      role: "Growth & Partnerships",
      description:
        "For enterprise and high-volume brand partnerships, strategic alliances, vendor onboarding, and commercial inquiries.",
      badge: "Direct Line",
      icon: Handshake,
      color: "#0D6E42",
      bgLight: "bg-[#0D6E42]/5",
      borderLight: "border-[#0D6E42]/20",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;

    // Construct mailto link
    const recipientName =
      contacts.find((c) => c.email === formState.recipient)?.name || "Kasi Team";
    const subject = encodeURIComponent(
      formState.subject || `Inquiry for ${recipientName} from ${formState.name || formState.email}`
    );
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\nRecipient: ${recipientName} (${formState.recipient})\n\nMessage:\n${formState.message}`
    );

    window.location.href = `mailto:${formState.recipient}?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-40 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        {/* Header Section */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D6E42]/10 border border-[#0D6E42]/20 text-[#0D6E42] text-xs font-mono font-medium tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0D6E42] animate-pulse" />
            DIRECT CONTACT & SUPPORT
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight leading-[1.1]">
            Speak directly with <br className="hidden sm:inline" />
            <span className="text-[#0D6E42]">our team.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#141C17]/75 font-light leading-relaxed max-w-2xl mx-auto">
            No endless ticket loops or anonymous robots. Reach the right person directly
            for technical support, merchant setup, or commercial partnerships.
          </p>
        </motion.div>

        {/* 3 Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {contacts.map((contact, index) => {
            const Icon = contact.icon;
            const isCopied = copiedEmail === contact.email;

            return (
              <motion.div
                key={contact.email}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="bg-white rounded-[24px] p-7 sm:p-8 border border-[#141C17]/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent top border strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-[#0D6E42] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0D6E42]/10 text-[#0D6E42] flex items-center justify-center">
                      <Icon size={24} weight="bold" />
                    </div>
                    <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#141C17]/5 text-[#141C17]/70">
                      {contact.badge}
                    </span>
                  </div>

                  {/* Name & Role */}
                  <h2 className="font-display font-medium text-2xl text-[#141C17]">
                    {contact.name}
                  </h2>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#0D6E42] font-semibold mt-1">
                    {contact.role}
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm text-[#141C17]/70 font-light leading-relaxed">
                    {contact.description}
                  </p>
                </div>

                {/* Email Address & Actions */}
                <div className="mt-8 pt-6 border-t border-[#141C17]/8">
                  <div className="flex items-center justify-between bg-[#F6F8F3] px-3.5 py-2.5 rounded-xl border border-[#141C17]/8 mb-3">
                    <span className="font-mono text-xs sm:text-sm text-[#141C17] font-medium truncate select-all">
                      {contact.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.email)}
                      className="ml-2 text-xs flex items-center gap-1 text-[#0D6E42] hover:text-[#0a5231] font-semibold cursor-pointer shrink-0"
                      title="Copy email to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} weight="bold" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} weight="bold" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={`mailto:${contact.email}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0D6E42] text-white font-medium text-sm hover:bg-[#0a5231] active:scale-98 transition-all shadow-xs"
                  >
                    <Envelope size={16} weight="bold" />
                    <span>Send Email</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two-Column Section: Direct Message Form & Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Message Form */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-8 sm:p-10 border border-[#141C17]/10 shadow-xs">
            <div className="mb-8">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full inline-block mb-3">
                INSTANT MESSAGE
              </span>
              <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#141C17]">
                Send a note directly from here.
              </h3>
              <p className="mt-2 text-sm text-[#141C17]/70 font-light">
                Fill this out to launch your mail client prefilled with your message.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#0D6E42]/10 border border-[#0D6E42]/20 text-center">
                <Check size={32} weight="bold" className="text-[#0D6E42] mx-auto mb-3" />
                <h4 className="font-display font-medium text-lg text-[#141C17]">
                  Message Prepared!
                </h4>
                <p className="text-sm text-[#141C17]/70 mt-1 max-w-md mx-auto">
                  Your email client has been opened with your message ready to send. If it didn't open automatically, you can email us directly at{" "}
                  <span className="font-mono text-[#0D6E42] font-semibold">{formState.recipient}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-5 px-5 py-2 rounded-full text-xs font-semibold bg-white border border-[#141C17]/15 hover:bg-[#F6F8F3] transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#141C17]/80 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Folake Adebayo"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#141C17]/15 bg-[#F6F8F3] text-sm focus:outline-none focus:border-[#0D6E42] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#141C17]/80 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@store.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#141C17]/15 bg-[#F6F8F3] text-sm focus:outline-none focus:border-[#0D6E42] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#141C17]/80 mb-2">
                    Who would you like to reach?
                  </label>
                  <select
                    value={formState.recipient}
                    onChange={(e) =>
                      setFormState({ ...formState, recipient: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#141C17]/15 bg-[#F6F8F3] text-sm focus:outline-none focus:border-[#0D6E42] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="support@usekasi.com">
                      Kasi Support (support@usekasi.com) — Setup & Merchant Help
                    </option>
                    <option value="bolaji@usekasi.com">
                      Bolaji (bolaji@usekasi.com) — Engineering & Architecture
                    </option>
                    <option value="temidayo@usekasi.com">
                      Temidayo (temidayo@usekasi.com) — Growth & Brand Partnerships
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#141C17]/80 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of what you need"
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#141C17]/15 bg-[#F6F8F3] text-sm focus:outline-none focus:border-[#0D6E42] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#141C17]/80 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your store, volume, questions, or how we can help..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#141C17]/15 bg-[#F6F8F3] text-sm focus:outline-none focus:border-[#0D6E42] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#0D6E42] text-white font-semibold text-sm hover:bg-[#0a5231] active:scale-98 transition-all cursor-pointer shadow-sm"
                >
                  <PaperPlaneTilt size={18} weight="bold" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Key Details & Quick Links */}
          <div className="lg:col-span-5 space-y-6">
            {/* Headquarters & Hours Card */}
            <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-[#141C17]/10 shadow-xs">
              <h4 className="font-display font-medium text-xl text-[#141C17] mb-5">
                Company Details
              </h4>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0D6E42]/10 text-[#0D6E42] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} weight="bold" />
                  </div>
                  <div>
                    <div className="font-medium text-[#141C17]">Headquarters</div>
                    <div className="text-[#141C17]/70 font-light mt-0.5">
                      Endogenous Technologies Limited
                      <br />
                      Lagos, Nigeria
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-[#141C17]/8">
                  <div className="w-8 h-8 rounded-lg bg-[#0D6E42]/10 text-[#0D6E42] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={18} weight="bold" />
                  </div>
                  <div>
                    <div className="font-medium text-[#141C17]">Operating Hours</div>
                    <div className="text-[#141C17]/70 font-light mt-0.5">
                      Monday – Saturday: 8:00 AM – 8:00 PM WAT
                      <br />
                      <span className="text-xs text-[#0D6E42] font-medium">
                        *AI Sales Agents run 24/7/365 without pause.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Explore Card */}
            <div className="bg-[#141C17] text-[#F6F8F3] rounded-[28px] p-7 sm:p-8 relative overflow-hidden">
              <div
                className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#0D6E42]/30 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkle size={18} weight="fill" className="text-[#DBF361]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#DBF361]">
                    EXPLORE FIRST
                  </span>
                </div>

                <h4 className="font-display font-medium text-xl text-white">
                  Looking for self-service info?
                </h4>
                <p className="mt-2 text-sm text-white/70 font-light leading-relaxed">
                  See how an order travels through Kasi or check transparent pricing tiers before reaching out.
                </p>

                <div className="mt-6 space-y-2.5">
                  <Link
                    to="/how-it-works"
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
                  >
                    <span>How Kasi works</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/pricing"
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
                  >
                    <span>View Pricing Plans</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/#demo-video"
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
                  >
                    <span>Watch 2-Minute Demo</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default ContactPage;
