# AI ToolKit Studio

Free, browser-side tools for creators and developers: a visual prompt builder, an n8n workflow visualizer, a social post converter and a video script generator.

**Live:** https://ai-toolkit-studio.vercel.app

## Tools

| Tool                   | Component                                       |
| ---------------------- | ----------------------------------------------- |
| Prompt Flow            | `src/components/tools/PromptFlow.jsx`           |
| n8n Visualizer         | `src/components/tools/N8nVisualizer.jsx`        |
| Social Converter       | `src/components/tools/SocialConverter.jsx`      |
| Video Script Generator | `src/components/tools/VideoScriptGenerator.jsx` |

## Stack

Vite 7, React 19, React Router 7, Tailwind CSS 4, Framer Motion, lucide-react. Static SPA on Vercel (`vercel.json` holds rewrites and security headers).

## Run it

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm run lint
```

Everything runs in the browser. No backend or API key is required.

Demo built by SkynetLabs.
