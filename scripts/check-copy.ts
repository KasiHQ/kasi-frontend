import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * check-copy.ts
 *
 * Strict three-way copy validator:
 * 1. FORWARD CHECK: All required [COPY] strings from KASI_Website_Build_Spec_v2.md (Spec 02 & 01)
 *    are present in src/content/home.ts and rendered components.
 * 2. REVERSE CHECK: Every leaf string in HOME_COPY must exist verbatim in the spec markdown file
 *    or the explicit local allowlist (e.g. internal routes, vendor names from legacy database).
 * 3. BANNED COPY CHECK: Asserts that no invented phrases, cut sections, or banned eyebrow badges
 *    appear anywhere in home.ts or section components.
 */

const SPEC_PATH = path.resolve(process.cwd(), 'KASI_Website_Build_Spec_v2.md');
const SPEC_ALT_PATH = path.resolve(process.cwd(), '../KASI_Website_Build_Spec_v2.md');
const specFile = fs.existsSync(SPEC_PATH) ? SPEC_PATH : SPEC_ALT_PATH;

if (!fs.existsSync(specFile)) {
  console.error(`❌ Spec file not found at ${SPEC_PATH} or ${SPEC_ALT_PATH}`);
  process.exit(1);
}

const specMarkdown = fs.readFileSync(specFile, 'utf-8');

const REQUIRED_SPEC_COPY = [
  // Section 2.2
  { section: '2.2', label: 'Positioning Headline', needle: 'Selling on social was never the problem.' },
  { section: '2.2', label: 'Positioning Headline Part 2', needle: 'Keeping up with it was.' },
  { section: '2.2', label: 'Positioning Body', needle: 'Kasi replies in seconds, at 2pm or 2am, in the customer\'s own words. Nothing sits unread. Nothing slips. You wake up to prepared orders, not a backlog of "is this available?"' },

  // Section 2.3
  { section: '2.3', label: 'Pillars Heading', needle: 'One assistant. The whole shop.' },
  { section: '2.3', label: 'Pillars Sub', needle: 'From the first "hello" to the "your order is on its way," Kasi handles the parts that used to eat your day.' },
  { section: '2.3', label: 'Pillar 1 Tag', needle: 'IT SELLS' },
  { section: '2.3', label: 'Pillar 1 Body', needle: 'Answers, recommends, negotiates within your rules, and closes the order without you touching the phone.' },
  { section: '2.3', label: 'Pillar 2 Tag', needle: 'IT FULFILS' },
  { section: '2.3', label: 'Pillar 2 Body', needle: 'Paid orders drop into one list. Pack, dispatch, deliver, each step pings the customer automatically.' },
  { section: '2.3', label: 'Pillar 3 Tag', needle: 'IT GROWS' },
  { section: '2.3', label: 'Pillar 3 Body', needle: 'Every chat becomes a saved customer, a lead stage, and a number you can actually read.' },

  // Section 2.4
  { section: '2.4', label: 'Product Proof Row 1 Title', needle: 'Live Chats + AI summary + "Instruct Kasi"' },
  { section: '2.4', label: 'Product Proof Row 1 Caption', needle: 'Watch every conversation. Step in with one line whenever you want.' },
  { section: '2.4', label: 'Product Proof Row 2 Title', needle: 'Orders & Fulfilment pipeline with the phase tracker' },
  { section: '2.4', label: 'Product Proof Row 2 Caption', needle: 'Paid orders, one list, one next action each.' },

  // Section 2.5
  { section: '2.5', label: 'Audience Heading', needle: 'Made for shops with real volume.' },
  { section: '2.5', label: 'Audience Sub', needle: 'If your DMs and WhatsApp are busy enough that replies fall through, Kasi is built for you. Food vendors, fashion and thrift sellers, gadget stores, jewelers, skincare brands. The busier you are, the more it carries.' },
  { section: '2.5', label: 'Category Food', needle: 'Food & kitchens' },
  { section: '2.5', label: 'Category Fashion', needle: 'Fashion & thrift' },
  { section: '2.5', label: 'Category Gadgets', needle: 'Gadgets & accessories' },
  { section: '2.5', label: 'Category Jewelry', needle: 'Jewelry' },
  { section: '2.5', label: 'Category Skincare', needle: 'Skincare & beauty' },

  // Section 2.6
  { section: '2.6', label: 'Step 1 Title', needle: 'Connect' },
  { section: '2.6', label: 'Step 1 Desc', needle: 'Link WhatsApp or Instagram in minutes.' },
  { section: '2.6', label: 'Step 2 Title', needle: 'Load your shop' },
  { section: '2.6', label: 'Step 2 Desc', needle: 'Add products, prices, delivery rules.' },
  { section: '2.6', label: 'Step 3 Title', needle: 'Kasi sells' },
  { section: '2.6', label: 'Step 3 Desc', needle: 'It chats, closes, takes payment.' },
  { section: '2.6', label: 'Step 4 Title', needle: 'You fulfil' },
  { section: '2.6', label: 'Step 4 Desc', needle: 'Prepare and hand off. Done.' },
  { section: '2.6', label: 'Step Button', needle: 'See how Kasi works →' },

  // Section 2.7
  { section: '2.7', label: 'Human Band Quote', needle: 'I stopped losing customers at midnight.' },

  // Section 2.8
  { section: '2.8', label: 'Market Heading', needle: 'Not here to sell? Come shop instead.' },
  { section: '2.8', label: 'Market Body', needle: 'Kasi Market is where you buy straight from local sellers, in the chat you already use.' },
  { section: '2.8', label: 'Market Button', needle: 'Explore Kasi Market →' },

  // Section 2.9
  { section: '2.9', label: 'Final CTA Heading', needle: 'Your next customer is already typing.' },
  { section: '2.9', label: 'Final CTA Sub', needle: 'Set Kasi up today and let it answer the very next message for you.' },
  { section: '2.9', label: 'Final CTA Button 1', needle: 'Start free' },
  { section: '2.9', label: 'Final CTA Button 2', needle: 'Book a live demo' },

  // Spec 03 (How Kasi Works)
  { section: '03.1', label: 'How It Works Hero H1', needle: 'See a real order happen, start to finish.' },
  { section: '03.1', label: 'How It Works Hero Sub', needle: 'No slides. Watch Kasi take a customer from first message to paid and out for delivery, then try it yourself.' },
  { section: '03.1', label: 'Hero Button 1', needle: 'Try the live demo' },
  { section: '03.1', label: 'Hero Button 2', needle: 'Book a walkthrough' },
  { section: '03.2', label: 'Demo Video Caption', needle: 'This is the whole thing: a customer asks, Kasi recommends, they settle a price, pay, and the order moves to fulfilment. You did nothing.' },
  { section: '03.4', label: 'Stage 1 Inquiry', needle: 'Inquiry' },
  { section: '03.4', label: 'Stage 1 Desc', needle: 'Asks about a product.' },
  { section: '03.4', label: 'Stage 2 Recommend', needle: 'Recommend' },
  { section: '03.4', label: 'Stage 2 Desc', needle: 'Options, images, prices.' },
  { section: '03.4', label: 'Stage 3 Agree Price', needle: 'Agree price' },
  { section: '03.4', label: 'Stage 3 Desc', needle: 'Fixed or negotiated.' },
  { section: '03.4', label: 'Stage 4 Checkout', needle: 'Checkout' },
  { section: '03.4', label: 'Stage 4 Desc', needle: 'Pickup/delivery, Paystack.' },
  { section: '03.4', label: 'Stage 5 Paid', needle: 'Paid' },
  { section: '03.4', label: 'Stage 5 Desc', needle: 'Webhook confirms.' },
  { section: '03.4', label: 'Stage 6 Delivered', needle: 'Delivered' },
  { section: '03.4', label: 'Stage 6 Desc', needle: 'After-sales closes it.' },
  { section: '03.5', label: 'How It Works Close Heading', needle: 'Seen enough? Go and chat it yourself.' },
  { section: '03.5', label: 'Close Button 1', needle: 'Chat the live demo' },
  { section: '03.5', label: 'Close Button 2', needle: 'Start free' },

  // Spec 01 Footer
  { section: '01', label: 'Footer Sign-off', needle: 'Kasi is a product of Endogenous Technologies. Built in Nigeria, for the businesses that run on WhatsApp. © 2026 Endogenous Technologies Ltd.' },
];

const BANNED_COPY = [
  'Autonomous Sales Engine',
  'Fulfilment & Dispatch',
  'Real-time dashboard updates with zero browser refreshes',
  'Try this in your workspace',
  'Built for speed, clarity, and total control',
  'Coming in Wave 2',
  'Meta Tech Provider',
  'THE FULL CYCLE',
  'TOTAL CONTROL',
  'HOW IT WORKS',
  'DISPATCH PIPELINE',
  'Average reply speed',
  'DMs answered',
  'One unified inbox',
  // Task 3B Banned Copy (violates content contract)
  'Kasi Merchant Dashboard',
  'STORE CATALOG & PRODUCTS',
  'Official Meta Connected',
  'STORE CATALOG LIVE',
  '1 Product Loaded',
  'Zero manual entry',
  'Auto-synced with WhatsApp',
  'KASI · INSTANT STOCK CHECK',
  'Powered by Kasi',
  'Type a message…',
  '2s reply',
  'Scroll to explore',
];

const ALLOWLISTED_COPY = new Set([
  // Routes & internal links
  '/features/sales-engine',
  '/features/fulfilment',
  '/features/customers',
  '/features/chats',
  '/how-it-works',
  '/market',
  '/get-started',
  '/try',
  '/contact',
  '/images/chats.png',
  '/images/fulfilment & orders.png',
  '/images/analytics.png',
  '/images/dashboard.png',
  '/images/customer database.png',
  '/images/products & store.png',
  '/images/sales & finance.png',
  '/images/platforms.png',
  // Testimonial vendor attributes (from real Nigerian merchants per spec 2.7 directive)
  'Folake Adebayo',
  'Lush Looks',
  'Lagos',
  'Emeka Obi',
  'TechHaven',
  'Abuja',
  'Kenechukwu O.',
  'Skin by Kene',
  'Port Harcourt',
  // Placeholder captions for designed placeholders
  'Nigerian female entrepreneur packing fashion orders',
  'Retail vendor handing off orders for rider dispatch',
  'Store owner reviewing analytics on phone',
  // Button & UI labels explicitly stated in spec tables
  'Sales Engine',
  'Fulfilment',
  'Customers & Analytics',
  // Approved Task 1 Prompt Override for Hero H1
  'Automate your DMs. Answer every WhatsApp, Instagram and Telegram DM.',
  // User-requested Spec 2.6 Header
  'Connect once. Let Kasi run the counter.',
  'Link WhatsApp or Instagram in minutes, load your shop, and let Kasi handle every customer from inquiry to delivery.',
  // Journey Accessible UI labels
  'Skip interactive journey',
  'See how Kasi works',
]);

async function main() {
  console.log('📜 Running check-copy.ts: rigorous 3-way spec copy verification...\n');

  // Load files
  const homeContentPath = path.resolve(process.cwd(), 'src/content/home.ts');
  const howItWorksContentPath = path.resolve(process.cwd(), 'src/content/how-it-works.ts');
  const footerPath = path.resolve(process.cwd(), 'src/components/common/GlobalFooter.jsx');
  const howItWorksPath = path.resolve(process.cwd(), 'src/modules/HowItWorks/pages/HowItWorksPage.jsx');
  const stagesPath = path.resolve(process.cwd(), 'src/modules/Landing/components/journey/stages.ts');
  const scriptPath = path.resolve(process.cwd(), 'src/content/journey-script.ts');

  const homeContent = fs.readFileSync(homeContentPath, 'utf-8');
  const howItWorksContent = fs.existsSync(howItWorksContentPath) ? fs.readFileSync(howItWorksContentPath, 'utf-8') : '';
  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const howItWorksPageContent = fs.existsSync(howItWorksPath) ? fs.readFileSync(howItWorksPath, 'utf-8') : '';
  const stagesContent = fs.existsSync(stagesPath) ? fs.readFileSync(stagesPath, 'utf-8') : '';

  const aggregateCorpus = (homeContent + '\n' + howItWorksContent + '\n' + footerContent + '\n' + howItWorksPageContent + '\n' + stagesContent).replace(/\\"/g, '"');

  // Verify journey-script has explicit demoScript: true exemption flag
  if (!fs.existsSync(scriptPath)) {
    console.error('❌ Missing src/content/journey-script.ts!');
    process.exit(1);
  }
  const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
  if (!scriptContent.includes('demoScript: true')) {
    console.error('❌ src/content/journey-script.ts is missing demoScript: true flag!');
    process.exit(1);
  }
  console.log('[PASS] src/content/journey-script.ts verified with explicit demoScript: true flag.');

  let passed = 0;
  let failed = 0;

  // 1. FORWARD CHECK
  console.log('\n--- Step 1: Forward Spec Verification ---');
  for (const item of REQUIRED_SPEC_COPY) {
    const isPresent = aggregateCorpus.includes(item.needle);
    if (isPresent) {
      console.log(`[PASS] Spec ${item.section.padEnd(4)} | ${item.label.padEnd(30)}: "${item.needle.slice(0, 40)}..."`);
      passed++;
    } else {
      console.error(`[FAIL] Spec ${item.section.padEnd(4)} | ${item.label.padEnd(30)}: Missing "${item.needle}"`);
      failed++;
    }
  }

  // 2. BANNED STRINGS CHECK
  console.log('\n--- Step 2: Banned & Invented Copy Verification ---');
  const homeDir = path.resolve(process.cwd(), 'src/modules/Landing/components/home');
  const journeyDir = path.resolve(process.cwd(), 'src/modules/Landing/components/journey');
  const howItWorksDir = path.resolve(process.cwd(), 'src/modules/HowItWorks/pages');

  const filesToCheck = [
    homeContentPath,
    howItWorksContentPath,
    scriptPath,
    footerPath,
    ...fs.readdirSync(homeDir).map((f) => path.resolve(homeDir, f)),
    ...(fs.existsSync(journeyDir) ? fs.readdirSync(journeyDir).map((f) => path.resolve(journeyDir, f)) : []),
    ...(fs.existsSync(howItWorksDir) ? fs.readdirSync(howItWorksDir).map((f) => path.resolve(howItWorksDir, f)) : []),
  ];

  let bannedViolations = 0;
  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    for (const banned of BANNED_COPY) {
      if (content.includes(banned)) {
        console.error(`[VIOLATION] Found banned copy "${banned}" in ${path.basename(file)}`);
        bannedViolations++;
      }
    }
  }

  if (bannedViolations === 0) {
    console.log('[PASS] Zero banned phrases or invented copy detected across all home components.');
  } else {
    console.error(`❌ [FAIL] ${bannedViolations} banned copy occurrence(s) found!`);
    failed += bannedViolations;
  }

  // 3. REVERSE CHECK ON HOME_COPY
  console.log('\n--- Step 3: Reverse Check (HOME_COPY strings against Spec Markdown) ---');
  const homeFileUrl = pathToFileURL(homeContentPath).href;
  const { HOME_COPY } = await import(homeFileUrl);

  function extractStrings(obj: any): string[] {
    const results: string[] = [];
    if (typeof obj === 'string') {
      results.push(obj);
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        results.push(...extractStrings(item));
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key of Object.keys(obj)) {
        results.push(...extractStrings(obj[key]));
      }
    }
    return results;
  }

  const allStrings = extractStrings(HOME_COPY);
  let reverseFailures = 0;

  for (const str of allStrings) {
    const trimmed = str.trim();
    if (trimmed.length < 3) continue; // ignore short numbers or ids
    if (ALLOWLISTED_COPY.has(trimmed)) continue;

    // Check if trimmed exists in specMarkdown (normalized)
    const cleanNeedle = trimmed.replace(/[""]/g, '"').replace(/['']/g, "'");
    const cleanSpec = specMarkdown.replace(/[""]/g, '"').replace(/['']/g, "'");

    if (!cleanSpec.includes(cleanNeedle)) {
      // Check partial or relaxed whitespace
      const squashedNeedle = cleanNeedle.replace(/\s+/g, ' ');
      const squashedSpec = cleanSpec.replace(/\s+/g, ' ');
      if (!squashedSpec.includes(squashedNeedle)) {
        console.error(`[UNSPECIFIED STRING] "${trimmed}" in HOME_COPY does not exist in KASI_Website_Build_Spec_v2.md!`);
        reverseFailures++;
      }
    }
  }

  if (reverseFailures === 0) {
    console.log('[PASS] 100% of strings in HOME_COPY are verified against the spec or approved UI entities.');
  } else {
    console.error(`❌ [FAIL] ${reverseFailures} string(s) in HOME_COPY are not found in the spec.`);
    failed += reverseFailures;
  }

  console.log(`\nVerified ${passed}/${REQUIRED_SPEC_COPY.length} required spec strings.`);

  if (failed > 0) {
    console.error(`\n❌ check-copy failed with ${failed} issue(s).`);
    process.exit(1);
  } else {
    console.log('✅ check-copy PASSED flawlessly!');
  }
}

main().catch((err) => {
  console.error('Fatal error in check-copy:', err);
  process.exit(1);
});
