import React from 'react';
import { motion } from 'framer-motion';

export const LocationPin = ({
  address = 'Store pickup · Jabi, Abuja',
  fee = '₦0',
}) => {
  return (
    <div className="bg-white border border-[#141C17]/10 rounded-xl p-3 text-left shadow-sm select-none">
      <div className="flex items-start gap-2.5">
        <motion.div
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-7 h-7 rounded-lg bg-[#EBF8EF] border border-[#0D6E42]/20 flex items-center justify-center shrink-0 text-[#0D6E42]"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase text-[#0D6E42] tracking-wider font-medium">
            Fulfillment Selected
          </p>
          <p className="text-xs text-[#141C17] font-medium truncate">{address}</p>
          <div className="mt-0.5 flex items-center justify-between text-[11px] font-mono text-[#141C17]/60">
            <span>Pickup Fee</span>
            <span className="text-[#0D6E42] font-semibold">{fee}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
