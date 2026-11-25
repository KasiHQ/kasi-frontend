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
      sub="Kasi requests the buyer's WhatsApp location pin, calculates real road distance via Google Maps, and locks the delivery fee into the Paystack link before payment."
      screenshot="/images/dashboard.png"
      screenshotAlt="Kasi Road Distance Delivery Calculation UI"
      screenshotCaption="Road-distance delivery calculation rounded to the nearest ₦50 and added before checkout."
      problemHeading="Stop eating the difference on underquoted dispatch"
      problemBody="Flat-rate city guesses lose money whenever traffic or winding roads double the trip distance. Kasi checks actual driving distance and travel time from your store pin before quoting a single Naira."
      movesTitle="How delivery pricing runs in chat"
      moves={[
        {
          title: "Pickup vs Delivery Gate",
          desc: "Before generating any payment link, Kasi asks whether the buyer wants in-store pickup (₦0 fee) or road delivery.",
        },
        {
          title: "WhatsApp Location Pin Check",
          desc: "Buyers tap 'Send Current Location' in WhatsApp so coordinates are exact rather than vague street names.",
        },
        {
          title: "Google Road Distance & Floor Rule",
          desc: "Computes driving distance and traffic duration from your store coordinates, enforces minimum dispatch floor, and rounds up to the nearest ₦50.",
        },
        {
          title: "Bundled Into One Checkout Link",
          desc: "Item subtotal and calculated delivery fee combine into a single Paystack invoice — or escalate to you if outside your delivery radius.",
        },
      ]}
      controlsTitle="What you configure"
      controls={[
        {
          title: "Store Pin & Pickup Address",
          desc: "Pin your exact shop or kitchen coordinates once during onboarding; pickup buyers receive your Google Maps link automatically.",
        },
        {
          title: "Never Quotes ₦0 By Mistake",
          desc: "If a pin fails validation, Kasi blocks payment link creation and asks the buyer to re-share their pin instead of guessing.",
        },
        {
          title: "Radius Escalation",
          desc: "Orders beyond your configured kilometer radius pause and flag you to quote custom interstate shipping.",
        },
      ]}
      ctaHeading="Quote accurate dispatch fees before checkout."
      ctaSub="Set your store coordinates once and let Kasi calculate road distance on every delivery order."
    />
  );
}

export default FeatureDelivery;
