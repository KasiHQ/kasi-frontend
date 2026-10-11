import React from 'react';
import { PaidStamp } from './PaidStamp';

export const OrderCard = ({
  orderId = 'KAS-CART-32-1791147016-43D9',
  customerName = 'Temi',
  location = 'Store pickup · Jabi, Abuja',
  item = 'Samosa ×1',
  amount = '₦100',
  isPaid = true,
  status = 'Paid',
  className = '',
}) => {
  return (
    <div
      className={`relative bg-white border border-[#141C17]/10 rounded-2xl p-4 text-left shadow-[0_4px_20px_rgba(20,28,23,0.08)] select-none overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="font-mono text-[10px] text-[#141C17]/55 uppercase tracking-wider block">
            {orderId}
          </span>
          <h4 className="text-[#141C17] font-medium text-sm leading-tight mt-0.5">
            {item}
          </h4>
        </div>
        <span className="font-mono text-sm font-bold text-[#141C17]">
          {amount}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#141C17]/70 pt-2 border-t border-[#141C17]/10 font-mono">
        <div className="truncate max-w-[220px]">
          <span className="text-[#141C17] font-semibold">{customerName}</span> ·{' '}
          <span className="text-[#141C17]/60">{location}</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#141C17]/5 text-[#141C17]/80 text-[10px] uppercase font-mono font-medium">
          {status}
        </span>
      </div>

      {isPaid && (
        <div className="absolute right-3 top-6 pointer-events-none">
          <PaidStamp isStamped={true} />
        </div>
      )}
    </div>
  );
};
