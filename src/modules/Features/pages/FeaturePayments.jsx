// spec 08
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeaturePayments() {
  return (
    <FeaturePageTemplate
      specId="08"
      badge="PAYMENTS & CHECKOUT"
      headlinePart1="Paid means paid."
      highlightText="Kasi knows the moment"
      headlinePart2="it happens."
      sub="Kasi sends a secure Paystack checkout, and the instant payment clears it confirms to the customer and moves the order forward. No manual checking, no fake 'I've paid' screenshots slipping through."
      screenshot="/images/sales & finance.png"
      screenshotAlt="Kasi Payments, Paystack Reconciliation, and Sales Ledger UI"
      screenshotCaption="Paystack webhook verification: order states advance strictly on confirmed funds, never customer claims."
      problemHeading="The fake transfer screenshot nightmare"
      problemBody="Waiting 20 minutes for bank app alerts, chasing screenshots, or losing merchandise to fake payment notifications kills operations. Kasi automates the verification directly through official Paystack webhooks."
      movesTitle="How in-chat payment checkout works"
      moves={[
        {
          title: "Order Total Locked",
          desc: "Products, selected variants, and distance delivery fee are compiled into a secure checkout summary.",
        },
        {
          title: "Paystack Link Delivered",
          desc: "Customer receives a one-click Paystack link directly in their WhatsApp or Instagram thread.",
        },
        {
          title: "Automated Webhook Confirmation",
          desc: "The second payment clears Paystack, our backend receives confirmation and validates the order.",
        },
        {
          title: "Immediate Queue Advancement",
          desc: "Customer gets instant receipt confirmation, and order lands in your kitchen or warehouse queue.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "Zero Manual Reconciliation",
          desc: "No toggling between your banking app and chat while customers wait impatiently.",
        },
        {
          title: "Tied to Customer Profile",
          desc: "Every transaction links to customer name and phone for accurate repeat tracking.",
        },
        {
          title: "Direct Merchant Settlement",
          desc: "Payouts settle directly into your bank account through Paystack's official rails.",
        },
      ]}
      ctaHeading="Stop chasing payment screenshots."
      ctaSub="Start accepting automated, verified payments right in your customer conversations."
    />
  );
}

export default FeaturePayments;
