# KASI Website Redesign Audit

**Date:** October 2026  
**Auditor:** Engineering  
**Single Source of Truth:** `docs/KASI_Website_Build_Spec_v2.md`  
**Target Codebase:** `frontend/` (Vite + React 19 + Tailwind CSS)

---

## 1. Routes & Sitemap Mapping (Spec 01)

| # | Spec Page | Target Route | Old/Existing Route | Status / Strategy |
|---|---|---|---|---|
| 02 | Homepage | `/` | `/` (`LandingPage.jsx`) | **Rewrite & Restyle** — Implement Spec 02 sections, modularized copy in `content/home.ts` |
| 03 | How Kasi Works | `/how-it-works` | None | **New Route (Stub Wave 2)** — Uses `<PageStub />`, demo video slot |
| 04 | Features Hub | `/features` | None | **New Route (Stub Wave 2)** — Directory of feature modules |
| 05 | Feature — Sales Engine | `/features/sales-engine` | None | **New Route (Stub Wave 2)** |
| 06 | Feature — Fulfilment | `/features/fulfilment` | None | **New Route (Stub Wave 2)** |
| 07 | Feature — Delivery & Pricing | `/features/delivery` | None | **New Route (Stub Wave 2)** |
| 08 | Feature — Payments & Checkout| `/features/payments` | None | **New Route (Stub Wave 2)** |
| 09 | Feature — Chats & Control | `/features/chats` | None (app has `/chats`) | **New Route (Stub Wave 2)** — Marketing page (`/features/chats`), app stays `/chats` |
| 10 | Feature — Customers / CRM | `/features/customers` | None (app has `/customers`) | **New Route (Stub Wave 2)** — Marketing page |
| 11 | Feature — Analytics & Bookings| `/features/analytics` | None (app has `/analytics`) | **New Route (Stub Wave 2)** — Marketing page |
| 12 | Platforms & Integrations | `/platforms` | None | **New Route (Stub Wave 2)** |
| 13 | Try It Yourself | `/try` | None | **New Route (Stub Wave 2)** — Interactive demo link |
| 14 | Kasi Market | `/market` | `/market` (`Marketplace.jsx`)| **Keep & Restyle Header/Footer** — Live product, preserves `/market/product/:id` & `/market/vendor/:vendorId` |
| 15 | Pricing | `/pricing` | In-page `#pricing` | **New Route (Stub / Standalone)** — Preserves real tiers (₦18k, ₦29k, ₦40k) |
| 16 | About — Endogenous Tech | `/about` | None | **New Route (Stub Wave 2)** |
| 17 | Blog | `/blog` | None | **External Link / Route** — Directs to `https://blog.usekasi.com` |
| 18 | Contact · Get Started | `/contact` · `/get-started` | In-page / `/signup` | **New Route (Stub Wave 2)**; `/get-started` directs to `/signup` |
| — | App & Auth Routes | `/login`, `/signup`, `/dashboard`, etc. | Unchanged | **Preserve 100%** — Zero regressions on app logic, auth or admin |
| — | Legal Pages | `/privacy`, `/terms`, `/data-deletion` | Existing | **Preserve & Link in Footer** |

---

## 2. Components & Sections Audit

### Reusable Components
- `WaitlistModal.jsx` (`frontend/src/modules/Landing/components/WaitlistModal.jsx`): Reusable for lead capture and waitlist CTA.
- Testimonial data: Folake Adebayo, Emeka Obi, and Kenechukwu O. extracted from `TestimonialSection.jsx` into structured data `src/data/testimonials.ts`.
- Pricing data: Starter (₦18,000/mo), Growth (₦29,000/mo), Premium (₦40,000/mo) extracted to `src/data/pricing.ts`.

### Superseded / Replaced Sections
- `HeroSection.jsx` -> Replaced by `NewHero.jsx` (with Part A corrections applied).
- `LandingNavbar.jsx` -> Replaced by `NewNav.jsx` with real brand logo and spec 01 links.
- Old Footer -> Replaced by Spec 01 3-column global footer.
- `DmSection.jsx`, `InvoiceSection.jsx`, `NegotiationSection.jsx`, `LogisticsSection.jsx`, `CustomerIntelligenceSection.jsx`, `ProactiveOutreachSection.jsx`, `BookingSection.jsx` -> Replaced by clean spec 02 modular sections (2.2 through 2.9).

### Cut Sections to Delete (Spec 00 Non-negotiable)
1. **`PricingVsAgentsSection.jsx`** ("Kasi vs a human sales agent" comparison table) -> **DELETED**.
2. **"Kasi price vs an agent's salary"** section -> **DELETED**.
3. **`AutomationSection.jsx`** (Standalone "24/7 automation" block) -> **DELETED**.

---

## 3. Assets Audit

### Brand Identity
- **Real Brand Mark:** `frontend/public/kasi-icon.svg` — Green gradient (`#0F8C55` to `#0BBF6A`) rounded square with stylized white "K".
- **Real Brand Wordmark:** `frontend/public/kasi-logo.svg` — Custom styled "kasi" in small-caps gradient.
- **Brand Component:** `<KasiLogo variant="mark|full" className="..." />` standardizes brand rendering everywhere.
- **Favicon:** Uses `kasi-icon.svg`.

### Third-Party Partner Logos
- Verified SVG files added to `frontend/public/logos/`:
  - `meta.svg` (Meta official SVG)
  - `openai.svg` (OpenAI official SVG)
  - `paystack.svg` (Paystack official SVG)
  - `telegram.svg` (Telegram official SVG)
  - `whatsapp.svg` (WhatsApp official SVG)
  - `instagram.svg` (Instagram official SVG)
  - `messenger.svg` (Messenger official SVG)
- **Documentation:** `public/logos/LOGO_SOURCES.md` logs origins, official URLs, licenses, and dates.
- **Dev Route:** `/dev/logos` renders all 7 SVGs side-by-side with dimensions.

### Photography & Video
- Video: `frontend/public/video/Kasi Explainer Video.mp4` verified as primary demo asset.
- Product Screenshots: `hero-dashboard-desktop.png`, `dashboard-analytics.png`, `mobile-chat-view.png`, `order-pipeline.png`.
- Human Placeholders: Authentic Nigerian SME photography placeholders tagged with `data-swap="vendor-real"`.

---

## 4. Config, Integrations & Tokens

- **Palette Tokens:**
  - Forest: `#0D6E42`
  - Green / Primary: `#1A7A4A` (Logo accent: `#0F8C55` / `#0BBF6A`)
  - Lime / Accent: `#DBF361` (Secondary: `#D4F263`)
  - Ink: `#141C17`
  - Paper: `#F6F8F3`
- **Environment Variables:** Documented in `.env.example`:
  - `VITE_APP_SIGNIN_URL`
  - `VITE_DEMO_WHATSAPP`
  - `VITE_SUPPORT_WHATSAPP`
  - `VITE_API_URL`
- **Analytics:** Preserved `usePageTracker` in `App.jsx`.

---

## 5. Decision Table

| Existing File / Page | Action | Rationale |
|---|---|---|
| `LandingPage.jsx` | **Restyle / Rewrite** | Implement Spec 02 full stack (Hero through 2.9 & Footer) |
| `PricingVsAgentsSection.jsx` | **Delete** | Forbidden per Spec 00 |
| `AutomationSection.jsx` | **Delete** | Forbidden per Spec 00 |
| `NewHero.jsx` | **Restyle** | Apply Part A fixes: H1 sizing, highlight position, token warmth |
| `NewNav.jsx` | **Restyle** | Use real `<KasiLogo />`, wire all spec 01 links and dropdowns |
| `ChannelOrbit.jsx` | **Restyle** | Center real Kasi mark, warm ripples, verified channel SVGs |
| `PartnerStrip.jsx` | **Restyle** | Verified official SVGs from `/logos/`, exact partner copy |
| `Marketplace.jsx` | **Keep** | Retain live ecommerce shopping functionality |
| `Dashboard.jsx` & app routes | **Keep** | App functionality untouched |
| `NotFound.jsx` | **Restyle** | Match Paper theme, brand mark, link back to home |
| Legal Pages (`PrivacyPolicy`, `TermsOfService`, `DataDeletion`) | **Keep** | Preserved legal text, linked in global footer |
