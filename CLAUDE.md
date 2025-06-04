# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack web application with:
- **Frontend**: SvelteKit 5 with TypeScript, Tailwind CSS 4, DaisyUI, and TanStack Query
- **Backend**: Bun + Hono API server with OpenAPI/Swagger support
- **Authentication**: Supabase integration
- **Code Quality**: Biome for linting and formatting

## Essential Commands

### Development
```bash
# Frontend development (port 5173)
task dev:frontend

# Backend development with hot reload (port 3000)
task dev:backend

# Run both frontend and backend
task dev:frontend & task dev:backend
```

### Build & Preview
```bash
# Build frontend for production
task build:frontend

# Preview frontend production build
task preview:frontend
```

### Code Quality
```bash
# Lint entire codebase
task lint

# Format code with Biome
task format

# Type check frontend
task check:frontend
```

### API Client Generation
```bash
# Fetch latest OpenAPI schema from backend
task openapi:fetch:frontend

# Generate TypeScript API client from schema
task openapi:generate:frontend
```

### Testing
```bash
# Frontend tests
cd frontend && bun test

# Backend tests
cd backend && bun test
```

## Architecture

### Frontend Structure
- `/frontend/src/routes/` - SvelteKit pages and routing
- `/frontend/src/lib/api/` - Auto-generated API client (DO NOT EDIT - use orval)
- `/frontend/src/lib/components/` - Reusable Svelte components
- `/frontend/src/lib/stores/` - Svelte stores (authStore.ts for authentication state)
- Uses Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactivity
- TanStack Query for server state management

### Backend Structure
- `/backend/src/index.ts` - Main Hono server setup with CORS and auth middleware
- `/backend/src/routes/` - API route handlers (auth, users, items)
- `/backend/src/schemas/` - Zod schemas for validation and OpenAPI generation
- `/backend/src/middleware/` - Authentication middleware for Supabase JWT verification
- `/backend/src/lib/` - Shared utilities (Supabase client)
- Swagger UI available at `/ui` endpoint

### API Integration
- Frontend uses Orval to generate type-safe clients from OpenAPI spec
- API client wrapper (`client-wrapper.ts`) automatically includes Supabase auth tokens
- All API types are auto-generated in `/frontend/src/lib/api/schemas/`
- API client handles token refresh and 401 responses automatically

### Authentication Flow
1. User signs in via Supabase (`authStore.signIn`)
2. Supabase returns JWT tokens stored in its session
3. API client (`client-wrapper.ts`) retrieves token from Supabase session
4. Backend verifies Supabase JWT on protected routes
5. User context available in backend via `c.get('userId')`

## Key Development Notes

1. **Never manually edit** files in `/frontend/src/lib/api/` - they are auto-generated
2. **Use Task commands** - The project uses go-task, not npm scripts directly
3. **Biome for formatting** - Run `task format` before committing
4. **Type safety** - Both frontend and backend use TypeScript with strict mode
5. **API changes** - After backend API changes, run `task openapi:fetch:frontend && task openapi:generate:frontend`
6. **Environment variables** - Frontend uses `PUBLIC_API_BASE_URL` for API endpoint configuration