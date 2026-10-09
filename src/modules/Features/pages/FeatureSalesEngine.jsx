// spec 05
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeatureSalesEngine() {
  return (
    <FeaturePageTemplate
      specId="05"
      badge="SALES ENGINE"
      headlinePart1="A salesperson who"
      highlightText="never sleeps,"
      headlinePart2="never forgets, and never goes off-script."
      sub="The Sales Engine is the brain behind every Kasi chat. It greets, recommends, negotiates inside the limits you set, and closes the order with payment taken. In your voice, at your prices."
      screenshot="/images/products & store.png"
      screenshotAlt="Kasi Store & Product Negotiation Engine UI"
      screenshotCaption="Store & product view with negotiation pricing fields: set your start, happy, and floor once; Kasi respects them in every chat."
      problemHeading="Most sales die in the gap between 'hi' and 'how much?'"
      problemBody="A customer messages at 11pm. You reply at 8am. They have moved on. Or you are cooking, driving, serving, and forty chats stack up unanswered. The Sales Engine closes that gap to seconds, every time, without a single message going cold."
      movesTitle="How it actually sells: the four moves"
      moves={[
        {
          title: "It understands, then recommends",
          desc: "Kasi reads what the customer actually wants and answers with real options: product, short description, price, and images. Returning customers are recognized in context.",
        },
        {
          title: "It negotiates, inside your rules",
          desc: "You set fixed pricing or a negotiation band (starting price, happy price, and floor). Kasi holds the top, gives ground only when necessary, and never sells below your floor.",
        },
        {
          title: "It closes: pickup or delivery",
          desc: "Once price is settled, Kasi captures pickup instructions or live delivery location, calculating exact distance delivery fees before checkout.",
        },
        {
          title: "It takes the money, and knows it landed",
          desc: "Sends secure Paystack checkout. The instant Paystack confirms via webhook, Kasi notifies the customer and moves the order into fulfilment.",
        },
      ]}
      controlsTitle="What you stay in control of"
      controls={[
        {
          title: "Your Prices",
          desc: "Fixed or negotiable, minimum price floor is never breached.",
        },
        {
          title: "Your Voice",
          desc: "Human, simple, local tone. No emoji spam or robotic scripts.",
        },
        {
          title: "Your Override",
          desc: "Jump into any conversation and steer Kasi with one instruction.",
        },
      ]}
      ctaHeading="Let it close your next sale."
      ctaSub="Connect your shop in minutes and never leave another customer waiting on read."
    />
  );
}

export default FeatureSalesEngine;
