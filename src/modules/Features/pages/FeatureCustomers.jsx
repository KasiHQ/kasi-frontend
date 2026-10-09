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
      sub="Kasi saves who they are, what they bought, and where they are in the buying journey. Your customer list builds itself while you sell."
      screenshot="/images/customer database.png"
      screenshotAlt="Kasi Customer Database and Social CRM UI"
      screenshotCaption="Customer CRM with lead stages: your whole customer base, sorted by how close they are to buying."
      problemHeading="Stop letting social chats disappear into the void"
      problemBody="Thousands of customers message your Instagram and WhatsApp every month, but without a CRM they vanish as new chats arrive. Kasi turns every inquiry into a lasting customer profile."
      movesTitle="What Kasi captures automatically"
      moves={[
        {
          title: "Automatic Customer Profiles",
          desc: "Names, phone numbers, delivery addresses, and full order history are saved organically from chat messages.",
        },
        {
          title: "Dynamic Lead Stages",
          desc: "Categorizes contacts into stages: New Inquiry, In Negotiation, Paid, Fulfilled, and Loyal Repeat Buyer.",
        },
        {
          title: "Instant Context On Return",
          desc: "When a customer returns weeks later, Kasi welcomes them back and references their previous orders.",
        },
        {
          title: "Warm Buyer Re-engagement",
          desc: "Identify warm shoppers who browsed but didn't check out, and re-engage them when new stock arrives.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "Zero Manual Entry",
          desc: "No copying phone numbers or pasting into Excel sheets after long working days.",
        },
        {
          title: "A Business Asset You Own",
          desc: "Your customer contacts belong to you, ready for export or outreach anytime.",
        },
        {
          title: "Cheaper Repeat Sales",
          desc: "Repeat buyers cost zero ad spend to reach and convert 3x faster than cold traffic.",
        },
      ]}
      ctaHeading="Build your customer list on autopilot."
      ctaSub="Start transforming anonymous chats into long-term customer relationships."
    />
  );
}

export default FeatureCustomers;
