/**
 * Single source of truth for Kasi Homepage Copy
 * Directly mapped to KASI_Website_Build_Spec_v2.md (Spec 02)
 *
 * RULES:
 * 1. Verbatim match with spec.
 * 2. No invented headings, counters, or eyebrow badges.
 * 3. All components import from here.
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
  },

  // spec 2.3
  "2.3": {
    heading: "One assistant. The whole shop.",
    sub: "From the first \"hello\" to the \"your order is on its way,\" Kasi handles the parts that used to eat your day.",
    pillars: [
      {
        tag: "IT SELLS",
        body: "Answers, recommends, negotiates within your rules, and closes the order without you touching the phone.",
        cta: "Sales Engine",
        href: "/features/sales-engine",
        screenshot: "/images/chats.png",
        placeholderCaption: "Nigerian female entrepreneur packing fashion orders",
      },
      {
        tag: "IT FULFILS",
        body: "Paid orders drop into one list. Pack, dispatch, deliver, each step pings the customer automatically.",
        cta: "Fulfilment",
        href: "/features/fulfilment",
        screenshot: "/images/fulfilment & orders.png",
        placeholderCaption: "Retail vendor handing off orders for rider dispatch",
      },
      {
        tag: "IT GROWS",
        body: "Every chat becomes a saved customer, a lead stage, and a number you can actually read.",
        cta: "Customers & Analytics",
        href: "/features/customers",
        screenshot: "/images/analytics.png",
        placeholderCaption: "Store owner reviewing analytics on phone",
      },
    ],
  },

  // spec 2.4
  "2.4": {
    rows: [
      {
        title: "Live Chats + AI summary + \"Instruct Kasi\"",
        caption: "Watch every conversation. Step in with one line whenever you want.",
        screenshot: "/images/chats.png",
        href: "/features/chats",
      },
      {
        title: "Orders & Fulfilment pipeline with the phase tracker",
        caption: "Paid orders, one list, one next action each.",
        screenshot: "/images/fulfilment & orders.png",
        href: "/features/fulfilment",
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
      },
      {
        title: "Fashion & thrift",
      },
      {
        title: "Gadgets & accessories",
      },
      {
        title: "Jewelry",
      },
      {
        title: "Skincare & beauty",
      },
    ],
  },

  // spec 2.6
  "2.6": {
    heading: "Connect once. Let Kasi run the counter.",
    sub: "Link WhatsApp or Instagram in minutes, load your shop, and let Kasi handle every customer from inquiry to delivery.",
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
    href: "/how-it-works",
  },

  // spec 2.7
  "2.7": {
    headline: "\"I stopped losing customers at midnight.\"",
    testimonials: [
      {
        name: "Folake Adebayo",
        business: "Lush Looks",
        city: "Lagos",
      },
      {
        name: "Emeka Obi",
        business: "TechHaven",
        city: "Abuja",
      },
      {
        name: "Kenechukwu O.",
        business: "Skin by Kene",
        city: "Port Harcourt",
      },
    ],
  },

  // spec 2.8
  "2.8": {
    heading: "Not here to sell? Come shop instead.",
    body: "Kasi Market is where you buy straight from local sellers, in the chat you already use.",
    button: "Explore Kasi Market →",
    href: "/market",
  },

  // spec 2.9
  "2.9": {
    heading: "Your next customer is already typing.",
    sub: "Set Kasi up today and let it answer the very next message for you.",
    ctaPrimary: "Start free",
    ctaSecondary: "Book a live demo",
    hrefPrimary: "/get-started",
    hrefSecondary: "/try#book",
  },
};
