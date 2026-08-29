# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses **bun** as the package manager.

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun start

# Run linting
bun run lint
bun run lint:fix

# Storybook (design system) — http://localhost:6006
bun run storybook          # dev server
bun run build-storybook    # static build

# Format code
bun run format
bun run format:check

# Database operations
bun run db:push       # Push schema changes to database (development)
bun run db:migrate    # Create and apply migrations
bun run db:generate   # Generate Prisma client
bun run db:studio     # Open Prisma Studio
```

## Architecture Overview

This is a **Next.js 16 application** with the **App Router**, using **TypeScript**, **Prisma ORM** with MySQL, and **Tailwind CSS v4**. The app follows a feature-based architecture with clear separation between server and client components.

### Tech Stack

- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript 5
- **Database**: MySQL with Prisma ORM
- **Styling**: Tailwind CSS v4 with custom theme
- **State**: Zustand for client-side auth state
- **Authentication**: Custom session-based auth (not NextAuth)

### Project Structure

```
├── app/                    # Next.js App Router (routes and API)
│   ├── api/               # API routes (RESTful endpoints)
│   ├── components/        # Page-level components (Navbar, Footer)
│   ├── quotes/            # Quotes feature pages
│   ├── timeline/          # Timeline feature pages
│   └── saves/             # Game saves feature pages
├── features/              # Feature-based modules
│   ├── auth/              # Authentication logic and models
│   ├── quotes/            # Quotes functionality
│   └── users/             # User management
├── shared/                # Shared utilities and UI
│   ├── ui/                # Reusable UI components
│   ├── model/             # Shared models (e.g., session validation)
│   └── errors/            # Custom error classes (UnauthError)
├── lib/                   # Core utilities
│   ├── db.ts              # Prisma client instance
│   ├── stores/            # Zustand stores (auth)
│   └── providers/         # React providers (AuthProvider)
├── prisma/                # Database schema and migrations
└── styles/                # Global styles and theme
```

### Key Architectural Patterns

**Feature-Based Architecture**: Each major feature has its own module under `features/` containing models, services, and UI components.

**Server/Client Component Split**: Use Server Components by default for data fetching and auth. Use Client Components (`"use client"`) only for interactivity (voting, forms, UI state).

**Path Aliases**: Use `@/` for absolute imports (e.g., `@/lib/db`, `@/shared/ui/Button`). This is configured in `tsconfig.json`.

**Authentication Flow**: Custom session-based auth using cookies. The `AuthProvider` wraps the app and manages auth state via Zustand. Use `validateSession()` from `@/shared/model/validateSession` in API routes to authenticate requests.

**Error Handling**: Use `UnauthError` from `@/shared/errors/UnauthError` for authentication failures. Throw this in API routes when validation fails.

**Database Access**: Import the Prisma client from `@/lib/db` for all database operations.

### Database Models

The app uses Prisma with MySQL. Key models:

- **users**: User accounts with gauntlet status
- **quotes**: User-submitted quotes with upvote/downvote
- **quote_rankings**: User votes on quotes
- **timeline**: Events with participants
- **gamesaves**: Game save file metadata
- **gauntlet_games**: Gaming challenge system
- **sessions**: Session management

Prisma 7 setup: connection URL lives in `prisma.config.ts` (not in the schema), MySQL is accessed via the `@prisma/adapter-mariadb` driver adapter, and the client is generated as TypeScript into `lib/generated/prisma/` (gitignored; `postinstall` and `build` run `prisma generate`). Always import `db` from `@/lib/db` — never instantiate `PrismaClient` elsewhere.

After modifying `prisma/schema.prisma`, run `bun run db:generate` to regenerate the Prisma client, then `bun run db:push` to sync changes to the database.

### Styling Conventions

- Use Tailwind v4 utility classes for layout and styling; no styled-components, no CSS modules
- Design tokens live in `styles/`:
  - `tokens.css` — exported from Figma by the designer, **never edit by hand** (replaced wholesale on re-export)
  - `reset-defaults.css` — disables Tailwind's built-in palette/spacing/text scales so only design-system tokens exist
  - `theme.css` — project overrides on top of tokens (font stacks via `next/font`, unit fixes)
- Spacing tokens are in **pixels**: `p-16` = 16px, `gap-24` = 24px (not Tailwind's default `0.25rem` scale)
- Prefer semantic tokens (`bg-surface-bg-page`, `text-surface-text-heading`, `bg-action-primary-bg-default`) over primitives (`bg-purple-500`)
- Typography: `font-heading` (Geologica) / `font-body` (PT Root UI), sizes `text-display-*`, `text-heading-*`, `text-body-*`, `text-label-*`, tracking `tracking-<same-name>`
- Component-specific dimensions are `--ryav-*` variables, used as arbitrary values: `p-[var(--ryav-button-padding-x)]`
- Dark theme only
- Shared UI components in `shared/ui/`
- Fonts are wired in `app/fonts.ts` (single source for app + Storybook): Geologica via `next/font/google`, PT Root UI via `next/font/local` from `app/fonts/*.woff2`. **Caveat:** PT Root UI ships 300/400/500/700; the `--font-weight-semibold` token (600) has no exact face → browser falls back to 700. Flag to designer if that matters.
- Typography is a **compound** component: `Typography.Display|Heading|Body|Label` with a `size` prop (`shared/ui/Typography`). `as` (semantic tag) is decoupled from visual size — pass `as="h1"…"h6"` for real headings; default element is `p` (`span` for Label). Weight/color via `weight` and `color` props.
- Button (`shared/ui/Button`) has 4 axes: `variant` (filled/outlined/ghost/soft), `tone` (primary/secondary/tertiary/error — named `tone` because the native `<button type>` attribute is kept), `size` (sm/md/lg). States (hover/pressed/focused/disabled) are **native pseudo-classes**, not props/JS. Supports `leftIcon`/`rightIcon`/`avatar`; no children ⇒ square icon-only button.
- Input (`shared/ui/Input`) axes: `size` (sm/md/lg — named `size`, native `<input size>` omitted). Wrapper is a `<label>` (click-to-focus, no useId, stays a Server Component). States: hover/focused via pseudo-classes, `error` and `disabled` via props/data-attrs; "filled" is automatic (typed text uses value color, placeholder uses ::placeholder). Styles in `shared/ui/Input/input.css`. Font-size per size uses the body scale (sm=body-sm, md=body-md, lg=body-lg).
- State-heavy component styles are a generated CSS file (`shared/ui/Button/button.css`, `@layer components`) that maps `--color-button-*` / `--ryav-button-*` tokens to `--btn-*` custom properties, with pseudo-classes swapping which token feeds each var. It references tokens by name, so it survives Figma value re-exports; regenerate only if the designer adds/removes an axis value. Button font-size per size uses the body scale (sm=body-sm, md=body-md, lg=body-lg).
- Line-heights are **provisional** (in `styles/theme.css` as `--text-*--line-height`) — the Figma export has none. Replace when the designer provides them.
- Storybook 10 (`@storybook/nextjs-vite`, Vite builder). Stories live next to components as `*.stories.tsx` under `shared/**` or `features/**`. `.storybook/preview.tsx` imports `app/globals.css` and loads Geologica via `next/font`, so tokens/fonts match the app. Prefer stories for building UI in isolation before wiring into pages.

### Locale and Language

The app is primarily in **Russian**. When working with dates, use dayjs with Russian locale:

```typescript
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
```

## Working Style: Teach While Building

The project owner has deep experience with React, TypeScript, styled-components and micro-frontends, but is **new to Next.js (App Router), Bun and Tailwind CSS**. This project is deliberately a learning vehicle for those three tools.

When doing any task, explain the reasoning alongside the work — including fundamentals:

- **Why this file / why here**: App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`, dynamic `[id]` segments), what Next.js does with each file.
- **Why this pattern**: Server vs Client Components, where data fetching lives, when `"use client"` is needed, caching/rendering modes (static vs dynamic), `cookies()`/`headers()` and their consequences.
- **Why this tool**: Bun vs Node/npm (runtime, package manager, test runner, `bunfig.toml`, `bun.lock`), Tailwind v4 (`@theme`, utility classes vs styled-components mental model, CSS-first config).
- Draw comparisons to what the owner already knows (styled-components → Tailwind, CRA/Vite SPA → Next.js, Jest → `bun test`).

Keep explanations concise and attached to the actual change being made, not abstract lectures. Communicate in Russian.
