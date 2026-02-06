# Nuxt 3 Tasks Application

A full-featured task management application built with Nuxt 3, TypeScript, Vue 3 Composition API, Vuetify 3, and Pinia.

## Features

- **Authentication System**
  - JWT-based authentication with SSR-safe cookie storage
  - Secure login/logout functionality
  - Route guards for protected pages
  - Automatic token decoding and user management

- **Task Management**
  - View tasks in a data table with sorting
  - Create new tasks with a dialog form
  - Status tracking (Pending, In Progress, Done)
  - Color-coded status chips
  - Empty state handling

- **Tech Stack**
  - Nuxt 3 with TypeScript
  - Vue 3 Composition API
  - Vuetify 3 for UI components
  - Pinia for state management
  - @tabler/icons-vue for icons
  - SSR-safe cookie handling

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Installation

1. **Clone or extract the project:**

   ```bash
   cd nuxt-tasks-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your backend API URL:

   ```
   NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
nuxt-tasks-app/
├── pages/
│   ├── index.vue          # Home page (redirects based on auth)
│   ├── login.vue          # Login page
│   └── tasks.vue          # Tasks management page
├── stores/
│   └── auth.ts            # Pinia auth store with JWT handling
├── composables/
│   └── useApi.ts          # API wrapper with auth & headers
├── middleware/
│   └── auth.global.ts     # Global route guards
├── plugins/
│   └── vuetify.ts         # Vuetify configuration
├── app.vue                # Main app component
├── nuxt.config.ts         # Nuxt configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Key Features Explained

### Authentication Flow

1. User submits credentials on `/login`
2. Auth store sends POST request to `/api/auth/login`
3. JWT token is received and decoded
4. Token stored in SSR-safe cookie
5. User redirected to `/tasks`

### API Integration

All API calls use the `useApi` composable which:

- Automatically adds Authorization Bearer token
- Adds `x-tenant-id: 1` header
- Points to configured backend URL
- Wraps Nuxt's `useFetch` for SSR compatibility

### Route Protection

The global auth middleware:

- Redirects unauthenticated users from `/tasks` to `/login`
- Redirects authenticated users from `/login` to `/tasks`
- Initializes auth state from cookie on page load

### State Management

Pinia auth store provides:

- `token`: JWT token string
- `user`: Decoded user object from JWT
- `isAuthenticated`: Computed boolean (checks token validity & expiration)
- `login(username, password)`: Login action
- `logout()`: Logout action
- `initAuth()`: Initialize from cookie

## Backend API Requirements

The application expects the following backend endpoints:

### Authentication

```
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string }
```

### Tasks

```
GET /api/tasks
Headers:
  - Authorization: Bearer {token}
  - x-tenant-id: 1
Response: Task[]

POST /api/tasks
Headers:
  - Authorization: Bearer {token}
  - x-tenant-id: 1
Body: { title: string, description?: string, status: string }
Response: Task
```

### Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Pending" | "InProgress" | "Done";
  createdAt: string;
}
```

### JWT Payload

The JWT token should contain:

```typescript
{
  sub?: string        // User ID
  username?: string   // Username
  email?: string      // Email
  exp?: number        // Expiration timestamp
  iat?: number        // Issued at timestamp
}
```

## Styling & Theming

The application uses Vuetify's default light theme with custom colors:

- Primary: #1976D2
- Success: #4CAF50 (Done status)
- Info: #2196F3 (In Progress status)
- Warning: #FFC107 (Pending status)
- Error: #FF5252

All components use Vuetify's utility classes for spacing and layout.

## Development Tips

1. **Hot Module Replacement**: Changes to `.vue` files auto-reload
2. **TypeScript**: Full type safety with TypeScript strict mode
3. **DevTools**: Nuxt DevTools available in development mode
4. **Pinia DevTools**: Use Vue DevTools to inspect Pinia state

## Troubleshooting

### Port already in use

Change the dev server port:

```bash
PORT=3001 npm run dev
```

### API connection errors

- Verify backend is running
- Check `NUXT_PUBLIC_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Authentication issues

- Clear cookies and local storage
- Check JWT token expiration
- Verify backend returns valid JWT

## License

MIT
