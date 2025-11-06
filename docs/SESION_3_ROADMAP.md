# 🗺️ Sesión 3 - Roadmap Técnico Detallado

## Objetivo: Completar Auth Service + API Gateway GraphQL

---

## 📋 PARTE 1: Completar Auth Service (Prioridad Máxima)

### 1.1 Application Layer - Use Cases (1 hora)

#### RegisterUseCase
```typescript
// services/auth/src/application/use-cases/register.use-case.ts

@Injectable()
export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private passwordService: PasswordService,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    // 1. Validar que email no existe
    const exists = await this.userRepository.emailExists(dto.email);
    if (exists) throw new ConflictException('Email already exists');

    // 2. Obtener rol por defecto (WORKER o especificado)
    const role = await this.roleRepository.findByName(RoleType.WORKER);

    // 3. Hash password
    const hashedPassword = await this.passwordService.hash(dto.password);

    // 4. Crear usuario
    return this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleId: role.id,
    });
  }
}
```

#### LoginUseCase
```typescript
// Similar estructura - validar credenciales, generar tokens
```

#### Otros Use Cases
- RefreshTokenUseCase
- LogoutUseCase
- VerifyTokenUseCase

### 1.2 Infrastructure - Security Services (1 hora)

#### JwtService
```typescript
// services/auth/src/infrastructure/security/jwt.service.ts

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_CONFIG) private config: JwtConfig,
    private jwtService: JwtService, // from @nestjs/jwt
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.accessTokenSecret,
      expiresIn: this.config.accessTokenExpiration,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: this.config.refreshTokenExpiration,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: this.config.accessTokenSecret,
    });
  }
}
```

#### PasswordService
```typescript
// Usar bcrypt con BCRYPT_ROUNDS del .env
```

#### TokenService
```typescript
// Gestionar RefreshTokens en DB
```

### 1.3 Infrastructure - Repositories (45 min)

Implementar con TypeORM siguiendo patrón de Programa Service:
- UserRepository
- RoleRepository
- RefreshTokenRepository

### 1.4 Infrastructure - Controllers (45 min)

#### AuthController
```typescript
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    const user = await this.registerUseCase.execute(dto);
    const tokens = await this.tokenService.generateTokens(user);
    return { user, ...tokens };
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    // ...
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponse> {
    // ...
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: User): Promise<void> {
    // ...
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
```

### 1.5 Infrastructure - Guards & Strategies (30 min)

#### JwtStrategy
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
```

#### Guards
- JwtAuthGuard (extends AuthGuard('jwt'))
- RolesGuard (RBAC checker)

### 1.6 Database - Seed Script (30 min)

```typescript
// services/auth/src/infrastructure/database/seeds/seed-roles.ts

const roles = [
  {
    name: RoleType.SUPER_ADMIN,
    description: 'Full system access',
    permissions: ['*:*'], // All permissions
  },
  {
    name: RoleType.ADMIN,
    description: 'Organization administrator',
    permissions: [
      'projects:*',
      'spaces:*',
      'users:read',
      'users:create',
      'costs:read',
    ],
  },
  // ... otros roles
];

// Usuario admin por defecto
const adminUser = {
  email: 'admin@construccion.com',
  password: 'Admin123!',
  firstName: 'Admin',
  lastName: 'Sistema',
  role: RoleType.SUPER_ADMIN,
};
```

### 1.7 Modules Configuration (30 min)

```typescript
// auth.module.ts
// app.module.ts
// main.ts (bootstrap)
```

### 1.8 Testing Auth Service (1 hora)

Tests críticos:
- RegisterUseCase: éxito y email duplicado
- LoginUseCase: credenciales correctas e incorrectas
- JwtService: generación y verificación de tokens
- Guards: protección de rutas

---

## 📋 PARTE 2: API Gateway GraphQL

### 2.1 Setup Básico (30 min)

```bash
mkdir -p apps/api-gateway
cd apps/api-gateway
```

```json
// package.json
{
  "dependencies": {
    "@nestjs/graphql": "^12.0.0",
    "@nestjs/apollo": "^12.0.0",
    "@apollo/server": "^4.9.0",
    "graphql": "^16.8.0",
    "axios": "^1.6.0"
  }
}
```

### 2.2 GraphQL Schema (1 hora)

```graphql
# schema.graphql

type Query {
  me: User!
  projects(limit: Int, offset: Int): ProjectsConnection!
  project(id: ID!): Project
  spaces(projectId: ID): [Space!]!
  space(id: ID!): Space
  spaceTypes: [SpaceType!]!
}

type Mutation {
  # Auth
  login(input: LoginInput!): AuthResponse!
  register(input: RegisterInput!): AuthResponse!

  # Projects
  createProject(input: CreateProjectInput!): Project!
  updateProject(id: ID!, input: UpdateProjectInput!): Project!
  deleteProject(id: ID!): Boolean!

  # Spaces
  createSpace(input: CreateSpaceInput!): Space!
  updateSpace(id: ID!, input: UpdateSpaceInput!): Space!
  deleteSpace(id: ID!): Boolean!
}
```

### 2.3 GraphQL Types (45 min)

```typescript
// src/schema/types/user.type.ts
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field(() => Role)
  role: Role;
}
```

Similar para Project, Space, SpaceType, etc.

### 2.4 Resolvers (2 horas)

```typescript
// src/schema/resolvers/project.resolver.ts

@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private programaService: ProgramaService,
  ) {}

  @Query(() => ProjectsConnection)
  @UseGuards(GqlAuthGuard)
  async projects(
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('offset', { defaultValue: 0 }) offset: number,
    @CurrentUser() user: User,
  ): Promise<ProjectsConnection> {
    return this.programaService.getProjects({ limit, offset });
  }

  @Mutation(() => Project)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.PROJECT_MANAGER)
  async createProject(
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return this.programaService.createProject(input);
  }

  @ResolveField(() => [Space])
  async spaces(@Parent() project: Project): Promise<Space[]> {
    return this.programaService.getSpacesByProject(project.id);
  }
}
```

### 2.5 Service Clients (45 min)

```typescript
// src/services/programa.service.ts

@Injectable()
export class ProgramaService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get('PROGRAMA_SERVICE_URL');
  }

  async getProjects(params: any): Promise<any> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseUrl}/projects`,
      { params }
    );
    return data;
  }

  async createProject(input: any): Promise<any> {
    const { data } = await this.httpService.axiosRef.post(
      `${this.baseUrl}/projects`,
      input
    );
    return data;
  }
}
```

### 2.6 Authentication Layer (45 min)

```typescript
// src/guards/gql-auth.guard.ts

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const token = this.extractToken(req);
    if (!token) throw new UnauthorizedException();

    const user = await this.authService.verifyToken(token);
    req.user = user;
    return true;
  }
}
```

```typescript
// src/decorators/current-user.decorator.ts

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
```

---

## 📋 PARTE 3: Integration & Testing

### 3.1 Docker Compose Update

```yaml
# Agregar a infra/docker/docker-compose.yml

  auth-db:
    image: postgres:16-alpine
    container_name: construccion-auth-db
    environment:
      POSTGRES_DB: construccion_auth
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5433:5432"
    volumes:
      - auth_db_data:/var/lib/postgresql/data

volumes:
  auth_db_data:
```

### 3.2 Testing Checklist

#### Auth Service Tests
```bash
cd services/auth
npm run test
npm run test:cov
```

- [ ] RegisterUseCase tests
- [ ] LoginUseCase tests
- [ ] JwtService tests
- [ ] PasswordService tests
- [ ] Guards tests

#### API Gateway Tests
```bash
cd apps/api-gateway
npm run test
```

- [ ] Resolvers tests
- [ ] Guards tests
- [ ] Service clients tests

### 3.3 Manual Testing

#### Auth Service
```bash
# Start service
cd services/auth
npm run dev # Port 3002

# Test register
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test login
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test123!"
  }'

# Swagger
open http://localhost:3002/api/docs
```

#### API Gateway
```bash
# Start gateway
cd apps/api-gateway
npm run dev # Port 4000

# GraphQL Playground
open http://localhost:4000/graphql

# Test query
query {
  me {
    id
    email
    fullName
  }
}
```

---

## 🎯 Definition of Done

### Auth Service ✅
- [ ] Arranca sin errores en puerto 3002
- [ ] Swagger accesible y funcional
- [ ] Seed crea roles y admin
- [ ] Todos los endpoints funcionan
- [ ] Tests pasan con 80%+ coverage
- [ ] JWT tokens se generan correctamente
- [ ] Refresh token funciona
- [ ] Guards protegen rutas
- [ ] RBAC funciona correctamente

### API Gateway ✅
- [ ] Arranca sin errores en puerto 4000
- [ ] GraphQL Playground accesible
- [ ] Schema completo y válido
- [ ] Resolvers funcionan
- [ ] Autenticación con JWT funciona
- [ ] Puede consultar Programa Service
- [ ] Puede autenticar con Auth Service
- [ ] Tests pasan

### Integration ✅
- [ ] Docker Compose con 3 DBs funciona
- [ ] Programa Service + Auth Service + Gateway corren juntos
- [ ] Gateway puede comunicarse con ambos servicios
- [ ] Autenticación end-to-end funciona
- [ ] GraphQL queries requieren autenticación
- [ ] RBAC funciona en GraphQL

---

## 📝 Commits Planeados

1. `feat(auth): implement use cases and security services`
2. `feat(auth): add repositories and controllers`
3. `feat(auth): add guards, strategies and jwt authentication`
4. `feat(auth): add seed data for roles and default admin`
5. `test(auth): add unit and integration tests`
6. `feat(gateway): initialize graphql api gateway`
7. `feat(gateway): add graphql schema and types`
8. `feat(gateway): implement resolvers and service clients`
9. `feat(gateway): add authentication and authorization`
10. `test(gateway): add resolver and guard tests`
11. `chore(infra): update docker-compose with auth database`
12. `docs: add integration guide and graphql documentation`
13. `feat: complete auth service and graphql api gateway`

---

## 🚀 Execution Plan

### Día 1: Auth Service (4-5 horas)
1. Morning: Use Cases + Security Services + Repositories
2. Afternoon: Controllers + Guards + Modules
3. Evening: Seed data + Testing

### Día 2: API Gateway (4-5 horas)
1. Morning: Setup + Schema + Types
2. Afternoon: Resolvers + Service Clients
3. Evening: Authentication + Testing

### Día 3: Integration (2-3 horas)
1. Docker Compose update
2. End-to-end testing
3. Documentation
4. Final commit and push

---

**Total Estimado: 10-13 horas de trabajo**

**Resultado Final**: Sistema completo con 3 servicios integrados y funcionando.
