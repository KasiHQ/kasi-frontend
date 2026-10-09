/**
 * Single source of truth for the Kasi interactive journey demo script.
 * Verified against real dashboard screenshots:
 * - products & store.png (Kay's Sweet Confections: Samosa ₦100)
 * - fulfilment & orders.png (Customer Temi, Order KAS-CART-32-1791147016-43D9, Samosa ×1, Total ₦100)
 * - chats.png (WhatsApp inquiries for Kay's Sweet Confections in Abuja)
 */
export const JOURNEY_SCRIPT = {
  demoScript: true,
  category: 'food',
  vendorName: "Kay's Sweet Confections",
  product: {
    name: 'Samosa',
    shortName: 'Samosa',
    quantity: '1',
    itemDisplay: 'Samosa ×1',
    startPrice: '₦100',
    agreedPrice: '₦100',
    deliveryFee: '₦0',
    totalPrice: '₦100',
    fulfillmentType: 'Store pickup',
    location: 'Jabi, Abuja',
    image: '/images/products & store.png',
  },
  customer: {
    name: 'Temi',
    initial: 'T',
    locationName: 'Store pickup · Jabi, Abuja',
    maskedPhone: '+234 812 ••• 1134',
    rawPhone: '2348127611134',
  },
  orderId: 'KAS-CART-32-1791147016-43D9',
  orderIdShort: 'KAS-43D9',

  // Script lines for Full Journey (Spec 3.4)
  full: {
    stage1_inquiry: {
      customer: 'Hi! Do you have fresh Samosa available today?',
    },
    stage2_recommend: {
      kasi: 'Yes! Fresh crispy Samosas are in stock at ₦100 each. Store pickup or delivery in Abuja?',
    },
    stage3_agreePrice: {
      customer: 'Store pickup in Jabi please. Ready today?',
      kasi: 'Yes, store pickup at Jabi is ready today. Price is ₦100.',
    },
    stage4_checkout: {
      customerLocation: 'Store pickup · Jabi, Abuja',
      kasi: 'Store pickup selected. Total is ₦100. Tap below to pay via Paystack.',
    },
    stage5_paid: {
      kasi: 'Payment received. We are preparing your order now.',
    },
    stage6_delivered: {
      autoPacked: 'Your order is marked as packed and ready for pickup.',
      autoReady: 'Ready for pickup at Jabi.',
      autoDelivered: 'Order picked up. Thank you for shopping with Kay\'s Sweet Confections.',
    },
  },

  // Script lines for Landing Variant (Spec 2.6)
  landing: {
    act1_connect: {
      channel: 'WhatsApp',
      status: 'Connected',
    },
    act2_loadShop: {
      product: 'Samosa',
      price: '₦100',
    },
    act3_sells: {
      customer: 'Hi! Do you have fresh Samosa available today?',
      kasi: 'Yes, fresh Samosa in stock at ₦100. Store pickup or delivery in Abuja?',
      payment: 'Paid ₦100 via Paystack',
    },
    act4_fulfil: {
      order: 'KAS-CART-32-1791147016-43D9 · Store pickup',
      status: 'Prepared',
    },
  },
};
