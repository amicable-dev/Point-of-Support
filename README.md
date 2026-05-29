# Point of Support

A premium therapy practice landing page for **Dr. Ananya Sharma** (NIMHANS-trained clinical psychologist) based in Mumbai, India. Built as a scroll-driven brand experience with WebGL shader backgrounds, GSAP animations, and a smooth-scroll journey section.

## Features

- **Scroll-driven narrative** — each section flows into the next with GSAP ScrollTrigger
- **WebGL shader effects** — drunken unrolling/peel background in the Journey section
- **Smooth scroll** — Lenis-powered inertia scrolling bridged to GSAP
- **Booking modal** — contact form with Indian phone validation (+91)
- **Responsive** — mobile-first, degrades WebGL on small viewports
- **Pricing** — 3-tier (₹1.5k / ₹2.5k / ₹1.2k)

## Sections

| # | Section | Key Feature |
|---|---------|-------------|
| 1 | Hero | Portrait + grain shader, split-text headline |
| 2 | Philosophy | Ambient glow canvas, 3 card columns |
| 3 | Services Carousel | Three.js velocity-distorted card loop |
| 4 | Journey | 100vh pinned, WebGL unrolling bg, card stack overlay |
| 5 | Pricing | 3-tier cards with booking CTA |
| 6 | Founders | 55/45 split with portrait + bio |
| 7 | Resources | 3-column grid with resource cards |
| 8 | CTA | Video/poster background with trust indicators |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7.2 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Animation | GSAP 3.15 (ScrollTrigger, SplitText) |
| Smooth Scroll | Lenis 1.3 |
| WebGL | Three.js 0.184 (imperative, no R3F) |
| Icons | Lucide React |
| Form | React Hook Form + Zod |

## Getting Started

```bash
cd app
npm install
npm run dev      # starts on localhost:3000
npm run build    # type-check + production build
npm run preview  # preview the build
```

## Project Structure

```
app/
  src/
    components/       Shared components (Header, Footer, BookingModal, …)
      ui/             shadcn/ui primitives (53 components)
    context/          BookingContext (modal state)
    hooks/            useLenis, use-mobile
    sections/         8 page-level sections (Hero → CTA)
    App.tsx           Root component, composes sections
    main.tsx          Entry point
    index.css         Global styles + Tailwind
  public/
    assets/           Images (hero, journey, service cards, …)
    fonts/            Geist Sans + Geist Mono (40 files)
  index.html          HTML entry with SEO/OG tags
```

## Build

```bash
npm run build    # outputs to dist/
```

## Deployment

This is a static site. Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages).

Set the build command to `cd app && npm install && npm run build` and output directory to `app/dist`.

If using a sub-path, set `base: './'` in `vite.config.ts` (already configured).
