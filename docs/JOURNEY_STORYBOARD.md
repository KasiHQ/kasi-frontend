# Kasi User Journey: Motion Storyboard & Architecture Specification

## 1. Logline & Tone

**Logline:** A single continuous, scroll-driven interactive scene that takes the viewer from a customer's midnight "how much?" message through automated negotiation, instant Paystack payment, and live dispatch notification without the vendor ever lifting a finger.  
**Tone:** Confident, precise, and humanly grounded in Nigerian social commerce reality; calm and cinematic with tactile physics rather than bouncy cartoon gimmicks.

---

## 2. Scene Tables

### 2.1 Full Variant: How Kasi Works (`/how-it-works`, Spec 3.4)
Pinned viewport container (`100svh`), scroll length = 4.5 viewports. Scroll progress \(\theta \in [0, 1]\).

| Stage | Spec Name & Subtitle | Scroll Range | Hold Range | Visual Description | Persisting Objects | Active Surface | Exact On-Screen Text | Signature Motion Beat |
|---|---|---|---|---|---|---|---|---|
| **1** | **Inquiry**<br>`"Asks about a product."` | `0.00 – 0.16` | `0.05 – 0.13` | Customer WhatsApp phone is front-left on dark green stage. Amaka sends an inquiry about the Ankara two-piece. Kasi typing indicator activates. | Customer phone frame, WhatsApp header mark | Customer Phone (100% opacity, 1.0 scale); Vendor panel dimmed (0.4 opacity, 0.95 scale) | **Amaka:** *"Hi! Is the Ankara two-piece in size 14 still available?"*<br>Spec: `"Inquiry — Asks about a product."` | Three typing dots emerge and pulse softly in brand lime before resolving into Kasi's incoming response. |
| **2** | **Recommend**<br>`"Options, images, prices."` | `0.17 – 0.33` | `0.22 – 0.30` | Kasi bubble delivers product confirmation, live stock check, price (₦18,500), and prompts for delivery preference. | Phone, chat bubble stream, avatar | Customer Phone with catalog snippet | **Kasi:** *"Yes, size 14 is in stock. ₦18,500. Pickup or delivery?"*<br>Spec: `"Recommend — Options, images, prices."` | Recommendation card unfurls smoothly with product tag and price chip. |
| **3** | **Agree price**<br>`"Fixed or negotiated."` | `0.34 – 0.50` | `0.39 – 0.47` | Amaka counters asking for ₦16,000 to Lekki. Kasi negotiates within vendor band: starting ₦18,500 down to ₦17,000 (floor is hidden). | Price token, chat conversation | Customer Phone + negotiation band overlay | **Amaka:** *"Delivery to Lekki. Can you do ₦16,000?"*<br>**Kasi:** *"I can do ₦17,000 for you today."*<br>Spec: `"Agree price — Fixed or negotiated."` | Price indicator slides from ₦18,500 to ₦17,000 with tactile spring tension, locking at the agreed amount. |
| **4** | **Checkout**<br>`"Pickup/delivery, Paystack."` | `0.51 – 0.67` | `0.56 – 0.64` | Amaka shares location (Admiralty Way, Lekki Phase 1). Map pin drops, distance fee ticks up (+₦1,500), Paystack sheet slides up. | Agreed price bubble transforms into Draft Order Card | Split focus: Paystack sheet on phone + order card emerging | **Location:** *"Admiralty Way, Lekki Phase 1"*<br>**Kasi:** *"Delivery to Lekki is ₦1,500. Total ₦18,500. Tap below to pay via Paystack."*<br>Spec: `"Checkout — Pickup/delivery, Paystack."` | Map pin drops into mini-radar circle; delivery fee ticks from ₦0 to ₦1,500. Paystack sheet rises from phone bottom. |
| **5** | **Paid**<br>`"Webhook confirms."` | `0.68 – 0.83` | `0.73 – 0.80` | Customer authorizes payment. Webhook light pulse travels from Paystack node across to Kasi Brain mark. Vibrant green `PAID` stamp slams onto Order Card. Order flies into Vendor Fulfilment queue! | Order Card transforms into Fulfilment List Row; `PAID` stamp persists | Camera pushes right to Vendor Dashboard; phone dims | **Kasi:** *"Payment received. We are preparing your order now."*<br>Spec: `"Paid — Webhook confirms."`<br>Badge: `PAID · PAYSTACK` | Webhook pulse travels along connector line. Bold angled `PAID` stamp stamps with soft haptic glow; card flies across to vendor panel. |
| **6** | **Delivered**<br>`"After-sales closes it."` | `0.84 – 1.00` | `0.89 – 0.97` | In the vendor fulfilment pipeline, status moves: Packed → Dispatched (rider Ibrahim) → Delivered. Each tap instantly fires an auto-ping message back to Amaka's phone! | Fulfilment row phase tracker, customer chat history | Vendor Dashboard full focus; Customer Phone receives synced real-time bubbles | **Vendor pipeline:** `Packed → Dispatched → Delivered`<br>**Customer pings:** *"Your order is packed and being dispatched."* → *"Dispatched with rider Ibrahim (+234 802 ••• 4102)."* → *"Delivered. Thank you for shopping with us."*<br>Spec: `"Delivered — After-sales closes it."` | Vendor status pill clicks; simultaneous instant message bubble lands on customer phone with zero delay. |

---

### 2.2 Landing Variant: Homepage Teaser (`/`, Spec 2.6)
Pinned viewport container (`100svh`), scroll length = 3.2 viewports. Scroll progress \(\theta \in [0, 1]\).

| Act | Spec Title & Description | Scroll Range | Hold Range | Visual Description | Persisting Objects | Active Surface | Exact On-Screen Text | Signature Motion Beat |
|---|---|---|---|---|---|---|---|---|
| **1** | **Connect**<br>`"Link WhatsApp or Instagram in minutes."` | `0.00 – 0.24` | `0.06 – 0.18` | Vendor panel connects to WhatsApp official API; verified green checkmark pulses with active sync line. | Official WhatsApp mark, sync status chip | Central Stage / Vendor Bridge | Spec: `Connect`<br>`"Link WhatsApp or Instagram in minutes."` | Connection arc draws between WhatsApp mark and Kasi mark; sync ring glows lime. |
| **2** | **Load your shop**<br>`"Add products, prices, delivery rules."` | `0.25 – 0.49` | `0.31 – 0.43` | Product card (Ankara two-piece, ₦18,500) slides into store catalog with delivery zone rule. | Product card, price tag | Vendor Catalog Panel | Spec: `Load your shop`<br>`"Add products, prices, delivery rules."` | Catalog card slides in from right and locks into live inventory slot with price tag. |
| **3** | **Kasi sells**<br>`"It chats, closes, takes payment."` | `0.50 – 0.74` | `0.56 – 0.68` | Customer chat bubble lands ("Is size 14 available?"), Kasi negotiates & sends Paystack link, customer pays, `PAID` stamp lands! | Product card morphs to paid order card; `PAID` stamp | Split View (Chat left, Payment right) | Spec: `Kasi sells`<br>`"It chats, closes, takes payment."`<br>Badge: `PAID` | Rapid, fluid conversation: inquiry → agree price → `PAID` stamp slams down on order summary. |
| **4** | **You fulfil**<br>`"Prepare and hand off. Done."` | `0.75 – 1.00` | `0.81 – 0.95` | Order drops into fulfilment pipeline; vendor taps dispatch hand-off; customer receives live dispatch notification. Below stage: `See how Kasi works →`. | Order card, phase tracker | Vendor Fulfilment queue + customer phone confirmation | Spec: `You fulfil`<br>`"Prepare and hand off. Done."`<br>Button: `See how Kasi works →` | Order row slides into Active Fulfilment list with checked status indicator; CTA button unveils cleanly. |

---

## 3. Continuity Map (Persistent Entities Across Stages)

To fulfill the **One Continuous Scene** principle, objects transform organically rather than unmounting:
1. **The Price Token (`₦18,500` → `₦17,000`):** Appears in Stage 2 (Recommendation), flexes under negotiation tension in Stage 3, locks into the Checkout total in Stage 4, and gets stamped in Stage 5.
2. **The Order Card (`ORD-8291`):** Synthesized during checkout in Stage 4, stamped with the permanent `PAID` badge in Stage 5, and glides across the stage into the Vendor Fulfilment list in Stage 6.
3. **The `PAID` Stamp:** Hits once at the exact moment the Paystack webhook completes in Stage 5, emitting an emerald ring wave, and stays permanently imprinted on the order item through fulfilment.
4. **The Synchronized Ping:** In Stage 6, the status dot clicked in the vendor dashboard directly tethers to the incoming message bubble on the customer's phone via an animated signal pulse.

---

## 4. Mobile Storyboard (390px Viewport)

On mobile devices:
- Viewport is set to `100svh` with safe-area padding.
- Single-surface focal mode: stage centers **one surface at a time**.
  - Stages 1–4: Customer Phone UI is centered and fills 88% width.
  - Stage 5: Paystack checkout sheet slides up from bottom, webhook pulse sweeps up, then camera pans slightly right as Order Card transitions.
  - Stage 6: Vendor Fulfilment panel slides into 100% center view while the customer phone minimizes to a top notification chip showing incoming rider pings.
- The stage rail is a sleek, sticky bottom navigation pill (`h-12`) with compact numeric nodes (`1` to `6`) and active lime pip.
- Scroll height is optimized to `70svh` per stage to prevent fatigue while preserving hold readability.

---

## 5. Reduced-Motion Mode (`prefers-reduced-motion: reduce`)

When reduced motion is enabled:
- **No sticky pinning and no scroll scrubbing.**
- The component renders as a clean, vertical chronological card sequence.
- Each stage is presented as a card containing:
  1. Spec stage number and title (Bricolage Grotesque).
  2. Spec description copy.
  3. The final resolved UI snapshot of that stage (crisp, readable, static visual).
- Accessible keyboard navigation and pure CSS transitions for hover states.

---

## 6. Performance & Quality Plan

1. **Animated Element Count:** Max **4 to 6 simultaneous animated DOM nodes** per frame.
2. **Zero Scroll-Jacking:** Standard browser scrolling drives a native Framer Motion `useScroll` target offset.
3. **Zero State Re-renders:** Scroll progress is stored strictly inside `MotionValue`s (`useTransform` & `useSpring`). Zero React state mutations during scrolling.
4. **Composite-Only Properties:** Animated properties are strictly limited to `transform` (scale, translate3d) and `opacity`, plus SVG `pathLength`. No layout reflows (no animating `width`, `height`, `top`, or `padding`).
5. **Offscreen & Tab Throttling:** IntersectionObserver pauses rAF execution when the stage is off-screen. `visibilitychange` suspends execution when the browser tab is hidden.
6. **Hardware Concurrency & Low-Power Adaptation:** If `hardwareConcurrency <= 4` or `saveData` is detected, background radial blurs and secondary depth parallax layers are bypassed.
7. **Bundle Budget:** All journey logic and primitives are kept modular in `src/modules/Landing/components/journey/`, lazy-loaded via `React.lazy` with reserved section aspect ratios. Added gzipped bundle size < 35 KB.

---

## 7. Component Reuse Plan

All journey components are broken into pure atomic primitives in `src/modules/Landing/components/journey/`:
- `PhoneChat.jsx`: Generic WhatsApp-style phone frame with status header, message stream, and typing indicator.
- `VendorPanel.jsx`: Frameless dashboard panel featuring real cropped assets (`fulfilment & orders.png`, `chats.png`, `products & store.png`) with crisp UI overlays.
- `PriceBand.jsx`: Visual negotiation slider showing start, happy, and agreed prices with an unrevealed floor.
- `LocationPin.jsx`: Interactive map pin and animated distance-based delivery fee counter.
- `PaySheet.jsx`: Minimalist Paystack checkout sheet with verified badge.
- `WebhookPulse.jsx`: Animated SVG pulse wire connecting payment rail to Kasi brain.
- `PaidStamp.jsx`: Stylized tactile `PAID` stamp with ring flash.
- `PhaseTracker.jsx`: 3-stage fulfilment tracker (`Packed` → `Dispatched` → `Delivered`).
- `StageRail.jsx`: Accessible bottom navigation line with clickable numeric nodes and keyboard focus rings.
