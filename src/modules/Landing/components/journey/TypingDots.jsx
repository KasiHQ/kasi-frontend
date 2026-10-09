import React from 'react';

export const TypingDots = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[16px] bg-[#EBF8EF] border border-[#0D6E42]/10 shadow-sm ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#141C17]/40 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#141C17]/40 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#141C17]/40 animate-bounce" />
    </div>
  );
};
