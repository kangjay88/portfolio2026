# Portfolio Site — Phase 1 & 2

A modern, dark-themed developer portfolio built with **HTML**, **Tailwind CSS v4**, and **vanilla JavaScript**. Inspired by [rylanphillips.com](https://www.rylanphillips.com/).

## What's Included

```
portfolio-site/
├── public/                  ← Open index.html to view the site
│   ├── css/
│   │   └── output.css       ← Compiled Tailwind (ready to use)
│   ├── js/
│   │   └── main.js          ← Nav toggle, live clock, carousel, scroll effects
│   ├── images/projects/     ← Drop your project thumbnails here
│   ├── index.html           ← Homepage: hero + project carousel
│   ├── info.html            ← About/bio page
│   └── archive.html         ← Project archive (table layout)
├── src/
│   └── input.css            ← Tailwind source (custom theme, animations, components)
├── package.json
└── README.md
```

## Quick Start

### 1. Install dependencies
```bash
cd portfolio-site
npm install
```

### 2. View the site
Just open `public/index.html` in your browser. Everything works as static files — no server needed for Phase 1 & 2.

### 3. Edit & rebuild Tailwind (when you change classes)
```bash
npm run dev
```
This watches for changes and recompiles `output.css` automatically.

### 4. Production build
```bash
npm run build
```
Minifies the CSS for deployment.

## Key Features Built

| Feature | File | How It Works |
|---------|------|--------------|
| **Hero with split text** | `index.html` | Oversized filled + outline text with staggered fade-slide animations |
| **Full-screen nav overlay** | `input.css` + `main.js` | Circle clip-path expansion from hamburger position |
| **Hamburger → X animation** | `input.css` | Pure CSS transform on `.active` state |
| **Horizontal project carousel** | `index.html` | CSS `scroll-snap` with JS slide counter |
| **Project card hover effects** | `input.css` | Image scale + darken + overlay slide-up CTA |
| **Live clock** | `main.js` | `setInterval` updating HH:MM:SS every second |
| **Header blur on scroll** | `main.js` | Backdrop-filter toggled based on scroll position |
| **Scroll-triggered animations** | `main.js` | IntersectionObserver with `[data-animate]` attribute |
| **Film grain texture** | `input.css` | SVG noise filter as fixed pseudo-element overlay |
| **Archive table layout** | `archive.html` | 12-column grid with hover row highlights |
| **Info/bio page** | `info.html` | Skills grid, bio text, social links |

## Design System

### Typography
- **Display:** Outfit (800 weight for hero, 700 for headings)
- **Body:** DM Sans (clean, geometric sans-serif)
- **Mono:** JetBrains Mono (for numbers, labels, metadata)

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `base-950` | `#08080a` | Page background |
| `base-900` | `#111114` | Card backgrounds |
| `base-800` | `#1a1a1f` | Borders, dividers |
| `base-400` | `#7a7a88` | Muted text, metadata |
| `base-200` | `#c8c8d0` | Body text |
| `base-50` | `#f5f5f7` | Headings, primary text |
| `accent` | `#e8decf` | CTA highlights, hover states |

### Animation Timing
All entrance animations use `cubic-bezier(0.16, 1, 0.3, 1)` (expo ease-out) for that smooth deceleration feel.

## Customization Checklist

- [ ] Replace "Your Name" throughout all 3 HTML files
- [ ] Update email address in contact links
- [ ] Replace Unsplash placeholder images with your project thumbnails
- [ ] Update project titles, categories, and descriptions
- [ ] Add your real social media links on the info page
- [ ] Update the location and any bio text
- [ ] Customize accent color in `src/input.css` → `--color-accent`

## Next Steps (Phase 3+)

Phase 3 converts this into a **Node.js + Express** app with:
- EJS templating (shared header/footer partials)
- Dynamic project routing (`/projects/:slug`)
- Project data from a JSON file
- Server-side rendering

Phase 4 adds advanced animations (GSAP, smooth scroll).
Phase 5–6 covers polish and deployment to Vercel or Render.
