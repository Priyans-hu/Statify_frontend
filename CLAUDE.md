# Statify Frontend - Claude AI Instructions

## Project Overview
Statify is a multi-tenant real-time status page system. This is the Next.js frontend that provides the dashboard for managing services, incidents, and viewing status pages.

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Components**: shadcn/ui
- **State**: React hooks
- **Real-time**: WebSocket for live updates

## Project Structure
```
frontend/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable UI components (shadcn/ui)
│   ├── features/       # Feature-specific components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities, API client, WebSocket
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # App constants
│   └── styles/         # Global styles
├── public/             # Static assets
└── package.json
```

## Development Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Code Conventions
- Use TypeScript for all new files
- Use shadcn/ui components from `@/components/ui`
- Follow Next.js App Router conventions
- Use `@/` path alias for imports
- Keep components small and focused

## Component Guidelines
- Prefer shadcn/ui components over custom implementations
- Use Tailwind classes for styling
- Extract reusable logic into custom hooks
- Type all props with TypeScript interfaces

## API Integration
- API client in `src/lib/`
- Handle WebSocket connections for real-time updates
- Store JWT token for authenticated requests

## Styling
- TailwindCSS for utility-first styling
- shadcn/ui for component library
- Custom styles in `src/styles/`

## Common Imports
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
```

## Adding New Pages
1. Create page in `src/app/` following App Router conventions
2. Use layouts for shared UI
3. Create feature components in `src/features/`
4. Add types in `src/types/`

## Adding New Components
1. For UI primitives, use shadcn/ui: `npx shadcn-ui@latest add [component]`
2. For custom components, add to `src/components/`
3. Keep components typed with TypeScript

## Real-time Updates
WebSocket connection provides live updates for:
- Service status changes
- New incidents
- Incident updates

## Environment Variables
Create `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL
