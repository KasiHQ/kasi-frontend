// spec 12
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeaturePlatforms() {
  return (
    <FeaturePageTemplate
      specId="12"
      badge="PLATFORMS & INTEGRATIONS"
      headlinePart1="Wherever your customers message you,"
      highlightText="Kasi is already there."
      headlinePart2=""
      sub="One brain, every channel. Your customers keep using the apps they know. You run it all from one place."
      screenshot="/images/platforms.png"
      screenshotAlt="Kasi Platforms and Connected Channels Management UI"
      screenshotCaption="Multi-channel connection hub: WhatsApp Cloud API, Instagram Direct, and Telegram operating on one synchronized catalog."
      problemHeading="Stop fracturing your business across separate apps"
      problemBody="Customers message you across WhatsApp, Instagram DMs, and Telegram. Juggling multiple apps causes dropped chats and lost revenue. Kasi unifies every customer rail into one central operating system."
      movesTitle="Official channel integrations"
      moves={[
        {
          title: "WhatsApp Cloud API",
          desc: "Built on Meta's official WhatsApp Business Cloud API. High deliverability, rich media, and 24/7 uptime.",
        },
        {
          title: "Instagram Direct Messaging",
          desc: "Connects to Instagram Graph API to answer story replies, post inquiries, and direct messages instantly.",
        },
        {
          title: "Facebook Messenger",
          desc: "Engage Facebook store visitors directly and drive them straight into an interactive checkout experience.",
        },
        {
          title: "Telegram Commercial Bot",
          desc: "Lightweight, ultra-fast Telegram integration supporting full product catalogs and automated invoices.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "Single Synchronized Catalog",
          desc: "Update a price or product stock once; every channel updates instantaneously.",
        },
        {
          title: "Zero Risk of Bans",
          desc: "Built strictly on official platform partner APIs, never unofficial browser-scraping hacks.",
        },
        {
          title: "Unified Cross-Channel CRM",
          desc: "If a customer messages on WhatsApp today and Instagram tomorrow, their history stays intact.",
        },
      ]}
      ctaHeading="Connect your channels in minutes."
      ctaSub="Unify your customer chats and start selling across every platform."
    />
  );
}

export default FeaturePlatforms;
