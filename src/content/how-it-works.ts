/**
 * Single source of truth for How Kasi Works page copy
 * Directly mapped to KASI_Website_Build_Spec_v2.md (Spec 03)
 */

export const HOW_IT_WORKS_COPY = {
  // spec 3.1
  "3.1": {
    h1: "See a real order happen, start to finish.",
    sub: "No slides. Watch Kasi take a customer from first message to paid and out for delivery, then try it yourself.",
    ctaPrimary: "Try the live demo",
    ctaSecondary: "Book a walkthrough",
    hrefPrimary: "/try",
    hrefSecondary: "/contact",
  },

  // spec 3.2
  "3.2": {
    caption: "This is the whole thing: a customer asks, Kasi recommends, they settle a price, pay, and the order moves to fulfilment. You did nothing.",
  },

  // spec 3.4
  "3.4": {
    stages: [
      { step: 1, title: "Inquiry", desc: "Asks about a product." },
      { step: 2, title: "Recommend", desc: "Options, images, prices." },
      { step: 3, title: "Agree price", desc: "Fixed or negotiated." },
      { step: 4, title: "Checkout", desc: "Pickup/delivery, Paystack." },
      { step: 5, title: "Paid", desc: "Webhook confirms." },
      { step: 6, title: "Delivered", desc: "After-sales closes it." },
    ],
  },

  // spec 3.5
  "3.5": {
    heading: "Seen enough? Go and chat it yourself.",
    ctaPrimary: "Chat the live demo",
    ctaSecondary: "Start free",
    hrefPrimary: "/try",
    hrefSecondary: "/get-started",
  },
};
