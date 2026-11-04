# Oussama Brahami — Filmmaker & Cinematographer | Creative Showcase

A high-performance, dark-aesthetic showcase website for filmmaker and cinematographer **Oussama Brahami**, built strictly as a creative portfolio and direct contact hub.

---

## ✨ Features & Architecture

- **Aesthetic & Visual Identity**:
  - Ultra-sleek dark mode (`#080808` obsidian background, subtle silver gradients, border glows).
  - High-impact sans-serif typography with tight tracking.
  - Subtitle badge: **"FILMMAKER CINEMATOGRAPHER"**.
  - Interactive 9:16 titanium phone-frame mockup featuring auto-playing muted preview loop, one-click audio unmute toggle, scrubber bar, and live camera overlays.
  - Location: **Based in Tlemcen, Algeria**.

- **Hero Metrics**:
  - **10M+** Organic Views
  - **199+** Projects Delivered
  - **100%** Satisfied Clients

- **Selected Works (9:16 Vertical Showcase)**:
  - Unified, responsive vertical grid displaying all 9:16 vertical commercial reels.
  - Zero sub-category friction or aspect-ratio switches—instant, fluid presentation of vertical reels.
  - Live video preview on card hover (desktop) with glowing silver borders.
  - `IntersectionObserver` battery and mobile data protection: auto-pauses off-screen previews.

- **Fullscreen Cinema Lightbox Player**:
  - Keyboard controls: `[Space]` to Play/Pause, `[M]` to Mute/Unmute, `[Esc]` to Close.
  - Mobile swipe-down and backdrop tap-to-dismiss.
  - Full production specs drawer: Camera packages, lens optics, color profile, client, duration.
  - Direct "Get in Touch" navigation.

- **Creative Disciplines & Craft**:
  - 3-column grid showcasing core creative capabilities:
    1. *9:16 Vertical Commercials & Brand Reels*
    2. *Cinematic Brand Films & Commercials*
    3. *High-End Color Grading & Finishing*

- **Director Statement with FR / EN Switcher**:
  - Header: **"DIRECTOR STATEMENT"**.
  - Interactive toggle pill `[FR] / [EN]` with dedicated director statements for French and English visitors.
  - Portrait photo loaded directly from `/about.jpg` (drop any new image into `public/about.jpg` to update).

- **Centered Direct Contact Section**:
  - Clean, centered layout without input form containers:
    * Direct Email card (`brahami.oussama@gmail.com`) with one-click **Copy Email** and **Open Mail App** launcher.
    * Direct Instagram card linked to [@brahamioussama](https://www.instagram.com/brahamioussama).
    * Location pill: **Based in Tlemcen, Algeria**.

- **Mobile First & Responsive**:
  - Safe-area insets (`env(safe-area-inset-top)` / `bottom`).
  - Strict zero horizontal overflow (`overflow-x: hidden`).
  - Thumb-reachable navigation with >= 44x44px touch targets.

---

## 🚀 Running Locally

```bash
# 1. Navigate to the project directory
cd "C:\Users\PcTec\.gemini\antigravity\scratch\oussama-brahami-portfolio"

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```
