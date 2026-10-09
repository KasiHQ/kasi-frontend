// spec 11
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeatureAnalytics() {
  return (
    <FeaturePageTemplate
      specId="11"
      badge="ANALYTICS & BOOKINGS"
      headlinePart1="Know what's selling."
      highlightText="Book what's next."
      headlinePart2=""
      sub="Kasi turns your chats and orders into clear numbers, and handles bookings for services, so a salon, a clinic, or a studio runs on the same system as a store."
      screenshot="/images/analytics.png"
      screenshotAlt="Kasi Analytics and Service Booking Interface"
      screenshotCaption="Real-time revenue charts, conversion drop-off insights, and automated booking schedules."
      problemHeading="Sell time, not just things."
      problemBody="If you provide services or take appointments, Kasi manages the calendar right inside the chat: offering open slots, taking deposits through Paystack, and sending automatic reminders so clients actually show up."
      movesTitle="Analytics and booking capabilities"
      moves={[
        {
          title: "Clear Sales & Revenue Metrics",
          desc: "Track total revenue, average order value, and daily sales trends with zero complicated financial jargon.",
        },
        {
          title: "Chat Conversion Funnels",
          desc: "Understand exactly what percentage of incoming inquiries convert into paying customers.",
        },
        {
          title: "Top Products & Demand Insights",
          desc: "See which items receive the highest inquiries and sales so you restock inventory with confidence.",
        },
        {
          title: "In-Chat Service Appointments",
          desc: "Kasi presents available calendar slots, collects appointment deposits via Paystack, and confirms bookings.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "Actionable Clarity",
          desc: "Understand exactly which marketing posts and channels drive paying revenue.",
        },
        {
          title: "Reduce Costly No-Shows",
          desc: "Automated deposit requirements ensure clients commit and respect your business time.",
        },
        {
          title: "Automated Calendar Sync",
          desc: "Set your working hours and buffer periods with zero double-booking risks.",
        },
      ]}
      ctaHeading="Gain total clarity on your business numbers."
      ctaSub="Start tracking sales trends and automating your appointments today."
    />
  );
}

export default FeatureAnalytics;
