export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  business: string;
  city: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "folake",
    quote: "I stopped losing customers at midnight. While I'm asleep, Kasi answers sizing questions, confirms orders, and verifies bank payments. Waking up to processed orders instead of hundreds of unread DMs completely changed my life.",
    author: "Folake Adebayo",
    role: "Founder & Creative Director",
    business: "Lush Looks Fashion",
    city: "Lagos",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "emeka",
    quote: "Selling gadgets on WhatsApp means endless haggling. Kasi negotiates firmly within my preset minimum price floors, issues invoices, and books dispatch riders before competitors even open their messages.",
    author: "Emeka Obi",
    role: "Managing Director",
    business: "TechHaven Electronics",
    city: "Abuja",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "kene",
    quote: "Customers ask for skincare advice before they buy. Kasi recommends exact routines based on their skin type, adds bundles to cart, and collects Paystack payments in seconds. Our conversion tripled.",
    author: "Kenechukwu O.",
    role: "Lead Formulator",
    business: "Skin by Kene Naturals",
    city: "Port Harcourt",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  },
];
