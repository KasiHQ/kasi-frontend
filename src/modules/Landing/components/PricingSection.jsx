import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRELAUNCH_WAITLIST_MODE } from '../../../config';

export const PricingSection = ({ onJoinWaitlistClick }) => {
  const [vendorType, setVendorType] = useState('product'); // 'product' or 'service'

  const productPlans = [
    {
      name: 'Starter',
      price: '₦18,000',
      priceSub: '/month',
      isDark: false,
      ctaBg: 'bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white',
      features: [
        'AI sales agent on WhatsApp',
        'Unlimited product catalog with voice pitch per product',
        'Inventory tracking — never sells out-of-stock items',
        'Paystack payment integration',
        'Full status dashboard with AI conversation summaries',
        'Basic analytics — revenue, units sold, best sellers',
        'Physical store direction'
      ]
    },
    {
      name: 'Growth',
      price: '₦29,000',
      priceSub: '/month',
      isDark: true,
      badge: 'MOST POPULAR',
      ctaBg: 'bg-[#1A7A4A] hover:bg-[#15603A] text-white border border-[#D4F263]/25',
      features: [
        'Everything in Starter',
        'Connect all social media DMs (Instagram, Facebook + more)',
        'Full analytics — margins, avg deal value, best sellers',
        'Broadcast marketing to your customer list',
        'Token top-ups for campaigns available as add-on'
      ]
    },
    {
      name: 'Premium',
      price: '₦40,000',
      priceSub: '/month',
      isDark: false,
      ctaBg: 'bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white',
      features: [
        'Everything in Growth',
        'Customer intelligence — full interaction database, drop-off categorisation',
        'Re-engage leads on the right platform with full context',
        'Proactive outreach to people who engaged with your social posts',
        'Token top-ups for re-engagement and outreach available as add-on'
      ]
    }
  ];

  const servicePlans = [
    {
      name: 'Starter',
      price: '₦15,000',
      priceSub: '/month',
      isDark: false,
      ctaBg: 'bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white',
      features: [
        'AI booking agent on WhatsApp',
        '1 Active Booking Schedule/Calendar',
        'Appointment booking directly in DM',
        'Paystack integration for upfront deposits/payments',
        'Full status dashboard with AI conversation summaries',
        'Basic analytics — appointments booked, revenue, best times',
        'Custom store address & opening hours in DM'
      ]
    },
    {
      name: 'Growth',
      price: '₦24,000',
      priceSub: '/month',
      isDark: true,
      badge: 'MOST POPULAR',
      ctaBg: 'bg-[#1A7A4A] hover:bg-[#15603A] text-white border border-[#D4F263]/25',
      features: [
        'Everything in Starter',
        'Connect all social media DMs (Instagram, Facebook + more)',
        'Google Calendar integration & automatic two-way sync',
        'Automated appointment reminders (WhatsApp/IG)',
        'Broadcast marketing to your client list',
        'Token top-ups for campaigns available as add-on'
      ]
    },
    {
      name: 'Premium',
      price: '₦32,000',
      priceSub: '/month',
      isDark: false,
      ctaBg: 'bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white',
      features: [
        'Everything in Growth',
        'Client intelligence — full appointment history database, drop-off categorisation',
        'Re-engage clients on the right platform with full context',
        'Proactive outreach to people who engaged with your social posts',
        'Token top-ups for re-engagement and outreach available as add-on'
      ]
    }
  ];

  const activePlans = vendorType === 'product' ? productPlans : servicePlans;

  return (
    <section id="pricing" className="w-full py-[100px] bg-white border-b border-[#E5E5E5] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E8F5EE] border border-[#1A7A4A]/20 text-[#1A7A4A] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
            <span>PRICING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black font-bricolage tracking-tight leading-tight">
            Simple pricing.<br />
            Powerful selling.
          </h2>
        </div>

        {/* Toggle Control */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-gray-100/80 p-1.5 rounded-xl max-w-sm w-full border border-gray-200/60 shadow-xs">
            <button
              onClick={() => setVendorType('product')}
              className={`flex-1 py-2.5 text-[14px] transition-all duration-200 ${
                vendorType === 'product'
                  ? 'bg-white text-gray-900 font-bold rounded-lg shadow-xs'
                  : 'bg-transparent text-gray-500 hover:text-gray-900 font-semibold'
              }`}
            >
              Product Vendors
            </button>
            <button
              onClick={() => setVendorType('service')}
              className={`flex-1 py-2.5 text-[14px] transition-all duration-200 ${
                vendorType === 'service'
                  ? 'bg-white text-gray-900 font-bold rounded-lg shadow-xs'
                  : 'bg-transparent text-gray-500 hover:text-gray-900 font-semibold'
              }`}
            >
              Service Vendors
            </button>
          </div>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-[1140px] mx-auto">
          {activePlans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 md:p-10 flex flex-col justify-between text-left transition-all duration-300 relative ${
                plan.isDark
                  ? 'bg-[#0F1F0F] text-white border border-emerald-950/60 shadow-[0_20px_45px_rgba(0,0,0,0.2)] hover:-translate-y-1'
                  : 'bg-white text-black border border-gray-100 shadow-xs hover:border-gray-200 hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {/* Badge for Popular plan */}
              {plan.isDark && plan.badge && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#D4F263] text-gray-950 border border-black/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              {/* Plan Heading Info */}
              <div className="space-y-4">
                <span
                  className={`text-[13px] font-bold uppercase tracking-widest block ${
                    plan.isDark ? 'text-white/60' : 'text-gray-400'
                  }`}
                >
                  {plan.name}
                </span>
                
                <div className="flex items-baseline">
                  <span className="text-[44px] font-black leading-none font-bricolage">{plan.price}</span>
                  <span
                    className={`text-[15px] font-semibold ml-1.5 ${
                      plan.isDark ? 'text-white/50' : 'text-gray-400'
                    }`}
                  >
                    {plan.priceSub}
                  </span>
                </div>

                {PRELAUNCH_WAITLIST_MODE ? (
                  <button
                    onClick={onJoinWaitlistClick}
                    className={`w-full py-3.5 rounded-xl font-bold text-center text-[15px] block transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${plan.ctaBg}`}
                  >
                    Join Waitlist
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    className={`w-full py-3.5 rounded-xl font-bold text-center text-[15px] block transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${plan.ctaBg}`}
                  >
                    Get started
                  </Link>
                )}

                <hr className={`my-7 border-t ${plan.isDark ? 'border-white/10' : 'border-gray-100'}`} />

                {/* Features List */}
                <ul className="space-y-4">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="shrink-0 mt-0.5">
                        <Check
                          size={16}
                          className={`font-black ${
                            plan.isDark ? 'text-[#D4F263]' : 'text-[#1A7A4A]'
                          }`}
                          strokeWidth={3}
                        />
                      </span>
                      <span
                        className={`text-[15px] font-medium leading-normal ${
                          plan.isDark ? 'text-white/80' : 'text-gray-600'
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
