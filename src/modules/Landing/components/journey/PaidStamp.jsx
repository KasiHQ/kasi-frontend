import React from 'react';
import { motion } from 'framer-motion';

export const PaidStamp = ({ isStamped = true, className = '' }) => {
  if (!isStamped) return null;

  return (
    <motion.div
      initial={{ scale: 1.8, opacity: 0, rotate: -15 }}
      animate={{ scale: 1, opacity: 1, rotate: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border-2 border-[#0D6E42] bg-[#EBF8EF] text-[#0D6E42] font-mono text-xs font-bold uppercase tracking-wider shadow-md select-none ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#0D6E42]" />
      <span>PAID · PAYSTACK</span>
    </motion.div>
  );
};
