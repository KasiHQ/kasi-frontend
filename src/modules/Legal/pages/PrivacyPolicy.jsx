import React from 'react';
import LegalLayout, { LegalSection } from './LegalLayout';

const PrivacyPolicy = () => (
  <LegalLayout eyebrow="Privacy" title="Privacy Policy" updated="August 28, 2026">
    <LegalSection title="1. Who we are">
      <p>
        Kasi AI is an autonomous conversational commerce sales assistant operated by Endogenous Technologies
        ("Kasi", "we", "us", or "our"). This policy explains how we collect,
        use, disclose, and protect information when vendors, customers, and site
        visitors use Kasi through our website, dashboard, and connected messaging
        channels including WhatsApp, Facebook Messenger, and Instagram.
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
        When a vendor connects Meta channels (including WhatsApp Business API via our Tech Provider onboarding, Facebook Messenger, and Instagram DM), we may receive WhatsApp Business Account IDs (WABA IDs), phone numbers, display names, phone number IDs, Facebook Page IDs, Instagram Business Account IDs, Page names, permissions granted to Kasi, access tokens, message sender IDs, message IDs, message content, attachments/media, message status, and webhook events needed to receive and respond to WhatsApp, Messenger, and Instagram conversations.
      </p>
      <p>
        We also collect technical information such as device type, browser type,
        IP address, pages viewed, timestamps, log data, and security events.
      </p>
    </LegalSection>

    <LegalSection title="3. Independent Tech Provider role & WhatsApp Business API">
      <p>
        As an Independent Tech Provider, Kasi acts as a technology service provider to help vendors connect their own WhatsApp Business Accounts. Each vendor's WhatsApp Business Account (WABA) and phone number remains owned by the vendor's business. Kasi accesses WABA data only with the vendor's explicit permission via Meta's Embedded Signup to provide messaging automation, order processing, and conversational sales support.
      </p>
      <p>
        For all Meta platform integrations, we use Meta platform data strictly to provide the vendor-requested messaging automation and account connection features. We do not sell Meta platform data to third parties.
      </p>
    </LegalSection>

    <LegalSection title="4. How we use information">
      <p>
        We use information to create and secure accounts, operate the vendor
        dashboard, connect social channels, automate customer conversations across WhatsApp and Meta channels,
        generate invoices, reconcile payments, coordinate bookings or logistics,
        provide support, improve Kasi, prevent fraud, and comply with applicable
        obligations.
      </p>
    </LegalSection>

    <LegalSection title="5. AI processing">
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

    <LegalSection title="6. Sharing information">
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

    <LegalSection title="7. Data retention & deletion timelines">
      <p>
        We keep information for as long as needed to provide Kasi, maintain
        business records, resolve disputes, enforce agreements, prevent fraud,
        and meet legal or operational requirements. 
      </p>
      <p>
        When a vendor disconnects WhatsApp or Meta channels, authentication tokens are purged from active systems within 7 days, and conversation logs are deleted within 90 days (or immediately upon verified request).
      </p>
    </LegalSection>

    <LegalSection title="8. Security">
      <p>
        We use technical and organizational safeguards designed to protect
        information, including access controls, encrypted transport (HTTPS/TLS), token
        handling controls, logging, and restricted administrative access. No
        internet service can guarantee absolute security.
      </p>
    </LegalSection>

    <LegalSection title="9. Your choices and data deletion instructions">
      <p>
        You may request access, correction, export, disconnection, or deletion of
        your information at any time.
      </p>
      <p>
        <strong>To delete your data:</strong>
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <li><strong>Option 1:</strong> Disconnect WhatsApp, Instagram, or Facebook directly inside the Kasi dashboard under <em>Settings &gt; Integrations</em>.</li>
        <li><strong>Option 2:</strong> Remove Kasi Link from your Meta account via <em>business.facebook.com &gt; Business Settings &gt; Business Integrations</em> or Facebook App Settings.</li>
        <li><strong>Option 3:</strong> Email <a className="font-semibold text-[#1A7A4A] hover:underline" href="mailto:support@usekasi.com">support@usekasi.com</a> with the subject line <strong>DELETE</strong> or <strong>Data Deletion Request</strong>.</li>
      </ul>
      <p className="mt-2">
        Detailed step-by-step instructions are available at <a className="font-semibold text-[#1A7A4A] hover:underline" href="/data-deletion">usekasi.com/data-deletion</a>.
      </p>
    </LegalSection>

    <LegalSection title="10. International use">
      <p>
        Kasi is operated from Nigeria and may use cloud service providers in other
        countries. By using Kasi, you understand that information may be
        processed in locations outside your country of residence.
      </p>
    </LegalSection>

    <LegalSection title="11. Updates">
      <p>
        We may update this policy as Kasi evolves or as legal, operational, or
        platform requirements change. The updated date above shows when the
        policy was last revised.
      </p>
    </LegalSection>
  </LegalLayout>
);

export default PrivacyPolicy;

