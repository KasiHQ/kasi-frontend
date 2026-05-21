import React from "react";
import {
  CreditCard,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export const InvoiceSection = () => {
  return (
    <section
      id="invoices"
      className="py-24 bg-gray-50/50 dark:bg-bg-main/50 border-b border-gray-50 dark:border-gray-850/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 reveal">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            02_Invoicing & Payments
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-none">
            Secure Payments, <span className="text-blue-600">zero code.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl">
            Never type out your bank details again or chase screenshots of
            transfers. Kasi automatically generates beautiful receipts and
            matches payments inside chats instantly.
          </p>
        </div>

        {/* Modular Grid Layout (Inspired by Image 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start font-prompt">
          {/* Left Column: Heading and 3D Angled Phone Invoice Tracker */}
          <div className="lg:col-span-6 space-y-8 bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 reveal delay-100">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3.5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-tight">
                Stay in control of your cash, every step of the way.
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                Track your income and see your savings update in real time as
                automated orders close. Set up direct transfers, link bank
                accounts, and configure customized receipts for your customer's
                WhatsApp.
              </p>
            </div>

            {/* Custom CSS 3D Phone Mockup for Invoice detail */}
            <div className="w-full flex justify-center pt-6">
              <div className="w-[230px] h-[450px] bg-gray-950 rounded-[38px] border-4 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden select-none">
                {/* Dynamic island */}
                <div className="h-6 bg-black flex items-center justify-center relative">
                  <div className="w-16 h-3 bg-black rounded-full absolute top-1" />
                </div>

                {/* App screen */}
                <div className="flex-1 bg-gray-50 dark:bg-bg-main p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-bold text-gray-400">
                      STORE WALLET
                    </span>
                    <span className="text-[7px] font-extrabold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      GTBANK
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-gray-400">
                      Total revenue
                    </span>
                    <h4 className="text-lg font-black text-gray-950 dark:text-white">
                      ₦358,400.00
                    </h4>
                  </div>

                  {/* Savings progress bar mockup */}
                  <div className="bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-850 rounded-xl p-3.5 shadow-2xs space-y-2">
                    <div className="flex justify-between text-[8px] font-extrabold">
                      <span className="text-gray-400">
                        Goal: Delivery Trucks
                      </span>
                      <span className="text-green-500">₦200k / ₦500k</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-[40%] h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>

                  {/* Recent Invoices list */}
                  <div className="space-y-2">
                    <div className="text-[7px] font-extrabold text-gray-400 uppercase tracking-wider pl-1">
                      Recent Invoices
                    </div>
                    {[
                      {
                        id: "#INV-4093",
                        name: "Zobo Tonic",
                        val: "₦3,500",
                        paid: true,
                      },
                      {
                        id: "#INV-4092",
                        name: "Bitter Kola",
                        val: "₦2,100",
                        paid: true,
                      },
                      {
                        id: "#INV-4091",
                        name: "Shea Butter",
                        val: "₦4,800",
                        pending: true,
                      },
                    ].map((inv, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-850 rounded-xl p-2.5 shadow-2xs flex items-center justify-between"
                      >
                        <div className="text-[8px]">
                          <span className="font-extrabold text-gray-950 dark:text-white block">
                            {inv.id}
                          </span>
                          <span className="text-[7px] text-gray-400">
                            {inv.name}
                          </span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-[8px] font-extrabold text-gray-900 dark:text-white block">
                            {inv.val}
                          </span>
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded-full text-[6px] font-black uppercase ${
                              inv.paid
                                ? "bg-green-100 text-green-600 dark:bg-green-950/20"
                                : "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/20"
                            }`}
                          >
                            {inv.paid ? "Paid" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Command Centre Plate and Stats Analytics Chart */}
          <div className="lg:col-span-6 space-y-8">
            {/* Top Wreath Capsule (Inspired by Image 4 black banner) */}
            <div className="relative w-full bg-gray-950 text-white rounded-[32px] p-8 overflow-hidden hover:shadow-xl transition-shadow duration-300 reveal reveal-right delay-200">
              {/* Star plate ambient decoration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                  <span>New Release</span>
                </div>
                <h4 className="text-xl md:text-2xl font-semibold font-bricolage tracking-tight max-w-sm">
                  Your Conversational Finance Command Centre
                </h4>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-xs">
                  Connect Paystack or configure your raw Naira bank account
                  details. Kasi handles invoice payouts effortlessly without any
                  service limits.
                </p>
              </div>
            </div>

            {/* Bottom Revenue Chart Card (Inspired by Image 4 right bottom card) */}
            <div className="bg-white dark:bg-bg-surface border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 space-y-8 reveal reveal-right delay-300">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">
                    Revenue stream
                  </span>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white">
                    ₦358,400.00
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp size={14} /> +34.2%
                  </span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase block mt-0.5">
                    Vs Last 30 Days
                  </span>
                </div>
              </div>

              {/* Custom CSS Line Sparkline Graph Mockup */}
              <div className="h-40 relative flex items-end justify-between px-2 pt-6">
                {/* Horizontal gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-px bg-gray-50 dark:bg-gray-850" />
                  <div className="w-full h-px bg-gray-50 dark:bg-gray-850" />
                  <div className="w-full h-px bg-gray-50 dark:bg-gray-850" />
                  <div className="w-full h-px bg-gray-50 dark:bg-gray-850" />
                </div>

                {/* Simulated Chart Bars/Line heights */}
                {[20, 35, 25, 45, 60, 50, 75, 90, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 group relative z-10"
                  >
                    <div
                      className="w-full max-w-[8px] bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-sm group-hover:from-green-500 group-hover:to-green-400 transition-all duration-300 cursor-pointer"
                      style={{ height: `${h}%`, minHeight: "8px" }}
                    />
                    <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors select-none">
                      W{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 dark:border-gray-850 pt-6 text-center">
                <p className="text-xs text-gray-450 font-semibold leading-normal">
                  Clear overview: See how you sell over time, matched with your
                  automated credit usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
