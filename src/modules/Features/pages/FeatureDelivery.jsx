// spec 07
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeatureDelivery() {
  return (
    <FeaturePageTemplate
      specId="07"
      badge="DELIVERY & PRICING"
      headlinePart1="The right delivery fee,"
      highlightText="before they pay."
      headlinePart2="Every time."
      sub="Kasi asks for the customer's live location and a written description, works out the distance, and adds a fair fee to checkout. No guessing, no losses, no 'the rider says it's more.'"
      screenshot="/images/dashboard.png"
      screenshotAlt="Kasi Delivery Fee Calculation and Logistics UI"
      screenshotCaption="Dynamic delivery fee computation: distance-calculated and locked into checkout before payment is made."
      problemHeading="Stop losing money on delivery you underpriced."
      problemBody="Vendors lose tens of thousands every month guessing delivery rates, arguing with riders, or eating the cost when a customer lives further than expected. Kasi solves logistics before the invoice is sent."
      movesTitle="How live delivery calculation works"
      moves={[
        {
          title: "Live Location Capture",
          desc: "Customer easily sends their live WhatsApp pin directly within the chat conversation.",
        },
        {
          title: "Detailed Address Description",
          desc: "Captures building number, estate gate, street, and landmarks so riders find the door immediately.",
        },
        {
          title: "Distance Fee Computed",
          desc: "Kasi computes the exact distance from your store to customer address and applies your rate formula.",
        },
        {
          title: "Added to In-Chat Checkout",
          desc: "Product subtotal and delivery fee are bundled into a single Paystack checkout link.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "Distance-Based",
          desc: "Short trips stay affordable while long-distance deliveries are completely covered.",
        },
        {
          title: "Locked In Before Pay",
          desc: "You never have to message back asking for extra delivery money.",
        },
        {
          title: "Your Own Rates",
          desc: "Set your own starting base fares, kilometer tiers, and free delivery thresholds.",
        },
      ]}
      ctaHeading="Stop losing money on delivery you underpriced."
      ctaSub="Automate logistics pricing and make every delivery smooth and profitable."
    />
  );
}

export default FeatureDelivery;
