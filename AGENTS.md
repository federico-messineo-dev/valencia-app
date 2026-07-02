# AGENTS.md - Valencia App

## Tech Stack

- **Framework**: React 19
- **Build tool**: Vite 8
- **CSS**: Tailwind CSS v4 (use `@import "tailwindcss"` — no `tailwind.config.js` needed)
- **Icons**: Lucide React
- **Language**: JavaScript (JSX) — no TypeScript
- **Linting**: ESLint with react-hooks and react-refresh plugins

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

Always run `npm run lint` after code changes.

## Project Structure

```
valencia-app/
├── public/              # Static assets (icons, images)
├── src/
│   ├── assets/          # Images, SVGs imported by components
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components (one per route)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── index.css        # Tailwind import + global styles
│   ├── main.jsx         # Entry point
│   └── App.jsx          # Root component with routing
├── DESIGN.md            # Design system reference
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Code Conventions

### React
- Functional components only — no class components
- Use `export default` for components
- File naming: `ComponentName.jsx` for components, `useHookName.js` for hooks
- Props destructuring in function signature
- Keep components small; split when a component exceeds ~150 lines

### Tailwind CSS v4
- Utility-first: use Tailwind classes directly in JSX
- **No `tailwind.config.js`** — Tailwind v4 uses CSS-based config via `@theme` in `index.css`
- Custom theme values (colors, fonts) go in `src/index.css` using `@theme {}`
- Avoid custom CSS files; use Tailwind utilities + `@apply` only when necessary
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Use `cn()` or template literals for conditional classes

### Design System (from DESIGN.md)
- **Primary**: `#FF7A00` (Orange Valencia)
- **Secondary**: `#D9531E` (Terracotta)
- **Background**: `#FDFBF7` (Sabbia Soft)
- **Surface**: `#FFFFFF`
- **Accent**: `#00A3FF` (Azzurro Mare)
- **Text**: `#1C1B1A` (Notte)
- Font: Inter or Geist
- Cards: `rounded-2xl shadow-sm`
- Mobile-first UX, bottom tab navigation

### File Organization
- One component per file
- Co-locate related files (component + styles + tests in same folder)
- Assets in `src/assets/`, static files in `public/`

## Routing

Use React Router (`react-router-dom`) for navigation. Define routes in `App.jsx`.

## Performance

- Lazy-load pages with `React.lazy()` + `Suspense`
- Optimize images (WebP format, proper sizing)
- Use `loading="lazy"` on `<img>` tags
