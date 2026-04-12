# CLAUDE.md

This file is the source of truth for Claude Code in this project. Read it fully before acting. Agents must read it before scoped work.

---

## Project Overview

Ulyssies Adams's personal website — a single-page portfolio showcasing projects, skills, background, and hobbies. Built as a single self-contained HTML file with no framework or build step. Intended as a living document that gets updated as Ulyssies's work evolves.

**Status:** Active development

---

## Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript — all inline in `index.html`
- **Fonts:** DM Mono, Syne, DM Sans (Google Fonts CDN)
- **Icons:** Lucide (unpkg CDN)
- **Backend:** None
- **Database:** None
- **Hosting:** GitHub Pages — auto-deploys from `main`
- **Package manager:** None

---

## Deployment

- **Site:** GitHub Pages — pushing to `main` deploys automatically
- **URL:** ulyssies.github.io/personal-website
- **No build step** — what's in `index.html` is what ships

---

## Project Structure

```
personal-website/
├── index.html          #
├── attachments/        # Static binary assets (resume PDF, profile photo)
│   ├── UlyssiesAdams_Resume.pdf
│   └── 66501E6C-396C-4975-9632-4BAE718D5C38_1_201_a.jpeg
└── CLAUDE.md
```

### index.html layout

The file is organized in this order:
1. `<head>` — meta, fonts, Lucide script
2. `<style>` — all CSS (organized by section with `/* ── SECTION ── */` comments)
3. `<body>` — all HTML markup
4. `<script>` — all JavaScript (animations, interactivity, theme toggle)

---

## Conventions

- **Single file rule:** All code stays in `index.html`. Do not create separate `.css` or `.js` files.
- **CSS sections:** Delimit CSS blocks with `/* ── SECTION NAME ─────────────── */` comments matching the existing style.
- **Design tokens:** All colors, spacing, and radii use CSS custom properties defined in `:root`. Never hardcode values that already have a token.
- **Themes:** Both `[data-theme="dark"]` (default) and `[data-theme="light"]` must be supported for every new UI element. Add light-mode overrides immediately after the dark-mode rule.
- **Naming:** camelCase for JS variables and functions, kebab-case for CSS classes and IDs.
- **Commits:** Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Comments:** Explain *why*, not *what*. Remove all debug comments before commit.
- **No console.logs** left in production code.

---

## Design System

All UI work references the shared design system before touching any styles.

**Shared reference:** `~/claude-shared/design-system.md`

### Per-project overrides

This site uses a **warm/grit palette** instead of the shared system's indigo accent. The token names also differ from the shared system — always use the tokens below for this project.

| Project Token | Value (dark) | Value (light) | Usage |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#f5f2ed` | Page background |
| `--bg2` | `#111111` | `#ede9e3` | Slightly elevated surfaces |
| `--bg3` | `#161616` | `#e5e0d8` | Cards, panels |
| `--surface` | `#1a1a1a` | `#ddd8d0` | Highest surface layer |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.07)` | All borders |
| `--border-hover` | `rgba(255,255,255,0.15)` | `rgba(0,0,0,0.15)` | Hover borders |
| `--text` | `#f0ede8` | `#1a1714` | Primary text |
| `--text2` | `#8a8680` | `#6b6560` | Secondary text |
| `--text3` | `#4a4744` | `#aaa59e` | Tertiary / disabled |
| `--accent` | `#e8e0d0` | `#1a1714` | Accent (warm, not indigo) |
| `--accent2` | `#c8bfaf` | `#3a3530` | Secondary accent |
| `--grit` | `#2a2520` | `#d5cfc5` | Texture / noise layer |

**Fonts:** Syne for headings, DM Sans for body, DM Mono for labels/tags/mono.

---

## Do Not Touch

- `.env` files — not applicable here, but never add secrets to `index.html`
- `attachments/` — binary files only. Replace only on explicit instruction; never rename the resume PDF without updating all references in `index.html`.
- `.git/` — never hand-edit

---

## Current Priorities

1. Ongoing copy and content updates (About section, project descriptions, hobbies)
2. Polish and visual refinements (profile card, section ordering)
3. Performance — particle system and canvas animations should stay lightweight

---

## Known Issues

- None currently documented

---

## Session Notes

Detailed session history lives in `.claude/session-notes.md`. The context-manager agent maintains it. Run `/session-end` at the end of every work session.
