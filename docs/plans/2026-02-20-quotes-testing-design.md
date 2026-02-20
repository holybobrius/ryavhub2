# Quotes Feature Testing Design

## Overview
Design for testing the quotes feature using Vitest and React Testing Library, targeting core coverage (70-80%) with both unit and integration tests.

## Architecture

### Tech Stack
- **Test Runner**: Vitest (fast, modern, native ESM)
- **Component Testing**: React Testing Library
- **Mocking**: Vitest built-in mocking for Prisma and external dependencies

### Test Structure

```
features/quotes/
├── __tests__/
│   ├── getQuotesList.test.ts        # Unit tests for data functions
│   ├── QuoteCard.test.tsx          # Component tests
│   └── api-vote.test.ts            # Integration tests for API routes
└── ...

vitest.config.ts                     # Vitest configuration
test-setup.ts                        # Test utilities and custom render
```

## Test Coverage Scope

### Unit Tests

**getQuotesList.test.ts**
- Returns empty array when no quotes in database
- Correctly maps quote data with author information
- Filters rankings into upvotes and downvotes
- Handles missing author gracefully (returns empty name)

**getBestQuote.test.ts**
- Returns null when no quotes exist
- Returns quote with highest upvote-downvote ratio
- Randomly selects when multiple quotes have same top score
- Handles quotes with equal upvotes and downvotes (score 0)

### Component Tests

**QuoteCard.test.tsx**
- Renders quote text correctly
- Displays author name and formatted date
- Shows correct upvote/downvote counts
- Vote buttons have correct disabled state when voting
- Clicking upvote button sends API request
- Clicking downvote button sends API request
- Toggling vote (upvote -> downvote) works correctly
- Removing vote works correctly
- Auth state changes update vote button states
- Durak-enabled localStorage affects icon visibility

**QuotesPage.test.tsx** (via server component wrapper)
- Groups quotes into rows correctly based on length
- Small quotes (<150 chars) are grouped 2 per row
- Large quotes (>150 chars) take full row
- Best quote section renders when best quote exists
- Hero section renders with correct text

### Integration Tests

**api-vote.test.ts**
- Returns 400 for invalid quote ID
- Returns 400 for invalid vote type
- Returns 401 for unauthenticated requests
- Creates new upvote when no existing vote
- Creates new downvote when no existing vote
- Removes vote when clicking same vote type again
- Changes vote type when switching between upvote/downvote
- Returns correct updated vote counts
- Returns user's current vote state

## Test Utilities

### Custom Render Function
```typescript
function renderWithProviders(
  ui: React.ReactElement,
  options?: { authUser?: User | null }
)
```
Wraps components with `AuthProvider` and other necessary providers.

### Mock Utilities
- `mockDb.quotes.findMany()` - Mock Prisma queries
- `mockGetUserById()` - Mock user data fetcher
- `mockValidateSession()` - Mock session validation

## Dependencies to Install

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^23.0.0"
  }
}
```

## Configuration

**vitest.config.ts**
- Environment: jsdom for component tests, node for unit/integration tests
- Setup file: test-setup.ts
- Coverage reporting
- Path aliases support (@/)

## Success Criteria

- All tests pass locally and in CI
- Coverage ~70-80% for tested files
- Tests run in <2 seconds for quick feedback
- Mocks are maintainable and clearly documented
- API tests cover all success and error paths
