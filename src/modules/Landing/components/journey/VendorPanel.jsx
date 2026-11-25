import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Storefront,
  ShieldCheck,
  MapPin,
  SlidersHorizontal,
  NotePencil,
  Broadcast,
} from '@phosphor-icons/react';
import { OrderCard } from './OrderCard';
import { PhaseTracker } from './PhaseTracker';
import { WebhookPulse } from './WebhookPulse';
import { JOURNEY_SCRIPT } from '../../../../content/journey-script';

const SAMPLE_PRODUCTS = [
  {
    name: 'Samosa',
    price: '₦100',
    floor: 'Fixed price',
    stock: '30 in stock',
    badge: 'Listed',
    tone: 'bg-[#EBF8EF] text-[#0D6E42]',
  },
  {
    name: 'Chocolate Fudge Cake',
    price: '₦275',
    floor: 'Floor ₦250',
    stock: '14 in stock',
    badge: 'Listed',
    tone: 'bg-[#DBF361] text-[#141C17]',
  },
  {
    name: 'Crispy Meat Pie',
    price: '₦450',
    floor: '5+ units: 10% off',
    stock: '22 in stock',
    badge: 'Listed',
    tone: 'bg-[#EBF8EF] text-[#0D6E42]',
  },
];

const CHANNELS = [
  { name: 'WhatsApp Business', logo: '/logos/whatsapp.svg', detail: 'Cloud API & receipts' },
  { name: 'Instagram Direct', logo: '/logos/instagram.svg', detail: 'DMs & story replies' },
  { name: 'Facebook Messenger', logo: '/logos/messenger.svg', detail: 'Page inbox linked' },
  { name: 'Telegram Bot', logo: '/logos/telegram.svg', detail: 'Bot webhook active' },
];

export const VendorPanel = ({
  stageNumber = 1,
  isFull = true,
  className = '',
}) => {
  const script = JOURNEY_SCRIPT;

  let mode = 'catalog';
  if (!isFull) {
    if (stageNumber === 1) mode = 'connect';
    else if (stageNumber === 2) mode = 'catalog';
    else if (stageNumber === 3) mode = 'selling';
    else mode = 'fulfil';
  } else {
    if (stageNumber === 1) mode = 'inquiry';
    else if (stageNumber === 2) mode = 'catalog';
    else if (stageNumber === 3) mode = 'negotiate';
    else if (stageNumber === 4) mode = 'checkout';
    else if (stageNumber === 5) mode = 'paid';
    else mode = 'fulfil_complete';
  }

  const headerTitleByMode = {
    connect: 'Channels & Settlement',
    inquiry: 'Inbox · Gatekeeper',
    catalog: 'Products & Pricing Rules',
    negotiate: 'Price Floor & Terms',
    checkout: 'Checkout & Paystack Link',
    selling: 'Live Sales & Payment',
    paid: 'Orders & Fulfilment',
    fulfil: 'Orders & Fulfilment',
    fulfil_complete: 'Order Closed',
  };

  return (
    <div
      className={`w-full max-w-[540px] h-[420px] md:h-[445px] max-h-[calc(100svh-225px)] mx-auto bg-white border border-[#141C17]/15 rounded-2xl p-3.5 md:p-4 shadow-[0_2px_8px_rgba(20,28,23,0.05),0_18px_36px_-18px_rgba(20,28,23,0.12)] relative select-none flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Crisp Application Top Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#141C17]/10 shrink-0">
        <span className="text-xs font-semibold text-[#141C17] truncate">
          {headerTitleByMode[mode]}
        </span>

        <span className="font-mono text-[10px] font-medium text-[#0D6E42] bg-[#EBF8EF] px-2.5 py-0.5 rounded shrink-0">
          {script.vendorName}
        </span>
      </div>

      {/* Stage Body */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHANNELS.map((ch) => (
                  <div
                    key={ch.name}
                    className="rounded-xl bg-[#F6F8F3] border border-[#141C17]/10 p-3 flex items-start gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#141C17]/10 flex items-center justify-center p-1.5 shrink-0">
                      <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[#141C17] truncate">
                          {ch.name}
                        </span>
                        <CheckCircle size={14} weight="fill" className="text-[#0D6E42] shrink-0" />
                      </div>
                      <span className="text-[10px] text-[#141C17]/60 block truncate mt-0.5">
                        {ch.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-[#141C17] text-white p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1.5">
                    <img src="/logos/paystack.svg" alt="Paystack" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">Bank Subaccount Settlement</span>
                    <span className="text-[10px] text-white/65 font-mono">
                      Paystack NIBSS account verified · Split active
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-xs bg-[#DBF361] text-[#141C17] font-mono text-[10px] font-bold shrink-0">
                  LINKED
                </span>
              </div>
            </motion.div>
          )}

          {mode === 'inquiry' && (
            <motion.div
              key="inquiry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              <div className="rounded-xl bg-[#EBF8EF] border border-[#0D6E42]/20 p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0D6E42] text-white flex items-center justify-center shrink-0">
                  <Broadcast size={16} weight="bold" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D6E42]">
                    Inbound Webhook · Matched SKU
                  </span>
                  <p className="text-xs font-medium text-[#141C17] mt-0.5">
                    Product inquiry from <strong>{script.customer.name}</strong> matched against catalog item <strong>Samosa</strong>.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F6F8F3] border border-[#141C17]/10 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#141C17]/60">
                  <span>Pre-reply checks</span>
                  <span className="text-[#0D6E42] font-semibold">Verified</span>
                </div>
                {[
                  { label: 'Stock quantity', val: 'Samosa · 30 units' },
                  { label: 'Unit price', val: '₦100 (fixed)' },
                  { label: 'Fulfilment options', val: 'Jabi Pickup (₦0) / Road Delivery' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-white border border-[#141C17]/8 text-xs"
                  >
                    <span className="text-[#141C17]/70">{row.label}</span>
                    <span className="font-mono text-[11px] font-semibold text-[#141C17]">{row.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {mode === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2"
            >
              <div className="space-y-2">
                {SAMPLE_PRODUCTS.map((prod) => (
                  <div
                    key={prod.name}
                    className="rounded-xl bg-[#F6F8F3] border border-[#141C17]/10 p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#141C17]/10 flex items-center justify-center text-[#0D6E42] shrink-0">
                        <Storefront size={17} weight="regular" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-semibold text-[#141C17] block truncate">
                          {prod.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#141C17]/60">
                          {prod.stock} · {prod.floor}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-sm text-[#141C17] block">
                        {prod.price}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[9px] font-mono font-semibold ${prod.tone}`}>
                        {prod.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-white border border-[#141C17]/10 px-3 py-2 flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#141C17]/80 font-medium">
                  <MapPin size={14} weight="regular" className="text-[#0D6E42]" />
                  Jabi Store Pickup (₦0) + Road Distance Rate
                </span>
                <span className="font-mono text-[10px] font-semibold text-[#0D6E42]">
                  Saved
                </span>
              </div>
            </motion.div>
          )}

          {mode === 'negotiate' && (
            <motion.div
              key="negotiate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              <div className="rounded-xl bg-[#F6F8F3] border border-[#141C17]/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141C17]">
                    <SlidersHorizontal size={15} weight="bold" className="text-[#0D6E42]" />
                    Price Guardrail Lock
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#EBF8EF] text-[#0D6E42] font-mono text-[10px] font-semibold">
                    Confirmed
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#141C17]/10 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#141C17]/65">{script.product.itemDisplay}</span>
                    <span className="text-[#0D6E42] font-bold">Agreed: {script.product.agreedPrice}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#141C17]/10 overflow-hidden">
                    <div className="h-full w-full bg-[#0D6E42]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#141C17]/55">
                    <span>Fulfilment: Store pickup · Jabi</span>
                    <span>Delivery: ₦0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#141C17]/70">Cart status</span>
                  <span className="font-mono text-[11px] font-semibold text-[#141C17] bg-[#DBF361] px-2 py-0.5 rounded-xs">
                    checkout_pending →
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {(mode === 'checkout' || mode === 'selling') && (
            <motion.div
              key="selling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2.5"
            >
              <div className="rounded-lg bg-[#F6F8F3] border border-[#141C17]/12 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <NotePencil size={15} weight="bold" className="text-[#0D6E42] shrink-0" />
                  <span className="text-xs font-medium text-[#141C17] truncate">
                    Summary: {script.customer.name} · {script.product.itemDisplay} · Jabi Pickup
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-[#0D6E42] shrink-0">
                  {mode === 'selling' ? 'PAID' : 'INVOICED'}
                </span>
              </div>

              <WebhookPulse active={mode === 'selling'} />

              <OrderCard
                orderId={script.orderId}
                customerName={script.customer.name}
                location={script.customer.locationName}
                item={script.product.itemDisplay}
                amount={script.product.totalPrice}
                isPaid={mode === 'selling'}
                status={mode === 'selling' ? 'Paid' : 'Invoice Sent'}
              />
            </motion.div>
          )}

          {(mode === 'paid' || mode === 'fulfil' || mode === 'fulfil_complete') && (
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2.5"
            >
              {mode === 'paid' && <WebhookPulse active={true} />}

              <OrderCard
                orderId={script.orderId}
                customerName={script.customer.name}
                location={script.customer.locationName}
                item={script.product.itemDisplay}
                amount={script.product.totalPrice}
                isPaid={true}
                status={
                  mode === 'fulfil_complete'
                    ? 'Picked up'
                    : mode === 'fulfil'
                    ? 'Prepared'
                    : 'Paid'
                }
              />

              <PhaseTracker
                activePhase={
                  mode === 'fulfil_complete'
                    ? 'Picked up'
                    : mode === 'fulfil'
                    ? 'Prepared'
                    : 'Paid'
                }
              />

              <div className="rounded-lg bg-[#141C17] text-white px-3.5 py-2 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-white/90 truncate">
                  <ShieldCheck size={14} weight="fill" className="text-[#DBF361] shrink-0" />
                  {mode === 'fulfil_complete'
                    ? 'Order closed · Buyer history saved to CRM'
                    : 'WhatsApp status update dispatched to buyer'}
                </span>
                <span className="font-mono text-[10px] text-[#DBF361] shrink-0 ml-2">
                  Sent
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
