# StyleK Frontend

Frontend application untuk StyleK Platform menggunakan Next.js 14, React 18, dan TypeScript.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root folder `frontend/`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api

# Google OAuth (Required for Google login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note:** Generate `NEXTAUTH_SECRET` dengan command:
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (login, register)
│   ├── (protected)/       # Protected routes per role
│   │   ├── brand/         # Brand portal
│   │   ├── creator/        # Creator portal
│   │   └── admin/          # Admin portal
│   └── api/                # API routes
│       └── auth/           # NextAuth handler
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   └── auth/               # Auth components
├── lib/                    # Utilities & configs
│   ├── api/                # API clients (axios, auth helpers)
│   ├── auth/               # NextAuth config
│   └── config/             # App configs (routes, constants)
├── store/                   # Zustand stores
├── types/                   # TypeScript types
└── utils/                   # Utility functions
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + lucide-react
- **State Management:** 
  - TanStack Query (React Query) untuk server state
  - Zustand untuk client/UI state
- **Forms:** react-hook-form + zod
- **Auth:** NextAuth.js (Credentials + Google OAuth)
- **HTTP Client:** Axios

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Phase 1 Complete ✅

Phase 1 implementation includes:

- ✅ Environment setup & configuration
- ✅ NextAuth integration (Credentials Provider)
- ✅ Axios instance with auth interceptor
- ✅ Auth screens (Login, Register Brand/Creator)
- ✅ Role-based layouts (Brand, Creator, Admin)
- ✅ Middleware for route protection
- ✅ Zustand UI store (sidebar state)
- ✅ Basic UI components (Button, Input, Card, Label)
- ✅ Route configuration

## Next Steps

See `docs/frontend-docs/7.5. FRONTEND_PHASE2.MD` for Phase 2 development plan.
