import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const NAV_LINKS = [
  { id: 'dms', label: 'DMs' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'negotiation', label: 'Negotiations' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
];

export const LandingNavbar = ({ activeSection, scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 64; // height of navbar
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full h-16 flex items-center justify-center',
        scrolled 
          ? 'bg-white border-b-[1.5px] border-[#E5E5E5]' 
          : 'bg-transparent border-b-[1.5px] border-transparent'
      )}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 flex justify-between items-center h-full">
        {/* Logo and Brand */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <img 
            src="/logo.png" 
            alt="Kasi AI Logo" 
            className="w-8 h-8 object-contain shrink-0"
          />
          <span className="text-xl font-black text-black tracking-tight select-none">
            Kasi <span className="text-brand font-black">AI</span>
          </span>
        </a>

        {/* Desktop Nav - Middle standard list */}
        <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-3">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={clsx(
                  'text-[15px] font-medium tracking-tight transition-all duration-150 select-none block font-sans',
                  isActive
                    ? 'bg-[#0A0A0A] text-white rounded-[999px] py-1 px-3'
                    : 'text-grey-700 hover:text-black hover:underline'
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop Right Side CTAs */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/login"
            className="text-[15px] font-medium text-grey-700 hover:text-black transition-colors"
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="text-[15px] font-bold text-white bg-black px-5 py-2.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
          >
            Get started →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-black hover:bg-bg-subtle rounded-lg transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] p-6 flex flex-col justify-between animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-6">
            {/* Header inside the overlay */}
            <div className="flex justify-between items-center h-12">
              <a
                href="#hero"
                onClick={(e) => {
                  handleLinkClick(e, 'hero');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <img 
                  src="/logo.png" 
                  alt="Kasi AI Logo" 
                  className="w-8 h-8 object-contain shrink-0"
                />
                <span className="text-xl font-black text-black tracking-tight select-none">
                  Kasi <span className="text-brand font-black">AI</span>
                </span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-black hover:bg-bg-subtle rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav Link List - Stacked, Large Text */}
            <div className="flex flex-col gap-4 mt-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={clsx(
                      'text-3xl font-black py-2.5 transition-all text-left block border-b border-transparent',
                      isActive
                        ? 'text-black border-black inline-block'
                        : 'text-grey-700 hover:text-black'
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions inside Full Screen menu */}
          <div className="flex flex-col gap-3 mt-auto">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 font-bold text-lg text-black border-[1.5px] border-black rounded-full bg-white hover:bg-bg-subtle transition-all duration-150"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 font-bold text-lg text-white bg-black rounded-full hover:bg-neutral-800 transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
