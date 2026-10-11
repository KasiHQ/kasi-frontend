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
      sub="Watch every chat as it happens, read a one-line AI summary of where each one is, and step in with a single instruction. Kasi runs the floor; you stay the owner."
      screenshot="/images/chats.png"
      screenshotAlt="Kasi Live Chats and AI Conversation Oversight UI"
      screenshotCaption="Live Chats with AI summary + 'Instruct Kasi': see the whole conversation, nudge it with one line, and never lose the thread."
      problemHeading="Automate the work. Keep the wheel."
      problemBody="Most bots are rigid black boxes that frustrate customers and embarrass your brand. Kasi gives you a live dashboard and full control: see every message live, give one-line instructions, or jump in yourself anytime."
      movesTitle="Total control in four capabilities"
      moves={[
        {
          title: "Live Unified Inbox",
          desc: "Every conversation across WhatsApp, Instagram, and Telegram in a single fast, synchronized inbox.",
        },
        {
          title: "AI Summary Per Chat",
          desc: "One glance tells you where each customer is: inquiring, negotiating, checking delivery, or paid.",
        },
        {
          title: "Instruct Kasi",
          desc: "Type a quick command ('give 5% off', 'this size is out of stock') and Kasi carries it out in natural conversation.",
        },
        {
          title: "Instant Seamless Takeover",
          desc: "Jump into the conversation as yourself. When you're finished, hand the chat right back to Kasi.",
        },
      ]}
      controlsTitle="Why it matters"
      controls={[
        {
          title: "Zero Swapping Apps",
          desc: "No more toggling between WhatsApp Business, Instagram apps, and separate devices.",
        },
        {
          title: "Customer Context",
          desc: "View customer order history and previous preferences directly alongside the chat.",
        },
        {
          title: "Team Collaboration",
          desc: "Your staff can review conversation logs without needing direct access to your personal phone.",
        },
      ]}
      ctaHeading="Automate the work. Keep the wheel."
      ctaSub="Experience the power of autonomous commerce with total oversight."
    />
  );
}

export default FeatureChats;
