import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const STANDARD_LINKS = [
  { label: 'Features', href: '#dms' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const FEATURE_LINKS = [
  { id: 'dms', label: 'DMs', num: '01' },
  { id: 'invoices', label: 'Invoices', num: '02' },
  { id: 'negotiation', label: 'Negotiations', num: '03' },
  { id: 'logistics', label: 'Logistics', num: '04' },
  { id: 'pricing', label: 'Pricing', num: '05' },
  { id: 'testimonials', label: 'Testimonials', num: '06' },
  { id: 'faq', label: 'FAQ', num: '07' },
];

export const LandingNavbar = ({ activeSection, scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full border-b',
        scrolled
          ? 'bg-white/80 dark:bg-bg-surface/80 backdrop-blur-xl shadow-md border-transparent py-2.5'
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo and Brand */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, 'hero')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="Kasi" 
              className="w-8 h-8 rounded-xl shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-bricolage">
              Kasi <span className="text-primary">AI</span>
            </span>
          </a>

          {/* Desktop Nav - Middle Dynamic Swapper */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-3xl px-8">
            <div className="relative flex items-center gap-1.5 p-1 rounded-full transition-all duration-500">
              {!scrolled ? (
                // Standard Links before scrolling
                <div className="flex items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
                  {STANDARD_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href.substring(1))}
                      className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-green-650 dark:hover:text-green-400 transition-colors font-prompt"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                // Dynamic Scroll-linked Feature Links
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 animate-in slide-in-from-top-3 fade-in duration-500">
                  {FEATURE_LINKS.map((link) => {
                    const isActive = activeSection === link.id;
                    return (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        onClick={(e) => handleLinkClick(e, link.id)}
                        className={clsx(
                          'relative px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-300 flex items-center gap-1 select-none border font-prompt',
                          isActive
                            ? 'bg-gray-950 border-gray-950 text-white dark:bg-white dark:border-white dark:text-gray-900 shadow-xs'
                            : 'bg-transparent border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-55 dark:hover:bg-gray-800/45'
                        )}
                      >
                        <span>{link.label}</span>
                        <span
                          className={clsx(
                            'text-[9px] font-mono font-medium opacity-80',
                            isActive ? 'text-green-500 dark:text-green-650' : 'text-gray-400 dark:text-gray-500'
                          )}
                        >
                          {link.num}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Side CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-bold text-gray-650 dark:text-gray-355 hover:text-gray-950 dark:hover:text-white transition-colors font-prompt"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="text-xs font-bold text-white bg-primary hover:opacity-90 px-4 py-2.5 rounded-full shadow-md transition-all hover:scale-103 active:scale-97 flex items-center gap-1 font-prompt"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white/98 dark:bg-bg-main/98 backdrop-blur-2xl z-[100] p-6 flex flex-col justify-between animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            {/* Header inside the overlay */}
            <div className="flex justify-between items-center h-12">
              <a
                href="#hero"
                onClick={(e) => {
                  handleLinkClick(e, 'hero');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <img 
                  src="/logo.png" 
                  alt="Kasi" 
                  className="w-8 h-8 rounded-xl shadow-sm"
                />
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-bricolage">
                  Kasi <span className="text-primary">AI</span>
                </span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mt-6 font-prompt">
              Navigation
            </div>
            
            {/* Nav Link List - Premium large font */}
            <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
              {(!scrolled ? STANDARD_LINKS : FEATURE_LINKS).map((link) => (
                <a
                  key={link.label || link.id}
                  href={`#${link.href ? link.href.substring(1) : link.id}`}
                  onClick={(e) => handleLinkClick(e, link.href ? link.href.substring(1) : link.id)}
                  className={clsx(
                    'flex items-center justify-between text-xl font-bold py-4 px-4 rounded-2xl transition-all font-prompt',
                    (link.href ? activeSection === link.href.substring(1) : activeSection === link.id)
                      ? 'bg-green-500/10 text-green-600 dark:bg-green-500/8 dark:text-green-450 border border-green-500/20'
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-850/50'
                  )}
                >
                  <span>{link.label}</span>
                  {link.num ? (
                    <span className="text-xs font-mono opacity-60">#{link.num}</span>
                  ) : (
                    <ArrowRight size={16} className="text-gray-400 dark:text-gray-500" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Actions inside Full Screen menu */}
          <div className="flex flex-col gap-3 mt-auto">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 font-bold text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-2xl font-prompt"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 font-bold text-sm text-white bg-primary rounded-2xl shadow-lg font-prompt"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
