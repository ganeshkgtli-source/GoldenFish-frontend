# GoldenFish Frontend

## Overview
GoldenFish Frontend is a modern React SPA that implements the currently active product stages: **authentication + KYC verification + authenticated user dashboards**. It is structured to support “process-based” flows (step-by-step UX) and transactional screens (trading/orders-related pages).

This app is built with **Vite** (fast bundling), **TypeScript** (type-safe domain/data modeling), **TanStack Router** (file-based routing with generated route trees), **TanStack React Query** (server state caching/synchronization), **Tailwind CSS** (consistent utility-first styling), and **Zustand** (small client-side state like auth/session).

The app uses a custom **Axios-based** API layer for consistent HTTP behavior and error handling. Development tooling includes **ESLint**, **Prettier**, **Vitest/Playwright**, and **PostCSS/Autoprefixer**.

Key providers: Theme (dark/light mode), React Query, TanStack Router.

## “Process stage” mapping (why these technologies)
The repository currently reflects a pipeline like this:

1) **Entry & authentication stage**
- **TanStack Router**: keeps route definitions colocated with features/pages, which is critical for multi-step flows like register/login.
- **React Query mutations + hooks**: OTP/email verification and KYC submission are server mutations; React Query provides loading/error state and retries in a predictable way.
- **Zustand**: stores the authenticated user/session snapshot (including flags like `is_kyc_verified`) so UI can synchronously gate access to protected screens.

2) **KYC verification stage (the active “verification gate”)**
- **Form handling**: the codebase uses a step-like UX pattern (file upload + identifiers). The chosen libraries support validation and controlled inputs.
- **Axios + multipart/form-data**: KYC requires image uploads; Axios handles multipart payloads reliably with the correct headers.
- **parseError()** in the auth API layer: normalizes backend error shapes into user-friendly strings, which reduces UX friction in verification.
- **React Query onSuccess**: the KYC mutation updates auth state only when the backend confirms verification.

3) **Post-KYC authenticated stage (user dashboards & trading screens)**
- **React Query queries**: market data, orders, holdings, positions, etc. are server state that must be cached and refreshed safely.
- **Query keys per resource**: enables independent invalidation/refetching for each widget/table without reloading the whole app.
- **Tailwind**: consistent layout for data-dense screens (tables/cards) across pages.

4) **Future extensibility stage (trading/operations/admin workflows)**
- **TanStack Router file routing** makes it straightforward to add new admin operations and workflow pages without manually maintaining large route maps.
- **Feature folder convention** (api/hooks/pages/components) keeps changes localized as workflows grow.

### Tech Stack (what each is used for right now)
- **Framework: React 19** — UI rendering and component composition.
- **Build: Vite 8** — fast dev server + production bundling.
- **Router: @tanstack/react-router v1** — file-based routing + generated route tree for multi-step flows.
- **Data Fetching: @tanstack/react-query v5** — server-state queries/mutations with caching, invalidation, and retry behavior.
- **State: Zustand v5** — lightweight client state (auth/session flags like KYC status).
- **Forms: react-hook-form v7 + @hookform/resolvers + Zod v4** — structured validation for step-like forms.
- **Styling: Tailwind CSS v3 + clsx + tailwind-merge + lucide-react** — consistent UI for dashboards/tables.
- **HTTP: Axios** — reliable REST calls + multipart uploads (KYC images).
- **Utils: react-phone-number-input** — phone/OTP UX in authentication steps.
- **Testing: Vitest + jsdom + Testing Library + Playwright** — unit/integration + end-to-end coverage.
- **Lint/Format: ESLint v9 + TypeScript ESLint + Prettier** — consistency and safe refactors.


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

