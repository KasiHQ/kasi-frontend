import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/home/hero/Nav";
import { Hero } from "@/components/home/hero/Hero";
import { ChannelOrbit } from "@/components/home/ChannelOrbit";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-lime selection:text-ink">
      {/* Top Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2.1 Hero Section (includes Rotating Headline, Chat Stage, and Partner Strip) */}
        <Hero />

        {/* 2.2 Positioning Band (Green Band with Lime Highlights) */}
        <section className="bg-forest text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-[960px] mx-auto text-center relative z-10">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Selling on social was never the problem.{" "}
              <span className="text-lime">Keeping up with it was.</span>
            </h2>
            <p className="mt-6 font-sans font-light text-lg sm:text-xl text-white/85 leading-relaxed max-w-[760px] mx-auto">
              Kasi replies in seconds, at 2pm or 2am, in the customer&apos;s own words.
              Nothing sits unread. Nothing slips. You wake up to prepared orders, not a
              backlog of &ldquo;is this available?&rdquo;
            </p>
          </div>
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lime/10 blur-[100px] pointer-events-none" />
        </section>

        {/* 2.3 The Three Pillars (It Sells, It Fulfils, It Grows) */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
          <div className="text-center max-w-[720px] mx-auto mb-16">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest bg-forest/10 px-3 py-1 rounded-full">
              THE FULL CYCLE
            </span>
            <h2 className="mt-4 font-sans font-bold text-3xl sm:text-4xl text-ink tracking-tight">
              One assistant. The whole shop.
            </h2>
            <p className="mt-3 font-sans font-light text-base sm:text-lg text-ink/70">
              From the first &ldquo;hello&rdquo; to the &ldquo;your order is on its way,&rdquo;
              Kasi handles the parts that used to eat your day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 1 */}
            <div className="bg-white rounded-card p-7 border border-ink/8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-forest">
                  IT SELLS
                </span>
                <h3 className="mt-2 font-sans font-bold text-xl text-ink">
                  Autonomous Sales Engine
                </h3>
                <p className="mt-3 font-sans text-sm text-ink/75 leading-relaxed">
                  Answers, recommends, negotiates within your rules, and closes the
                  order without you touching the phone.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/5">
                <Link
                  href="/features/sales-engine"
                  className="font-sans font-semibold text-sm text-forest hover:text-forest-green inline-flex items-center gap-1 group"
                >
                  <span>Explore Sales Engine</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-card p-7 border border-ink/8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-forest">
                  IT FULFILS
                </span>
                <h3 className="mt-2 font-sans font-bold text-xl text-ink">
                  Fulfilment & Dispatch
                </h3>
                <p className="mt-3 font-sans text-sm text-ink/75 leading-relaxed">
                  Paid orders drop into one list. Pack, dispatch, deliver, each step
                  pings the customer automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/5">
                <Link
                  href="/features/fulfilment"
                  className="font-sans font-semibold text-sm text-forest hover:text-forest-green inline-flex items-center gap-1 group"
                >
                  <span>Explore Fulfilment</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-card p-7 border border-ink/8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-forest">
                  IT GROWS
                </span>
                <h3 className="mt-2 font-sans font-bold text-xl text-ink">
                  Customers & Analytics
                </h3>
                <p className="mt-3 font-sans text-sm text-ink/75 leading-relaxed">
                  Every chat becomes a saved customer, a lead stage, and a number you
                  can actually read.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink/5">
                <Link
                  href="/features/customers"
                  className="font-sans font-semibold text-sm text-forest hover:text-forest-green inline-flex items-center gap-1 group"
                >
                  <span>Explore Customers & Analytics</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Channel Orbit (Between 2.3 and 2.4 per spec instruction) */}
        <ChannelOrbit />
      </main>

      {/* Global Footer */}
      <footer className="border-t border-ink/10 bg-paper py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-ink/10 bg-white p-0.5">
                  <Image
                    src="/brand/kasi-mark.svg"
                    alt="Kasi mark"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-sans font-bold text-lg text-ink">Kasi</span>
              </div>
              <p className="font-sans text-xs text-ink/65 leading-relaxed max-w-[200px]">
                The operating system for businesses that sell on WhatsApp &amp; Instagram.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink/40 mb-3">
                PRODUCT
              </h4>
              <ul className="space-y-2 text-sm text-ink/75">
                <li><Link href="/how-it-works" className="hover:text-ink">How it works</Link></li>
                <li><Link href="/features" className="hover:text-ink">Features</Link></li>
                <li><Link href="/try" className="hover:text-ink">Try it</Link></li>
                <li><Link href="/market" className="hover:text-ink">Market</Link></li>
                <li><Link href="/pricing" className="hover:text-ink">Pricing</Link></li>
                <li><Link href="/platforms" className="hover:text-ink">Platforms</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink/40 mb-3">
                COMPANY
              </h4>
              <ul className="space-y-2 text-sm text-ink/75">
                <li><Link href="/about" className="hover:text-ink">About Endogenous</Link></li>
                <li><Link href="/blog" className="hover:text-ink">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink/40 mb-3">
                GET STARTED
              </h4>
              <ul className="space-y-2 text-sm text-ink/75">
                <li><Link href="/get-started" className="hover:text-ink font-semibold text-forest">Create a store</Link></li>
                <li><Link href="/try#book" className="hover:text-ink">Book a demo</Link></li>
                <li><Link href="/try" className="hover:text-ink">Chat the live demo</Link></li>
                <li><Link href="/login" className="hover:text-ink">Sign in</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-ink/8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-ink/60">
            <p>
              Kasi is a product of Endogenous Technologies. Built in Nigeria, for the
              businesses that run on WhatsApp. © 2026 Endogenous Technologies Ltd.
            </p>
            <div className="flex gap-4">
              <Link href="/legal/privacy" className="hover:text-ink">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-ink">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
