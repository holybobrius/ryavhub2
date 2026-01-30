# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Database operations
npm run db:push       # Push schema changes to database (development)
npm run db:migrate    # Create and apply migrations
npm run db:generate   # Generate Prisma client
npm run db:studio     # Open Prisma Studio
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

After modifying `prisma/schema.prisma`, run `npm run db:generate` to regenerate the Prisma client, then `npm run db:push` to sync changes to the database.

### Styling Conventions

- Use Tailwind utility classes for layout and styling
- Custom theme with CSS custom properties for colors
- Dark theme by default
- Shared UI components in `shared/ui/` (Button, Typography, Avatar, etc.)

### Locale and Language

The app is primarily in **Russian**. When working with dates, use dayjs with Russian locale:
```typescript
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");
```
