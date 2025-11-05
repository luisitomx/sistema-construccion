# Web Frontend - Sistema de Construcción

Aplicación web construida con **Next.js 14 (App Router)** para el Sistema Integral de Gestión de Construcción.

## Estado del Proyecto

### ✅ Configuración Base (100%)
- [x] Next.js 14 con App Router
- [x] TypeScript configurado (strict mode)
- [x] Tailwind CSS configurado
- [x] Package.json con dependencias

### ⏳ En Implementación
- [ ] Apollo Client setup
- [ ] Páginas de autenticación
- [ ] Dashboard
- [ ] Gestión de proyectos
- [ ] Componentes UI
- [ ] GraphQL integration

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **GraphQL Client**: Apollo Client 3.8
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Estructura del Proyecto

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Protected routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── projects/          # Project components
│   └── spaces/            # Space components
├── lib/
│   ├── apollo-client.ts   # Apollo Client config
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # General utilities
├── graphql/
│   ├── queries/           # GraphQL queries
│   ├── mutations/         # GraphQL mutations
│   └── fragments/         # GraphQL fragments
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Quick Start

### 1. Install Dependencies

```bash
cd apps/web
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Application runs on http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## Features

### Autenticación
- [x] Login page
- [x] Register page
- [ ] Protected routes con middleware
- [ ] JWT token management
- [ ] Refresh token handling

### Dashboard
- [ ] Stats cards (proyectos, espacios, área total)
- [ ] Recent projects list
- [ ] Activity feed
- [ ] User info display

### Gestión de Proyectos
- [ ] Lista de proyectos con paginación
- [ ] Detalle de proyecto
- [ ] Crear proyecto
- [ ] Editar proyecto
- [ ] Eliminar proyecto
- [ ] Stats por proyecto

### Gestión de Espacios
- [ ] Lista de espacios por proyecto
- [ ] Detalle de espacio
- [ ] Crear espacio
- [ ] Editar espacio
- [ ] Comparación área requerida vs real

### UI Components
- [ ] Button (variants + loading states)
- [ ] Input (con validación)
- [ ] Select
- [ ] Card
- [ ] Modal
- [ ] Table (con sorting + pagination)
- [ ] Badge
- [ ] Spinner

### Layouts
- [ ] Navbar con user menu
- [ ] Sidebar con navegación
- [ ] Footer
- [ ] Responsive design

## GraphQL Integration

### Example Query

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_PROJECTS = gql`
  query GetProjects($limit: Int, $offset: Int) {
    projects(limit: $limit, offset: $offset) {
      nodes {
        id
        name
        client
        status
      }
      totalCount
    }
  }
`;

function ProjectsList() {
  const { data, loading } = useQuery(GET_PROJECTS, {
    variables: { limit: 10, offset: 0 }
  });

  if (loading) return <Spinner />;

  return (
    <div>
      {data.projects.nodes.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Example Mutation

```typescript
import { useMutation, gql } from '@apollo/client';

const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
    }
  }
`;

function CreateProjectForm() {
  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (data) => {
    await createProject({
      variables: { input: data }
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Environment Variables

```env
# API URLs
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## Development Guidelines

### Component Structure

```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  loading,
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium',
        variant === 'primary' && 'bg-primary-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        loading && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

### Page Structure

```typescript
// app/(dashboard)/projects/page.tsx
'use client';

import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/graphql/queries/projects';

export default function ProjectsPage() {
  const { data, loading } = useQuery(GET_PROJECTS);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Projects</h1>
      {/* content */}
    </div>
  );
}
```

## Scripts

```bash
# Development
npm run dev            # Start dev server on port 3000

# Build
npm run build          # Build for production
npm start              # Start production server

# Quality
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

## Responsive Design

Breakpoints (Tailwind):
- `sm`: 640px
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px
- `2xl`: 1536px

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
</div>
```

## Authentication Flow

1. User visits protected route
2. Middleware checks for valid token
3. If no token → redirect to `/login`
4. User logs in → receives JWT tokens
5. Tokens stored in localStorage
6. Apollo Client adds token to requests
7. User accesses protected resources

## Testing

```bash
# Run tests (cuando estén implementados)
npm run test

# E2E tests
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Apollo Client errors

**Error**: "Network error: Failed to fetch"
**Solution**: Check that API Gateway is running on port 4000

### Authentication issues

**Error**: Redirect loop on protected routes
**Solution**: Check middleware.ts and token validation

### Build errors

**Error**: Module not found
**Solution**: Clear `.next` folder and rebuild
```bash
rm -rf .next
npm run build
```

## Next Steps

1. Complete Apollo Client setup
2. Implement authentication pages
3. Create dashboard with stats
4. Build project management pages
5. Add space management
6. Create UI component library
7. Add tests
8. Deploy to production

## Support

For issues or questions:
- Project documentation: `/docs`
- Backend services: `services/programa/README.md`, `services/auth/README.md`
- API Gateway: `apps/api-gateway/README.md`

---

**Version**: 0.1.0 (In Progress)
**Framework**: Next.js 14
**Last Updated**: 2025-11-05
