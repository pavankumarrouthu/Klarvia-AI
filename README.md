# Klarvia-AI

Vite + React + TypeScript + shadcn-ui + Tailwind CSS, with a minimal Node/Express backend for Postgres.



## Frontend (Vite)

- Dev server runs on http://localhost:8080
- Dev proxy forwards `/api` to `http://localhost:4000`

```powershell
npm install --legacy-peer-deps
npm run dev
```

## Tech stack

- Vite, React, TypeScript, shadcn-ui, Tailwind CSS
- Node/Express, pg, bcrypt, jsonwebtoken

## Database connectivity (Render Postgres)

The backend ships with a small DB connectivity check and migrations. To verify your Render Postgres (or any PostgreSQL) connection from the project, set the following environment variables and run the check script from the `server/` folder.

- Required env vars:
	- `DATABASE_URL` — the full Postgres connection string (do NOT commit this to source control)
	- `DATABASE_SSL` — set to `true` when connecting to hosted Postgres services that require SSL (for example, Render)

Example (PowerShell):

```powershell
$env:DATABASE_URL = 'postgres://username:password@db-host:5432/dbname'
$env:DATABASE_SSL = 'true'
npm --prefix server run check-db
```

Expected successful output:

- "DB connection OK"
- `server_time:` (server reported time)
- `version:` (Postgres server version)

Common failure and how to interpret it:

- Error: `getaddrinfo ENOTFOUND base`
	- This means the hostname portion of your `DATABASE_URL` could not be resolved. Often this happens when `DATABASE_URL` is missing, malformed, or contains a placeholder value like `base` from some templated string.
	- Solution: Verify `DATABASE_URL` is a valid URL. Example valid URL:
		- `postgres://user:pass@db.xxx.render.com:5432/dbname` (hostname should be a resolvable DNS name or IP)

- Error: SSL or certificate issues
	- If you see certificate validation errors, ensure `DATABASE_SSL` is set to `true` for hosted Postgres providers that require SSL. The backend uses `rejectUnauthorized: false` when `DATABASE_SSL=true` so it will accept the server certificate in typical managed Postgres setups.

If you want me to run the DB-check here, please set `DATABASE_URL` in your environment (or paste a sanitized host part) and confirm you'd like me to proceed. I will NOT ask you to paste secrets; a sanitized host (for debugging) or setting the env locally is sufficient.


# be -- npm --prefix D:\office-work\Klarvia-AI\server run dev