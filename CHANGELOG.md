# Changelog

All notable changes to this project are documented in this file.

## [2026.10] - 2026-10-12

- ai-toolkit-studio is a public Vite 7 + React 19 single-page app of free, browser-side AI tools for creators: Prompt Flow, n8n Visualizer, Social Converter and Video Script Generator, plus an Admin page. Tailwind v4, Framer Motion, Vercel SPA rewrites and security headers.
- State: stable and unchanged in code since the last functional commit in February 2026; only the September release commit sits on top.
- Re-reviewed October 2026: README, file tree and commit history re-read; documentation and version metadata only, no code changes. The README has no external links to verify.
- Known gaps: no LICENSE; no tests and no CI; public/ holds only favicon.svg and vite.svg, so the og-image.png named in the Open Graph tags is still missing.

## [2026.09] - 2026-09-16

- Maintenance review of ai-toolkit-studio — a public React single-page app collecting free, browser-side AI tools for creators (no API keys required, per its own meta description).
- Status: Vite 7 + React 19 SPA with React Router, Tailwind CSS v4, Framer Motion and lucide-react. Two pages (Home, Admin), four tool components (PromptFlow, N8nVisualizer, SocialConverter, VideoScriptGenerator), a small UI kit and an ErrorBoundary. `vercel.json` configures SPA rewrites plus nosniff / DENY-frame / XSS headers; `index.html` declares the canonical URL https://ai-toolkit-studio.vercel.app/.
- Reviewed September 2026: README replaced (it was still the stock Vite + React template text) with a project-specific description and Status section, CHANGELOG created, package version bumped from 0.0.0 to 0.1.0. No application code, styling or dependency changes.
- Known gaps: no LICENSE; no tests and no CI; `public/og-image.png` is referenced by the Open Graph tags but is not present in the repo; last functional commit was February 2026.
