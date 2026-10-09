import fs from 'fs';
import path from 'path';

/**
 * check-copy.ts
 * Parses and verifies that all required [COPY] strings from KASI_Website_Build_Spec_v2.md
 * for the homepage and global components are accurately present in content/home.ts and rendered files.
 */

const REQUIRED_SPEC_COPY = [
  // Section 2.2
  { section: '2.2', label: 'Positioning Headline', needle: 'Selling on social was never the problem' },
  { section: '2.2', label: 'Positioning Headline Part 2', needle: 'Keeping up with it was' },
  { section: '2.2', label: 'Positioning Body', needle: 'Kasi replies in seconds, at 2pm or 2am, in the customer\'s own words' },
  { section: '2.2', label: 'Positioning Wake Up', needle: 'You wake up to prepared orders, not a backlog of' },

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
  { section: '2.4', label: 'Product Proof Row 1', needle: 'Watch every conversation. Step in with one line whenever you want.' },
  { section: '2.4', label: 'Product Proof Row 2', needle: 'Paid orders, one list, one next action each.' },

  // Section 2.5
  { section: '2.5', label: 'Audience Heading', needle: 'Made for shops with real volume.' },
  { section: '2.5', label: 'Audience Sub', needle: 'If your DMs and WhatsApp are busy enough that replies fall through, Kasi is built for you.' },
  { section: '2.5', label: 'Category Food', needle: 'Food & kitchens' },
  { section: '2.5', label: 'Category Fashion', needle: 'Fashion & thrift' },
  { section: '2.5', label: 'Category Gadgets', needle: 'Gadgets & accessories' },
  { section: '2.5', label: 'Category Jewelry', needle: 'Jewelry' },
  { section: '2.5', label: 'Category Skincare', needle: 'Skincare & beauty' },

  // Section 2.6
  { section: '2.6', label: 'Step 1', needle: 'Link WhatsApp or Instagram in minutes.' },
  { section: '2.6', label: 'Step 2', needle: 'Add products, prices, delivery rules.' },
  { section: '2.6', label: 'Step 3', needle: 'It chats, closes, takes payment.' },
  { section: '2.6', label: 'Step 4', needle: 'Prepare and hand off. Done.' },
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

  // Spec 01 Footer
  { section: '01', label: 'Footer Sign-off', needle: 'Kasi is a product of Endogenous Technologies. Built in Nigeria, for the businesses that run on WhatsApp. © 2026 Endogenous Technologies Ltd.' },
];

function main() {
  console.log('📜 Running check-copy.ts: verifying spec copy against built modules...\n');

  const homeContentPath = path.resolve(process.cwd(), 'src/content/home.ts');
  const footerPath = path.resolve(process.cwd(), 'src/components/common/GlobalFooter.jsx');

  const homeContent = fs.readFileSync(homeContentPath, 'utf-8');
  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const aggregateCorpus = (homeContent + '\n' + footerContent).replace(/\\"/g, '"');

  let passed = 0;
  let failed = 0;

  for (const item of REQUIRED_SPEC_COPY) {
    const isPresent = aggregateCorpus.includes(item.needle);

    if (isPresent) {
      console.log(`[PASS] Spec ${item.section.padEnd(4)} | ${item.label.padEnd(28)}: "${item.needle.slice(0, 45)}..."`);
      passed++;
    } else {
      console.error(`[FAIL] Spec ${item.section.padEnd(4)} | ${item.label.padEnd(28)}: Missing "${item.needle}"`);
      failed++;
    }
  }

  console.log(`\nVerified ${passed}/${REQUIRED_SPEC_COPY.length} copy strings.`);

  if (failed > 0) {
    console.error(`❌ check-copy failed: ${failed} spec copy string(s) missing!`);
    process.exit(1);
  } else {
    console.log('✅ check-copy passed: 100% of required spec copy matches verbatim.');
  }
}

main();
