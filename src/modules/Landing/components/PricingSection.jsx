import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  const [vendorType, setVendorType] = useState('product'); // 'product' or 'service'

  const productPlans = [
    {
      name: 'Starter',
      price: '₦7,500',
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
      price: '₦15,000',
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
      price: '₦28,000',
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
      price: '₦5,000',
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
      price: '₦11,000',
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
      price: '₦22,000',
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
    <section id="pricing" className="w-full py-[100px] bg-white border-b-[1.5px] border-[#0A0A0A] relative select-none">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EE] border-[1.5px] border-[#1A7A4A] text-[#1A7A4A] text-xs font-black uppercase tracking-wider rounded-full">
            <span>PRICING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black font-bricolage tracking-tight leading-tight">
            Simple pricing.<br />
            Powerful selling.
          </h2>
        </div>

        {/* Toggle Control */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-white border-[1.5px] border-[#E5E5E5] rounded-full p-1 max-w-sm w-full">
            <button
              onClick={() => setVendorType('product')}
              className={`flex-1 py-3 text-[14px] font-black transition-all ${
                vendorType === 'product'
                  ? 'bg-[#0A0A0A] text-white rounded-full'
                  : 'bg-transparent text-grey-500 hover:text-black'
              }`}
            >
              Product Vendors
            </button>
            <button
              onClick={() => setVendorType('service')}
              className={`flex-1 py-3 text-[14px] font-black transition-all ${
                vendorType === 'service'
                  ? 'bg-[#0A0A0A] text-white rounded-full'
                  : 'bg-transparent text-grey-500 hover:text-black'
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
              className={`rounded-[24px] p-10 flex flex-col justify-between text-left transition-all duration-300 relative ${
                plan.isDark
                  ? 'bg-[#0F1F0F] text-white border-none shadow-[6px_6px_0px_#0A0A0A]'
                  : 'bg-white text-black border-[1.5px] border-[#E5E5E5] hover:border-black hover:shadow-[6px_6px_0px_#0A0A0A]'
              }`}
            >
              {/* Badge for Popular plan */}
              {plan.isDark && plan.badge && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#D4F263] text-[#0A0A0A] border-[1.5px] border-black px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0A0A0A]">
                  {plan.badge}
                </div>
              )}

              {/* Plan Heading Info */}
              <div className="space-y-4">
                <span
                  className={`text-[14px] font-bold uppercase tracking-widest block ${
                    plan.isDark ? 'text-white/60' : 'text-grey-500'
                  }`}
                >
                  {plan.name}
                </span>
                
                <div className="flex items-baseline">
                  <span className="text-[48px] font-black leading-none font-bricolage">{plan.price}</span>
                  <span
                    className={`text-[16px] font-bold ml-1 ${
                      plan.isDark ? 'text-white/50' : 'text-grey-550'
                    }`}
                  >
                    {plan.priceSub}
                  </span>
                </div>

                {/* CTA Button */}
                <Link
                  to="/signup"
                  className={`w-full py-4 rounded-full font-black text-center text-[15px] block border-[1.5px] border-black shadow-[3px_3px_0px_#0A0A0A] transition-all hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#0A0A0A] active:translate-y-[0px] ${plan.ctaBg}`}
                >
                  Get started
                </Link>

                <hr className={`my-7 border-t ${plan.isDark ? 'border-white/10' : 'border-[#E5E5E5]'}`} />

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
                          plan.isDark ? 'text-white/80' : 'text-[#3D3D3D]'
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
