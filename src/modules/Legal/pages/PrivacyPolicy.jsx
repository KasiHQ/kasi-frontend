import React from 'react';
import LegalLayout, { LegalSection } from './LegalLayout';

const PrivacyPolicy = () => (
  <LegalLayout eyebrow="Privacy" title="Privacy Policy" updated="June 9, 2026">
    <LegalSection title="1. Who we are">
      <p>
        Kasi AI is a social commerce sales assistant operated by Endogenous Technologies
        ("Kasi", "we", "us", or "our"). This policy explains how we collect,
        use, disclose, and protect information when vendors, customers, and site
        visitors use Kasi through our website, dashboard, and connected messaging
        channels.
      </p>
      <p>
        Contact us about privacy at <a className="font-semibold text-[#1A7A4A] hover:underline" href="mailto:support@usekasi.com">support@usekasi.com</a>.
      </p>
    </LegalSection>

    <LegalSection title="2. Information we collect">
      <p>
        We collect account information such as names, business names, email
        addresses, phone numbers, passwords, business profile details, catalog
        data, service listings, invoices, bookings, payment records, customer
        records, logistics details, and support messages.
      </p>
      <p>
        When a vendor connects Meta channels, we may receive Facebook Page IDs,
        Instagram Business Account IDs, Page names, permissions granted to Kasi,
        access tokens, message sender IDs, message content, attachments, and
        webhook events needed to receive and respond to Facebook Messenger and
        Instagram DM conversations.
      </p>
      <p>
        We also collect technical information such as device type, browser type,
        IP address, pages viewed, timestamps, log data, and security events.
      </p>
    </LegalSection>

    <LegalSection title="3. How we use information">
      <p>
        We use information to create and secure accounts, operate the vendor
        dashboard, connect social channels, automate customer conversations,
        generate invoices, reconcile payments, coordinate bookings or logistics,
        provide support, improve Kasi, prevent fraud, and comply with applicable
        obligations.
      </p>
      <p>
        For Meta integrations, we use Meta platform data only to provide the
        vendor-requested messaging automation and account connection features.
        We do not sell Meta platform data.
      </p>
    </LegalSection>

    <LegalSection title="4. AI processing">
      <p>
        Kasi uses AI systems to understand vendor instructions, product catalogs,
        customer messages, images sent in conversations, pricing rules, booking
        preferences, and order context. AI output may be used to draft or send
        replies, create invoices, summarize conversations, and assist with sales
        workflows.
      </p>
      <p>
        Vendors are responsible for configuring Kasi accurately and reviewing
        sensitive workflows where human approval is appropriate.
      </p>
    </LegalSection>

    <LegalSection title="5. Sharing information">
      <p>
        We share information with service providers that help us host the app,
        store data, send emails, process payments, operate messaging channels,
        provide analytics, maintain security, and deliver customer support.
      </p>
      <p>
        We may disclose information if required by law, to protect rights and
        safety, to investigate abuse, or as part of a business transaction such
        as a merger, acquisition, financing, or asset transfer.
      </p>
    </LegalSection>

    <LegalSection title="6. Data retention">
      <p>
        We keep information for as long as needed to provide Kasi, maintain
        business records, resolve disputes, enforce agreements, prevent fraud,
        and meet legal or operational requirements. Vendors may disconnect Meta
        integrations at any time from the dashboard, which removes the connected
        integration token from Kasi.
      </p>
    </LegalSection>

    <LegalSection title="7. Security">
      <p>
        We use technical and organizational safeguards designed to protect
        information, including access controls, encrypted transport, token
        handling controls, logging, and restricted administrative access. No
        internet service can guarantee absolute security.
      </p>
    </LegalSection>

    <LegalSection title="8. Your choices and deletion requests">
      <p>
        You may request access, correction, export, disconnection, or deletion of
        your information by contacting <a className="font-semibold text-[#1A7A4A] hover:underline" href="mailto:support@usekasi.com">support@usekasi.com</a>.
        We may need to verify your identity before acting on a request.
      </p>
      <p>
        Meta-connected users can also review or remove app access through their
        Facebook or Instagram settings. Our data deletion instructions are
        available at <a className="font-semibold text-[#1A7A4A] hover:underline" href="/data-deletion">usekasi.com/data-deletion</a>.
      </p>
    </LegalSection>

    <LegalSection title="9. International use">
      <p>
        Kasi is operated from Nigeria and may use service providers in other
        countries. By using Kasi, you understand that information may be
        processed in locations outside your country of residence.
      </p>
    </LegalSection>

    <LegalSection title="10. Updates">
      <p>
        We may update this policy as Kasi evolves or as legal, operational, or
        platform requirements change. The updated date above shows when the
        policy was last revised.
      </p>
    </LegalSection>
  </LegalLayout>
);

export default PrivacyPolicy;
