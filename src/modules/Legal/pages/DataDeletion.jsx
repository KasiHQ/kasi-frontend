import React from 'react';
import LegalLayout, { LegalSection } from './LegalLayout';

const DataDeletion = () => (
  <LegalLayout eyebrow="Data deletion" title="User Data Deletion Instructions" updated="June 9, 2026">
    <LegalSection title="How to request deletion">
      <p>
        To request deletion of data associated with your Kasi AI account or Meta
        connection, email <a className="font-semibold text-[#1A7A4A] hover:underline" href="mailto:support@usekasi.com">support@usekasi.com</a> from the email
        address connected to your Kasi account. Include your business name, the
        Facebook Page or Instagram Business account you connected, and the words
        "Data deletion request" in the subject line.
      </p>
      <p>
        If you are a customer who messaged a vendor using Kasi, include the
        messaging channel, approximate date of the conversation, and the vendor
        or business name so we can locate the relevant records.
      </p>
    </LegalSection>

    <LegalSection title="Disconnecting Meta access">
      <p>
        Vendors can disconnect Facebook Messenger or Instagram from Kasi in the
        dashboard under Settings, then Integrations. You can also remove Kasi
        from your Facebook or Instagram app settings. Disconnecting removes the
        stored integration token from Kasi and stops Kasi from receiving new
        messages for that connected channel.
      </p>
    </LegalSection>

    <LegalSection title="What we delete">
      <p>
        After verification, we will delete or anonymize personal data associated
        with the request where reasonably possible, including connected Meta
        tokens, integration identifiers, profile details, conversation records,
        customer records, and related operational data.
      </p>
      <p>
        Some records may be retained where needed for security, fraud
        prevention, dispute resolution, accounting, legal compliance, or backup
        integrity. Retained records will be limited to the purpose that requires
        retention.
      </p>
    </LegalSection>

    <LegalSection title="Response timing">
      <p>
        We aim to acknowledge deletion requests promptly and complete verified
        requests within a reasonable period, subject to identity verification,
        technical constraints, and legal or operational retention requirements.
      </p>
    </LegalSection>
  </LegalLayout>
);

export default DataDeletion;
