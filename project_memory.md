# Project Memory & Constraints

## Architectural Decisions

### Frontend (React + TypeScript + Vite + Tailwind)
- **Modular Typings**: All interfaces MUST live in `frontend/src/types/index.ts`. No inline definitions in components.
- **API Service Layer**: All API calls go through `frontend/src/services/api.ts`. This reads `VITE_API_URL` from `.env`. Never hardcode `localhost:5000` in components.
- **Custom Hooks**: Logic is extracted into focused hooks in `frontend/src/hooks/`:
  - `usePortfolioData` — fetches all 4 endpoints concurrently
  - `useMousePosition` — tracks cursor for the flashlight glow
  - `useContactForm` — owns form state and submit handler
- **Animation Constants**: All Framer Motion variants are defined in `frontend/src/animations/variants.ts`. No inline `any`-typed animation objects in components.

### Backend (Express + TypeScript + MongoDB)
- **MVC Architecture**: Strict Model → Repository → Controller → Route layering.
  - **Models** (`src/models/`): Mongoose schemas and `IEntity` interfaces.
  - **Repositories** (`src/repositories/`): All Mongoose query logic. Controllers never call Mongoose directly.
  - **Controllers** (`src/controllers/`): Business logic only. All errors delegated via `next(error)`.
  - **Routes** (`src/routes/`): Endpoint definitions only. Include validation middleware before controllers.
- **Centralized Error Handler**: `src/middleware/errorHandler.ts` is registered last in `server.ts`. It is the only place that formats error responses.
- **Input Validation**: All mutating routes use the `validate(schema)` Zod middleware from `src/middleware/validate.ts`. Schemas live in `src/middleware/validation/`.
- **Env Config**: All environment variables are read through `src/config/env.ts`. No raw `process.env` calls outside this file.
- **Migration Methodology**: `src/seed.ts` is the single source of truth. It guards against re-seeding using `countDocuments()`. Use `SEED_FORCE=true` to wipe and reseed intentionally.

### Database (MongoDB via Docker)
- Collections: `profiles` (1 doc), `skills` (4 docs), `experiences` (2 docs), `educations` (2 docs), `contacts` (append-only)

---

## Known Anti-Patterns & Corrected Errors
- **Seed-on-Restart Bug (CRITICAL)**: `seedDatabase()` is called every startup. Since `nodemon` restarts on file changes, this caused 3x data duplication. Fix: `countDocuments()` guard + `SEED_FORCE=true` escape hatch.
- **Hardcoded API URLs**: Never write `http://localhost:5000` in components. Use `api.*` from the service layer.
- **Inline try/catch in controllers**: All `catch` blocks must call `next(error)`, never `res.status(500)` directly.

---

## Active Context
- **Current Phase**: Full architectural refactor complete. Cyberpunk UI live on `http://127.0.0.1:5173/`. Ready for deployment.
