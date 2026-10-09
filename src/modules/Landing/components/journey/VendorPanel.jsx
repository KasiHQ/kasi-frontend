import React from 'react';
import { motion } from 'framer-motion';
import { OrderCard } from './OrderCard';
import { PhaseTracker } from './PhaseTracker';
import { WebhookPulse } from './WebhookPulse';
import { JOURNEY_SCRIPT } from '../../../../content/journey-script';

export const VendorPanel = ({
  stageNumber = 1,
  isFull = true,
  className = '',
}) => {
  const script = JOURNEY_SCRIPT;

  // Determine active screenshot based on stage
  let activeImage = '/images/products & store.png';
  let imageAlt = 'Products and Store Catalog';

  if (stageNumber >= 3 && stageNumber <= 4 && isFull) {
    activeImage = '/images/chats.png';
    imageAlt = 'Live Chats and Inquiries';
  } else if (stageNumber >= 5 || (!isFull && stageNumber >= 4)) {
    activeImage = '/images/fulfilment & orders.png';
    imageAlt = 'Orders and Fulfilment';
  }

  return (
    <div
      className={`w-full max-w-[540px] h-[460px] md:h-[480px] max-h-[60svh] mx-auto bg-white border border-[#141C17]/[0.08] rounded-[28px] p-3 md:p-4 shadow-[0_1px_2px_rgba(20,28,23,0.06),0_14px_32px_-14px_rgba(20,28,23,0.14)] relative select-none flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Frameless, legible crop of real dashboard - no darkening overlays, 100% opacity */}
      <div className="relative rounded-2xl overflow-hidden border border-[#141C17]/10 bg-[#FAFCF8] h-full min-h-0 flex items-center justify-center">
        <img
          src={activeImage}
          alt={imageAlt}
          className="w-full h-full object-cover object-top transition-opacity duration-300"
          loading="lazy"
        />

        {/* Dynamic focused overlays per stage */}
        <div className="absolute inset-x-3 bottom-3 space-y-2 pointer-events-none">
          {/* Stage 4 & 5: Paystack webhook pulse and arriving order */}
          {stageNumber >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto"
            >
              <WebhookPulse active={stageNumber === 5} />
              <OrderCard
                orderId={script.orderId}
                customerName={script.customer.name}
                location={script.customer.locationName}
                item={script.product.itemDisplay}
                amount={script.product.totalPrice}
                isPaid={stageNumber >= 5}
                status={stageNumber >= 6 ? 'Prepared' : stageNumber >= 5 ? 'Paid' : 'Pending'}
              />
            </motion.div>
          )}

          {/* Stage 6: Fulfilment Pipeline Phase Tracker */}
          {stageNumber >= 6 && isFull && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto"
            >
              <PhaseTracker activePhase="Prepared" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
