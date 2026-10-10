export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  pricePeriod: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export const PRICING_DATA = {
  heading: "Simple, transparent pricing for growing sellers.",
  sub: "No commissions. No hidden cuts. Keep 100% of your sales with flat monthly plans built for African businesses.",
  tabs: [
    { id: "product", label: "Product Vendors" },
    { id: "service", label: "Service Vendors" },
  ],
  productPlans: [
    {
      id: "product-starter",
      name: "STARTER",
      price: "₦18,000",
      pricePeriod: "/month",
      features: [
        "AI sales agent on WhatsApp",
        "Unlimited product catalog with voice pitch per product",
        "Inventory tracking — never sells out-of-stock items",
        "Paystack payment integration",
        "Full status dashboard with AI conversation summaries",
        "Basic analytics — revenue, units sold, best sellers",
        "Physical store direction",
      ],
    },
    {
      id: "product-growth",
      name: "GROWTH",
      price: "₦29,000",
      pricePeriod: "/month",
      badge: "MOST POPULAR",
      isPopular: true,
      features: [
        "Everything in Starter",
        "Connect all social media DMs (Instagram, Facebook + more)",
        "Full analytics — margins, avg deal value, best sellers",
        "Broadcast marketing to your customer list",
        "Token top-ups for campaigns available as add-on",
      ],
    },
    {
      id: "product-premium",
      name: "PREMIUM",
      price: "₦40,000",
      pricePeriod: "/month",
      features: [
        "Everything in Growth",
        "Customer intelligence — full interaction database, drop-off categorisation",
        "Re-engage leads on the right platform with full context",
        "Proactive outreach to people who engaged with your social posts",
        "Token top-ups for re-engagement and outreach available as add-on",
      ],
    },
  ],
  servicePlans: [
    {
      id: "service-starter",
      name: "STARTER",
      price: "₦15,000",
      pricePeriod: "/month",
      features: [
        "AI booking agent on WhatsApp",
        "1 Active Booking Schedule/Calendar",
        "Appointment booking directly in DM",
        "Paystack integration for upfront deposits/payments",
        "Full status dashboard with AI conversation summaries",
        "Basic analytics — appointments booked, revenue, best times",
        "Custom store address & opening hours in DM",
      ],
    },
    {
      id: "service-growth",
      name: "GROWTH",
      price: "₦24,000",
      pricePeriod: "/month",
      badge: "MOST POPULAR",
      isPopular: true,
      features: [
        "Everything in Starter",
        "Connect all social media DMs (Instagram, Facebook + more)",
        "Google Calendar integration & automatic two-way sync",
        "Automated appointment reminders (WhatsApp/IG)",
        "Broadcast marketing to your client list",
        "Token top-ups for campaigns available as add-on",
      ],
    },
    {
      id: "service-premium",
      name: "PREMIUM",
      price: "₦32,000",
      pricePeriod: "/month",
      features: [
        "Everything in Growth",
        "Client intelligence — full appointment history database, drop-off categorisation",
        "Re-engage clients on the right platform with full context",
        "Proactive outreach to people who engaged with your social posts",
        "Token top-ups for re-engagement and outreach available as add-on",
      ],
    },
  ],
  faq: [
    {
      q: "Do you take a percentage or commission on my sales?",
      a: "No. Never. You pay your flat monthly subscription and keep 100% of your revenue. Standard Paystack processing fees apply directly to transactions.",
    },
    {
      q: "Can I switch between plans or cancel anytime?",
      a: "Yes. You can upgrade, downgrade, or cancel your subscription anytime directly from your dashboard with zero penalty.",
    },
    {
      q: "How does the WhatsApp connection work?",
      a: "We connect via the official Meta WhatsApp Business Cloud API. Your number stays yours, and you can still view chats and jump in whenever you want.",
    },
  ],
};
