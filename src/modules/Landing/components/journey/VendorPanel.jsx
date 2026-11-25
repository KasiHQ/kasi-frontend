import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Sparkle,
  Storefront,
  ShieldCheck,
  MapPin,
  Tag,
  Package,
  SlidersHorizontal,
} from '@phosphor-icons/react';
import { OrderCard } from './OrderCard';
import { PhaseTracker } from './PhaseTracker';
import { WebhookPulse } from './WebhookPulse';
import { JOURNEY_SCRIPT } from '../../../../content/journey-script';

const SAMPLE_PRODUCTS = [
  {
    name: 'Samosa',
    price: '₦100',
    floor: 'Fixed',
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
    tone: 'bg-[#DBF361]/45 text-[#141C17]',
  },
  {
    name: 'Crispy Meat Pie',
    price: '₦450',
    floor: 'Bulk 5+ 10% off',
    stock: '22 in stock',
    badge: 'Listed',
    tone: 'bg-[#EBF8EF] text-[#0D6E42]',
  },
];

const CHANNELS = [
  { name: 'WhatsApp Business', logo: '/logos/whatsapp.svg', status: 'Active', detail: 'Instant replies & receipts' },
  { name: 'Instagram Direct', logo: '/logos/instagram.svg', status: 'Active', detail: 'DMs & story replies' },
  { name: 'Facebook Messenger', logo: '/logos/messenger.svg', status: 'Ready', detail: 'Page inbox linked' },
  { name: 'Telegram Bot', logo: '/logos/telegram.svg', status: 'Ready', detail: 'Channel orders synced' },
];

export const VendorPanel = ({
  stageNumber = 1,
  isFull = true,
  className = '',
}) => {
  const script = JOURNEY_SCRIPT;

  // Map (isFull, stageNumber) -> visual mode
  // Landing (4 steps): 1=connect, 2=catalog, 3=selling, 4=fulfil
  // Full (6 stages): 1=inquiry, 2=catalog, 3=negotiate, 4=checkout, 5=paid, 6=fulfil
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
    inquiry: 'Live Inbox · AI Gatekeeper',
    catalog: 'Products & Pricing Rules',
    negotiate: 'Price Guardrails & Terms',
    checkout: 'Checkout & Paystack Link',
    selling: 'Live Sales & Payment',
    paid: 'Orders & Fulfilment',
    fulfil: 'Orders & Fulfilment',
    fulfil_complete: 'Fulfilment Complete',
  };

  return (
    <div
      className={`w-full max-w-[540px] h-[420px] md:h-[445px] max-h-[calc(100svh-225px)] mx-auto bg-gradient-to-br from-white via-[#FCFDFB] to-[#F2F6EE] border border-[#141C17]/10 rounded-[26px] p-3.5 md:p-4 shadow-[0_2px_6px_rgba(20,28,23,0.04),0_20px_44px_-16px_rgba(13,110,66,0.14)] relative select-none flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Subtle Ambient Corner Glow */}
      <div
        className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-[#DBF361]/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Crisp App Window Top Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#141C17]/8 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#141C17]/15" />
            <span className="w-2 h-2 rounded-full bg-[#141C17]/15" />
            <span className="w-2 h-2 rounded-full bg-[#0D6E42]/50" />
          </div>
          <span className="text-xs font-semibold text-[#141C17] truncate">
            {headerTitleByMode[mode]}
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF8EF] border border-[#0D6E42]/15 text-[10px] font-mono font-medium text-[#0D6E42] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          {script.vendorName}
        </span>
      </div>

      {/* Choreographed Stage Body (100% Uncut, Crisp Native UI) */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHANNELS.map((ch, idx) => (
                  <motion.div
                    key={ch.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="rounded-2xl bg-white border border-[#141C17]/10 p-3 shadow-2xs flex items-start gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 flex items-center justify-center p-1.5 shrink-0">
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
                  </motion.div>
                ))}
              </div>

              <div className="rounded-2xl bg-[#141C17] text-white p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center p-1.5">
                    <img src="/logos/paystack.svg" alt="Paystack" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">Direct Bank Settlement</span>
                    <span className="text-[10px] text-white/65 font-mono">
                      Paystack subaccount verified · Instant split
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#DBF361] text-[#141C17] font-mono text-[10px] font-bold shrink-0">
                  LINKED
                </span>
              </div>
            </motion.div>
          )}

          {mode === 'inquiry' && (
            <motion.div
              key="inquiry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="rounded-2xl bg-[#EBF8EF] border border-[#0D6E42]/20 p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0D6E42] text-[#DBF361] flex items-center justify-center shrink-0">
                  <Sparkle size={16} weight="fill" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D6E42]">
                    Intent Detected · 0.4s
                  </span>
                  <p className="text-xs font-medium text-[#141C17] mt-0.5">
                    Commercial product inquiry from <strong>{script.customer.name}</strong> matching SKU: <strong>Samosa</strong>.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#141C17]/10 p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#141C17]/60">
                  <span>Live Context Bound</span>
                  <span className="text-[#0D6E42] font-semibold">3 checks passed</span>
                </div>
                {[
                  { label: 'Inventory Lock Check', val: 'Samosa · 30 units available' },
                  { label: 'Pricing Rule', val: '₦100 unit price verified' },
                  { label: 'Fulfilment Zones', val: 'Jabi Pickup (₦0) + Abuja Road Delivery' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl bg-[#F6F8F3] text-xs"
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              <div className="space-y-2">
                {SAMPLE_PRODUCTS.map((prod, idx) => (
                  <motion.div
                    key={prod.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, delay: idx * 0.05 }}
                    className="rounded-2xl bg-white border border-[#141C17]/10 p-3 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 flex items-center justify-center text-[#0D6E42] shrink-0">
                        <Storefront size={18} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-semibold text-[#141C17] block truncate">
                          {prod.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#141C17]/55">
                          {prod.stock} · {prod.floor}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-bold text-sm text-[#0D6E42] block">
                        {prod.price}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold ${prod.tone}`}>
                        {prod.badge}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#141C17]/80 font-medium">
                  <MapPin size={14} weight="duotone" className="text-[#0D6E42]" />
                  Jabi Pickup (₦0) + GPS Road Delivery
                </span>
                <span className="font-mono text-[10px] font-semibold text-[#0D6E42]">
                  Rules saved
                </span>
              </div>
            </motion.div>
          )}

          {mode === 'negotiate' && (
            <motion.div
              key="negotiate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="rounded-2xl bg-white border border-[#141C17]/10 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141C17]">
                    <SlidersHorizontal size={15} weight="bold" className="text-[#0D6E42]" />
                    Deterministic Pricing Guardrail
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EBF8EF] text-[#0D6E42] font-mono text-[10px] font-semibold">
                    Locked
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F6F8F3] border border-[#141C17]/8 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#141C17]/60">Item: {script.product.itemDisplay}</span>
                    <span className="text-[#0D6E42] font-bold">Agreed: {script.product.agreedPrice}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#141C17]/10 overflow-hidden">
                    <div className="h-full w-full rounded-full bg-[#0D6E42]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#141C17]/55">
                    <span>Fulfilment: Store pickup · Jabi</span>
                    <span>Delivery fee: ₦0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#141C17]/70">Cart State Machine</span>
                  <span className="font-mono text-[11px] font-semibold text-[#0D6E42] bg-[#DBF361]/45 px-2.5 py-0.5 rounded-full">
                    checkout_pending →
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {(mode === 'checkout' || mode === 'selling') && (
            <motion.div
              key="selling"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              <div className="rounded-xl bg-[#EBF8EF] border border-[#0D6E42]/20 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkle size={15} weight="fill" className="text-[#0D6E42] shrink-0" />
                  <span className="text-xs font-medium text-[#141C17] truncate">
                    AI Summary: {script.customer.name} · {script.product.itemDisplay} · Jabi Pickup
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
                status={mode === 'selling' ? 'Paid' : 'Awaiting Payment'}
              />
            </motion.div>
          )}

          {(mode === 'paid' || mode === 'fulfil' || mode === 'fulfil_complete') && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
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

              <div className="rounded-xl bg-[#141C17] text-white px-3.5 py-2 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-white/90 truncate">
                  <ShieldCheck size={14} weight="fill" className="text-[#DBF361] shrink-0" />
                  {mode === 'fulfil_complete'
                    ? 'Order closed · Repeat buyer saved to CRM'
                    : 'Customer automatically notified on WhatsApp'}
                </span>
                <span className="font-mono text-[10px] text-[#DBF361] shrink-0 ml-2">
                  Auto
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
