# Work Order Management System

A modern, full-stack work order management application built with SvelteKit 5, Hono, and Supabase.

## 🚀 Features

- **Work Order Management**: Create, view, update, and track work orders
- **Interactive Maps**: 
  - Search and display any address on a map
  - View all active work orders with location pins
  - Multiple marker support with work order details
- **Real-time Updates**: Powered by Supabase real-time subscriptions
- **Authentication**: Secure JWT-based authentication with Supabase
- **Type Safety**: Full TypeScript support with auto-generated API types
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS and DaisyUI

## 🛠️ Tech Stack

### Frontend
- **SvelteKit 5** - Modern web framework with Svelte 5 runes
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **TanStack Query** - Powerful data synchronization
- **Leaflet** - Interactive maps for multiple markers
- **Orval** - Type-safe API client generation

### Backend
- **Bun** - Fast JavaScript runtime
- **Hono** - Lightweight web framework
- **Supabase** - Database and authentication
- **OpenAPI/Swagger** - API documentation
- **Zod** - Schema validation

### Development Tools
- **Biome** - Fast formatter and linter
- **go-task** - Task runner for development workflows

## 📦 Project Structure

```
├── frontend/               # SvelteKit frontend application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api/       # Auto-generated API client (DO NOT EDIT)
│   │   │   ├── components/# Reusable Svelte components
│   │   │   │   └── maps/  # Map-related components
│   │   │   ├── constants/ # Application constants
│   │   │   ├── services/  # Business logic services
│   │   │   ├── stores/    # Svelte stores
│   │   │   └── types/     # TypeScript type definitions
│   │   └── routes/        # SvelteKit pages
│   └── static/            # Static assets
├── backend/               # Hono API server
│   ├── src/
│   │   ├── index.ts       # Main server setup
│   │   ├── lib/           # Shared utilities
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route handlers
│   │   └── schemas/       # Zod validation schemas
│   └── supabase/
│       └── migrations/    # Database migrations
└── CLAUDE.md              # AI assistant instructions
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Supabase](https://supabase.com) account and project
- [go-task](https://taskfile.dev) (optional but recommended)

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend && bun install

# Install backend dependencies
cd ../backend && bun install
```

3. Set up environment variables:

Create `.env` files in both `frontend/` and `backend/` directories:

**Frontend `.env`:**
```env
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
PUBLIC_API_BASE_URL=http://localhost:3000
```

**Backend `.env`:**
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

### Database Setup

1. Run the database migrations in your Supabase project:
   - Copy the SQL from `backend/supabase/migrations/`
   - Execute in Supabase SQL editor

2. Enable Row Level Security (RLS) policies as needed

### Development

Start both frontend and backend development servers:

```bash
# Using go-task (recommended)
task dev:frontend  # Frontend on http://localhost:5173
task dev:backend   # Backend on http://localhost:3000

# Or using bun directly
cd frontend && bun run dev
cd backend && bun run dev
```

### API Client Generation

When you make changes to the backend API:

1. Ensure the backend is running
2. Fetch the latest OpenAPI schema:
```bash
task openapi:fetch:frontend
```
3. Generate TypeScript client:
```bash
task openapi:generate:frontend
```

## 📝 Key Commands

### Development
- `task dev:frontend` - Start frontend dev server
- `task dev:backend` - Start backend dev server with hot reload
- `task lint` - Lint entire codebase
- `task format` - Format code with Biome
- `task check:frontend` - Type check frontend

### Building
- `task build:frontend` - Build frontend for production
- `task preview:frontend` - Preview production build

### API Generation
- `task openapi:fetch:frontend` - Fetch OpenAPI schema from backend
- `task openapi:generate:frontend` - Generate TypeScript API client

### Testing
- `cd frontend && bun test` - Run frontend tests
- `cd backend && bun test` - Run backend tests

## 🏗️ Architecture

### Authentication Flow
1. User signs in via Supabase Auth
2. Frontend receives JWT tokens
3. API client automatically includes auth token
4. Backend verifies JWT on protected routes
5. User context available via `c.get('userId')`

### Data Flow
```
Frontend (SvelteKit) 
    ↓ (HTTP + Auth Token)
Backend API (Hono)
    ↓ (Supabase Client)
Database (PostgreSQL)
```

### Map Features
- **Single Address Search**: Uses OpenStreetMap iframe embed
- **Multiple Work Orders**: Dynamic Leaflet.js map with markers
- **Geocoding**: Nominatim API with caching and rate limiting
- **Performance**: Lazy loads map library only when needed

## 🔒 Security

- JWT-based authentication
- Row Level Security (RLS) in Supabase
- Input validation with Zod schemas
- CORS configuration for API endpoints
- Environment variables for sensitive data

## 🎨 UI Components

The application uses DaisyUI components with Tailwind CSS:
- Responsive tables for work order listings
- Modal dialogs for forms
- Toast notifications for user feedback
- Loading states and error boundaries
- Accessible form controls

## 📊 Database Schema

Key tables:
- `profiles` - User profiles
- `work_orders` - Main work order records
- `locations` - Address and geocoding data
- `assignments` - Work order assignments

## 🚧 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `task build:frontend`
2. Deploy the `frontend/build` directory

### Backend (Railway/Fly.io)
1. Use the provided `Dockerfile` in `backend/`
2. Set environment variables in hosting platform
3. Deploy with automatic SSL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 License

MIT License

## 🙏 Acknowledgments

- SvelteKit team for the amazing framework
- Supabase for the backend infrastructure
- OpenStreetMap contributors for map data