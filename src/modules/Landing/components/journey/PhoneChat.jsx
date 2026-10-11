import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypingDots } from './TypingDots';
import { LocationPin } from './LocationPin';
import { PriceBand } from './PriceBand';
import { PaySheet } from './PaySheet';
import { JOURNEY_SCRIPT } from '../../../../content/journey-script';

export const PhoneChat = ({
  stageNumber = 1,
  isFull = true,
  className = '',
}) => {
  const script = JOURNEY_SCRIPT;
  const chatScrollRef = useRef(null);

  // Internal scroll only - NEVER call window scrollIntoView
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [stageNumber]);

  return (
    <div
      className={`w-full max-w-[380px] h-[460px] md:h-[480px] max-h-[60svh] mx-auto bg-white border border-[#141C17]/[0.08] rounded-[28px] p-4 shadow-[0_1px_2px_rgba(20,28,23,0.06),0_14px_32px_-14px_rgba(20,28,23,0.14)] relative select-none flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Phone Header: WhatsApp channel mark, vendor title, real Kasi avatar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#141C17]/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EBF8EF] border border-[#0D6E42]/20 flex items-center justify-center p-1.5">
            <img
              src="/logos/whatsapp.svg"
              alt="WhatsApp"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#141C17] text-xs font-semibold">
                {script.vendorName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            </div>
            <span className="text-[#141C17]/55 text-[10px] font-mono block">
              WhatsApp
            </span>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#141C17]/5 border border-[#141C17]/10 flex items-center justify-center p-1">
          <img
            src="/kasi.png"
            alt="Kasi"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Message Stream */}
      <div
        ref={chatScrollRef}
        className="flex-1 py-3 space-y-2.5 overflow-y-auto min-h-0 flex flex-col justify-start pr-0.5"
      >
        {/* Customer initial inquiry */}
        <div className="self-end max-w-[85%] bg-white border border-[#141C17]/10 rounded-2xl rounded-tr-sm p-3 text-right shadow-xs">
          <p className="text-xs text-[#141C17] leading-relaxed font-normal">
            {isFull
              ? script.full.stage1_inquiry.customer
              : script.landing.act3_sells.customer}
          </p>
          <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
            {script.customer.name.toUpperCase()} · 11:42 AM
          </span>
        </div>

        {/* Stage 1: Typing dots while Kasi prepares reply */}
        {stageNumber === 1 && (
          <div className="self-start">
            <TypingDots />
          </div>
        )}

        {/* Stage 2+: Kasi recommendation */}
        {stageNumber >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs"
          >
            <p className="text-xs text-[#141C17] leading-relaxed">
              {isFull
                ? script.full.stage2_recommend.kasi
                : script.landing.act3_sells.kasi}
            </p>
            <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
              11:42 AM
            </span>
          </motion.div>
        )}

        {/* Stage 3: Price confirmation */}
        {stageNumber >= 3 && isFull && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="self-end max-w-[85%] bg-white border border-[#141C17]/10 rounded-2xl rounded-tr-sm p-3 text-right shadow-xs"
            >
              <p className="text-xs text-[#141C17] leading-relaxed font-normal">
                {script.full.stage3_agreePrice.customer}
              </p>
              <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                {script.customer.name.toUpperCase()} · 11:43 AM
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs space-y-2"
            >
              <p className="text-xs text-[#141C17] leading-relaxed">
                {script.full.stage3_agreePrice.kasi}
              </p>
              <PriceBand price={script.product.totalPrice} />
              <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                11:43 AM
              </span>
            </motion.div>
          </>
        )}

        {/* Stage 4: Store pickup confirmation & Paystack sheet */}
        {stageNumber >= 4 && isFull && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="space-y-2"
          >
            <LocationPin
              address={script.customer.locationName}
              fee={script.product.deliveryFee}
            />
            <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs">
              <p className="text-xs text-[#141C17] leading-relaxed">
                {script.full.stage4_checkout.kasi}
              </p>
              <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                11:44 AM
              </span>
            </div>
            <PaySheet
              isPaid={stageNumber >= 5}
              amount={script.product.totalPrice}
            />
          </motion.div>
        )}

        {/* Stage 5: Payment Confirmed */}
        {stageNumber >= 5 && isFull && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs"
          >
            <p className="text-xs text-[#141C17] leading-relaxed font-medium">
              {script.full.stage5_paid.kasi}
            </p>
            <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
              11:45 AM
            </span>
          </motion.div>
        )}

        {/* Stage 6: Fulfilment Automated pings */}
        {stageNumber >= 6 && isFull && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="space-y-2"
          >
            <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs">
              <p className="text-xs text-[#141C17] leading-relaxed">
                {script.full.stage6_delivered.autoPacked}
              </p>
              <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                11:48 AM
              </span>
            </div>
            <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs">
              <p className="text-xs text-[#141C17] leading-relaxed font-medium text-[#0D6E42]">
                {script.full.stage6_delivered.autoDelivered}
              </p>
              <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                11:55 AM
              </span>
            </div>
          </motion.div>
        )}

        {/* Landing variant Act 3: Inline Payment confirmation */}
        {!isFull && stageNumber >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-xs"
          >
            <p className="text-xs text-[#0D6E42] font-semibold">
              {script.landing.act3_sells.payment}
            </p>
            <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
              11:44 AM
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
