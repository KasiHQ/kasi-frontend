import React, { useState } from 'react';
import { Bot, HelpCircle, Check, DollarSign, Calculator, HelpCircle as HelpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  const [volume, setVolume] = useState(100);

  // Price calculations: ₦20 per credit/order
  const getPricingDetails = (vol) => {
    const cost = vol * 20;
    const repSalary = 60000; // Average rep salary in Nigeria ₦60,000
    const savings = repSalary - cost;
    return {
      cost: cost.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }),
      savings: savings.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }),
      credits: vol
    };
  };

  const details = getPricingDetails(volume);

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-bg-main border-b border-gray-50 dark:border-gray-850/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-prompt">
             {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-left reveal">
          <div className="inline-block px-3 py-1 bg-transparent text-gray-950 dark:text-white text-xs font-bold font-mono rounded-full border border-gray-950 dark:border-white/20">
            05_Credits & Pricing
          </div>
          <h2 className="text-[40px] max-md:leading-10 md:text-5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-none">
            Pay only for <span className="text-green-650">success.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-550 dark:text-gray-400 font-medium font-prompt leading-relaxed max-w-xl">
            No expensive setup costs or heavy fixed monthly invoices. You only spend credits when Kasi successfully secures a booking or completes a paid order.
          </p>
        </div>

        {/* The 3-Step Value Cards (Inspired by Image 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          
          {/* Card 1 */}
          <div className="bg-gray-50/50 dark:bg-bg-surface/50 border border-gray-100 dark:border-gray-800 p-8 rounded-[32px] flex flex-col items-center text-center justify-between hover:shadow-lg transition-shadow duration-300 reveal delay-100">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold font-bricolage text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold font-bricolage text-gray-950 dark:text-white">Load Credits</h3>
              <p className="text-xs text-gray-455 dark:text-gray-400 font-semibold leading-relaxed max-w-[240px]">
                Purchase Kasi Credits in blocks (e.g. 50 Credits for ₦1,000). Think of them as sales tokens that never expire.
              </p>
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6">₦20 PER CREDIT</div>
          </div>

          {/* Card 2: Highlighted active card */}
          <div className="bg-green-50/20 dark:bg-green-950/5 border-2 border-green-500 p-8 rounded-[32px] flex flex-col items-center text-center justify-between shadow-xl relative hover:scale-[1.01] transition-transform duration-300 reveal delay-200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-550 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
              100% Free Chats
            </div>
            
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20">
                <Bot size={22} />
              </div>
              <h3 className="text-lg font-bold font-bricolage text-gray-950 dark:text-white">Kasi Works 24/7</h3>
              <p className="text-xs text-gray-455 dark:text-gray-450 font-semibold leading-relaxed max-w-[240px]">
                Kasi answers thousands of product questions, bargains with customers, and tracks items in DMs completely for free!
              </p>
            </div>
            <div className="text-[10px] font-black text-green-600 dark:text-green-400 tracking-widest mt-6">UNLIMITED INQUIRIES</div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50/50 dark:bg-bg-surface/50 border border-gray-100 dark:border-gray-800 p-8 rounded-[32px] flex flex-col items-center text-center justify-between hover:shadow-lg transition-shadow duration-300 reveal delay-300">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold font-bricolage text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold font-bricolage text-gray-950 dark:text-white">-1 Token Deducted</h3>
              <p className="text-xs text-gray-455 dark:text-gray-400 font-semibold leading-relaxed max-w-[240px]">
                A single credit is ONLY deducted when Kasi closes the deal and delivers a paid invoice. If they don't buy, you don't pay.
              </p>
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6">PAY ONLY FOR RESULTS</div>
          </div>

        </div>

        {/* Pricing Calculator Block */}
        <div className="bg-gray-50/50 dark:bg-bg-surface/50 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 hover:shadow-xl transition-shadow duration-300 reveal delay-100">
          
          {/* Slider input column */}
          <div className="w-full lg:w-1/2 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-650 dark:text-green-400 text-[10px] font-extrabold rounded-full">
              <Calculator size={10} />
              <span>SAVINGS CALCULATOR</span>
            </div>
            <h3 className="text-2xl md:text-3.5xl font-semibold font-bricolage text-gray-900 dark:text-white tracking-tight leading-tight">
              See what you save compared to hiring.
            </h3>
            <p className="text-xs text-gray-455 dark:text-gray-400 leading-relaxed font-semibold">
              Hiring a social media manager in Nigeria costs upwards of ₦60,000/month, and they still have to sleep. Kasi works 24/7 without holidays, responds in 1.5 seconds, and handles unlimited chats instantly.
            </p>

            <div className="space-y-3.5 pt-4">
              <div className="flex justify-between text-xs font-black text-gray-900 dark:text-white px-0.5">
                <span>Estimated Sales Per Month</span>
                <span className="text-green-600 dark:text-green-400 font-extrabold">{volume} Completed Sales</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="50"
                value={volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 px-0.5 select-none">
                <span>50 Orders</span>
                <span>500 Orders</span>
                <span>1,000 Orders</span>
              </div>
            </div>
          </div>

          {/* Calculator breakdown outputs */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-bg-main border border-gray-150 dark:border-gray-855 rounded-2xl p-6 md:p-8 shadow-sm text-left">
            <div className="space-y-4 font-prompt">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
                <span>Credits Needed</span>
                <span className="font-extrabold text-gray-950 dark:text-white">{details.credits} Credits</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
                <span>Monthly Investment</span>
                <span className="text-lg font-black text-green-600 dark:text-green-400">{details.cost}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
                <span>Customer Inquiries</span>
                <span className="font-extrabold text-gray-950 dark:text-white flex items-center gap-1"><Check size={14} className="text-green-500"/> Unlimited (Free)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-400 pb-2">
                <span>Estimated Naira Savings</span>
                <span className="font-black text-gray-900 dark:text-white">{details.savings} / month</span>
              </div>

              <div className="pt-4">
                <Link
                  to="/signup"
                  className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-50 text-white dark:text-gray-900 rounded-full font-bold text-xs shadow-md flex items-center justify-center gap-1 hover:scale-101 active:scale-99 transition-transform"
                >
                  Start Saving with Kasi
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
