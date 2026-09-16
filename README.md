# AI ToolKit Studio

A collection of free, browser-side AI tools for creators, developers and content professionals — a visual prompt builder, an n8n workflow visualizer, a social-post converter and a video-script generator. No API keys required.

## Status

Last reviewed: September 2026 · release v2026.09

## Stack

- Vite 7 + React 19, React Router 7
- Tailwind CSS v4, Framer Motion, lucide-react
- Deployed as a static SPA on Vercel (see `vercel.json` for rewrites and security headers)

## Tools

| Tool | Component |
| --- | --- |
| Prompt Flow | `src/components/tools/PromptFlow.jsx` |
| n8n Visualizer | `src/components/tools/N8nVisualizer.jsx` |
| Social Converter | `src/components/tools/SocialConverter.jsx` |
| Video Script Generator | `src/components/tools/VideoScriptGenerator.jsx` |

## Development

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # production build
npm run preview  # preview the build
npm run lint     # eslint
```
