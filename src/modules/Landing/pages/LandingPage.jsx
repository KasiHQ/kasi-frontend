import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Receipt, ShieldCheck, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

// Import Modular Components
import { LandingNavbar } from '../components/LandingNavbar';
import { HeroSection } from '../components/HeroSection';
import { DmSection } from '../components/DmSection';
import { InvoiceSection } from '../components/InvoiceSection';
import { NegotiationSection } from '../components/NegotiationSection';
import { LogisticsSection } from '../components/LogisticsSection';
import { PricingSection } from '../components/PricingSection';
import { TestimonialSection } from '../components/TestimonialSection';
import { FAQSection } from '../components/FAQSection';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Waitlist Form State
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '', phone_number: '', instagram_handle: '' });
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistLoading(true);
    setWaitlistError('');
    try {
      await api.post('/api/auth/waitlist', waitlistForm);
      setWaitlistSuccess(true);
    } catch (err) {
      setWaitlistError(err.response?.data?.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setWaitlistLoading(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Scroll Tracking & Intersection Observer
  useEffect(() => {
    const sections = ['hero', 'dms', 'invoices', 'negotiation', 'logistics', 'pricing', 'testimonials', 'faq'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Capture elements as they occupy the middle of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 280); // Scrolled past the main hero banner height
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Custom Animate on Scroll (AOS) Intersection Observer
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // trigger slightly before entering fully
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // make it animate once for premium feel
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-bg-main text-gray-900 dark:text-gray-100 font-sans tracking-tight antialiased selection:bg-green-500/10 selection:text-green-600 overflow-x-hidden w-full relative">
      
      {/* Dynamic Header */}
      <LandingNavbar activeSection={activeSection} scrolled={scrolled} />

      {/* Main Core Sections */}
      <HeroSection />
      
      <DmSection />
      
      <InvoiceSection />
      
      <NegotiationSection />
      
      <LogisticsSection />
      
      <PricingSection />
      
      <TestimonialSection />
      
      <FAQSection />

      {/* High-Impact Bottom Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-emerald-950 text-white relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center space-y-8 font-prompt">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
            <span>Ready for Autopilot?</span>
          </div>

          <h2 className="text-[36px] md:text-5.5xl font-semibold font-bricolage tracking-tight max-w-3xl mx-auto leading-none">
            Launch your autonomous <span className="text-green-300">commerce agent</span> in minutes.
          </h2>

          <p className="text-sm md:text-base text-green-100/80 max-w-xl mx-auto leading-relaxed">
            Deploy your 24/7 AI employee today. Automatically handle inquiries, negotiate deals with floor limits, and reconcile payments seamlessly.
          </p>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left">
            {[
              { title: "24/7 Social Automation", desc: "No more missed inquiries or cold leads in DMs." },
              { title: "Floor-Limit Bargaining", desc: "AI negotiates prices inside your safe thresholds." },
              { title: "Naira Instant Reconciles", desc: "Automatic callback verification directly on bank receipts." }
            ].map((hl, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs select-none">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle2 size={16} />
                  <h4 className="text-xs font-bold text-white leading-none">{hl.title}</h4>
                </div>
                <p className="text-[10px] text-green-100/60 mt-2 font-medium">{hl.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-950 hover:bg-green-50 font-bold text-sm rounded-full shadow-2xl transition-all hover:scale-103 active:scale-97 flex items-center justify-center gap-2 group"
            >
              <span>Create Your Kasi Storefront</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rebranded Dark-Mode High-end Footer (Image 4 inspired) */}
      <footer className="bg-[#0a0c0e] text-[#9ca3af] border-t border-gray-900 py-16 transition-colors font-prompt select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
            
            {/* Left Branding & QR Code Visual Block */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-2xl font-black tracking-tight text-white font-bricolage flex items-center gap-2">
                Kasi <span className="text-primary">AI</span>
              </span>
              <p className="text-xs text-gray-400 leading-relaxed font-medium max-w-sm">
                Autonomous conversational sales agents helping African merchants turn direct messages into paid orders automatically. Connect Instagram, WhatsApp, or Telegram to start.
              </p>

              {/* QR Code SVG Card Visual */}
              <div className="inline-flex items-center gap-4 p-4 bg-[#111317] border border-gray-850 rounded-2xl max-w-xs shadow-inner">
                {/* SVG Mock QR Code */}
                <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-900 fill-current">
                    <rect x="0" y="0" width="25" height="25" />
                    <rect x="0" y="75" width="25" height="25" />
                    <rect x="75" y="0" width="25" height="25" />
                    <rect x="35" y="35" width="30" height="30" />
                    <rect x="10" y="40" width="10" height="10" />
                    <rect x="80" y="80" width="10" height="10" />
                    <rect x="50" y="10" width="10" height="10" />
                    <rect x="10" y="50" width="10" height="10" />
                    <rect x="50" y="80" width="15" height="15" />
                  </svg>
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider block">Scan to Test Agent</span>
                  <span className="text-[9px] text-gray-500 font-bold block leading-tight">Try Kasi live demonstration storefront on WhatsApp.</span>
                </div>
              </div>
            </div>

            {/* Links Columns Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              
              {/* Product links */}
              <div className="space-y-3.5 text-left">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Product</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-400">
                  <li><a href="#dms" className="hover:text-primary transition-colors">Direct Messages</a></li>
                  <li><a href="#pricing" className="hover:text-primary transition-colors">Success Credits</a></li>
                  <li><a href="#faq" className="hover:text-primary transition-colors">Safety Systems</a></li>
                  <li><Link to="/signup" className="hover:text-primary transition-colors">Merchant Portal</Link></li>
                </ul>
              </div>

              {/* Resources links */}
              <div className="space-y-3.5 text-left">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Integrations</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-400">
                  <li><a href="#" className="hover:text-primary transition-colors">WhatsApp API</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Instagram DM</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Telegram Bot</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Paystack callback</a></li>
                </ul>
              </div>

              {/* Company links */}
              <div className="space-y-3.5 text-left col-span-2 md:col-span-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Company</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-400">
                  <li><a href="#" className="hover:text-primary transition-colors">About Salience</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                  <li><a href="mailto:support@usekasi.com" className="hover:text-primary transition-colors">support@usekasi.com</a></li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Bar separator & watermarks */}
          <div className="border-t border-[#16181b] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              © {new Date().getFullYear()} Kasi AI. All rights reserved.
            </span>
            
            {/* Salience Tech Watermark Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111317] border border-gray-850 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#0F8C55] rounded-full animate-pulse" />
              <span>MADE IN NIGERIA BY SALIENCE TECHNOLOGY LTD</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
