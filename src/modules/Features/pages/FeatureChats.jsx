// spec 09
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeatureChats() {
  return (
    <FeaturePageTemplate
      specId="09"
      badge="CHATS & CONTROL"
      headlinePart1="Hands-off,"
      highlightText="but never in the dark."
      headlinePart2=""
      sub="Watch every chat as it happens, read a one-line summary of where each buyer stands, and step in with a single instruction. Kasi runs the counter; you stay the owner."
      screenshot="/images/chats.png"
      screenshotAlt="Kasi Live Chats and Conversation Oversight UI"
      screenshotCaption="Live Chats with thread summary and 'Instruct Kasi': read the whole conversation, steer it with one line, or mute Kasi to reply yourself."
      problemHeading="Automate the replies. Keep the wheel."
      problemBody="Rigid menu bots frustrate buyers who just want to ask a normal question in English or Pidgin. Kasi shows you every thread live so you can send a quick whisper instruction or reply directly whenever a conversation needs your personal touch."
      movesTitle="Four controls inside every thread"
      moves={[
        {
          title: "Unified Channel Inbox",
          desc: "Every active conversation from WhatsApp, Instagram Direct, Messenger, and Telegram appears in one chronological list.",
        },
        {
          title: "One-Line Thread Summary",
          desc: "See immediately what items are in the buyer's cart, what price was quoted, and whether they chose pickup or delivery.",
        },
        {
          title: "Instruct Kasi",
          desc: "Type a plain note ('give her ₦1,500 off', 'red size 42 is finished') and Kasi works it naturally into its next reply.",
        },
        {
          title: "Direct Manual Reply",
          desc: "Click Mute Kasi to message the customer yourself, then unmute when you want Kasi to finish checkout.",
        },
      ]}
      controlsTitle="Operational details"
      controls={[
        {
          title: "Automatic Handoff Flags",
          desc: "Requests for refunds, complaints, or out-of-radius pins flag the chat as 'Requires Attention' and pause auto-replies.",
        },
        {
          title: "Buyer Order History Alongside Chat",
          desc: "Past paid invoices and saved delivery addresses sit right next to the active thread.",
        },
        {
          title: "Staff Oversight Without Phone Sharing",
          desc: "Your team can monitor and pack orders from the web workspace while your SIM stays in your pocket.",
        },
      ]}
      ctaHeading="See every chat. Step in anytime."
      ctaSub="Connect your WhatsApp or Instagram shop and test 'Instruct Kasi' on a real thread."
    />
  );
}

export default FeatureChats;
