# Klarvia Backend

Quick notes:

- Install dependencies: `npm install`
- Copy `.env.example` to `.env` and set `DATABASE_URL`.
- Set `DATABASE_SSL=true` for Render, and set `JWT_SECRET` and `JWT_TTL`.
- Run migrations: `npm run migrate` (this runs `server/migrations/init.sql`).
- Start dev server: `npm run dev` or `npm run dev:ready` to migrate then start.

Do not commit `.env` or real credentials. Use your cloud provider's secret store for production.
