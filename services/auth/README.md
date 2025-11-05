# Microservicio Auth - Autenticación y Autorización

Sistema de autenticación basado en **JWT (JSON Web Tokens)** con **RBAC (Role-Based Access Control)** para el Sistema de Construcción.

## Características

- ✅ Autenticación con JWT (Access + Refresh tokens)
- ✅ RBAC con Roles y Permisos granulares
- ✅ Passwords hasheados con bcrypt
- ✅ Refresh token rotation
- ✅ Token revocation
- ✅ Email validation
- ✅ Rate limiting
- ✅ Clean Architecture

## Arquitectura

```
src/
├── domain/              # Entidades, Value Objects, Interfaces
│   ├── entities/        # User, Role, Permission, RefreshToken
│   ├── value-objects/   # Email
│   └── repositories/    # Interfaces de repositorios
├── application/         # Casos de Uso y DTOs
│   ├── use-cases/       # Register, Login, Refresh, Logout
│   └── dtos/            # DTOs con validaciones
├── infrastructure/      # Implementaciones
│   ├── database/        # TypeORM, Repositories, Seeds
│   ├── security/        # JWT, Password, Token services
│   └── http/            # Controllers, Guards, Strategies
└── main.ts              # Entry point
```

## Modelo de Datos

### User
- id (UUID)
- email (unique)
- password (hashed)
- firstName
- lastName
- roleId
- isActive
- isVerified
- lastLogin
- timestamps

### Role
- id (UUID)
- name (enum: SUPER_ADMIN, ADMIN, PROJECT_MANAGER, ARCHITECT, FIELD_ENGINEER, WORKER)
- description
- isActive
- permissions (Many-to-Many)
- timestamps

### Permission
- id (UUID)
- name (e.g., "projects:create")
- resource (e.g., "projects")
- action (e.g., "create")
- description
- timestamps

### RefreshToken
- id (UUID)
- token (hashed)
- userId
- expiresAt
- isRevoked
- createdAt

## Endpoints

```
POST   /api/v1/auth/register        - Register new user
POST   /api/v1/auth/login           - Login (returns access + refresh token)
POST   /api/v1/auth/refresh         - Refresh access token
POST   /api/v1/auth/logout          - Logout (revokes refresh token)
GET    /api/v1/auth/me              - Get current user
POST   /api/v1/auth/verify-email    - Verify email
POST   /api/v1/auth/forgot-password - Request password reset
POST   /api/v1/auth/reset-password  - Reset password with token
```

## JWT Strategy

### Access Token
- **Duration**: 15 minutes
- **Payload**: `{ sub: userId, email, role }`
- **Purpose**: Authenticate API requests

### Refresh Token
- **Duration**: 7 days
- **Storage**: Database (can be revoked)
- **Purpose**: Renew access token

## Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Token Security
- Signed with HS256 (can upgrade to RS256)
- Secret stored in environment variable
- Refresh tokens are revocable
- Automatic token rotation

### Rate Limiting
- Login: 5 attempts / 15 minutes
- Register: 3 attempts / hour

## Default Roles

1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Organization administrator
3. **PROJECT_MANAGER** - Project management
4. **ARCHITECT** - Design and spaces
5. **FIELD_ENGINEER** - Field execution
6. **WORKER** - Limited access

## Default Permissions

- `projects:create`, `projects:read`, `projects:update`, `projects:delete`
- `spaces:create`, `spaces:read`, `spaces:update`, `spaces:delete`
- `costs:read`, `costs:update`
- `design:create`, `design:read`, `design:update`
- `execution:create`, `execution:read`, `execution:update`
- `users:create`, `users:read`, `users:update`, `users:delete`
- `roles:create`, `roles:read`, `roles:update`, `roles:delete`

## Quick Start

### 1. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Run Database Migration

```bash
npm run seed
```

This creates:
- Default roles with permissions
- Default admin user (`admin@construccion.com` / `Admin123!`)

### 3. Start Service

```bash
npm run dev
```

Service runs on http://localhost:3002

### 4. Test Authentication

```bash
# Register
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Use access token
curl http://localhost:3002/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Integration with Other Services

### API Gateway Integration

The Auth Service is designed to work with the API Gateway:

```typescript
// In API Gateway
import { AuthService } from './services/auth.service';

// Verify token
const user = await authService.verifyToken(token);

// Check permissions
const hasPermission = await authService.checkPermission(
  user.id,
  'projects:create'
);
```

### Protected Routes

```typescript
// In other microservices
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    const user = req.user; // Populated by guard
    return this.projectsService.findAll(user.id);
  }
}
```

## Environment Variables

```env
# Application
NODE_ENV=development
PORT=3002

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=construccion_auth
DATABASE_USER=admin
DATABASE_PASSWORD=admin123

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Security
BCRYPT_ROUNDS=10
```

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## Swagger Documentation

Access API documentation at:
http://localhost:3002/api/docs

## Future Enhancements

- [ ] OAuth2 integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Password reset via email
- [ ] Audit logs
- [ ] Session management dashboard
- [ ] IP whitelisting
- [ ] Device tracking

## Troubleshooting

### Token expired
- Access tokens expire after 15 minutes
- Use refresh token to get new access token
- Refresh tokens expire after 7 days

### Unauthorized error
- Check if token is present in Authorization header
- Format: `Authorization: Bearer TOKEN`
- Verify token is not expired or revoked

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_* environment variables
- Run `npm run infra:up` to start Docker services

## Support

For issues or questions, refer to:
- Main project documentation: `/README.md`
- Architecture guide: `/CLAUDE.md`
- API Gateway documentation: `/apps/api-gateway/README.md`
