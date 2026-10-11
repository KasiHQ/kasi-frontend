import React from 'react';
import { motion } from 'framer-motion';

export const WebhookPulse = ({ active = false }) => {
  return (
    <div className="relative flex items-center justify-center my-2.5 px-2 select-none">
      <div className="w-full h-0.5 bg-[#141C17]/10 relative overflow-hidden rounded-full">
        {active && (
          <motion.div
            className="absolute top-0 bottom-0 w-20 bg-[#0D6E42]"
            initial={{ left: '-20%' }}
            animate={{ left: '120%' }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          />
        )}
      </div>
      <div className="absolute px-2.5 py-0.5 rounded-full bg-white border border-[#141C17]/10 text-[9px] font-mono text-[#0D6E42] uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
        <span
          className={`w-1.5 h-1.5 rounded-full bg-[#0D6E42] ${
            active ? 'animate-ping' : ''
          }`}
        />
        <span>Paystack Webhook</span>
      </div>
    </div>
  );
};
