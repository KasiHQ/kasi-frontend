# Kasi User Journey: Motion Storyboard & Architecture Specification (Task 3B Light Theme Redesign)

## 1. Logline, Benchmark & Tone

**Benchmark:** **The Hero.** Paper background (`#F6F8F3`), subtle ink dot-grid at low alpha, soft ambient tint blob, floating white cards with warm layered shadows (`0 1px 2px rgba(20,28,23,.06), 0 14px 32px -14px rgba(20,28,23,.14)`), clean Ink typography, and tactile editorial details. Dark/neon/glassmorphic templates are strictly eliminated.  
**Logline:** A single continuous, scroll-driven interactive scene that takes the viewer from a customer's WhatsApp inquiry to instant catalog recommendation, checkout, Paystack payment confirmation, and automated fulfilment handoff without the vendor touching their phone.  
**Real Vendor & Data Grounding:** Grounded in authentic Nigerian vendor dashboard screenshots from Kay's Sweet Confections:
- Product: **Samosa** (₦100 from `public/images/products & store.png`)
- Customer: **Temi** (`+234 812 ••• 1134` from `public/images/fulfilment & orders.png`)
- Order ID: **KAS-CART-32-1791147016-43D9** (Total paid: ₦100, Store pickup)
- Real crops from `products & store.png`, `chats.png`, and `fulfilment & orders.png`.

---

## 2. Scene Tables

### 2.1 Full Variant: How Kasi Works (`/how-it-works`, Spec 3.4)
Pinned viewport container (`100svh`), scroll length = 4.6 viewports. Scroll progress $\theta \in [0, 1]$.

| Stage | Spec Name & Subtitle | Scroll Range | Hold Range | Visual Description | Persisting Objects | Active Surface | Exact On-Screen Text | Signature Motion Beat |
|---|---|---|---|---|---|---|---|---|
| **01** | **Inquiry**<br>`"Asks about a product."` | `0.00 – 0.17` | `0.04 – 0.12` | Paper stage with subtle dot grid. White WhatsApp phone card on left. Temi sends inquiry about fresh Samosa. Typing dots appear. | WhatsApp header, Temi contact | Customer Phone (100% opacity, 1.0 scale); Vendor panel (0.65 opacity, 0.94 scale) | **Temi:** *"Hi! Do you have fresh Samosa available today?"*<br>Spec: `"Inquiry — Asks about a product."` | Three typing dots bounce softly before resolving into Kasi's response. |
| **02** | **Recommend**<br>`"Options, images, prices."` | `0.17 – 0.33` | `0.21 – 0.29` | Kasi replies in solid tinted bubble matching Hero (`#EBF8EF` / `#E8F5E9`), confirming Samosa is in stock at ₦100 each. Vendor catalog highlights real Samosa entry. | Phone, chat bubble stream, avatar | Customer Phone with catalog focus | **Kasi:** *"Yes! Fresh crispy Samosas are in stock at ₦100 each. Store pickup or delivery in Abuja?"*<br>Spec: `"Recommend — Options, images, prices."` | Clean recommendation bubble unfurls with product confirmation and price. |
| **03** | **Agree price**<br>`"Fixed or negotiated."` | `0.33 – 0.50` | `0.38 – 0.46` | Temi chooses store pickup in Jabi. Kasi confirms fixed catalog price of ₦100 for store pickup. | Price token (₦100), chat conversation | Customer Phone + price confirmation | **Temi:** *"Store pickup in Jabi please. Ready today?"*<br>**Kasi:** *"Yes, store pickup at Jabi is ready today. Price is ₦100."*<br>Spec: `"Agree price — Fixed or negotiated."` | Catalog price indicator locks at ₦100 with clear tag. |
| **04** | **Checkout**<br>`"Pickup/delivery, Paystack."` | `0.50 – 0.67` | `0.54 – 0.62` | Store pickup destination confirmed. Paystack checkout sheet slides up in clean white card with Paystack logo, item breakdown (₦100), and pay CTA. | Draft Order Card, Paystack sheet | Split focus: Paystack sheet + emerging Order Card | **Location:** *"Store pickup · Jabi, Abuja"*<br>**Kasi:** *"Store pickup selected. Total is ₦100. Tap below to pay via Paystack."*<br>Spec: `"Checkout — Pickup/delivery, Paystack."` | Paystack checkout card glides up from phone bottom with exact ₦100 total. |
| **05** | **Paid**<br>`"Webhook confirms."` | `0.67 – 0.83` | `0.71 – 0.79` | Paystack webhook fires. Real green `PAID` stamp stamps onto Order Card. Order card moves cleanly into the Vendor Fulfilment queue. | Order Card (`KAS-CART-32-1791147016-43D9`); `PAID` stamp | Camera focuses right on Vendor Dashboard; phone dims | **Kasi:** *"Payment received. We are preparing your order now."*<br>Spec: `"Paid — Webhook confirms."`<br>Badge: `PAID · PAYSTACK` | Webhook pulse completes, tactile stamp lands at -8° angle, order card transfers to active queue. |
| **06** | **Delivered**<br>`"After-sales closes it."` | `0.83 – 1.00` | `0.88 – 0.96` | Vendor dashboard shows real fulfilment pipeline (`fulfilment & orders.png`): Paid → Prepared → Ready → Picked up. "Mark as packed" action triggers automated notification to Temi. | Fulfilment pipeline, customer chat confirmation | Vendor Dashboard full focus; Customer Phone receives synced message | **Vendor pipeline:** `Paid → Prepared → Ready → Picked up`<br>**Customer pings:** *"Your order is marked as packed and ready for pickup."* → *"Order picked up. Thank you for shopping with Kay's Sweet Confections."*<br>Spec: `"Delivered — After-sales closes it."` | Clean marker highlight on active pipeline phase; instant notification lands on customer phone. |

---

### 2.2 Landing Variant: Homepage Teaser (`/`, Spec 2.6)
Pinned viewport container (`100svh`), scroll length = 3.3 viewports. Scroll progress $\theta \in [0, 1]$.

| Act | Spec Title & Description | Scroll Range | Hold Range | Visual Description | Persisting Objects | Active Surface | Exact On-Screen Text | Signature Motion Beat |
|---|---|---|---|---|---|---|---|---|
| **01** | **Connect**<br>`"Link WhatsApp or Instagram in minutes."` | `0.00 – 0.25` | `0.06 – 0.18` | Paper stage with clean dual cards. WhatsApp channel connects to Kasi with active green status dot. | Official WhatsApp mark, real Kasi mark | Central Stage / Vendor Bridge | Spec: `Connect`<br>`"Link WhatsApp or Instagram in minutes."` | Gentle connection indicator between WhatsApp and Kasi marks. |
| **02** | **Load your shop**<br>`"Add products, prices, delivery rules."` | `0.25 – 0.50` | `0.31 – 0.43` | Frameless real crop of `products & store.png` showing Samosa (₦100), Scotch Eggs (₦400), Shortbread cookies (₦300). Clean marker highlight on Samosa. | Real product crop, price tag | Vendor Catalog Panel | Spec: `Load your shop`<br>`"Add products, prices, delivery rules."` | Catalog crop shifts in smoothly with soft focus ring on active food items. |
| **03** | **Kasi sells**<br>`"It chats, closes, takes payment."` | `0.50 – 0.75` | `0.56 – 0.68` | Customer chat bubble lands ("Hi! Do you have fresh Samosa available today?"), Kasi recommends at ₦100, Paystack confirms payment, tactile `PAID` stamp lands! | Order card; `PAID` stamp | Split View (Phone left, Payment right) | Spec: `Kasi sells`<br>`"It chats, closes, takes payment."`<br>Badge: `PAID` | Rapid, fluid conversation: inquiry → price confirmed → `PAID` stamp lands cleanly. |
| **04** | **You fulfil**<br>`"Prepare and hand off. Done."` | `0.75 – 1.00` | `0.81 – 0.95` | Real crop of `fulfilment & orders.png` showing Temi's Samosa order in the Active Pipeline. Hand-off ready. Below section: `See how Kasi works →`. | Order card, phase tracker | Vendor Fulfilment queue + customer phone confirmation | Spec: `You fulfil`<br>`"Prepare and hand off. Done."`<br>Button: `See how Kasi works →` | Order moves into Prepared state; CTA button appears in normal flow below the pinned section. |

---

## 3. Continuity Map (Persistent Entities Across Stages)

1. **The Real Samosa Product (₦100):** Featured in catalog (`products & store.png`), quoted in chat, charged via Paystack, and fulfilled in orders pipeline (`fulfilment & orders.png`).
2. **Customer Temi:** Consistent customer identity, phone `2348127611134`, destination Jabi / store pickup.
3. **The Order ID (`KAS-CART-32-1791147016-43D9`):** Generated at checkout, stamped upon Paystack webhook verification, and visible in fulfilment queue.
4. **The Tactile `PAID` Stamp:** Forest green on lime border, stamped at -8° angle upon payment confirmation.

---

## 4. Visual Layer Guidelines (Task 3B Compliance)

- **Palette:** Paper background (`#F6F8F3`), dot-grid at 5% ink alpha, at most one soft ambient lime/green tint blur (`#DBF361` at 12% opacity).
- **Surfaces:** Pure white cards (`bg-white`), `rounded-[28px]`, `border border-[#141C17]/[0.08]`, warm layered shadow (`shadow-[0_1px_2px_rgba(20,28,23,0.06),0_14px_32px_-14px_rgba(20,28,23,0.14)]`). No glassmorphism, no backdrop-blur, no dark containers.
- **Typography:** Active stage title in Bricolage Grotesque (`--font-display`), 28–34px, Ink (`#141C17`), with lime marker highlight. Subtitle in Poppins 16px, Ink ~70%. No neon uppercase mono labels.
- **Progress Rail:** Slim Ink line (8–10% opacity) with forest green fill and numbered nodes (`01`, `02`, `03`, `04` / `01`–`06`). Active = solid `#0D6E42` with white numeral; passed = solid with plain SVG stroke tick; upcoming = outlined white. Step names in plain spec text.
- **Vendor Panel:** Frameless, un-obscured crop of authentic screenshots. No artificial headers, no dark gradients, no darkening overlays.
