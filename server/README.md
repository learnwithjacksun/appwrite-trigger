# Appwrite Trigger API

Backend API that manages multiple Appwrite projects and keeps them active with manual and scheduled health pings.

## Tech Stack

- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- JWT authentication
- node-cron, axios, helmet, morgan, zod

## Prerequisites

- [Bun](https://bun.sh) or Node.js 20+
- MongoDB running locally or Atlas URI

## Setup

1. **Install dependencies**

   ```bash
   cd server
   bun install
   ```

2. **Environment variables**

   ```bash
   cp .env.example .env
   ```

   Generate an encryption key:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Paste the output into `ENCRYPTION_KEY` in `.env`.

3. **Start the server**

   ```bash
   bun run dev
   ```

   API base URL: `http://localhost:5000/api/v1`

## API Documentation

All protected routes require:

```
Authorization: Bearer <jwt_token>
```

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{ name, email, password }` | Register |
| POST | `/auth/login` | `{ email, password }` | Login |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects?page=1&limit=10&search=name` | List (paginated + search) |
| GET | `/projects/:id` | Get one |
| PUT | `/projects/:id` | Update |
| DELETE | `/projects/:id` | Delete |
| POST | `/projects/:id/ping` | Manual keep-alive ping |
| GET | `/projects/:id/ping-history?page=1&limit=20` | Ping logs |

**Create project body:**

```json
{
  "projectName": "My App",
  "appwriteEndpoint": "https://cloud.appwrite.io",
  "projectId": "your-appwrite-project-id",
  "apiKey": "your-api-key",
  "autoPingEnabled": true
}
```

API keys are encrypted at rest and never returned in responses.

### Stats & Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats/dashboard` | Yes | Dashboard aggregates |
| GET | `/health` | No | Server + DB health |

### Response format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Projects fetched successfully",
  "data": {}
}
```

### Ping response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project is active",
  "data": {
    "responseTimeMs": 142,
    "success": true,
    "appwriteResponse": {}
  }
}
```

## Auto Ping (Cron)

- Runs on `CRON_SCHEDULE` (default: `0 0 * * *` — daily at midnight)
- Pings projects where `autoPingEnabled: true`
- Logs results to console and `PingLog` collection
- Optional retry for failed projects when `AUTO_RETRY_FAILED=true`
- Prevents overlapping cron runs

## Security

- API keys encrypted with AES-256-GCM
- Helmet, CORS whitelist, rate limiting
- JWT on all project/stats routes
- Centralized error handling

## Project Structure

```
src/
  config/       # env, database
  controllers/  # route handlers
  cron/         # scheduled auto-ping
  middleware/   # auth, validation, errors, rate limits
  models/       # User, Project, PingLog
  routes/       # API routes
  services/     # business logic
  utils/        # helpers
  validators/   # Zod schemas
```

## Client integration

Set in your Vite client `.env`:

```
VITE_BASE_URL=http://localhost:5000/api/v1
```

Send JWT via `Authorization: Bearer <token>` on protected requests.
