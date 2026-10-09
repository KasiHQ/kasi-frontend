/**
 * Stage definitions for Kasi User Journey
 * Mapped strictly to KASI_Website_Build_Spec_v2.md:
 * - Spec 2.6 for variant="landing"
 * - Spec 3.4 for variant="full"
 */

export interface JourneyStage {
  id: string;
  stepNumber: number;
  title: string;
  desc: string;
  range: [number, number]; // [startProgress, endProgress]
  holdProgress: number;     // Target scroll progress for hold and rail jump
}

export const LANDING_STAGES: JourneyStage[] = [
  {
    id: 'landing-1',
    stepNumber: 1,
    title: 'Connect',
    desc: 'Link WhatsApp or Instagram in minutes.',
    range: [0.0, 0.25],
    holdProgress: 0.12,
  },
  {
    id: 'landing-2',
    stepNumber: 2,
    title: 'Load your shop',
    desc: 'Add products, prices, delivery rules.',
    range: [0.25, 0.5],
    holdProgress: 0.37,
  },
  {
    id: 'landing-3',
    stepNumber: 3,
    title: 'Kasi sells',
    desc: 'It chats, closes, takes payment.',
    range: [0.5, 0.75],
    holdProgress: 0.62,
  },
  {
    id: 'landing-4',
    stepNumber: 4,
    title: 'You fulfil',
    desc: 'Prepare and hand off. Done.',
    range: [0.75, 1.0],
    holdProgress: 0.88,
  },
];

export const FULL_STAGES: JourneyStage[] = [
  {
    id: 'full-1',
    stepNumber: 1,
    title: 'Inquiry',
    desc: 'Asks about a product.',
    range: [0.0, 0.17],
    holdProgress: 0.08,
  },
  {
    id: 'full-2',
    stepNumber: 2,
    title: 'Recommend',
    desc: 'Options, images, prices.',
    range: [0.17, 0.33],
    holdProgress: 0.25,
  },
  {
    id: 'full-3',
    stepNumber: 3,
    title: 'Agree price',
    desc: 'Fixed or negotiated.',
    range: [0.33, 0.5],
    holdProgress: 0.42,
  },
  {
    id: 'full-4',
    stepNumber: 4,
    title: 'Checkout',
    desc: 'Pickup/delivery, Paystack.',
    range: [0.5, 0.67],
    holdProgress: 0.58,
  },
  {
    id: 'full-5',
    stepNumber: 5,
    title: 'Paid',
    desc: 'Webhook confirms.',
    range: [0.67, 0.83],
    holdProgress: 0.75,
  },
  {
    id: 'full-6',
    stepNumber: 6,
    title: 'Delivered',
    desc: 'After-sales closes it.',
    range: [0.83, 1.0],
    holdProgress: 0.92,
  },
];
