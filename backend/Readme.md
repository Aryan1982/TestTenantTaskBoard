# NestJS Tasks Backend

A production-ready NestJS backend API with TypeScript, Sequelize ORM, MSSQL database, JWT authentication, and multi-tenancy support.

## Features

### ✅ **Core Architecture**

- **NestJS Framework** - Modern, scalable Node.js framework
- **TypeScript** - Full type safety
- **Sequelize ORM** - Database abstraction with `sequelize-typescript`
- **MSSQL Database** - Connected via `tedious` driver
- **Modular Structure** - Proper separation of concerns with modules, controllers, services

### ✅ **Authentication & Security**

- **JWT Authentication** - Secure token-based auth
- **bcrypt Password Hashing** - Never store plain text passwords
- **Global Auth Guard** - Protect all routes by default
- **Public Decorator** - Mark specific endpoints as public (login)
- **Role-based Access** - User roles in JWT payload

### ✅ **Multi-Tenancy**

- **Tenant Isolation** - All queries filtered by TenantId
- **Custom @TenantId() Decorator** - Reads `x-tenant-id` header
- **Strict Enforcement** - No query bypasses tenant filtering
- **Tenant-scoped Data** - Users and tasks belong to tenants

### ✅ **Task Management**

- **CRUD Operations** - Create, Read, Update, Delete tasks
- **Status Management** - Pending, InProgress, Done
- **User Tracking** - CreatedBy tracks task creator
- **Validation** - DTO validation with class-validator
- **Auto Timestamps** - CreatedAt, UpdatedAt

### ✅ **API Endpoints**

#### Public Endpoints

- `POST /api/auth/login` - Login with username/password

#### Protected Endpoints (Require JWT + x-tenant-id header)

- `GET /api/tasks` - List all tasks for tenant
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete task

---

## Prerequisites

### Required Software

1. **Node.js** v18.x or higher
   - Download: https://nodejs.org/

2. **Microsoft SQL Server**
   - SQL Server 2017 or higher
   - OR SQL Server Express (free)
   - OR Azure SQL Database
   - Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads

3. **SQL Server Management Studio** (Optional but recommended)
   - Download: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

---

## Installation

### 1. Clone/Extract Project

```bash
cd nestjs-tasks-backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs:

- NestJS framework
- Sequelize ORM
- MSSQL driver (tedious)
- JWT and Passport
- bcrypt
- Validation libraries

### 3. Configure Database

#### Option A: Using Docker (Recommended for Development)

Run MSSQL in Docker:

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql_server \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

#### Option B: Local SQL Server Installation

Install SQL Server locally and configure:

- Port: 1433
- Username: sa
- Password: (your secure password)

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_DATABASE=TasksDB
DB_DIALECT=mssql

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

PORT=3001
NODE_ENV=development
```

### 5. Create Database and Seed Data

#### Option A: Using the Seeder Script (Recommended)

This will:

- Create database if needed
- Create tables
- Create admin user with hashed password
- Create 5 sample tasks

```bash
npm run seed
```

**Expected Output:**

```
✅ Database connection established successfully.
✅ Database synchronized.
✅ Admin user created:
   Username: admin
   Password: admin123
   Tenant ID: 1
   Role: Admin
✅ 5 sample tasks created.

✨ Database seeding completed successfully!
```

#### Option B: Using SQL Script

Run the SQL script manually:

```bash
# Connect to SQL Server and run:
sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -i database/setup.sql
```

Or use SQL Server Management Studio to execute `database/setup.sql`

**Note:** The SQL script requires you to replace the bcrypt hash. Use the seeder script instead for automatic hash generation.

### 6. Start the Application

#### Development Mode (with auto-reload)

```bash
npm run start:dev
```

#### Production Mode

```bash
npm run build
npm run start:prod
```

**Expected Output:**

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [RoutesResolver] AuthController {/api/auth}:
[Nest] LOG [RouterExplorer] Mapped {/api/auth/login, POST} route
[Nest] LOG [RoutesResolver] TasksController {/api/tasks}:
[Nest] LOG [RouterExplorer] Mapped {/api/tasks, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/tasks/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/tasks, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/tasks/:id, PATCH} route
[Nest] LOG [NestApplication] Nest application successfully started
Application is running on: http://localhost:3001
API endpoints available at: http://localhost:3001/api
```

---

## Usage Examples

### 1. Login

**Request:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**JWT Payload (decoded):**

```json
{
  "userId": 1,
  "username": "admin",
  "role": "Admin",
  "tenantId": 1,
  "iat": 1706789012,
  "exp": 1707393812
}
```

### 2. Get All Tasks

**Request:**

```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-tenant-id: 1"
```

**Response:**

```json
[
  {
    "Id": 1,
    "Title": "Complete project setup",
    "Description": "Set up the NestJS backend with MSSQL and Sequelize",
    "Status": "Done",
    "TenantId": 1,
    "CreatedBy": 1,
    "CreatedAt": "2024-02-06T10:00:00.000Z",
    "UpdatedAt": "2024-02-06T10:00:00.000Z",
    "Creator": {
      "Id": 1,
      "Username": "admin",
      "Email": "admin@example.com"
    }
  }
]
```

### 3. Create Task

**Request:**

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-tenant-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "status": "Pending"
  }'
```

**Response:**

```json
{
  "Id": 6,
  "Title": "New Task",
  "Description": "Task description",
  "Status": "Pending",
  "TenantId": 1,
  "CreatedBy": 1,
  "CreatedAt": "2024-02-06T12:00:00.000Z",
  "UpdatedAt": "2024-02-06T12:00:00.000Z",
  "Creator": {
    "Id": 1,
    "Username": "admin",
    "Email": "admin@example.com"
  }
}
```

### 4. Update Task Status

**Request:**

```bash
curl -X PATCH http://localhost:3001/api/tasks/6 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-tenant-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "InProgress"
  }'
```

**Response:**

```json
{
  "Id": 6,
  "Title": "New Task",
  "Description": "Task description",
  "Status": "InProgress",
  "TenantId": 1,
  "CreatedBy": 1,
  "CreatedAt": "2024-02-06T12:00:00.000Z",
  "UpdatedAt": "2024-02-06T12:05:00.000Z"
}
```

---

## Project Structure

```
nestjs-tasks-backend/
├── src/
│   ├── auth/                      # Authentication module
│   │   ├── dto/
│   │   │   └── login.dto.ts       # Login validation DTO
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts    # JWT Passport strategy
│   │   ├── auth.controller.ts     # Login endpoint
│   │   ├── auth.service.ts        # Auth logic & bcrypt
│   │   └── auth.module.ts         # Auth module config
│   │
│   ├── tasks/                     # Tasks module
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts # Create task validation
│   │   │   └── update-task-status.dto.ts
│   │   ├── tasks.controller.ts    # Task endpoints
│   │   ├── tasks.service.ts       # Task business logic
│   │   └── tasks.module.ts        # Tasks module config
│   │
│   ├── models/                    # Sequelize models
│   │   ├── user.model.ts          # User entity
│   │   └── task.model.ts          # Task entity
│   │
│   ├── common/                    # Shared code
│   │   ├── decorators/
│   │   │   ├── tenant-id.decorator.ts    # @TenantId()
│   │   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   │   └── public.decorator.ts       # @Public()
│   │   └── guards/
│   │       └── jwt-auth.guard.ts  # JWT authentication guard
│   │
│   ├── database/                  # Database config
│   │   ├── seeders/
│   │   │   └── seed.ts            # Database seeder
│   │   └── database.module.ts     # Sequelize config
│   │
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Application entry point
│
├── database/
│   └── setup.sql                  # SQL setup script
│
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── nest-cli.json                  # NestJS CLI config
└── README.md                      # This file
```

---

## API Documentation

### Data Models

#### User

```typescript
{
  Id: number;
  Username: string;
  Email: string;
  PasswordHash: string;
  Role: string;
  TenantId: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}
```

#### Task

```typescript
{
  Id: number;
  Title: string;
  Description?: string;
  Status: 'Pending' | 'InProgress' | 'Done';
  TenantId: number;
  CreatedBy: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}
```

### Validation Rules

#### CreateTaskDto

- `title`: Required, string, max 200 characters
- `description`: Optional, string
- `status`: Required, must be one of: Pending, InProgress, Done

#### UpdateTaskStatusDto

- `status`: Required, must be one of: Pending, InProgress, Done

---

## Security Features

### Password Security

- Passwords hashed with bcrypt (10 salt rounds)
- Never stored or transmitted in plain text
- Secure comparison using bcrypt.compare()

### JWT Security

- Tokens signed with secret key
- 7-day expiration (configurable)
- Contains minimal payload (userId, username, role, tenantId)
- Verified on every protected request

### Multi-Tenancy Security

- All database queries filter by TenantId
- x-tenant-id header required on all protected endpoints
- No cross-tenant data access possible
- Validated using custom decorator

### Input Validation

- All DTOs validated with class-validator
- Automatic type transformation
- Whitelist mode (strips unknown properties)
- Forbids non-whitelisted properties

---

## Development

### Available Scripts

```bash
# Development with auto-reload
npm run start:dev

# Production build
npm run build

# Start production server
npm run start:prod

# Lint and fix
npm run lint

# Format code
npm run format

# Seed database
npm run seed
```

### Adding New Endpoints

1. Create DTOs in appropriate module
2. Add methods to service with tenant filtering
3. Add endpoints to controller with guards and decorators
4. Test with proper headers

Example:

```typescript
@Get()
findAll(@TenantId() tenantId: number) {
  return this.service.findAll(tenantId);
}
```

---

## Troubleshooting

### Database Connection Issues

**Error: "Login failed for user 'sa'"**

- Check username/password in .env
- Ensure SQL Server is running
- Verify port 1433 is accessible

**Error: "Cannot connect to database"**

```bash
# Test connection
telnet localhost 1433

# Or check if SQL Server is running
docker ps  # if using Docker
```

### Seeding Issues

**Error: "Unable to connect to database"**

- Ensure .env file exists
- Check database credentials
- Make sure SQL Server is running

**Error: "Table already exists"**

- Drop existing tables or clear data
- Or comment out the destroy lines in seed.ts

### JWT Issues

**Error: "Unauthorized"**

- Check if token is included in Authorization header
- Verify token hasn't expired
- Ensure JWT_SECRET matches between login and validation

---

## Production Deployment

### Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Use strong database password
- [ ] Enable SSL/TLS for database connection
- [ ] Set synchronize: false in database config
- [ ] Use migrations instead of sync
- [ ] Enable CORS only for your frontend domain
- [ ] Set up proper logging
- [ ] Use environment-specific .env files
- [ ] Set up database backups

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PORT=1433
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password
DB_DATABASE=TasksDB
JWT_SECRET=your-very-secure-random-string-here
JWT_EXPIRATION=7d
```

---

## Testing with Postman

Import this collection:

```json
{
  "info": {
    "name": "NestJS Tasks API"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"admin\",\"password\":\"admin123\"}"
        }
      }
    },
    {
      "name": "Get Tasks",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/tasks",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" },
          { "key": "x-tenant-id", "value": "1" }
        ]
      }
    }
  ]
}
```

---

## License

MIT

---

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the error messages carefully
3. Ensure all prerequisites are installed
4. Verify environment variables are correct
