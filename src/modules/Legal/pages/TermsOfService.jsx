import React from 'react';
import LegalLayout, { LegalSection } from './LegalLayout';

const TermsOfService = () => (
  <LegalLayout eyebrow="Terms" title="Terms of Service" updated="June 9, 2026">
    <LegalSection title="1. Agreement">
      <p>
        These Terms of Service govern access to and use of Kasi AI, a social
        commerce sales assistant operated by Endogenous Technologies ("Kasi",
        "we", "us", or "our"). By creating an account or using Kasi, you agree
        to these terms.
      </p>
    </LegalSection>

    <LegalSection title="2. Use of Kasi">
      <p>
        Kasi helps vendors manage sales conversations, product catalogs,
        invoices, payments, bookings, logistics, and connected messaging
        channels. You are responsible for your account, business information,
        instructions, pricing rules, customer commitments, and compliance with
        laws that apply to your business.
      </p>
    </LegalSection>

    <LegalSection title="3. Connected platforms">
      <p>
        If you connect Facebook, Instagram, WhatsApp, Telegram, Paystack, or any
        other third-party service, you authorize Kasi to access and use the
        connected service only as needed to provide the features you enable. You
        must comply with the terms and policies of those third-party services.
      </p>
    </LegalSection>

    <LegalSection title="4. AI output">
      <p>
        Kasi may generate automated messages, summaries, invoice drafts, order
        details, and workflow suggestions. AI output can be imperfect. You are
        responsible for reviewing your settings, monitoring important
        conversations, honoring customer-facing commitments, and correcting any
        inaccurate output.
      </p>
    </LegalSection>

    <LegalSection title="5. Prohibited use">
      <p>
        You may not use Kasi to break the law, deceive customers, send spam,
        infringe rights, sell prohibited goods or services, misuse platform
        data, interfere with the service, attempt unauthorized access, or upload
        malicious content.
      </p>
    </LegalSection>

    <LegalSection title="6. Fees and payments">
      <p>
        Paid features, subscriptions, trials, and billing terms will be shown in
        the product or checkout flow. Payment processing may be handled by
        third-party providers. You are responsible for taxes, chargebacks, and
        payment disputes connected to your business.
      </p>
    </LegalSection>

    <LegalSection title="7. Service availability">
      <p>
        We work to keep Kasi reliable, but we do not guarantee uninterrupted or
        error-free service. Features may depend on third-party platforms,
        network availability, app review status, API limits, and external
        service changes.
      </p>
    </LegalSection>

    <LegalSection title="8. Limitation of liability">
      <p>
        To the maximum extent permitted by law, Kasi is provided "as is" and we
        are not liable for indirect, incidental, special, consequential, or
        punitive damages, or for lost profits, revenue, data, goodwill, or
        business opportunities.
      </p>
    </LegalSection>

    <LegalSection title="9. Changes and termination">
      <p>
        We may update these terms or modify, suspend, or discontinue parts of
        Kasi. You may stop using Kasi at any time. We may suspend or terminate
        accounts that violate these terms, create risk, or misuse the service.
      </p>
    </LegalSection>

    <LegalSection title="10. Contact">
      <p>
        Questions about these terms can be sent to <a className="font-semibold text-[#1A7A4A] hover:underline" href="mailto:support@usekasi.com">support@usekasi.com</a>.
      </p>
    </LegalSection>
  </LegalLayout>
);

export default TermsOfService;
