import React from 'react';
import { motion } from 'framer-motion';

export const PaySheet = ({ isPaid = false, amount = '₦100' }) => {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      className="bg-white border border-[#141C17]/10 rounded-2xl p-4 text-left shadow-[0_4px_16px_rgba(20,28,23,0.08)] relative select-none"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#141C17]/10">
        <div className="flex items-center gap-2">
          <img
            src="/logos/paystack.svg"
            alt="Paystack"
            className="h-4 w-auto object-contain"
          />
          <span className="font-mono text-[10px] text-[#141C17]/55 uppercase tracking-wider">
            Checkout
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-[#141C17]">
          {amount}
        </span>
      </div>

      <div className="py-2.5 space-y-1 font-mono text-[11px] text-[#141C17]/80">
        <div className="flex justify-between">
          <span>Samosa ×1</span>
          <span>₦100</span>
        </div>
        <div className="flex justify-between text-[#141C17]/55">
          <span>Store pickup (Jabi)</span>
          <span>₦0</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#141C17]/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#141C17]/70">
          <span
            className={`w-2 h-2 rounded-full ${
              isPaid ? 'bg-[#0D6E42]' : 'bg-[#141C17]/30 animate-pulse'
            }`}
          />
          <span className={isPaid ? 'text-[#0D6E42] font-semibold' : ''}>
            {isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#141C17]/50">
          Paystack Verified
        </span>
      </div>
    </motion.div>
  );
};
