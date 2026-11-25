// spec 10
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeatureCustomers() {
  return (
    <FeaturePageTemplate
      specId="10"
      badge="CUSTOMERS / CRM"
      headlinePart1="Every chat becomes a"
      highlightText="customer you can keep."
      headlinePart2=""
      sub="Kasi saves who they are, what they bought, and where they stopped in the conversation. Your buyer directory updates itself with every order."
      screenshot="/images/customer database.png"
      screenshotAlt="Kasi Customer Directory and CRM UI"
      screenshotCaption="Customer directory sorted by New, Regular, and VIP segments with verified spend totals."
      problemHeading="Stop losing buyer records inside old chat threads"
      problemBody="Hundreds of people message your WhatsApp and Instagram every month, then get buried under newer chats. Kasi logs each buyer's name, phone number, address, and verified spend automatically."
      movesTitle="What gets recorded from every chat"
      moves={[
        {
          title: "Verified Contact & Address Records",
          desc: "Names, phone numbers, delivery pins, and past invoices are linked automatically as orders close.",
        },
        {
          title: "Behavioral Buyer Segments",
          desc: "Groups contacts into New, Regular, and VIP tiers based on verified paid order counts and total spend.",
        },
        {
          title: "Memory When Buyers Return",
          desc: "When a repeat buyer messages weeks later, Kasi sees their previous purchases and saved address context.",
        },
        {
          title: "Targeted Restock Broadcasts",
          desc: "Filter past buyers or open inquiries and notify them when fresh stock lands, with built-in pacing.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "No Late-Night Spreadsheet Entry",
          desc: "Stop copying phone numbers and addresses out of WhatsApp into notebooks after closing.",
        },
        {
          title: "Records You Own & Export",
          desc: "Export your customer directory and invoice history as CSV whenever your accountant needs it.",
        },
        {
          title: "Direct Repeat Orders",
          desc: "Reach people who already trust your quality without paying for another social ad click.",
        },
      ]}
      ctaHeading="Keep every buyer who messages your shop."
      ctaSub="Link your channels and start building an organized buyer ledger from day one."
    />
  );
}

export default FeatureCustomers;
