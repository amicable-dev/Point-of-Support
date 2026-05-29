# Tech Spec — Point of Support

## Architecture

React 19 SPA composed of 8 vertically-stacked sections inside a `<main>` element, wrapped in a `BookingProvider` context for modal state. A fixed `Header` overlays all sections. `Lenis` provides smooth scrolling bridged to GSAP via `lenis.on('scroll', ScrollTrigger.update)`.

## Component Tree

```
<BookingProvider>
  <Header />                      ← fixed, z-100
  <main>
    <HeroSection />               ← owns HeroCanvas (Three.js grain + vignette)
    <PhilosophySection />         ← owns AmbientGlowCanvas (Three.js)
    <ServicesCarouselSection />   ← owns CarouselScene (Three.js)
    <JourneySection />            ← owns WebGL unrolling canvas
    <PricingSection />
    <FoundersSection />
    <ResourcesSection />
    <CTASection />                ← video/poster bg
  </main>
  <Footer />
  <BookingModal />                ← teleported overlay
</BookingProvider>
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2 | UI framework |
| react-dom | ^19.2 | DOM renderer |
| vite | ^7.2 | Build tool |
| typescript | ~5.9 | Type system |
| tailwindcss | ^3.4 | Utility CSS |
| gsap | ^3.15 | Animation + ScrollTrigger + SplitText |
| lenis | ^1.3 | Smooth scroll with inertia |
| three | ^0.184 | WebGL (imperative, no R3F) |
| lucide-react | ^0.562 | Icon library |
| react-hook-form | ^7.70 | Form management |
| zod | ^4.3 | Form validation |

## Animation System

### GSAP + Lenis Bridge

A single `useLenis` hook at app root creates the Lenis instance and wires bidirectional sync:

```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
```

This makes all ScrollTrigger animations run on Lenis's smooth scroll thread.

### Journey Section — Scroll-Pinned Unrolling

The Journey section is the most complex. It uses a single `ScrollTrigger` pinned for the full travel distance (`journeyData.length * 600 + window.innerHeight * 0.5` pixels). During the pin:

- **WebGL canvas** (background): 6 images render at 50% viewport width, 180° rotated, fixed center. Each image's progress maps to `1/6` of total scroll. The fragment shader applies a drunken-weave distortion + paper-peel unroll effect. Crossfade opacity: fade-in over first 25%, hold to 80%, fade-out over last 20%.

- **Card stack** (overlay): 6 thumbnail images stacked vertically inside a container at `top: 100%`. The container translates upward by `-progress * travel` pixels, pulling cards from the bottom edge of the viewport. Each card has:

  - `py-24` spacing (~192px padding per card)
  - `clamp(180px, 35vw, 360px)` width, 4:5 aspect ratio
  - Alternating `±20°` rotation
  - Blur/saturation filter: upcoming cards are blurred + desaturated, active card is sharp + full color, past cards are softly muted

- **Active index** derived from `Math.min(Math.floor(progress * 6), 5)`.

### Opening Statement

GSAP SplitText scatter-to-assemble: each character starts at random offset (±400px X, ±200px Y, ±60° rotation) and animates to its natural position with 0.02s stagger.

## WebGL Implementation

All Three.js is managed imperatively via refs and `useEffect`, not R3F.

### Journey Shader

- **Vertex shader**: flips both UV axes for 180° rotation (`v_uv = 0.5 - a_position * 0.5`)
- **Fragment shader**: weave distortion (`sin(uv.y * 24 + time * 1.8)`) applied before texture lookup, then paper-peel unroll via smoothstep fold/unfold masking

### Performance

- All WebGL canvases gated by `IntersectionObserver` — RAF loops only run when in viewport
- `devicePixelRatio` capped at `1.5`
- Canvas resized on window resize

## Booking Modal

`BookingContext` provides `openBooking` / `closeBooking` globally. The modal renders a contact form with:
- Name, email, phone (+91 validation), preferred session type, message
- GSAP entrance/exit animation (scale + opacity)
- ZenDesk-style overlay pattern

## SEO

- Open Graph tags with `og:locale: en_IN`
- Geo tags for Mumbai, Maharashtra (`IN-MH`)
- Keywords targeting Indian therapy market
- `<link rel="preload">` for Geist Sans font

## Build & Deploy

```bash
npm run build    # tsc -b && vite build → dist/
```

`dist/` is a fully static site. Deploy to any static host (Vercel, Netlify, GitHub Pages). Build command: `cd app && npm install && npm run build`, output: `app/dist`.
