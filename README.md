# Portfolio Site — Phase 3: Node.js + Express + EJS

A modern, dark-themed developer portfolio with server-side rendering.

## Architecture

```
portfolio-site/
├── server.js                 ← Express server with all routes
├── data/
│   └── projects.json         ← Project data (edit this to add your work)
├── views/
│   ├── partials/
│   │   ├── head.ejs          ← Shared <head>, fonts, meta tags
│   │   ├── header.ejs        ← Top bar + desktop nav (with active state)
│   │   ├── nav-overlay.ejs   ← Full-screen mobile nav
│   │   ├── footer.ejs        ← Site footer
│   │   ├── project-card.ejs  ← Reusable project card component
│   │   └── end.ejs           ← Closing script tags
│   └── pages/
│       ├── home.ejs          ← Homepage: hero + project carousel
│       ├── info.ejs          ← About/bio page
│       ├── archive.ejs       ← All projects table
│       ├── project.ejs       ← Individual project (dynamic)
│       └── 404.ejs           ← Not found page
├── public/
│   ├── css/output.css        ← Compiled Tailwind
│   └── js/main.js            ← Client-side interactions
├── src/
│   └── input.css             ← Tailwind source + theme
├── .env                      ← PORT, NODE_ENV
├── .gitignore
└── package.json
```

## Quick Start

```bash
npm install
npm run css:build    # Compile Tailwind CSS
npm run dev          # Start Express with --watch (auto-restart on changes)
```

Then open **http://localhost:3000**

For CSS development, run in a second terminal:
```bash
npm run css:watch    # Recompile Tailwind on class changes
```

## Routes

| URL | Template | Description |
|-----|----------|-------------|
| `/` | `home.ejs` | Hero + featured projects carousel |
| `/info` | `info.ejs` | Bio, skills, contact links |
| `/archive` | `archive.ejs` | All projects in table format |
| `/projects/:slug` | `project.ejs` | Individual project detail + prev/next nav |
| `/*` | `404.ejs` | Styled 404 page |

## What's New in Phase 3

### Server-side rendering with EJS
Every page now uses **shared partials** — change the header once, it updates everywhere. No more duplicating HTML across files.

### Dynamic project routing
Project data lives in `data/projects.json`. The `/projects/:slug` route looks up the project by slug and renders it with prev/next navigation. Add a new project by adding an entry to the JSON file — no new HTML needed.

### Active nav highlighting
The header partial receives `currentPath` from Express middleware and highlights the active page automatically.

### Site-wide config
All personal info (name, email, location, social links) is defined once in `server.js` middleware and available in every template via `site.*`.

### Reusable components
The project card is a partial (`project-card.ejs`) used in both the homepage carousel and anywhere else you need it.

## Adding a New Project

1. Open `data/projects.json`
2. Add a new object:
```json
{
  "id": 7,
  "slug": "my-new-project",
  "title": "My New Project",
  "category": "Web Design",
  "year": "2026",
  "featured": true,
  "thumbnail": "/images/projects/my-project-thumb.jpg",
  "hero": "/images/projects/my-project-hero.jpg",
  "description": "A brief overview of what this project is about.",
  "role": "Design & Development",
  "tech": ["Figma", "React", "Tailwind"],
  "link": "https://myproject.com",
  "details": [
    "First key detail about the project.",
    "Second key detail.",
    "Third key detail."
  ]
}
```
3. Drop your images in `public/images/projects/`
4. Restart the server — the project appears on the homepage (if `featured: true`), archive, and at `/projects/my-new-project`

## Customization

Edit these in `server.js` → `res.locals.site`:
- `name` — your full name (also splits into hero first/last)
- `title` — your tagline
- `email` — contact email
- `location` — displayed in hero section
- `github`, `linkedin`, `twitter` — social links on info page

## Next Steps

- **Phase 4**: Add GSAP animations, smooth scroll (Lenis), page transitions *DONE 
- **Phase 5**: Image optimization, accessibility audit, responsive polish *DONE 
- **Phase 6**: Deploy to Vercel or Render

