import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkle } from '@phosphor-icons/react';
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
      className={`w-full max-w-[380px] h-[420px] md:h-[445px] max-h-[calc(100svh-225px)] mx-auto bg-white border border-[#141C17]/10 rounded-[26px] p-4 shadow-[0_2px_6px_rgba(20,28,23,0.04),0_20px_44px_-16px_rgba(13,110,66,0.14)] relative select-none flex flex-col justify-between overflow-hidden ${className}`}
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            </div>
            <span className="text-[#141C17]/55 text-[10px] font-mono block">
              WhatsApp · Instant AI
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
        className="flex-1 py-3 space-y-2.5 overflow-y-auto min-h-0 flex flex-col justify-start pr-0.5 scrollbar-hide"
      >
        {/* ─── LANDING 4-STEP VARIANT (!isFull) ─── */}
        {!isFull && (
          <AnimatePresence mode="wait">
            {stageNumber === 1 && (
              <motion.div
                key="landing-phone-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="my-auto space-y-3"
              >
                <div className="rounded-2xl bg-[#F6F8F3] border border-[#141C17]/8 p-4 text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-3">
                    {['/logos/whatsapp.svg', '/logos/instagram.svg', '/logos/telegram.svg'].map((src, i) => (
                      <motion.div
                        key={src}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="w-10 h-10 rounded-2xl bg-white border border-[#141C17]/10 shadow-2xs flex items-center justify-center p-2"
                      >
                        <img src={src} alt="Channel" className="w-full h-full object-contain" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-[#141C17]">
                    Storefront channels connected
                  </p>
                  <p className="text-[11px] text-[#141C17]/65 leading-relaxed">
                    Buyers message your existing number or handle — no new app to install.
                  </p>
                </div>

                <div className="rounded-xl bg-[#EBF8EF] border border-[#0D6E42]/20 px-3 py-2 flex items-center justify-between text-[11px] text-[#0D6E42] font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle size={14} weight="fill" />
                    AI responder armed 24/7
                  </span>
                  <span className="font-mono text-[10px]">LIVE</span>
                </div>
              </motion.div>
            )}

            {stageNumber === 2 && (
              <motion.div
                key="landing-phone-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5 my-auto"
              >
                <div className="rounded-xl bg-[#EBF8EF] border border-[#0D6E42]/20 px-3 py-2 flex items-center gap-2 text-[11px] text-[#0D6E42] font-medium">
                  <Sparkle size={14} weight="fill" className="shrink-0" />
                  <span>Catalog & floor prices ready in chat memory</span>
                </div>

                <div className="self-end ml-auto max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-2xl rounded-tr-sm p-3 text-right">
                  <p className="text-xs text-[#141C17] leading-relaxed">
                    {script.landing.act3_sells.customer}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    {script.customer.name.toUpperCase()} · 11:42 AM
                  </span>
                </div>

                <div className="self-start">
                  <TypingDots />
                </div>
              </motion.div>
            )}

            {stageNumber >= 3 && (
              <motion.div
                key="landing-phone-34"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5"
              >
                <div className="self-end ml-auto max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-2xl rounded-tr-sm p-3 text-right">
                  <p className="text-xs text-[#141C17] leading-relaxed">
                    {script.landing.act3_sells.customer}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    {script.customer.name.toUpperCase()} · 11:42 AM
                  </span>
                </div>

                <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left">
                  <p className="text-xs text-[#141C17] leading-relaxed">
                    {script.landing.act3_sells.kasi}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    11:42 AM
                  </span>
                </div>

                <PaySheet isPaid={true} amount={script.product.totalPrice} />

                {stageNumber >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className="self-start max-w-[90%] bg-[#0D6E42] text-white rounded-2xl rounded-tl-sm p-3 text-left shadow-xs"
                  >
                    <p className="text-xs leading-relaxed">
                      {script.full.stage6_delivered.autoPacked}
                    </p>
                    <span className="font-mono text-[9px] text-[#DBF361] mt-1 block">
                      AUTO UPDATE · 11:48 AM ✓✓
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ─── FULL 6-STAGE VARIANT (/how-it-works) ─── */}
        {isFull && (
          <>
            {/* Customer initial inquiry */}
            <div className="self-end max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-2xl rounded-tr-sm p-3 text-right shadow-2xs">
              <p className="text-xs text-[#141C17] leading-relaxed font-normal">
                {script.full.stage1_inquiry.customer}
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
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-2xs"
              >
                <p className="text-xs text-[#141C17] leading-relaxed">
                  {script.full.stage2_recommend.kasi}
                </p>
                <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                  11:42 AM
                </span>
              </motion.div>
            )}

            {/* Stage 3: Price confirmation */}
            {stageNumber >= 3 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="self-end max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-2xl rounded-tr-sm p-3 text-right shadow-2xs"
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
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-2xs space-y-2"
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
            {stageNumber >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="space-y-2"
              >
                <LocationPin
                  address={script.customer.locationName}
                  fee={script.product.deliveryFee}
                />
                <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-2xs">
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
            {stageNumber >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-2xs"
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
            {stageNumber >= 6 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="space-y-2"
              >
                <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-2xl rounded-tl-sm p-3 text-left shadow-2xs">
                  <p className="text-xs text-[#141C17] leading-relaxed">
                    {script.full.stage6_delivered.autoPacked}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    11:48 AM
                  </span>
                </div>
                <div className="self-start max-w-[88%] bg-[#0D6E42] text-white rounded-2xl rounded-tl-sm p-3 text-left shadow-xs">
                  <p className="text-xs leading-relaxed font-medium">
                    {script.full.stage6_delivered.autoDelivered}
                  </p>
                  <span className="font-mono text-[9px] text-[#DBF361] mt-1 block">
                    11:55 AM ✓✓
                  </span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
