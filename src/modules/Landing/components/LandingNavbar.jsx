import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../../context/ThemeContext';

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
  const { theme, setTheme, THEMES, isDark } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);

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
            {/* Theme Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="p-2 text-gray-400 hover:text-gray-950 dark:text-gray-500 dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-800/85 transition-all"
              >
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {themeOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-44 bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeOpen(false);
                      }}
                      className={clsx(
                        'w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors font-prompt',
                        theme === t.id
                          ? 'text-green-650 bg-green-50/50 dark:text-green-400 dark:bg-green-950/20'
                          : 'text-gray-650 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-850/50'
                      )}
                    >
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="p-2 text-gray-400 dark:text-gray-500 rounded-xl"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-bg-surface/95 backdrop-blur-xl shadow-xl border-t border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300 max-h-[85vh] overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1 mb-1 font-prompt">
            Menu Navigation
          </div>
          {(!scrolled ? STANDARD_LINKS : FEATURE_LINKS).map((link) => (
            <a
              key={link.label || link.id}
              href={`#${link.href ? link.href.substring(1) : link.id}`}
              onClick={(e) => handleLinkClick(e, link.href ? link.href.substring(1) : link.id)}
              className={clsx(
                'flex items-center justify-between text-sm font-semibold p-3.5 rounded-2xl transition-all font-prompt',
                (link.href ? activeSection === link.href.substring(1) : activeSection === link.id)
                  ? 'bg-green-500/10 text-green-600 dark:bg-green-500/5 dark:text-green-400 border border-green-500/20'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
              )}
            >
              <span>{link.label}</span>
              {link.num && <span className="text-xs font-mono opacity-60">#{link.num}</span>}
            </a>
          ))}

          <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3.5 font-bold text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/80 rounded-2xl font-prompt"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3.5 font-bold text-sm text-white bg-primary rounded-2xl shadow-lg font-prompt"
          >
            Get started free
          </Link>
        </div>
      )}
    </nav>
  );
};
