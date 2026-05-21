import React from 'react';
import { Truck, MapPin, CheckCircle2, ChevronRight, Navigation, Shield, User } from 'lucide-react';

export const LogisticsSection = () => {
  return (
    <section id="logistics" className="py-24 bg-gray-50/50 dark:bg-bg-main/50 border-b border-gray-50 dark:border-gray-850/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left reveal">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            04_Logistics & Dispatch
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-none">
            Fulfillment, <span className="text-orange-600">automated.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl">
            Directly connect your completed invoices with top shipping and logistics carriers in Nigeria. No more copy-pasting addresses or arguing with riders over locations.
          </p>
        </div>

        {/* Modular Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Graphics (Custom dispatch and delivery progress timeline) */}
          <div className="lg:col-span-6 flex justify-center text-left reveal delay-100">
            <div className="w-full max-w-[420px] bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 space-y-6">
              
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-850 pb-3">
                <span>Shipment Dispatch</span>
                <span className="text-orange-500 font-extrabold flex items-center gap-1"><Truck size={12}/> GIG LOGISTICS</span>
              </div>

              {/* Package card details */}
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-bg-main p-4 rounded-2xl border border-gray-100 dark:border-gray-850">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Truck size={20} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-gray-950 dark:text-white">Order #INV-4093</div>
                  <div className="text-[10px] font-semibold text-gray-450 dark:text-gray-400">Recipient: Emeka Obi • Lekki, Lagos</div>
                </div>
              </div>

              {/* Progress timeline */}
              <div className="space-y-4 pt-2">
                {[
                  { title: 'Order Confirmed', time: '10:05 AM', desc: 'Automated catalog checkout by Kasi AI', completed: true },
                  { title: 'Invoice Paid', time: '10:08 AM', desc: 'Secure Naira transfer verified via bank API', completed: true },
                  { title: 'Rider Dispatched', time: '10:15 AM', desc: 'Rider booked with GIG Logistics', current: true },
                  { title: 'In Transit', desc: 'Estimated delivery: Today 2:00 PM' },
                  { title: 'Completed Delivery', desc: 'Secures customer confirmation code' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start relative select-none">
                    {/* Line connector */}
                    {i < 4 && (
                      <div className={`w-0.5 absolute left-[7px] top-4.5 bottom-[-16px] ${
                        step.completed ? 'bg-orange-500' : 'bg-gray-100 dark:bg-gray-800'
                      }`} />
                    )}
                    
                    {/* Circle icon */}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center z-10 ${
                      step.completed ? 'bg-orange-500 border-orange-500' :
                      step.current ? 'bg-white dark:bg-bg-surface border-orange-500' :
                      'bg-white dark:bg-bg-surface border-gray-200 dark:border-gray-850'
                    }`}>
                      {step.completed && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                      {step.current && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold ${
                          step.completed || step.current ? 'text-gray-950 dark:text-white' : 'text-gray-455'
                        }`}>{step.title}</span>
                        {step.time && <span className="text-[8px] font-mono text-gray-400 font-bold">{step.time}</span>}
                      </div>
                      <p className="text-[9px] font-semibold text-gray-455 leading-relaxed max-w-xs">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Right Column: Key Details */}
          <div className="lg:col-span-6 space-y-8 text-left reveal reveal-right delay-200">
            <h3 className="text-2xl md:text-3.5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-tight">
              Say goodbye to manual dispatch headaches.
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
              Kasi integrates directly with local shipping systems like Gokada, GIG Logistics, and Sendbox. As soon as a transaction registers "Paid", the customer's delivery details are synchronized, a courier is scheduled, and tracking links are auto-delivered back in their chat instantly.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[
                { title: 'Zero copy-paste addresses', desc: 'Addresses are fetched automatically by Kasi during conversations.' },
                { title: 'Automated Rider Booking', desc: 'Fulfillment is scheduled straight with Nigerian logistics endpoints.' },
                { title: 'Tracking Auto-Updates', desc: 'Rider coordinate details are sent straight to WhatsApp or Telegram.' },
                { title: 'Delivery Proof Checks', desc: 'Secures safe handshakes using custom delivery pins from clients.' }
              ].map((item, i) => (
                <li key={i} className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="text-orange-500 w-4 h-4 shrink-0" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-gray-455 leading-relaxed font-semibold pl-5">
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
