# GoldenFish Frontend

## Overview
This is a modern React Single Page Application (SPA) built with **Vite** (build tool), **TypeScript**, **TanStack Router** (file-based routing), **TanStack React Query** (data fetching/caching), **Tailwind CSS** (styling), **Zustand** (state management), and **Zod** + **React Hook Form** (form validation/handling). 

The app focuses on **authentication features** (login, register with wizard/OTP verification) and a basic home page. It uses a custom API layer (Axios-based) likely connecting to a backend (e.g., Django from nearby paths). Development tools include ESLint, Prettier, Vitest/Playwright for testing, and PostCSS/Autoprefixer.

Key providers: Theme (dark/light mode), React Query, TanStack Router.

### Tech Stack
- **Framework**: React 19
- **Build**: Vite 8
- **Router**: @tanstack/react-router v1
- **Data Fetching**: @tanstack/react-query v5
- **State**: Zustand v5
- **Forms**: react-hook-form v7 + @hookform/resolvers + Zod v4
- **Styling**: Tailwind CSS v3 + clsx + tailwind-merge + lucide-react icons
- **HTTP**: Axios
- **Utils**: react-phone-number-input (for OTP/phone), DevTools
- **Testing**: Vitest + jsdom + Testing Library + Playwright
- **Lint/Format**: ESLint v9 + TypeScript ESLint + Prettier

## Getting Started
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev` (opens at http://localhost:5173)
3. Build for prod: `npm run build` (outputs to `dist/`)
4. Lint: `npm run lint`
5. Test: `npm run test`
6. Preview build: `npm run preview`

## Project Structure & File Roles

### Root / Config Files
| File | Role |
|------|------|
| `package.json` | Defines dependencies, devDependencies, scripts (dev/build/lint/test). Core npm config. |
| `package-lock.json` | Locks dependency versions for reproducible installs. |
| `vite.config.ts` | Vite configuration: TanStack Router plugin (auto-generates routeTree), React plugin (fast HMR/SWC), path aliases (`@` → `src/`), Vitest globals/jsdom. |
| `tsconfig.json` | Root TypeScript config: references `tsconfig.app.json`/`tsconfig.node.json`, sets `baseUrl` and paths (`@/*` → `src/*`). |
| `tsconfig.app.json` | TS config for app source code (strict mode, DOM libs). |
| `tsconfig.node.json` | TS config for Node/Vite config files (ES modules, JSON libs). |
| `eslint.config.js` | Flat ESLint v9 config (modern JS-based). |
| `postcss.config.cjs` | PostCSS config for Tailwind/Autoprefixer processing. |
| `tailwind.config.cjs` | Tailwind config (content paths, theme customizations). |
| `vercel.json` | Vercel deployment config (rewrites, env vars). |
| `.gitignore` | Git ignore rules (node_modules, dist, logs). |
| `index.html` | App entry HTML template (mounts `#root`, loads Vite bundles). |
| `src.zip` | Archived source (likely backup; ignore in git). |
| `TODO.md` | Task tracker (e.g., RegisterWizard updates). |

### Public / Assets
| Directory/File | Role |
|----------------|------|
| `public/` | Static assets served at root (no bundling). |
| `public/favicon.svg` | Site favicon. |
| `public/icons.svg` | Shared SVG icons sprite. |
| `src/assets/` | Bundled assets. |
| `src/assets/hero.png` | Hero image (likely for home/landing). |
| `src/assets/react.svg`, `src/assets/vite.svg` | Default React/Vite logos (templates). |

### Source Code (`src/`)
#### Entry Points
| File | Role |
|------|------|
| `src/main.tsx` | App bootstrap: Creates TanStack Router, React Query client, ThemeProvider; renders RouterProvider to `#root`. |
| `src/App.tsx` | Root component (currently minimal/empty; wraps app if needed). |
| `src/App.css` | Global app styles (unused/minimal). |
| `src/index.css` | Global CSS: Imports Tailwind base/components/utilities + custom resets. |

#### Routing
| File | Role |
|------|------|
| `src/routes/` | File-based routes for TanStack Router (auto-imported to `routeTree.gen.ts`). |
| `src/routes/__root.tsx` | Root layout route (wraps all pages; error boundaries, loaders). |
| `src/routes/index.tsx` | Index/home route (redirects or default landing). |
| `src/routes/login.tsx` | Login page route. |
| `src/routes/register.tsx` | Register page route. |
| `src/routes/home.tsx` | Home page route. |
| `src/routeTree.gen.ts` | Auto-generated TanStack Router tree from `src/routes/` files. |

#### Contexts & State
| File | Role |
|------|------|
| `src/context/ThemeContext.tsx` | Theme provider (dark/light mode toggle; wraps app in `main.tsx`). |
| `src/store/authStore.ts` | Zustand store for auth state (user, tokens, actions like login/logout). |

#### Library / Utils
| File | Role |
|------|------|
| `src/lib/api.ts` | Base API config (Axios instance, interceptors, baseURL for backend). |
| `src/lib/queryClient.ts` | TanStack React Query client instance (defaults, persistence?). |

#### Features
##### `src/features/auth/` - Core Authentication Module
**API Layer**
| File | Role |
|------|------|
| `src/features/auth/api/authApi.ts` | Auth-specific queries/mutations (login/register/verify) using TanQ Query + Axios. |

**Components**
| File | Role |
|------|------|
| `src/features/auth/components/RegisterWizard.tsx` | Multi-step register form wizard (UI/steps logic). |
| `src/features/auth/components/OtpVerification.tsx` | OTP input/verification component (phone number). |
| `src/features/auth/components/ThemeToggle.tsx` | UI toggle for theme switching. |
| `src/features/auth/components/components/figma/ImageWithFallback.tsx` | Figma-exported image component with fallback. |

**Hooks**
| File | Role |
|------|------|
| `src/features/auth/hooks/useLogin.ts` | Custom hook for login form (React Query mutation + React Hook Form). |
| `src/features/auth/hooks/useRegister.ts` | Custom hook for register form (multi-step, validation). |

**Pages**
| File | Role |
|------|------|
| `src/features/auth/pages/LoginPage.tsx` | Full login page (form + layout). |
| `src/features/auth/pages/RegisterPage.tsx` | Full register page (wizard integration). |

**Schemas**
| File | Role |
|------|------|
| `src/features/auth/schemas/registerSchema.ts` | Zod schema for register form validation (fields, refinements). |

##### `src/features/home/`
| File | Role |
|------|------|
| `src/features/home/pages/HomePage.tsx` | Main home/landing page content. |

## Backend Integration
- API calls from `authApi.ts`/`lib/api.ts` target a backend (e.g., `../backend/accounts/` Django views/serializers visible in tabs).
- Environment vars for API base URL (via `.env` or Vercel).

## Development Notes
- **Routing**: Add pages in `src/routes/`; TanStack plugin auto-generates tree.
- **Data**: New queries/mutations in feature `api/` folders.
- **Forms**: Use Zod schemas + `useRegister`/`useLogin` patterns.
- **Testing**: Vitest for units (`npm test`), Playwright for E2E.
- **Deployment**: Vercel-ready (`vercel.json`).

For contributions, follow existing patterns: feature folders with pages/hooks/components/api/schemas.

