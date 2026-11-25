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
      sub="Kasi turns paid orders and chat threads into readable daily numbers — and manages appointment slots and Paystack deposits for salons, clinics, and studios."
      screenshot="/images/analytics.png"
      screenshotAlt="Kasi Sales Numbers and Service Booking Schedule UI"
      screenshotCaption="Verified revenue totals, SKU demand breakdown, and weekly service availability schedules."
      problemHeading="Built for salons, studios, and clinics too"
      problemBody="Service businesses lose hours going back and forth over open times and no-shows. Kasi checks your weekly schedule inside the chat, collects upfront deposits via Paystack, and locks the slot."
      movesTitle="Numbers and scheduling in one place"
      moves={[
        {
          title: "Verified Revenue & Order Counts",
          desc: "Tracks confirmed Paystack takings, unit counts, and average basket size without counting unpaid inquiries.",
        },
        {
          title: "Inquiry-to-Paid Conversion",
          desc: "Shows where shoppers drop off between initial price inquiry, negotiation, and completed payment.",
        },
        {
          title: "SKU Stock & Demand Signals",
          desc: "Highlights which products get asked about most often and which items are running low on stock.",
        },
        {
          title: "In-Chat Appointment Deposits",
          desc: "Shares open dates from your weekly availability table, collects fixed or percentage deposits, and records in-shop or home service bookings.",
        },
      ]}
      controlsTitle="Operational safeguards"
      controls={[
        {
          title: "Channel Attribution",
          desc: "See whether WhatsApp, Instagram, or Telegram brings in your highest-paying buyers.",
        },
        {
          title: "Upfront Deposit Rules",
          desc: "Require full payment or a deposit before locking a calendar slot so no-shows stop costing you slots.",
        },
        {
          title: "Weekly Hours & Buffers",
          desc: "Toggle working days and opening hours per day of the week directly from settings.",
        },
      ]}
      ctaHeading="See daily takings and booked slots clearly."
      ctaSub="Run product orders or deposit-backed service appointments from the same workspace."
    />
  );
}

export default FeatureAnalytics;
