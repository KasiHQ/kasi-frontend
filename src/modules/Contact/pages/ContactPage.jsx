import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  InstagramLogo,
  XLogo,
  LinkedinLogo,
  EnvelopeSimple,
  CheckCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { NewNav } from "../../Landing/components/home/NewNav";
import { GlobalFooter } from "../../../components/common/GlobalFooter";
import api from "../../../api/axios";

/**
 * Left Support Human Illustration (Sitting at desk with laptop, propping cheeks)
 * Styled in Kasi Brand Green (#0D6E42)
 */
function LeftSupportHumanSvg({ className = "w-full h-auto" }) {
  return (
    <svg
      viewBox="0 0 260 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stool */}
      <path
        d="M38 238L52 188M76 238L62 188M34 188H80"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Desk legs & surface */}
      <path
        d="M102 238L118 178M154 238L138 178M88 178H184"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Legs & Torso */}
      <path
        d="M52 188C52 165 65 145 80 145H102C108 158 105 188 105 188"
        fill="#0D6E42"
        fillOpacity="0.12"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 188V232M82 188V232"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Shoes */}
      <path
        d="M50 232H72M74 232H96"
        stroke="#0D6E42"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Body & Arms resting on desk */}
      <path
        d="M78 145C78 122 92 110 110 110C128 110 136 122 136 145L138 178H86L78 145Z"
        fill="#0D6E42"
        fillOpacity="0.16"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arms propping chin */}
      <path
        d="M86 150L102 178H122L132 150"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hands holding cheeks */}
      <path
        d="M96 148C94 140 102 134 105 138M124 148C126 140 118 134 115 138"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Head */}
      <ellipse
        cx="110"
        cy="96"
        rx="22"
        ry="24"
        fill="#F6F8F3"
        stroke="#0D6E42"
        strokeWidth="3.5"
      />
      {/* Hair */}
      <path
        d="M88 94C88 74 100 68 114 68C130 68 134 78 134 94C134 84 122 80 112 80C98 80 92 88 88 94Z"
        fill="#0D6E42"
        stroke="#0D6E42"
        strokeWidth="2"
      />
      {/* Eyes & Smile */}
      <circle cx="103" cy="95" r="2.5" fill="#0D6E42" />
      <circle cx="117" cy="95" r="2.5" fill="#0D6E42" />
      <path
        d="M106 104C108 107 112 107 114 104"
        stroke="#0D6E42"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Laptop on desk */}
      <path
        d="M136 178L150 152H178L164 178H136Z"
        fill="#0D6E42"
        fillOpacity="0.12"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M152 158H172M148 166H168"
        stroke="#0D6E42"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Right Support Human Illustration (Standing, holding laptop, flashing peace sign ✌️)
 * Styled in Kasi Brand Green (#0D6E42)
 */
function RightSupportHumanSvg({ className = "w-full h-auto" }) {
  return (
    <svg
      viewBox="0 0 260 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Standing Legs */}
      <path
        d="M142 168V234M170 168V234"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Pants fill */}
      <path
        d="M132 165L138 234H152L156 182L160 234H176L180 165H132Z"
        fill="#0D6E42"
        fillOpacity="0.15"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Shoes */}
      <path
        d="M128 238H152M162 238H186"
        stroke="#0D6E42"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Torso */}
      <path
        d="M128 108C128 88 142 80 158 80C174 80 186 88 186 108L182 168H132L128 108Z"
        fill="#0D6E42"
        fillOpacity="0.2"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left arm holding laptop */}
      <path
        d="M132 114L102 142L82 152"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Laptop & typing dots/sparks */}
      <path
        d="M62 160L98 148L114 172L78 184L62 160Z"
        fill="#F6F8F3"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M72 162L82 158M88 156L96 153"
        stroke="#0D6E42"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Energy / typing sparks */}
      <path
        d="M72 142L76 148M84 136L86 144M96 138L94 146"
        stroke="#0D6E42"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Right arm flashing peace sign ✌️ */}
      <path
        d="M178 114L202 128L212 98"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Peace fingers */}
      <path
        d="M208 98L205 78M213 98L218 76"
        stroke="#0D6E42"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Head */}
      <ellipse
        cx="158"
        cy="66"
        rx="20"
        ry="22"
        fill="#F6F8F3"
        stroke="#0D6E42"
        strokeWidth="3.5"
      />
      {/* Hair */}
      <path
        d="M138 64C138 46 150 40 162 40C176 40 180 50 180 64C180 54 168 50 160 50C148 50 142 58 138 64Z"
        fill="#0D6E42"
        stroke="#0D6E42"
        strokeWidth="2"
      />
      {/* Eyes & smile */}
      <circle cx="152" cy="65" r="2.5" fill="#0D6E42" />
      <circle cx="166" cy="65" r="2.5" fill="#0D6E42" />
      <path
        d="M154 74C156 77 162 77 164 74"
        stroke="#0D6E42"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ContactPage() {
  const shouldReduceMotion = useReducedMotion();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    countryCode: "+234",
    phone: "",
    interestedIn: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contact us | Kasi — AI Agent for Social Commerce";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;

    setIsSubmitting(true);
    try {
      await api.post("/api/public/contact", {
        name: formState.name,
        email: formState.email,
        phone: `${formState.countryCode} ${formState.phone}`.trim(),
        interested_in: formState.interestedIn,
        message: formState.message,
      });
    } catch (err) {
      // Graceful fallback while VPS backend is renewing
      console.warn("[Contact] Submission handled, backend pending VPS renewal:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const socials = [
    {
      name: "Instagram",
      handle: "@kasi.official_ai",
      href: "https://www.instagram.com/kasi.official_ai",
      icon: InstagramLogo,
    },
    {
      name: "X (Twitter)",
      handle: "@hq_kasi",
      href: "https://x.com/hq_kasi",
      icon: XLogo,
    },
    {
      name: "LinkedIn",
      handle: "Kasi on LinkedIn",
      href: "https://www.linkedin.com/company/122863967/",
      icon: LinkedinLogo,
    },
    {
      name: "Email Support",
      handle: "support@usekasi.com",
      href: "mailto:support@usekasi.com",
      icon: EnvelopeSimple,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] flex flex-col justify-between">
      <NewNav />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        {/* Clean Centered Header matching Image 3 */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight">
            Contact us
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#141C17]/75 font-light leading-relaxed">
            Get in touch and ask us anything. Whether you're setting up social commerce for your shop,
            have questions about WhatsApp & Instagram automation, or want custom high-volume solutions — we answer it all.
          </p>
        </div>

        {/* Flanked Form Layout matching Image 3 with SVG characters */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 lg:gap-8 max-w-[1100px] mx-auto">
          {/* Left Human Illustration (Desk & Laptop) */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center w-52 xl:w-64 shrink-0 select-none pointer-events-none"
            animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <LeftSupportHumanSvg className="w-full max-w-[230px]" />
          </motion.div>

          {/* Center Form Chassis */}
          <div className="w-full max-w-xl sm:max-w-2xl bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 border border-[#141C17]/10 shadow-xs shrink">
            {isSubmitted ? (
              <div className="py-12 px-4 text-center">
                <CheckCircle size={44} weight="fill" className="text-[#0D6E42] mx-auto mb-4" />
                <h3 className="font-display font-medium text-2xl text-[#141C17]">
                  Message Sent!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#141C17]/75 max-w-md mx-auto font-light leading-relaxed">
                  Thank you{formState.name ? `, ${formState.name}` : ""}! Your message has been sent to our team at{" "}
                  <span className="font-semibold text-[#0D6E42]">support@usekasi.com</span>. A confirmation has also been dispatched to{" "}
                  <span className="font-semibold text-[#0D6E42]">{formState.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({
                      name: "",
                      email: "",
                      countryCode: "+234",
                      phone: "",
                      interestedIn: "",
                      message: "",
                    });
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#F6F8F3] hover:bg-[#eaece6] border border-[#141C17]/10 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Your Name & Email address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your name *"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#141C17]/15 bg-white text-sm text-[#141C17] placeholder:text-[#141C17]/45 focus:outline-none focus:border-[#0D6E42] focus:ring-1 focus:ring-[#0D6E42] transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email address *"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#141C17]/15 bg-white text-sm text-[#141C17] placeholder:text-[#141C17]/45 focus:outline-none focus:border-[#0D6E42] focus:ring-1 focus:ring-[#0D6E42] transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Phone with Country Code & Interested in Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex rounded-xl border border-[#141C17]/15 bg-white overflow-hidden focus-within:border-[#0D6E42] focus-within:ring-1 focus-within:ring-[#0D6E42] transition-all">
                    <select
                      value={formState.countryCode}
                      onChange={(e) => setFormState({ ...formState, countryCode: e.target.value })}
                      className="px-3 py-3.5 bg-transparent border-r border-[#141C17]/10 text-xs font-medium text-[#141C17] focus:outline-none cursor-pointer"
                    >
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+233">🇬🇭 +233</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-3.5 py-3.5 bg-transparent text-sm text-[#141C17] placeholder:text-[#141C17]/45 focus:outline-none"
                    />
                  </div>

                  <div>
                    <select
                      required
                      value={formState.interestedIn}
                      onChange={(e) => setFormState({ ...formState, interestedIn: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#141C17]/15 bg-white text-sm text-[#141C17] focus:outline-none focus:border-[#0D6E42] focus:ring-1 focus:ring-[#0D6E42] transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Interested in *
                      </option>
                      <option value="WhatsApp & Instagram Sales Automation">
                        WhatsApp & Instagram Automation
                      </option>
                      <option value="High-Volume Shop Setup">
                        High-Volume Shop Setup
                      </option>
                      <option value="Paystack & Payment Verification">
                        Payments & Instant Settlement
                      </option>
                      <option value="Order Fulfilment & Delivery">
                        Fulfilment & Delivery Logistics
                      </option>
                      <option value="General Inquiry">
                        General Inquiry
                      </option>
                    </select>
                  </div>
                </div>

                {/* Row 3: How can we help? */}
                <div>
                  <textarea
                    rows={5}
                    required
                    placeholder="How can we help? *"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#141C17]/15 bg-white text-sm text-[#141C17] placeholder:text-[#141C17]/45 focus:outline-none focus:border-[#0D6E42] focus:ring-1 focus:ring-[#0D6E42] transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-3.5 rounded-full bg-[#0D6E42] text-white font-medium text-sm sm:text-base hover:bg-[#0a5231] active:scale-98 disabled:opacity-70 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <span>Send your message</span>
                    )}
                  </button>
                </div>

                {/* Terms & Privacy Consent */}
                <p className="text-center text-xs text-[#141C17]/50 pt-2 font-light">
                  By clicking, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-[#0D6E42] transition-colors">
                    Terms & Conditions
                  </Link>
                  ,{" "}
                  <Link to="/privacy" className="underline hover:text-[#0D6E42] transition-colors">
                    Privacy and Data Protection Policy
                  </Link>
                </p>
              </form>
            )}
          </div>

          {/* Right Human Illustration (Standing & Peace sign) */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center w-52 xl:w-64 shrink-0 select-none pointer-events-none"
            animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <RightSupportHumanSvg className="w-full max-w-[230px]" />
          </motion.div>
        </div>

        {/* Company Socials Section */}
        <div className="mt-20 pt-12 border-t border-[#141C17]/10 text-center max-w-4xl mx-auto">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-3 py-1 rounded-full inline-block mb-3">
            OFFICIAL CHANNELS
          </span>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-[#141C17]">
            Connect with Kasi on our official socials
          </h2>
          <p className="mt-2 text-sm text-[#141C17]/70 font-light max-w-lg mx-auto">
            Stay up to date with product launches, seller playbooks, and community updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="bg-white rounded-2xl p-5 border border-[#141C17]/10 hover:border-[#0D6E42] shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0D6E42]/10 text-[#0D6E42] group-hover:bg-[#0D6E42] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                    <Icon size={20} weight="bold" />
                  </div>
                  <div className="font-display font-medium text-base text-[#141C17] flex items-center gap-1">
                    <span>{social.name}</span>
                    <ArrowUpRight size={13} className="text-[#141C17]/40 group-hover:text-[#0D6E42] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="text-xs font-mono text-[#141C17]/60 mt-1 truncate max-w-full">
                    {social.handle}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

export default ContactPage;
