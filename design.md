# Design System & UI/UX Specification

## 1. Visual Identity & Brand Philosophy
`devsurmesure` combines modern editorial aesthetics with high-tech engineering precision. The visual language blends subtle warm sand tones with sleek obsidian surfaces, frosted glassmorphism, and vibrant electric accents (amber/emerald/cyan).

---

## 2. Color Palette & Design Tokens

### 2.1. Light Surface & Neutral Hierarchy
- `--bg-sand`: `#FBFBF9` (Primary viewport canvas)
- `--bg-sand-subtle`: `#F3F2EE` (Secondary container surface)
- `--surface-card`: `#FFFFFF` (Primary elevation cards)
- `--border-subtle`: `rgba(0, 0, 0, 0.08)`
- `--border-strong`: `rgba(0, 0, 0, 0.16)`

### 2.2. Dark Surface Hierarchy (Obsidian & Deep Charcoal)
- `--bg-dark`: `#0B0C10` (Dark section backgrounds)
- `--bg-dark-card`: `#15161E` (Dark elevated containers)
- `--border-dark`: `rgba(255, 255, 255, 0.10)`
- `--text-dark-primary`: `#F8F9FA`
- `--text-dark-secondary`: `#9CA3AF`

### 2.3. Typography Colors
- `--text-ink-primary`: `#111827` (Headings & high contrast text)
- `--text-ink-secondary`: `#4B5563` (Body copy & descriptions)
- `--text-ink-muted`: `#9CA3AF` (Captions, footnotes, timestamps)

### 2.4. Accent & Functional Colors
- `--accent-emerald`: `#10B981` (Available status, active states, health tech signals)
- `--accent-amber`: `#F59E0B` (Alerts, highlights, rating badges)
- `--accent-indigo`: `#6366F1` (Technical depth, tags, interactive hover)
- `--accent-blue`: `#2563EB` (Primary CTA focus, verified indicators)

---

## 3. Typography Hierarchy

| Role | Font Family | Weight | Size (Desktop) | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `Inter`, sans-serif | 800 / 900 | `3.5rem` (56px) | `1.1` |
| **Section Title / H2** | `Inter`, sans-serif | 700 / 800 | `2.25rem` (36px) | `1.2` |
| **Card Header / H3** | `Inter`, sans-serif | 600 / 700 | `1.25rem` (20px) | `1.3` |
| **Accents / Quotes** | `Playfair Display`, serif | 500 (Italic) | `1.5rem` (24px) | `1.4` |
| **Body Primary** | `Mukta`, `Inter`, sans-serif | 400 / 500 | `1.05rem` (16.8px)| `1.6` |
| **Code / Metrics** | `Space Grotesk`, monospace | 500 / 600 | `0.9rem` (14.4px) | `1.4` |

---

## 4. UI Components & Patterns

### 4.1. Floating Glass Pill Navigation
- Position: Fixed top center (`top: 1.25rem`, `left: 50%`, `transform: translateX(-50%)`)
- Backdrop: `backdrop-filter: blur(16px) saturate(180%)`
- Background: `rgba(255, 255, 255, 0.85)` / Dark mode: `rgba(18, 20, 29, 0.85)`
- Border radius: `9999px` (Full pill)
- Pulse Indicator: Double concentric ring ping animation for real-time availability.

### 4.2. Cards & Elevation
- Subtle inset borders: `1px solid var(--border-subtle)`
- Box shadows: Multi-layer soft ambient shadows (`0 10px 30px -10px rgba(0,0,0,0.05)`)
- Hover states: Smooth `translateY(-3px)` with elevated drop shadow and border brightness transition.

### 4.3. Floating Action Rail
- Position: Fixed right rail (`right: 1.5rem`, `top: 50%`, `transform: translateY(-50%)`)
- Micro-interactions: Tooltip appearance on hover, scale on press.

### 4.4. Lead Generation Form
- Floating labels / high-legibility inputs with clear focus outlines (`outline: 2px solid var(--accent-blue)`).
- Instant validation feedback without intrusive modals.
- Interactive submit button with loading spinner state and direct transition to WhatsApp bridge.
