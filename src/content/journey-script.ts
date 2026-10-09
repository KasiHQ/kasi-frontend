/**
 * Single source of truth for the Kasi interactive journey demo script.
 * Flagged for check-copy review.
 */
export const JOURNEY_SCRIPT = {
  demoScript: true,
  category: 'fashion',
  product: {
    name: 'Ankara two-piece, size 14',
    shortName: 'Ankara two-piece',
    sku: 'ANK-014',
    startPrice: '₦18,500',
    agreedPrice: '₦17,000',
    deliveryFee: '₦1,500',
    totalPrice: '₦18,500',
    image: '/images/products & store.png',
  },
  customer: {
    name: 'Amaka',
    initial: 'A',
    locationName: 'Admiralty Way, Lekki Phase 1',
    maskedPhone: '+234 803 ••• 8821',
  },
  rider: {
    name: 'Ibrahim',
    maskedPhone: '+234 802 ••• 4102',
  },
  orderId: 'ORD-8291',

  // Script lines for Full Journey (Spec 3.4)
  full: {
    stage1_inquiry: {
      customer: 'Hi! Is the Ankara two-piece in size 14 still available?',
    },
    stage2_recommend: {
      kasi: 'Yes, size 14 is in stock. ₦18,500. Pickup or delivery?',
    },
    stage3_agreePrice: {
      customer: 'Delivery to Lekki. Can you do ₦16,000?',
      kasi: 'I can do ₦17,000 for you today.',
    },
    stage4_checkout: {
      customerLocation: 'Admiralty Way, Lekki Phase 1',
      kasi: 'Delivery to Lekki is ₦1,500. Total ₦18,500. Tap below to pay via Paystack.',
    },
    stage5_paid: {
      kasi: 'Payment received. We are preparing your order now.',
    },
    stage6_delivered: {
      autoPacked: 'Your order is packed and being dispatched.',
      autoDispatched: 'Dispatched with rider Ibrahim (+234 802 ••• 4102).',
      autoDelivered: 'Delivered. Thank you for shopping with us.',
    },
  },

  // Script lines for Landing Variant (Spec 2.6)
  landing: {
    act1_connect: {
      channel: 'WhatsApp',
      status: 'Connected',
    },
    act2_loadShop: {
      product: 'Ankara two-piece',
      price: '₦18,500',
    },
    act3_sells: {
      customer: 'Is size 14 available? Can you do ₦16,000?',
      kasi: 'Yes, available at ₦17,000 today.',
      payment: 'Paid ₦18,500 via Paystack',
    },
    act4_fulfil: {
      order: 'ORD-8291 · Lekki Phase 1',
      status: 'Dispatched',
    },
  },
};
