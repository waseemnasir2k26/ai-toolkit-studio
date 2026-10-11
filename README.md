# AI ToolKit Studio

A collection of free, browser-side AI tools for creators, developers and content professionals — a visual prompt builder, an n8n workflow visualizer, a social-post converter and a video-script generator. No API keys required.

## Status

Last reviewed: October 2026 · release v2026.10

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

## Work with SkynetLabs

Built by [Waseem Nasir](https://www.skynetjoe.com/?utm_source=github&utm_medium=readme&utm_campaign=ai-toolkit-studio) at SkynetLabs — n8n + AI automation for small businesses.

- Hire on Fiverr: https://www.fiverr.com/agencies/skynetjoellc
- Hire on Upwork: https://www.upwork.com/freelancers/muhammadwaseemnasir
- Book a free call: https://calendly.com/skynetlabs/schedule-a-free-consultation
