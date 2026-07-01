# AGENTS.md

## Project type
Static single-page portfolio website. Vanilla HTML, CSS, JS — no framework, no package manager, no build step, no tests, no linting, no CI.

## Development workflow
- Edit files directly. Preview by opening `index.html` in a browser.
- There is no `npm`, no `package.json`, no dev server. Do not introduce Node tooling unless explicitly asked.

## Deployment
- GitHub Pages auto-deploys on push to `main`.
- Remote: `https://github.com/j4real2208/j4real2208.github.io.git`

## Key files
| File | Role |
|---|---|
| `index.html` | Single-page app, all sections inline |
| `css/styles.css` | Monolithic stylesheet (1750 lines) |
| `js/script.js` | Monolithic script (420 lines) |
| `404.html` | Custom error page with inline styles |
| `img/` | All image assets |
| `files/` | Downloadable files (resumes via `jj_res_2025.pdf`) |

## Architecture conventions
- CSS custom properties (`:root` block) for theming. Dark mode uses `data-theme="dark"` attribute on `<html>` — **not** a class toggle.
- Dark mode preference persisted in `localStorage`, also respects `prefers-color-scheme` media query.
- Responsive breakpoints: 992px, 768px, 576px.
- Class naming is BEM-like: `.hero-content`, `.project-card`, `.timeline-item`, etc.
- `.container` wrapper with `max-width: 1200px` on all sections.
- Design palette: ocean blue/turquoise, Poppins font (Google Fonts CDN).

## External dependencies (CDN only)
- Font Awesome 6.0.0 (icons)
- Google Fonts — Poppins
- Formspree for contact form (`https://formspree.io/f/xgegjoae`)

## Gotchas
- Meta `<meta name="theme-color">` is dynamically updated by JS for dark/light mode.
- The Go icon is custom via CSS pseudo-element hack (`.fab.fa-golang:before`).
- All blog links and "Read More" links are dead (`#`) — placeholder content.
- Twitter link points to generic `https://twitter.com/` — not a personal profile.
- CNAME file exists but is empty (custom domain deliberately removed).
- `.htaccess` is Apache-only; ignored by GitHub Pages (Nginx).
- Two resume PDFs in `files/` — only `jj_res_2025.pdf` is linked in HTML.

## Adding content
- Copy an existing card pattern (project card, testimonial, blog post, experience timeline entry) to add new items.
- Images go in `img/`, downloadable files in `files/`.
- Testimonials carousel auto-advances every 8 seconds; dynamically adjusts container height.

## Reference
- `.github/copilot-instructions.md` — minimal Copilot hints (low signal).