# PulseLink - Production-Grade URL Shortener

PulseLink is a complete full-stack URL shortener rebuilt for production use.

It ships with:
- Hardened Express + MongoDB backend
- Next-gen React frontend with a modern motion-driven UI
- Secure auth with HTTP-only JWT cookies
- Link analytics (click tracking), ownership controls, and pagination
- Dockerized deployment workflow

## What Was Revamped

### Frontend
- Complete visual redesign with custom typography, gradients, glass surfaces, and staggered motion
- Improved UX for auth, URL creation, copy actions, and dashboard management
- Reliable API integration via centralized Axios client and query caching
- Route-guarded dashboard and auth bootstrapping

### Backend
- Versioned API (`/api/v1`) with structured controllers/services/DAO layout
- Input validation using `zod` middleware
- Security stack: `helmet`, `cors` allowlist, `hpp`, `mongo-sanitize`, `rate limiting`, `httpOnly` cookies
- Structured logging with `pino` + graceful shutdown
- Health endpoint and consistent error responses
- URL ownership deletion + paginated user link retrieval

## Architecture

```text
url-shortner/
+-- BACKEND/
¦   +-- src/
¦   ¦   +-- app.js
¦   ¦   +-- config/
¦   ¦   +-- controller/
¦   ¦   +-- dao/
¦   ¦   +-- middleware/
¦   ¦   +-- models/
¦   ¦   +-- routes/
¦   ¦   +-- services/
¦   ¦   +-- utils/
¦   +-- .env.example
¦   +-- Dockerfile
+-- FRONTEND/
¦   +-- src/
¦   ¦   +-- api/
¦   ¦   +-- components/
¦   ¦   +-- pages/
¦   ¦   +-- routing/
¦   ¦   +-- store/
¦   ¦   +-- utils/
¦   +-- .env.example
¦   +-- Dockerfile
+-- docker-compose.yml
```

## API Endpoints

### Health
- `GET /api/v1/health`

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### URLs
- `POST /api/v1/urls` (auth optional; custom slug requires auth)
- `GET /api/v1/urls/me` (auth required)
- `DELETE /api/v1/urls/:id` (auth required)
- `GET /:id` (redirect)

## Local Development

## 1) Backend

```bash
cd BACKEND
cp .env.example .env
npm install
npm run dev
```

## 2) Frontend

```bash
cd FRONTEND
cp .env.example .env
npm install
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:3000`

## Environment Variables

### Backend (`BACKEND/.env`)

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Runtime mode | `development` |
| `PORT` | API port | `3000` |
| `MONGO_URI` | Mongo connection string | `mongodb://localhost:27017/url-shortner` |
| `APP_URL` | Public backend/base redirect URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret (long random) | `replace-me` |
| `JWT_EXPIRES_IN` | JWT TTL | `7d` |
| `COOKIE_NAME` | Auth cookie name | `accessToken` |
| `COOKIE_SAME_SITE` | Cookie SameSite policy | `lax` |
| `COOKIE_SECURE` | Use secure cookies | `false` in local |
| `COOKIE_MAX_AGE_MS` | Cookie max age in ms | `604800000` |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` |
| `TRUST_PROXY` | Express trust proxy value | `1` |
| `LOG_LEVEL` | Pino log level | `debug` |

### Frontend (`FRONTEND/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API root | `http://localhost:3000` |
| `VITE_PUBLIC_APP_URL` | Public redirect origin | `http://localhost:3000` |

## Docker Deployment

Run full stack (frontend + backend + MongoDB):

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017`

## Production Readiness Notes

- Replace `JWT_SECRET` with a long random secret
- Set `NODE_ENV=production`
- Set `COOKIE_SECURE=true` behind HTTPS
- Restrict `CORS_ORIGIN` to trusted domains only
- Place backend behind a reverse proxy/load balancer
- Enable monitoring and centralized log shipping

## Scripts

### Backend
- `npm run dev` - start with nodemon
- `npm start` - production start
- `npm run check` - syntax check

### Frontend
- `npm run dev` - Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - lint source
