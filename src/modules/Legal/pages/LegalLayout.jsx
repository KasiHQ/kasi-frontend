import React from 'react';
import { Link } from 'react-router-dom';

const LegalLayout = ({ eyebrow, title, updated, children }) => (
  <div className="min-h-screen bg-[#F8FAF9] text-[#101828] font-sans">
    <header className="border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-bold text-[#101828]">
          <img src="/kasi.png" alt="Kasi AI" className="h-8 w-8 object-contain" />
          <span>Kasi AI</span>
        </Link>
        <Link to="/" className="text-sm font-semibold text-[#1A7A4A] hover:underline">
          Back home
        </Link>
      </div>
    </header>

    <main className="mx-auto max-w-5xl px-5 py-12 md:py-16">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#1A7A4A]">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[#101828] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm font-medium text-[#667085]">
          Last updated: {updated}
        </p>
      </div>

      <article className="space-y-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-10">
        {children}
      </article>
    </main>
  </div>
);

export const LegalSection = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-black tracking-tight text-[#101828]">{title}</h2>
    <div className="space-y-3 text-sm leading-7 text-[#475467]">{children}</div>
  </section>
);

export default LegalLayout;
