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

### Upload (dropzone)

- `Upload` (`shared/ui/Upload`) is a drag&drop zone + click-to-pick (`"use client"`): hidden `<input type=file>` triggered by a button, drag state + size validation in state. States (hover/focus/drag-over/error/disabled) switch `--dz-*` vars; `error` and `disabled` are data-attrs, drag-over is component state. Colors from `--color-drop-zone-*`, dashed border. `maxSize` (bytes) shows a built-in "превышает размер" error; accepted files come back via `onFilesChange`.
- `Upload` has a `fileType` prop: `"files"` (default) renders a `FileItem` row list, `"images"` renders a grid of `PictureCard` thumbnails (128px, object URLs revoked on remove/unmount; `accept` defaults to image/*). Both track selected files in state; remove via the item/card action. `FileItem` (`--color-file-item-*`) shows icon/name/meta/progress/remove; `PictureCard` (`--color-picture-card-*`) shows a thumbnail with progress overlay (%), error overlay, and remove-on-hover.

### Avatar

- `Avatar` (`shared/ui/Avatar`) is a **server** component (no interactivity). 4 axes: `size` (16/20/24/28/32/40/64 — literal numbers, mapped to `--ryav-avatar-{n}-size`/`-icon-size`), `color` (12: neutral/primary/red/orange/yellow/lime/green/cyan/blue/pink/magenta/purple), `type` (soft/filled/tinted), `shape` (circle/square). Content resolves by priority: `src` → `<img class=avatar__img>` (native img — no `next/image`, object-fit cover), else `icon` → sized `<span class=avatar__icon>`, else `children` → text (initials), else a built-in person silhouette. `ring` adds a page-colored box-shadow for stacked avatars.
- Styles are a **generated** `shared/ui/Avatar/avatar.css` (`@layer components`) mapping tokens to `--av-*`, with `[data-type][data-color]` attribute selectors switching bg/fg (like `button.css`). Fill semantics: `filled` = colored bg + single light `foreground` (neutral is the exception, own bg + inverse text); `soft` = alpha-hover bg + per-color text; `tinted` = one grey bg + per-color text. The letter font-size (`--av-font`) has **no token** — values are provisional (like line-heights); flag to designer. Regenerate the color×type block only if the designer adds/removes a size, color, or type.

### Tag

- `Tag` (`shared/ui/Tag`) is a **server** component. Axes: `color` (12: secondary/primary/red/orange/yellow/lime/blue/cyan/green/magenta/pink/purple — note `secondary`, not neutral), `type` (soft/filled/tinted). Only one size (`sm`). Slots: `icon` (left, inherits text color via currentColor), `avatar` (lead slot, pass `<Avatar size={16}>` — overrides `icon`), `count`, and `onClose` (renders a native `<button class=tag__close>` — its `onClick`). `disabled` dims + blocks pointer.
- Styles are a **generated** `shared/ui/Tag/tag.css` (`@layer components`) mapping tokens to `--tag-*`, `[data-type][data-color]` switching bg/fg/close/count. The close button has default/hover/pressed via `:hover`/`:active` reading `--tag-close-*`. Fill semantics: `filled` = colored bg + single light `foreground` + white-alpha close/count (**secondary** is the exception: light bg → inverse text + its own `-secondary` close/count tokens); `soft` = per-color everything; `tinted` = one grey bg + shared close/count, per-color `foreground` only. Tokens also define a `tertiary` color (excluded from the card's 12; add if needed). Tag text uses `--text-label-md`; count is nudged down by `--ryav-tag-sm-count-down`.

### Tooltip

- `Tooltip` (`shared/ui/Tooltip`) is built on **Ariakit** (`Ariakit.TooltipProvider` / `TooltipAnchor` / `Tooltip` / `TooltipArrow`) — hover/focus, positioning, and a11y (role=tooltip, aria-describedby) for free; `"use client"`. Inverted surface (light bg `--color-tooltip-bg` / dark text on the dark theme). API: `content`, a single-element `children` trigger (passed via `render={children}` — the trigger must forward `ref`; DS components spread `...rest` so React 19 `ref` flows through), `direction`, plus `open`/`defaultOpen` passthrough (used by the showcase story to force all 12 open).
- The designer's **12 directions** (`{side}-{align}`, e.g. `top-left`/`right-bottom`) map to Ariakit's 12 placements (`top-start`/`right-end`) via a `PLACEMENT` record. `TooltipArrow` (size 16) draws the notch and auto-takes the tooltip's background color + placement. `gutter={8}` = `--ryav-tooltip-arrow-gap`. Styles in `shared/ui/Tooltip/tooltip.css` (padding/radius/max-width 280 from tokens). The box-shadow is **provisional** — the DS has no shadow tokens yet (flag to designer).
- **Ariakit tooltips are one-at-a-time**: the anchor coordinates a module-global "active store", so multiple _force-open_ (`open`) tooltips on one page thrash each other and disturb any hovered live tooltip (symptom: hover flashes then hides, works after a click/focus). Never force many tooltips open together. The `Directions` showcase therefore uses **static presentational bubbles** — `<span class="tooltip tooltip-demo" data-direction=...>` with a CSS `::after` notch — not live tooltips. Live tooltips (Playground/LongText) stay closed-initially so they never fight.

### Selection controls (Checkbox / Radio / Switch)

- `Checkbox`, `Radio`, `Switch` (`shared/ui/{Checkbox,Radio,Switch}`) are styled native inputs: a visually-hidden `<input>` inside a `<label>` drives state + a11y, a custom visual sibling is styled from tokens. States (hover/pressed/focused/disabled) come from input pseudo-classes via the `~` sibling combinator, switching `--cb-*`/`--rb-*`/`--sw-*` custom properties.
- `Checkbox` is `"use client"` (indeterminate is a DOM property set via ref; CSS uses the native `:indeterminate` pseudo-class). `Radio` and `Switch` are server-compatible.
- Radios group via a shared native `name`. Switch is `<input type=checkbox role=switch>`.

### Select & headless primitives

- `Select` (`shared/ui/Select`) is built on **Ariakit** (`@ariakit/react`) — headless a11y/keyboard/positioning, styled with our tokens. Modes: single, `searchable`, `multiple` (checkboxes), `multiple` + `tags`. The trigger reuses the Input field visual (imports `../Input/input.css`; wrapper is a `<div class="input select">`). Dropdown/options styled from `--color-dropdown-*` / `--color-menu-item-*` / `--ryav-menu-*` in `shared/ui/Select/select.css`.
- Prefer Ariakit for any future overlay/interactive primitive (Combobox, Menu, Dialog, Tooltip) so a11y/positioning stay consistent.
- `searchable` (single only) makes the trigger an editable input you type into to filter (Ariakit Combobox path; combobox operates on the option label, mapped back to value in onChange). Multi/tags use the Select path (chevron, no search). Tag removal uses a `role="button"` span (avoids nested `<button>`); the tags trigger grows in height as tags wrap.

### Component declarations

Components are **arrow consts**: `export const Button = ({ ... }: ButtonProps) => { ... }`. Same for internal, non-exported ones inside a file (`Base` in Typography, `PlainSelect` in Select, `MarqueeRow` in QuoteMarquee).

Exceptions, on purpose:

- **Next file conventions** in `app/` stay function declarations — `export default async function QuotesPage()`, `export default function RootLayout()`, `export async function POST()` in `route.ts`. That is the form in the Next docs and in `create-next-app` output, so it stays greppable/recognisable.
- **Plain helpers** (not components) stay `function` declarations: `formatQuoteDate`, `positionColor`, `formatSize`, `shuffle<T>`. Hoisting lets them sit _below_ the component that uses them (main thing first, plumbing after), and a generic arrow in a `.tsx` would need the `<T,>` comma hack.
- **Never** `export default () => …` — an anonymous default export has no name for Fast Refresh to match between recompiles, so instead of preserving state it remounts (and shows as `Anonymous` in DevTools/stack traces). A named `const` is fine: the name is inferred from the variable.

`displayName` and `Object.assign` compounding work the same on arrow consts (TS supports expando properties on un-annotated `const` functions) — see `Typography` and `Input.TextArea`.

### Styling Conventions

- Use Tailwind v4 utility classes for layout and styling; no styled-components, no CSS modules
- Design tokens live in `styles/`:
  - `tokens.css` — exported from Figma by the designer, **never edit by hand** (replaced wholesale on re-export)
  - `reset-defaults.css` — disables Tailwind's built-in palette/spacing/text scales so only design-system tokens exist
  - `theme.css` — project overrides on top of tokens (font stacks via `next/font`, unit fixes)
- Spacing tokens are in **pixels**, not Tailwind's `0.25rem` scale. But **do not use the numeric scale in JSX** (`gap-16`, `p-32`) — those are primitives, and they are bound to the exported token names: if the designer renames or drops a step, the class silently stops being generated (no build error, the default scale is disabled in `reset-defaults.css`). Use the semantic scale from `styles/theme.css` instead:
  - `gap-space-*` / `mt-space-*` — space BETWEEN elements; `p-inset-*` — padding INSIDE a frame. Steps are shared by both: `2xs`=8, `xs`=12, `sm`=16, `md`=20, `lg`=24, `xl`=32, `2xl`=40.
  - Direction is not encoded (no `stack`/`inline`): the container already says it via `flex-col`, and our vertical and horizontal rhythms use the same values.
  - This scale is **ours**, not the designer's — flag it, and replace it with `space/*` from Figma Variables if he has one.
  - Page-level: `px-page-margin` (grid margin, aligns with `<main>`), `mt-layout-block` (184px rhythm between page zones, `--ryav-layout-block-gap`).
  - Values outside the scale stay numeric with a comment (`mt-96`, `mt-56` in `app/quotes/page.tsx` — not in the tokens, pending the designer).
- Prefer semantic tokens (`bg-surface-bg-page`, `text-surface-text-heading`, `bg-action-primary-bg-default`) over primitives (`bg-purple-500`)
- Typography: `font-heading` (Geologica) / `font-body` (PT Root UI), sizes `text-display-*`, `text-heading-*`, `text-body-*`, `text-label-*`, tracking `tracking-<same-name>`
- Component-specific dimensions are `--ryav-*` variables. **Do not consume them as arbitrary values** (`gap-[var(--ryav-year-nav-gap)]`) — that syntax is unreadable and was removed from the codebase. Instead:
  - Colors need nothing: `--color-*` tokens are already in a Tailwind namespace, so `bg-sidebar-card-bg`, `text-quote-card-text-color`, `border-t-quote-card-border-color` work out of the box. Never write `bg-[color:var(--color-…)]`.
  - Single dimensions: add an alias in `styles/theme.css` under `@theme inline` — `--spacing-year-nav: var(--ryav-year-nav-gap)` gives `gap-year-nav`. Namespaces: `--spacing-*` → `p-`/`m-`/`gap-`/`w-`/`h-`, `--radius-*` → `rounded-`, `--border-width-*` → `border-` (incl. `border-t-`). `inline` is required so the token is substituted directly instead of through an extra Tailwind variable. Name the alias after the **element**, not the property (`--spacing-year-nav`, not `-year-nav-gap`, else you get `gap-year-nav-gap`).
  - Several dimensions of one kind on the same element (padding X + Y, or both gap and padding): one `@utility` in `styles/theme.css` — `@utility p-quote-card-footer { padding: … }`. An alias would collide, since a single `--spacing-*` name feeds both `p-` and `gap-`; on a collision Tailwind merges both declarations into one rule and the namespace wins.
  - Bare `--border-width-*` tokens are already usable as `border-1` / `border-t-2`.
- Dark theme only
- Shared UI components in `shared/ui/`
- Fonts are wired in `app/fonts.ts` (single source for app + Storybook): Geologica via `next/font/google`, PT Root UI via `next/font/local` from `app/fonts/*.woff2`. **Caveat:** PT Root UI ships 300/400/500/700; the `--font-weight-semibold` token (600) has no exact face → browser falls back to 700. Flag to designer if that matters.
- Typography is a **compound** component: `Typography.Display|Heading|Body|Label` with a `size` prop (`shared/ui/Typography`). `as` (semantic tag) is decoupled from visual size — pass `as="h1"…"h6"` for real headings; default element is `p` (`span` for Label). Weight/color via `weight` and `color` props.
- Button (`shared/ui/Button`) has 4 axes: `variant` (filled/outlined/ghost/soft), `tone` (primary/secondary/tertiary/error — named `tone` because the native `<button type>` attribute is kept), `size` (sm/md/lg). States (hover/pressed/focused/disabled) are **native pseudo-classes**, not props/JS. Supports `leftIcon`/`rightIcon`/`avatar`; no children ⇒ square icon-only button.
- Input (`shared/ui/Input`) axes: `size` (sm/md/lg — named `size`, native `<input size>` omitted). Wrapper is a `<label>` (click-to-focus, no useId, stays a Server Component). States: hover/focused via pseudo-classes, `error` and `disabled` via props/data-attrs; "filled" is automatic (typed text uses value color, placeholder uses ::placeholder). Compound: `Input.TextArea` renders a multi-line `<textarea>` with the same visual (reuses input tokens; textarea adds only `--ryav-textarea-*-padding-y`, vertical resize) and an optional character counter (`showCount`, uses --color-textarea-counter-* which equal helper colors). The module is `"use client"` because the counter tracks length in state. Styles in `shared/ui/Input/input.css`. Font-size per size uses the body scale (sm=body-sm, md=body-md, lg=body-lg).
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

### Who writes the code

The owner writes the code himself; Claude is a consultant and an occasional executor, not the default author.

- **Do not touch the files unless explicitly asked.** Editing/creating/deleting code requires a direct request in the current message ("сделай", "напиши", "поправь", "внеси", "делегирую тебе X"). A question, a discussion of an approach, a shown snippet, a complaint about a bug, or an agreed plan are **not** permission to edit.
- **Default response = an answer, not a diff.** Explain the approach, trade-offs and the exact steps; show code only as an illustration in the chat (a fenced block), so the owner types it in himself.
- If a change looks obviously needed, describe it and ask — one line is enough ("хочешь, внесу?"). Then wait.
- Explicit permission is **per-request**: it covers the task that was asked for, not the neighbouring files or the "while I'm here" cleanup, and it does not carry over to the next message.
- Reading and searching the repo, running `lint`/`build`/`db:*` and other read-only commands are always fine — the restriction is about writing to the project's files.
