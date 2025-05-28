# Svelte 5 Starter Project

A modern web application built with Svelte, SvelteKit, TypeScript, and Tailwind CSS. This project includes authentication, API integration with OpenAPI, and a responsive UI powered by DaisyUI.

## 🚀 Features

- ⚡ Svelte 5 with runes for fine-grained reactivity
- 🎨 Tailwind CSS 4 with DaisyUI components
- 🔄 TanStack Query for server state management
- 🔒 Authentication flow with JWT
- 📦 TypeScript for type safety
- 🛠️ Vite for fast development and builds
- 📝 OpenAPI integration with Orval for type-safe API clients

## 🛠️ Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lconnell/svelte5.git
   cd svelte5
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` in the root directory.

4. **Generate API client**
   ```bash
   npm run openapi:fetch
   npm run openapi:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
svelte5/
├── src/
│   ├── lib/
│   │   ├── api/                  # API client and utilities
│   │   │   ├── client.ts         # API client configuration
│   │   │   ├── client-wrapper.ts # Axios instance wrapper
│   │   │   ├── error.ts          # Error handling utilities
│   │   │   ├── schemas/          # Auto-generated API schemas
│   │   │   └── openapi.json      # OpenAPI spec
|   │   │
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── components/           # Reusable UI components
│   │   │   └── MapForm.svelte    # Form component with map integration
│   │   ├── queryClient.ts        # TanStack Query client configuration
│   │   └── index.ts              # Library exports
│   │
│   ├── routes/
│   │   ├── items/                # Items feature
│   │   │   └── +page.svelte      # Items listing and management
│   │   ├── login/                # Authentication
│   │   │   └── +page.svelte      # Login page
│   │   ├── +layout.svelte        # Root layout
│   │   ├── +layout.ts            # Root layout server code
│   │   └── +page.svelte          # Home page
│   │
│   ├── app.css                   # Global styles 
│   ├── app.d.ts                  # TypeScript declarations
│   └── app.html                  # HTML template
│
├── static/                       # Static assets
├── .eslintrc.cjs                 # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── postcss.config.cjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── .stylelintrc.cjs              # Stylelint configuration
├── orval.config.ts               # Orval configuration
└── vite.config.ts                # Vite configuration    
```

## 🛠️ Development Scripts

- `npm run dev`                   # Start development server
- `npm run build`                 # Build for production
- `npm run preview`               # Preview production build
- `npm run check`                 # Run TypeScript and Svelte checks
- `npm run check:watch`           # Run checks in watch mode
- `npm run pretty:lint`           # Lint code
- `npm run pretty:fix`            # Fix linting and formatting issues
- `npm run openapi:fetch`         # Fetch latest OpenAPI schema
- `npm run openapi:generate`      # Generate API client from OpenAPI schema

## 🧪 Testing

To run tests:

```bash
npm test
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   The application is ready to be deployed to any static hosting service (Vercel, Netlify, etc.)

## 📝 License

This project is licensed under the MIT License.
