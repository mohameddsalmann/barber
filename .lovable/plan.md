## BarberFlow POC — by Adham Gabriil

A complete, investor-demo-ready frontend POC for a multi-tenant barber shop OS, branded with the **Adham Gabriil "Art of Gents"** identity over the **TypeUI Dramatic** design system. Three connected apps (Owner Dashboard, Barber App, Client App) with a role-selector landing page, fully navigable end-to-end on mocked data.

---

### Brand & Design System

- **Brand:** Adham Gabriil — Art of Gents. The product name shown across all three apps is **Adham Gabriil**, with tagline *"The operating system for modern barber shops."* The uploaded gold logo appears on the landing hero, owner sidebar, barber header, and client header.
- **Primary accent:** Gold `#D4AF37` (replaces violet across buttons, active states, charts, glows, focus rings, status indicators).
- **Secondary accent:** Hot rose `#F43F5E` (kept from Dramatic).
- **Surface:** Near-black `#09090B` everywhere. Cards `#111113`, elevated `#16161A`, borders `#27272A`, inputs `#18181B`.
- **Status colors:** waiting `#D97706` · in-service gold · done `#16A34A` · cancelled `#27272A` · no-show `#DC2626`.
- **Typography:** Outfit (400 + 900 only) globally; JetBrains Mono for numeric/data. Headings always 900, body always 400 — no medium weights anywhere.
- **Motion:** Framer Motion on page mount (fade + 4px translateY), card hover (scale 1.01 + gold border), button press (scale 0.97), modal open/close, status-change flash, staggered list mounts (40ms).
- **Components:** shadcn/ui retheming to Dramatic tokens; gold-glow focus rings; pill badges with 15% opacity bg + full-color text.

---

### Routes & Apps

**Landing — `/`**
Full-screen dark hero with the Adham Gabriil gold logo, tagline, and three stagger-animated role cards: I'm an Owner → `/dashboard`, I'm a Barber → `/barber`, I'm a Client → `/client`. Subtle gold glow on hover.

**App 1 — Owner Dashboard `/dashboard/*`**
Collapsible left sidebar (`#0D0D0F`) with logo at top and gold-left-border active state.
- `/dashboard` — Overview: 4 KPI cards, 7-day revenue line chart, live queue summary (4 barber mini-cards), recent bookings table.
- `/dashboard/queue` — Live Kanban with 4 barber columns, drag-and-drop via @dnd-kit, Start/Done buttons, walk-in modal, live clock.
- `/dashboard/calendar` — Day/Week toggle, time grid with color-coded blocks per barber, slide-in detail panel.
- `/dashboard/barbers` — Card grid with avatar, specialty pills, rating, today's earnings, clock dot.
- `/dashboard/barbers/:id` — Profile header + 4 tabs (Schedule, Attendance, Earnings, Reviews).
- `/dashboard/clients` — Searchable table with filter pills (All/VIP/Dormant/New), loyalty tier badges.
- `/dashboard/clients/:id` — Profile, gold-bordered visit timeline, preferences notes.
- `/dashboard/analytics` — Revenue line chart with period switcher, 7×12 busiest-hours heatmap, top services bar chart, barber performance grouped bars, retention gauge.
- `/dashboard/pos` — Tablet layout: service/product grid (left), order cart with tip selector + discount + barber assign + Cash/Card/Split payment, animated success screen.
- `/dashboard/settings` — Tabs: General / Team / Billing / Notifications.

**App 2 — Barber App `/barber/*`** (mobile-first, max-w 430px, centered on desktop, bottom tab bar)
- `/barber` — Greeting, big clock-in/out toggle, Next Client card, today's queue list, earnings + tips strip.
- `/barber/queue` — Ordered booking cards with position number, Start/Done/Skip actions, "I'm on Break" floating button.
- `/barber/earnings` — Week/Month toggle, 3 metric cards, daily bar chart, payouts list.
- `/barber/profile` — Editable avatar/cover, bio, specialty pill editor, 2-col portfolio grid, ratings summary.

**App 3 — Client App `/client/*`** (mobile-first, max-w 430px, bottom tab bar with 5 tabs)
- `/client` — Greeting, "Book Your Usual" rebook card, 3 quick actions, loyalty card with progress bar, nearby shops with live wait badges.
- `/client/book` — 3-step flow (service grid → barber + time pills → confirm), animated success screen.
- `/client/queue/:id` — Huge "You're #3" display, est. wait, animated progress, 4-step status indicator with glow on current step.
- `/client/style-studio` — AI try-on: upload zone, multi-select style chips, gold "Generate" CTA, skeleton-pulse loading state, 2×3 results grid with confidence % and rose "Book This Style" button.
- `/client/profile` — Avatar header, gold-gradient loyalty card, visit timeline, favorite barbers horizontal scroll, payment method card.

---

### Mock Data (`src/mock/data.ts`)

- **Barbers:** Ahmed Khalil (Fade Specialist, ⭐4.9, in), Marcus Johnson (Beard Expert, ⭐4.7, in), Youssef Nasser (Color & Cuts, ⭐4.8, break), James Carter (Classic Cuts, ⭐4.6, out).
- **Services:** Haircut $25 · Fade $35 · Beard Trim $20 · Hair+Beard $50 · Kids Cut $18 · Hair Color $75.
- **Queue:** 10 bookings spread across barbers with mixed statuses.
- **Clients:** Karim El-Sayed (VIP/Gold, 48 visits, $2,400), Sofia Torres (Silver, 12, $580), James Okafor (New/Bronze, 2, $85), plus ~12 more for table density.
- **Revenue week:** Mon $820 · Tue $1,240 · Wed $980 · Thu $1,840 · Fri $2,100 · Sat $1,650 · Sun $420.

---

### Technical Notes

- Adapted to project's actual stack: **TanStack Start** file-based routing in `src/routes/` (not React Router v6 — same UX, idiomatic to this codebase).
- **Tailwind v4**: Dramatic tokens defined as CSS variables in `src/styles.css` under `@theme inline` (gold replaces violet primary). No `tailwind.config.js`.
- Logo copied from upload to `src/assets/adham-gabriil-logo.png` and imported as ES module.
- shadcn primitives already in repo are restyled via the new tokens; no new shadcn installs needed.
- Add deps: `framer-motion`, `recharts`, `@dnd-kit/core`, `@dnd-kit/sortable`.
- Each route file gets its own `head()` metadata (title + og tags) per TanStack conventions.
- All charts use Recharts with gold (`#D4AF37`) primary and rose (`#F43F5E`) secondary, dark grid lines.
- All data is in-memory mocks; queue mutations use local React state so drag-and-drop and status changes feel real within a session.
- Mobile apps use a fixed centered `max-w-[430px]` shell with a sticky bottom tab bar to feel like real native apps.
