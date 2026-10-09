/**
 * Single source of truth for Kasi Homepage Copy
 * Directly mapped to KASI_Website_Build_Spec_v2.md (Spec 02)
 */

export const HOME_COPY = {
  // spec 2.1
  "2.1": {
    h1: "Automate your DMs. Answer every WhatsApp, Instagram and Telegram DM.",
    sub: "Kasi is the operating system for businesses that sell on WhatsApp and Instagram. It answers every customer, negotiates, takes payment, and pushes the order to delivery. You just prepare it.",
    ctaPrimary: "Start free",
    ctaSecondary: "Chat the live demo",
    trustStrip: [
      "Works on WhatsApp, Instagram, Messenger & Telegram",
      "Payments by Paystack",
      "No app for your customers to download",
    ],
  },

  // spec 2.2
  "2.2": {
    headingPart1: "Selling on social was never the problem.",
    headingPart2: "Keeping up with it was.",
    body: "Kasi replies in seconds, at 2pm or 2am, in the customer's own words. Nothing sits unread. Nothing slips. You wake up to prepared orders, not a backlog of \"is this available?\"",
    stats: [
      { to: 8, suffix: "s", label: "Average reply speed", desc: "at 2pm or 2am" },
      { to: 100, suffix: "%", label: "DMs answered", desc: "zero dropped inquiries" },
      { to: 4, suffix: " rails", label: "One unified inbox", desc: "WhatsApp, IG, Messenger, Telegram" },
    ],
  },

  // spec 2.3
  "2.3": {
    badge: "THE FULL CYCLE",
    heading: "One assistant. The whole shop.",
    sub: "From the first \"hello\" to the \"your order is on its way,\" Kasi handles the parts that used to eat your day.",
    pillars: [
      {
        tag: "IT SELLS",
        title: "Autonomous Sales Engine",
        body: "Answers, recommends, negotiates within your rules, and closes the order without you touching the phone.",
        cta: "Explore Sales Engine",
        href: "/features/sales-engine",
        screenshot: "/images/hero-dashboard-desktop.png",
        humanPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
        humanAlt: "Nigerian female entrepreneur packing fashion orders",
      },
      {
        tag: "IT FULFILS",
        title: "Fulfilment & Dispatch",
        body: "Paid orders drop into one list. Pack, dispatch, deliver, each step pings the customer automatically.",
        cta: "Explore Fulfilment",
        href: "/features/fulfilment",
        screenshot: "/images/order-pipeline.png",
        humanPhoto: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80",
        humanAlt: "Retail vendor handing off orders for rider dispatch",
      },
      {
        tag: "IT GROWS",
        title: "Customers & Analytics",
        body: "Every chat becomes a saved customer, a lead stage, and a number you can actually read.",
        cta: "Explore Customers & Analytics",
        href: "/features/customers",
        screenshot: "/images/dashboard-analytics.png",
        humanPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
        humanAlt: "Store owner reviewing analytics on phone",
      },
    ],
  },

  // spec 2.4
  "2.4": {
    badge: "LIVE PRODUCT PROOF",
    heading: "Real dashboards. Real orders moving.",
    sub: "Built for speed, clarity, and total control over your business.",
    rows: [
      {
        title: "Live Chats + AI summary + \"Instruct Kasi\"",
        caption: "Watch every conversation. Step in with one line whenever you want.",
        tag: "TOTAL CONTROL",
        screenshot: "/images/hero-dashboard-desktop.png",
        alt: "Live chats and conversation oversight dashboard",
      },
      {
        title: "Orders & Fulfilment pipeline with the phase tracker",
        caption: "Paid orders, one list, one next action each.",
        tag: "DISPATCH PIPELINE",
        screenshot: "/images/order-pipeline.png",
        alt: "Orders and fulfilment phase tracker pipeline",
      },
    ],
  },

  // spec 2.5
  "2.5": {
    heading: "Made for shops with real volume.",
    sub: "If your DMs and WhatsApp are busy enough that replies fall through, Kasi is built for you. Food vendors, fashion and thrift sellers, gadget stores, jewelers, skincare brands. The busier you are, the more it carries.",
    categories: [
      {
        title: "Food & kitchens",
        tag: "Fast menu orders & delivery dispatch",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Fashion & thrift",
        tag: "Size inquiries & rapid drops",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Gadgets & accessories",
        tag: "Specs, bargaining & instant receipts",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Jewelry",
        tag: "Custom orders & high-trust checkout",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Skincare & beauty",
        tag: "Routine consultation & bundle sales",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },

  // spec 2.6
  "2.6": {
    badge: "HOW IT WORKS",
    heading: "Connect once. Let Kasi run the counter.",
    steps: [
      {
        step: 1,
        title: "Connect",
        desc: "Link WhatsApp or Instagram in minutes.",
      },
      {
        step: 2,
        title: "Load your shop",
        desc: "Add products, prices, delivery rules.",
      },
      {
        step: 3,
        title: "Kasi sells",
        desc: "It chats, closes, takes payment.",
      },
      {
        step: 4,
        title: "You fulfil",
        desc: "Prepare and hand off. Done.",
      },
    ],
    button: "See how Kasi works →",
  },

  // spec 2.7
  "2.7": {
    headline: "\"I stopped losing customers at midnight.\"",
    sub: "Real words from real sellers running social stores in Lagos, Abuja, and Port Harcourt.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },

  // spec 2.8
  "2.8": {
    heading: "Not here to sell? Come shop instead.",
    body: "Kasi Market is where you buy straight from local sellers, in the chat you already use.",
    button: "Explore Kasi Market →",
  },

  // spec 2.9
  "2.9": {
    heading: "Your next customer is already typing.",
    sub: "Set Kasi up today and let it answer the very next message for you.",
    ctaPrimary: "Start free",
    ctaSecondary: "Book a live demo",
  },
};
