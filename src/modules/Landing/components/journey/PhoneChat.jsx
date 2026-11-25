import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Check } from '@phosphor-icons/react';
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
      className={`w-full max-w-[380px] h-[420px] md:h-[445px] max-h-[calc(100svh-225px)] mx-auto bg-white border border-[#141C17]/15 rounded-2xl p-4 shadow-[0_2px_8px_rgba(20,28,23,0.05),0_18px_36px_-18px_rgba(20,28,23,0.12)] relative select-none flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Phone Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#141C17]/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EBF8EF] border border-[#0D6E42]/20 flex items-center justify-center p-1.5">
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
              WhatsApp Business
            </span>
          </div>
        </div>
        <div className="w-6 h-6 rounded-md bg-[#F6F8F3] border border-[#141C17]/10 flex items-center justify-center p-1">
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
        {!isFull && (
          <AnimatePresence mode="wait">
            {stageNumber === 1 && (
              <motion.div
                key="landing-phone-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="my-auto space-y-3"
              >
                <div className="rounded-xl bg-[#F6F8F3] border border-[#141C17]/10 p-4 text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-2.5">
                    {['/logos/whatsapp.svg', '/logos/instagram.svg', '/logos/telegram.svg'].map((src) => (
                      <div
                        key={src}
                        className="w-9 h-9 rounded-lg bg-white border border-[#141C17]/12 flex items-center justify-center p-2"
                      >
                        <img src={src} alt="Channel" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-[#141C17]">
                    Storefront channels linked
                  </p>
                  <p className="text-[11px] text-[#141C17]/65 leading-relaxed">
                    Customers message your existing WhatsApp number or Instagram handle.
                  </p>
                </div>

                <div className="rounded-lg bg-[#EBF8EF] border border-[#0D6E42]/20 px-3 py-2 flex items-center justify-between text-[11px] text-[#0D6E42] font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle size={14} weight="fill" />
                    Auto-reply active
                  </span>
                  <span className="font-mono text-[10px]">24/7</span>
                </div>
              </motion.div>
            )}

            {stageNumber === 2 && (
              <motion.div
                key="landing-phone-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-2.5 my-auto"
              >
                <div className="rounded-lg bg-[#EBF8EF] border border-[#0D6E42]/20 px-3 py-2 flex items-center gap-2 text-[11px] text-[#0D6E42] font-medium">
                  <Check size={13} weight="bold" className="shrink-0" />
                  <span>Catalog & floor prices loaded</span>
                </div>

                <div className="self-end ml-auto max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-xl rounded-tr-xs p-3 text-right">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-2.5"
              >
                <div className="self-end ml-auto max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-xl rounded-tr-xs p-3 text-right">
                  <p className="text-xs text-[#141C17] leading-relaxed">
                    {script.landing.act3_sells.customer}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    {script.customer.name.toUpperCase()} · 11:42 AM
                  </span>
                </div>

                <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-xl rounded-tl-xs p-3 text-left">
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
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="self-start max-w-[90%] bg-[#0D6E42] text-white rounded-xl rounded-tl-xs p-3 text-left"
                  >
                    <p className="text-xs leading-relaxed">
                      {script.full.stage6_delivered.autoPacked}
                    </p>
                    <span className="font-mono text-[9px] text-[#DBF361] mt-1 block">
                      11:48 AM ✓✓
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {isFull && (
          <>
            <div className="self-end max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-xl rounded-tr-xs p-3 text-right">
              <p className="text-xs text-[#141C17] leading-relaxed font-normal">
                {script.full.stage1_inquiry.customer}
              </p>
              <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                {script.customer.name.toUpperCase()} · 11:42 AM
              </span>
            </div>

            {stageNumber === 1 && (
              <div className="self-start">
                <TypingDots />
              </div>
            )}

            {stageNumber >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-xl rounded-tl-xs p-3 text-left"
              >
                <p className="text-xs text-[#141C17] leading-relaxed">
                  {script.full.stage2_recommend.kasi}
                </p>
                <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                  11:42 AM
                </span>
              </motion.div>
            )}

            {stageNumber >= 3 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="self-end max-w-[85%] bg-[#F6F8F3] border border-[#141C17]/10 rounded-xl rounded-tr-xs p-3 text-right"
                >
                  <p className="text-xs text-[#141C17] leading-relaxed font-normal">
                    {script.full.stage3_agreePrice.customer}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    {script.customer.name.toUpperCase()} · 11:43 AM
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-xl rounded-tl-xs p-3 text-left space-y-2"
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

            {stageNumber >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <LocationPin
                  address={script.customer.locationName}
                  fee={script.product.deliveryFee}
                />
                <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-xl rounded-tl-xs p-3 text-left">
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

            {stageNumber >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-xl rounded-tl-xs p-3 text-left"
              >
                <p className="text-xs text-[#141C17] leading-relaxed font-medium">
                  {script.full.stage5_paid.kasi}
                </p>
                <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                  11:45 AM
                </span>
              </motion.div>
            )}

            {stageNumber >= 6 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="self-start max-w-[88%] bg-[#EBF8EF] border border-[#0D6E42]/15 rounded-xl rounded-tl-xs p-3 text-left">
                  <p className="text-xs text-[#141C17] leading-relaxed">
                    {script.full.stage6_delivered.autoPacked}
                  </p>
                  <span className="font-mono text-[9px] text-[#141C17]/50 mt-1 block">
                    11:48 AM
                  </span>
                </div>
                <div className="self-start max-w-[88%] bg-[#0D6E42] text-white rounded-xl rounded-tl-xs p-3 text-left">
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
