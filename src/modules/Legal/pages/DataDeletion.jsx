import React from 'react';
import LegalLayout, { LegalSection } from './LegalLayout';

const DataDeletion = () => (
  <LegalLayout eyebrow="Data deletion" title="User Data Deletion Instructions" updated="August 28, 2026">
    <LegalSection title="Overview">
      <p>
        In compliance with Meta Platform Policies, GDPR, and global data privacy standards, users and vendors who connect their WhatsApp Business API, Facebook Messenger, or Instagram accounts to Kasi AI can request the complete deletion of their data at any time.
      </p>
    </LegalSection>

    <LegalSection title="3 Ways to Delete Your Data">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700">
          <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Option 1: In-App Disconnection (Instant)</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Log into your Kasi dashboard, go to <strong>Settings &gt; Integrations</strong>, and click <strong>Disconnect</strong> next to WhatsApp, Instagram, or Facebook. This immediately deletes the stored access tokens and halts all webhook event processing.
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700">
          <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Option 2: Meta Business Manager Removal</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Go to <a className="text-[#1A7A4A] underline" href="https://business.facebook.com" target="_blank" rel="noreferrer">business.facebook.com</a> &gt; <em>Business Settings &gt; Integrations &gt; Connected Apps</em>, locate <strong>Kasi Link</strong>, and click <strong>Remove</strong>. Meta will immediately revoke access and notify our servers.
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700">
          <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Option 3: Email Deletion Request</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Send an email to <a className="text-[#1A7A4A] font-semibold underline" href="mailto:support@usekasi.com">support@usekasi.com</a> with the subject line <strong>DELETE</strong> or <strong>Data Deletion Request</strong>. Include your business name, connected phone number or Page ID, and email address.
          </p>
        </div>
      </div>
    </LegalSection>

    <LegalSection title="What We Delete & Retention Timelines">
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <li><strong>Access Tokens & Credentials:</strong> Deleted from active servers within <strong>7 days</strong> of disconnection.</li>
        <li><strong>Message Content & Transcripts:</strong> Purged from conversational logs within <strong>90 days</strong> (or immediately upon manual request).</li>
        <li><strong>Customer & Order Records:</strong> Anonymized or deleted upon request, except where retention is strictly required for tax, accounting, or legal compliance.</li>
      </ul>
    </LegalSection>

    <LegalSection title="Confirmation & Support">
      <p>
        For inquiries regarding data privacy or to check the status of a deletion request, please reach out to our data privacy team at <a className="font-semibold text-[#1A7A4A] hover:underline" href="mailto:support@usekasi.com">support@usekasi.com</a>.
      </p>
    </LegalSection>
  </LegalLayout>
);

export default DataDeletion;

