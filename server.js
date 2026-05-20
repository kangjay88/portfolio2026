// ════════════════════════════════════════════
// PORTFOLIO SITE — Express Server
// Phase 3: Node.js + EJS + Dynamic Routing
// ════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const path = require('path');
const projects = require('./data/projects.json');

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine setup ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ──
app.use(express.static(path.join(__dirname, 'public')));

// ── Make data available to all templates ──
app.use((req, res, next) => {
  // Current path for active nav highlighting
  res.locals.currentPath = req.path;
  // Site-wide config available in every template
  res.locals.site = {
    name: 'Jay Kang',
    title: 'Designer & Developer',
    email: 'kang.jay.8@gmail.com',
    location: 'Fullerton, CA',
    year: new Date().getFullYear(),
    github: 'https://github.com/kangjay88',
    linkedin: 'https://linkedin.com/in/kangjay88',
  };
  next();
});

// ════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════

// ── Home / Work ──
app.get('/', (req, res) => {
  const featured = projects.filter(p => p.featured);
  res.render('pages/home', {
    pageTitle: 'Home',
    featured,
  });
});

// ── Info / About ──
app.get('/info', (req, res) => {
  res.render('pages/info', {
    pageTitle: 'Info',
  });
});

// ── Archive ──
app.get('/archive', (req, res) => {
  res.render('pages/archive', {
    pageTitle: 'Archive',
    projects,
  });
});

// ── Individual project page (dynamic route) ──
app.get('/projects/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);

  if (!project) {
    return res.status(404).render('pages/404', {
      pageTitle: 'Not Found',
    });
  }

  // Find prev/next projects for navigation
  const index = projects.indexOf(project);
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;

  res.render('pages/project', {
    pageTitle: project.title,
    project,
    prevProject,
    nextProject,
  });
});

// ── 404 catch-all ──
app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Not Found',
  });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`\n  🚀 Portfolio running at http://localhost:${PORT}\n`);
});
