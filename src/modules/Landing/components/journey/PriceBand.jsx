import React from 'react';

export const PriceBand = ({ price = '₦100' }) => {
  return (
    <div className="bg-white border border-[#141C17]/10 rounded-xl p-3 text-left text-xs text-[#141C17] shadow-sm select-none">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#141C17]/55">
          Catalog Price
        </span>
        <span className="font-mono font-semibold text-[#0D6E42]">
          Confirmed: {price}
        </span>
      </div>
      <div className="relative w-full h-1.5 bg-[#141C17]/10 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 bg-[#0D6E42] rounded-full w-full" />
      </div>
      <div className="flex justify-between items-center mt-1.5 font-mono text-[10px] text-[#141C17]/55">
        <span>Fixed Store Rate</span>
        <span className="text-[#0D6E42]">Instant Confirmation</span>
      </div>
    </div>
  );
};
