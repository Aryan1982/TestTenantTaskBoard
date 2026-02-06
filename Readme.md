# Task Management Application

A full-stack task management application with **Nuxt 3 frontend** and **NestJS backend**, featuring JWT authentication, multi-tenancy, and modern UI components.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=flat&logo=microsoft-sql-server&logoColor=white)

---

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Default Credentials](#default-credentials)
- [Development](#development)
- [Production Build](#production-build)
- [Troubleshooting](#troubleshooting)
- [Project Architecture](#project-architecture)
- [License](#license)

---

## ✨ Features

### Frontend (Nuxt 3)

- 🎨 **Vuetify 3** - Material Design components
- 🔐 **JWT Authentication** - Secure token-based auth with SSR-safe cookies
- 🏢 **Multi-tenancy** - Tenant isolation with header-based routing
- 📊 **Task Management** - Create, view, and update tasks
- ✅ **Status Tracking** - Visual status chips (Pending, In Progress, Done)
- 🎯 **Type-Safe** - Full TypeScript support
- 📱 **Responsive** - Mobile-friendly design

### Backend (NestJS)

- 🏗️ **NestJS Framework** - Modular, scalable architecture
- 🗄️ **MSSQL Database** - Sequelize ORM with PascalCase columns
- 🔒 **bcrypt Hashing** - Secure password storage
- 🎫 **JWT Tokens** - Stateless authentication
- 🏢 **Tenant Isolation** - Strict tenant-scoped queries
- ✅ **Validation** - DTO validation with class-validator
- 🛡️ **Guards & Decorators** - Custom auth and tenant decorators

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (comes with Node.js)
- **Docker** ([Download](https://www.docker.com/get-started)) - For SQL Server
- **Git** (optional)

**Check versions:**

```bash
node --version   # Should be v18.x.x or higher
npm --version    # Should be v9.x.x or higher
docker --version # Should show Docker version
```

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# 1. Start SQL Server with Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name mssql-server \
  -d mcr.microsoft.com/mssql/server:2022-latest

# 2. Setup Backend
cd nestjs-tasks-backend
npm install
npm run seed
npm run start:dev

# 3. In a new terminal, setup Frontend
cd nuxt-tasks-app
npm install
npm run dev
```

**🎉 Done! Open http://localhost:3000 in your browser**

### Option 2: Step-by-Step Setup

See [Detailed Setup](#detailed-setup) below.

---

## 📖 Detailed Setup

### Step 1: Start SQL Server

Using Docker (recommended):

```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 \
  --name mssql-server \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Verify it's running:**

```bash
docker ps
# Should show mssql-server container running
```

**Alternative:** Install SQL Server locally from [Microsoft](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

---

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd nestjs-tasks-backend

# Install dependencies
npm install

# Configure environment (already done, .env exists)
# Default settings work for local development

# Seed database (creates tables, admin user, sample tasks)
npm run seed
```

**Expected output:**

```
✅ Database connection established successfully.
✅ Database synchronized.
✅ Admin user created:
   Username: admin
   Password: admin123
   Tenant ID: 1
✅ 5 sample tasks created.

✨ Database seeding completed successfully!
```

**Start the backend:**

```bash
npm run start:dev
```

**Expected output:**

```
Application is running on: http://localhost:3001
API endpoints available at: http://localhost:3001/api
```

**Keep this terminal running!**

---

### Step 3: Setup Frontend

Open a **new terminal window**.

```bash
# Navigate to frontend directory
cd nuxt-tasks-app

# Install dependencies
npm install

# Configure environment (already done, .env exists)
# Default settings point to http://localhost:3001/api

# Start the frontend
npm run dev
```

**Expected output:**

```
Nuxt 3.13.2 with Nitro 2.x.x

  ➜ Local:    http://localhost:3000/
  ➜ Network:  http://192.168.x.x:3000/
```

---

### Step 4: Access the Application

Open your browser and navigate to:

**Frontend:** http://localhost:3000

**Backend API:** http://localhost:3001/api

---

## 🔑 Default Credentials

Use these credentials to login:

| Field     | Value      |
| --------- | ---------- |
| Username  | `admin`    |
| Password  | `admin123` |
| Tenant ID | `1`        |
| Role      | `Admin`    |

**Note:** The frontend automatically sends `x-tenant-id: 1` header.

---

## 🗄️ Database Migrations

To keep your database schema consistent across environments, it’s recommended to use **Sequelize migrations** instead of relying on `synchronize: true` in production.

### 1. Install Sequelize CLI (if not installed)

```bash
# Globally
npm install -g sequelize-cli

# Or locally
npm install --save-dev sequelize-cli
```

### 2. Initialize Sequelize CLI (if not already)

```bash
npx sequelize-cli init
```

This creates the following folders:

```
config/      # Database config
models/      # Sequelize models
migrations/  # Migration files
seeders/     # Seed files
```

> **Note:** In your project, you may already have `models` and `seeders`. Keep `migrations` folder for schema changes.

---

### 3. Create a New Migration

To add a table or modify schema:

```bash
npx sequelize-cli migration:generate --name create-tasks-table
```

This creates a timestamped file in `migrations/`. Open it and define the schema:

```ts
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      Description: {
        type: Sequelize.TEXT,
      },
      Status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Pending",
      },
      TenantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      CreatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      CreatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
```

---

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

> ✅ This applies all pending migrations to your database.

---

### 5. Undo Last Migration (if needed)

```bash
npx sequelize-cli db:migrate:undo
```

- Undo the **last migration**
- Useful during development

---

### 6. Seed Data (Optional)

```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Undo last seeder
npx sequelize-cli db:seed:undo
```

---

### 7. Notes for Production

- **Do not use `synchronize: true`** in production; rely on migrations
- Always commit migration files to version control
- Use environment-specific DB credentials in `.env`
- Run migrations after deploying updates:

```bash
npx sequelize-cli db:migrate --env production
```

## 🌐 API Endpoints

### Public Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Endpoints

All protected endpoints require:

- `Authorization: Bearer {token}` header
- `x-tenant-id: 1` header

#### Get All Tasks

```http
GET /api/tasks
Authorization: Bearer {token}
x-tenant-id: 1
```

#### Get Single Task

```http
GET /api/tasks/:id
Authorization: Bearer {token}
x-tenant-id: 1
```

#### Create Task

```http
POST /api/tasks
Authorization: Bearer {token}
x-tenant-id: 1
Content-Type: application/json

{
  "title": "Task title (required, max 200 chars)",
  "description": "Description (optional)",
  "status": "Pending|InProgress|Done (required)"
}
```

#### Update Task Status

```http
PATCH /api/tasks/:id
Authorization: Bearer {token}
x-tenant-id: 1
Content-Type: application/json

{
  "status": "Pending|InProgress|Done"
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer {token}
x-tenant-id: 1
```

---

## ⚙️ Environment Variables

### Backend (.env)

Located in `nestjs-tasks-backend/.env`

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_DATABASE=TasksDB
DB_DIALECT=mssql

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Application
PORT=3001
NODE_ENV=development
```

### Frontend (.env)

Located in `nuxt-tasks-app/.env`

```env
# Backend API Base URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

## 🧪 Testing the Application

### 1. Test Login

Open http://localhost:3000/login

- Enter username: `admin`
- Enter password: `admin123`
- Click "Sign In"

You should be redirected to `/tasks` page.

### 2. View Tasks

You should see a data table with 5 sample tasks:

- Complete project setup (Done)
- Implement authentication (Done)
- Create task management endpoints (In Progress)
- Add validation and error handling (Pending)
- Write API documentation (Pending)

### 3. Create a Task

- Click the "New Task" button
- Fill in the form:
  - Title: "My Test Task"
  - Description: "Testing task creation"
  - Status: Select "Pending"
- Click "Create"

The new task should appear in the table.

### 4. Update Task Status

- Click on a task in the table (if enabled)
- Or use the PATCH endpoint via API

### 5. Test API with cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Save the token, then get tasks
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-tenant-id: 1"
```

---

## 💻 Development

### Frontend Development

```bash
cd nuxt-tasks-app

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Frontend runs on:** http://localhost:3000

**Key files:**

- `pages/login.vue` - Login page
- `pages/tasks.vue` - Tasks management page
- `stores/auth.ts` - Authentication state
- `composables/useApi.ts` - API wrapper

### Backend Development

```bash
cd nestjs-tasks-backend

# Start dev server with auto-reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Seed database
npm run seed

# Format code
npm run format

# Lint code
npm run lint
```

**Backend runs on:** http://localhost:3001

**Key files:**

- `src/auth/` - Authentication module
- `src/tasks/` - Tasks module
- `src/models/` - Database models
- `src/common/decorators/` - Custom decorators

---

## 🏗️ Production Build

### Backend Production

```bash
cd nestjs-tasks-backend

# Build
npm run build

# Set environment
export NODE_ENV=production

# Update .env with production values
# - Change JWT_SECRET to a secure random string
# - Update database credentials
# - Set synchronize: false in database config

# Run
npm run start:prod
```

**Production checklist:**

- [ ] Change JWT_SECRET to secure random string
- [ ] Use strong database password
- [ ] Enable database SSL (encrypt: true)
- [ ] Set NODE_ENV=production
- [ ] Disable synchronize (use migrations)
- [ ] Configure CORS for production domain
- [ ] Set up proper logging
- [ ] Configure rate limiting

### Frontend Production

```bash
cd nuxt-tasks-app

# Build
npm run build

# Preview
npm run preview

# Update .env with production API URL
NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

**Production checklist:**

- [ ] Update API URL to production backend
- [ ] Configure CORS on backend for frontend domain
- [ ] Enable HTTPS
- [ ] Optimize images
- [ ] Configure CDN (optional)

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** "Cannot connect to database"

**Solution:**

```bash
# Check if SQL Server is running
docker ps

# Restart SQL Server
docker restart mssql-server

# Check logs
docker logs mssql-server
```

**Error:** "Login failed for user 'sa'"

**Solution:**

- Verify password in `nestjs-tasks-backend/.env`
- Ensure it matches the Docker container password
- Default: `YourStrong@Passw0rd`

### Backend Issues

**Error:** "Port 3001 already in use"

**Solution:**

```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port
PORT=3002 npm run start:dev
```

**Error:** "npm run seed fails"

**Solution:**

```bash
# Ensure SQL Server is running
docker ps

# Check .env configuration
cat nestjs-tasks-backend/.env

# Try running seed again
cd nestjs-tasks-backend
npm run seed
```

### Frontend Issues

**Error:** "Port 3000 already in use"

**Solution:**

```bash
# Use different port
PORT=3001 npm run dev
```

**Error:** "API calls fail with CORS error"

**Solution:**

- Ensure backend is running on http://localhost:3001
- Backend CORS is configured for http://localhost:3000
- Check `nestjs-tasks-backend/src/main.ts`

**Error:** "Login fails or redirects to login"

**Solution:**

- Clear browser cookies
- Check browser console for errors
- Verify backend is running
- Test backend login endpoint directly

### Node Modules Issues

**Error:** "Cannot find module" or dependency errors

**Solution:**

```bash
# Backend
cd nestjs-tasks-backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd nuxt-tasks-app
rm -rf node_modules package-lock.json .nuxt
npm install
```

---

## 🏛️ Project Architecture

### Frontend Architecture

```
Login Page (/login)
    ↓
Auth Store (Pinia)
    ↓
JWT Token stored in Cookie
    ↓
Tasks Page (/tasks)
    ↓
useApi Composable (adds token + tenant-id)
    ↓
Backend API
```

**Key Concepts:**

- **SSR-safe cookies** for token storage
- **Global route guards** for authentication
- **useApi composable** wraps useFetch with auth headers
- **Pinia store** manages auth state
- **Vuetify components** for UI

### Backend Architecture

```
Client Request
    ↓
JWT Auth Guard (validates token)
    ↓
@TenantId Decorator (extracts tenant from header)
    ↓
Controller (handles request)
    ↓
Service (business logic + tenant filtering)
    ↓
Sequelize Model (database query)
    ↓
MSSQL Database
```

**Key Concepts:**

- **Modular structure** (Auth, Tasks, Database modules)
- **Custom decorators** (@TenantId, @CurrentUser, @Public)
- **Global JWT guard** protects all routes
- **Tenant-scoped queries** on every database operation
- **DTO validation** with class-validator
- **bcrypt password hashing**

---

## 🔒 Security Features

### Frontend Security

- ✅ JWT stored in HTTP-only cookies (SSR-safe)
- ✅ Automatic token refresh on page load
- ✅ Route guards prevent unauthorized access
- ✅ No sensitive data in localStorage
- ✅ XSS protection via Vue's template escaping

### Backend Security

- ✅ bcrypt password hashing (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ Global authentication guard
- ✅ Tenant isolation on all queries
- ✅ Input validation with class-validator
- ✅ SQL injection prevention via Sequelize ORM
- ✅ CORS configuration
- ✅ No password in responses

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User',
    TenantId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

### Tasks Table

```sql
CREATE TABLE Tasks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    TenantId INT NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Tasks_CreatedBy FOREIGN KEY (CreatedBy)
        REFERENCES Users(Id),
    CONSTRAINT CHK_Tasks_Status
        CHECK (Status IN ('Pending', 'InProgress', 'Done'))
);
```

---

## 🧪 Sample Data

After running `npm run seed`, you'll have:

### 1 Admin User

- Username: admin
- Password: admin123 (hashed with bcrypt)
- Email: admin@example.com
- Role: Admin
- TenantId: 1

### 5 Sample Tasks

1. Complete project setup (Done)
2. Implement authentication (Done)
3. Create task management endpoints (InProgress)
4. Add validation and error handling (Pending)
5. Write API documentation (Pending)

---

## 📝 Available Scripts

### Frontend (nuxt-tasks-app)

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run generate` | Generate static site     |

### Backend (nestjs-tasks-backend)

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run start:dev`  | Start dev server with watch    |
| `npm run start:prod` | Start production server        |
| `npm run build`      | Build TypeScript               |
| `npm run seed`       | Seed database with sample data |
| `npm run format`     | Format code with Prettier      |
| `npm run lint`       | Lint code with ESLint          |

---

## 🌟 Features Highlight

### Frontend Features

- ✨ Modern, responsive UI with Vuetify 3
- 🔐 Secure JWT authentication with cookies
- 📊 Data table with sorting
- 🎨 Color-coded status chips
- ✅ Form validation
- ⚡ Loading states and error handling
- 🔄 Auto-refresh after creating tasks
- 📱 Mobile-friendly design

### Backend Features

- 🏗️ Clean, modular NestJS architecture
- 🗄️ Sequelize ORM with TypeScript
- 🔒 bcrypt password hashing
- 🎫 JWT-based authentication
- 🏢 Multi-tenant data isolation
- ✅ DTO validation with decorators
- 🛡️ Custom guards and decorators
- 📝 Comprehensive error handling

---

## 🚢 Deployment

### Deploy Backend

**Heroku:**

```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

**Azure:**

```bash
az webapp create --name your-app --runtime "NODE|18-lts"
az webapp config appsettings set --settings NODE_ENV=production
```

**Docker:**

```bash
docker build -t tasks-api ./nestjs-tasks-backend
docker run -p 3001:3001 tasks-api
```

### Deploy Frontend

**Vercel:**

```bash
npm install -g vercel
cd nuxt-tasks-app
vercel
```

**Netlify:**

```bash
npm install -g netlify-cli
cd nuxt-tasks-app
npm run build
netlify deploy --prod --dir=.output/public
```

---

## 📚 Documentation

Each project includes detailed documentation:

### Backend Documentation

- `README.md` - Complete project overview
- `API_DOCUMENTATION.md` - Full API reference
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `QUICK_START.md` - 5-minute setup guide

### Frontend Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_SPECIFICATION.md` - Backend API requirements
- `PROJECT_SUMMARY.md` - Technical details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **NestJS** - A progressive Node.js framework
- **Nuxt 3** - The Intuitive Vue Framework
- **Vuetify** - Material Design Component Framework
- **Sequelize** - Promise-based Node.js ORM
- **Microsoft SQL Server** - Reliable database solution

---

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the detailed documentation in each project folder
3. Check if SQL Server is running: `docker ps`
4. Verify environment variables are correct
5. Clear node_modules and reinstall dependencies

---

## 🎯 Quick Commands Reference

```bash
# Start everything from scratch

# Terminal 1 - SQL Server
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name mssql-server \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Terminal 2 - Backend
cd nestjs-tasks-backend
npm install
npm run seed
npm run start:dev

# Terminal 3 - Frontend
cd nuxt-tasks-app
npm install
npm run dev

# Access: http://localhost:3000
# Login: admin / admin123
```

---

**Built with ❤️ using NestJS, Nuxt 3, Vue 3, and Vuetify 3**

**Happy Coding! 🚀**
