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
      sub="Your buyers keep using WhatsApp, Instagram, Messenger, and Telegram. Every channel reads from the same catalog and lands in one inbox."
      screenshot="/images/platforms.png"
      screenshotAlt="Kasi Connected Channels Management UI"
      screenshotCaption="Channel settings: Meta WhatsApp Cloud API, Instagram Direct, Messenger, and Telegram Bot connected to one inventory."
      problemHeading="Stop splitting stock across four separate apps"
      problemBody="When buyers DM on Instagram while others message on WhatsApp, it is easy to sell the last unit twice or miss a thread completely. Kasi deducts from one shared stock count the moment Paystack confirms."
      movesTitle="Supported messaging & payment channels"
      moves={[
        {
          title: "Meta WhatsApp Cloud API",
          desc: "Recommended primary connection using Meta's official Cloud API with support for visual PNG receipts and approved templates.",
        },
        {
          title: "Instagram Direct",
          desc: "Connects via Meta Graph API v21.0 to answer product DMs, recognize catalog screenshots, and send checkout links.",
        },
        {
          title: "Facebook Messenger",
          desc: "Links your Facebook Page inbox so commenters and page visitors can negotiate and pay in-thread.",
        },
        {
          title: "Telegram Bot API",
          desc: "Connect any @BotFather token in seconds with instant webhook registration and full catalog access.",
        },
      ]}
      controlsTitle="Why it holds up under volume"
      controls={[
        {
          title: "Shared Stock Lock",
          desc: "Change a price or sell the last unit on WhatsApp and Instagram reflects the new stock count immediately.",
        },
        {
          title: "Official Meta & Paystack Webhooks",
          desc: "Every inbound Meta and Paystack payload is verified via HMAC cryptographic signatures.",
        },
        {
          title: "Quick Pairing Sandbox Included",
          desc: "Need to prototype in 60 seconds before Meta verification? Pair a test number via 8-digit code, then switch to Cloud API for long-term scale.",
        },
      ]}
      ctaHeading="Link your first channel in minutes."
      ctaSub="Connect WhatsApp, Instagram, or Telegram and manage every buyer from one counter."
    />
  );
}

export default FeaturePlatforms;
