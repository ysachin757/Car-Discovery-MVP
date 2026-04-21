# Car Discovery MVP

Production-ready starter project for a full-stack car discovery application that guides users through preference questions and returns a session-based shortlist.

## Live Demo

- **Frontend (Vercel)**: https://car-discovery-8u4gapeb4-sachin-yadavs-projects-79548f81.vercel.app
- **Backend (Render)**: https://car-discovery-mvp-2.onrender.com
- **Backend Health Check**: https://car-discovery-mvp-2.onrender.com/api/health
- **GitHub Repository**: https://github.com/ysachin757/Car-Discovery-MVP

## Highlights
- Full-stack TypeScript architecture
- Question-first recommendation flow
- Session-only shortlist, no login required
- Mock dataset with 28 car records
- Modular backend services and frontend components
- Deployment templates for Vercel and Render

## Repository Structure

```text
car-discovery-mvp/
  backend/
  frontend/
  deploy/
  docs/
  README.md
```

## Architecture Summary
- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript + Zod
- Data source: JSON files in backend/data
- Recommendation strategy: deterministic weighted scoring engine
- Session persistence: browser sessionStorage

## Prerequisites
- Node.js 20+
- npm 10+

## Quick Start (Local)

1. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

2. Frontend setup

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

3. Open application
- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api/health

## Environment Variables

### Backend
- NODE_ENV: development or production
- PORT: API server port
- CORS_ORIGIN: allowed frontend origin
- ENABLE_API_KEY_AUTH: true or false
- INTERNAL_API_KEY: required only when auth is enabled

### Frontend
- VITE_API_BASE_URL: optional backend API URL. If omitted in local dev, frontend falls back to /api and uses the Vite proxy.

## API Endpoints

### GET /api/health
Returns service health status.

### GET /api/questions
Returns questionnaire metadata.

### POST /api/recommendations
Generates ranked recommendations based on preferences.

### GET /api/cars/:carId
Returns full detail for one car.

Detailed examples: docs/API.md

## Database and Schema Scripts

MVP uses JSON data files, plus future-ready relational schema scripts.

- SQL schema: backend/db/migrations/001_init.sql
- Sample SQL seed: backend/db/migrations/002_seed_questions.sql
- JSON seed source: backend/db/seeds/cars.seed.json

To refresh runtime dataset from seed file:

```bash
cd backend
npm run seed
```

## Recommendation Logic
The scoring engine computes:
- Price fit
- Mileage fit
- Body type match
- Fuel type match
- Safety fit

Final score is weighted and normalized. Tie-breakers are:
1. Higher safety rating
2. Lower price

## AI Integration Strategy
The current implementation is deterministic-first and includes AI-ready service abstractions.

- Optional module: backend/src/services/aiExplanationService.ts
- Default provider: fallback deterministic explanation
- Future path: plug in an LLM provider without changing recommendation ranking logic

Guardrails:
- AI output should augment explanation only
- Recommendation ranking remains deterministic unless explicitly redesigned

## Authentication and Authorization
MVP does not require login by design. An optional API key middleware is included for future private endpoints.

- Middleware: backend/src/middleware/authOptional.ts
- Disabled by default
- Enable with:
  - ENABLE_API_KEY_AUTH=true
  - INTERNAL_API_KEY=<secure-value>

## Testing

Current scripts:

```bash
cd backend
npm test

cd ../frontend
npm test
```

Current automated coverage:
- Backend unit tests for recommendation payload validation
- Backend unit tests for scoring behavior
- Backend unit tests for recommendation fuel filtering and tie-break sorting

Recommended additions for full production hardening:
- Integration tests for API contracts
- Frontend component tests for form validation and result rendering
- E2E tests for question-to-shortlist flow
- Load checks for /api/recommendations

## Security Best Practices Included
- Helmet security headers
- CORS origin restrictions
- Request body size limits
- Standardized validation and error envelopes
- Basic in-memory rate limiting
- Correlation ID propagation

## Deployment

### Backend on Render
- Config template: backend/render.yaml
- Build command: npm ci && npm run build
- Start command: npm run start

### Frontend on Vercel
- Config template: frontend/vercel.json
- Set VITE_API_BASE_URL to deployed backend URL

## Production Readiness Checklist
- Replace mock dataset with managed database
- Add CI pipeline (lint, test, build)
- Add robust rate limiter (Redis-backed)
- Add observability stack (metrics, traces, alerts)
- Add structured logger instead of console output
- Add contract testing in CI
- Add stricter frontend form validation

## Troubleshooting

1. CORS error in browser
- Ensure CORS_ORIGIN matches frontend URL exactly.

2. Recommendations not loading
- Verify backend is running on expected port.
- Check frontend VITE_API_BASE_URL value.

3. Missing data errors
- Ensure backend/data/cars.json exists.
- Run npm run seed in backend.

## License
For assignment and educational use.
