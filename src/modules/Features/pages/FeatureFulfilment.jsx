// spec 06
import React from "react";
import { FeaturePageTemplate } from "../components/FeaturePageTemplate";

export function FeatureFulfilment() {
  return (
    <FeaturePageTemplate
      specId="06"
      badge="FULFILMENT CENTER"
      headlinePart1="Every paid order,"
      highlightText="one list,"
      headlinePart2="one next move."
      sub="No spreadsheets, no 'which order was this again?' Kasi lines up every paid order and tells you the single next thing to do. Tap it. The customer gets told. Move on."
      screenshot="/images/fulfilment & orders.png"
      screenshotAlt="Kasi Fulfilment & Order Pipeline UI"
      screenshotCaption="Orders & Fulfilment pipeline with the phase tracker: packed, dispatched, delivered. The customer hears about each one before you finish tapping."
      problemHeading="Where ecommerce actually breaks down"
      problemBody="Taking money is easy; getting 50 orders packed, addressed, assigned to riders, and kept updated without angry DMs is where shops crumble. Kasi eliminates the confusion with one linear kanban pipeline."
      movesTitle="How orders flow through the pipeline"
      moves={[
        {
          title: "Pickup: Prepared & Ready",
          desc: "Customer gets instant store directions, hours, order confirmation, and pickup instructions.",
        },
        {
          title: "Pickup: Handed Off",
          desc: "Order is marked picked up with one tap, closing the transaction and requesting review.",
        },
        {
          title: "Delivery: Packed & Dispatched",
          desc: "Customer gets notified when packed. On dispatch, the assigned rider's contact is automatically sent.",
        },
        {
          title: "Delivery: Confirmed Delivered",
          desc: "Automatic after-sales satisfaction message sent to customer, closing out the pipeline.",
        },
      ]}
      controlsTitle="What makes it different"
      controls={[
        {
          title: "Only Paid Orders",
          desc: "Unpaid queries never clutter your list. Only verified payments enter fulfilment.",
        },
        {
          title: "Automatic Customer Pings",
          desc: "Every status update triggers a WhatsApp DM so buyers never ask 'where is my order?'",
        },
        {
          title: "Order Comments",
          desc: "Special instructions ride along so whoever prepares the package sees every note.",
        },
      ]}
      ctaHeading="Turn paid into delivered, without the chaos."
      ctaSub="Put your order fulfilment on autopilot and keep every customer happily informed."
    />
  );
}

export default FeatureFulfilment;
