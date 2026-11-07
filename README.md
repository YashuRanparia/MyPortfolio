# Constellation

Interactive portfolio: every star is a record in Postgres, edited from a protected `/admin`.

**Stack:** Next.js 15 (App Router) · Postgres + Drizzle · argon2 + signed httpOnly session cookie · optional TOTP 2FA · Cloudinary uploads.

## Run locally
```bash
npm install
docker compose up -d        # local Postgres on :5433
cp .env.example .env.local  # fill SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD (12+ chars)
npm run db:push             # create tables
npm run seed                # create admin + sample content
npm run dev                 # site: /   admin: /admin
```
Then sign in at `/admin`, and enable 2FA under *Security*.

## Run everything in Docker
```bash
cp .env.example .env.local   # fill SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
docker compose up --build    # site on :3000, admin on :3000/admin
```
The app container pushes the schema and seeds on every start (idempotent). It runs in production mode, so session cookies are `Secure`: use `http://localhost` (Chrome/Firefox accept this), not a LAN IP.

## Free deployment
1. **Neon** (free Postgres): create a project, copy the *pooled* connection string.
2. **Cloudinary** (free): copy cloud name, API key and secret.
3. **Vercel** (free Hobby): import this repo; set env vars `DATABASE_URL`, `SESSION_SECRET` (`openssl rand -base64 48`), `CLOUDINARY_*`.
4. From your machine, with the Neon `DATABASE_URL` and `ADMIN_*` in `.env.local`: `npm run db:push && npm run seed`.
5. Visit `https://<your-app>/admin`.

Lost your password or 2FA device: `npm run seed -- --reset-admin` with a new `ADMIN_PASSWORD`.

## Admin extras
Markdown details (rendered safely: no raw HTML, `javascript:` links dropped), live preview beside the editor, drag-and-drop ordering (↑/↓ buttons remain for keyboard), and an activity log at `/admin/activity`. After pulling this version run `npm run db:push` to add the `audit_log` table.

## AI guide (optional, free providers)
Set `LLM_API_KEY` and an "✦ Ask" button appears. It answers only from your published content and flies the camera to the star it cites. Same-origin only, 20 questions per IP per hour.
Works with any OpenAI-compatible provider that has a free tier: default is **Groq**; set `LLM_BASE_URL` / `LLM_MODEL` for **OpenRouter** (`:free` models) or **Gemini**. See `.env.example`. Model names and free limits change, so check the provider's docs. Leave the key empty to hide the button.

## Security model
- No signup route; the single admin is created by the seed script.
- Passwords: argon2id. Login is rate-limited (5 failures / 15 min per IP+email) and timing-equalised for unknown emails.
- Session: HS256 JWT in an `httpOnly`, `SameSite=Strict`, `__Host-` (prod) cookie, 12h. Changing the password or "Sign out everywhere" bumps `session_version`, invalidating all other tokens.
- Middleware blocks `/admin/*` and `/api/admin/*` without a valid token; every admin page and server action re-checks against the DB (`requireAdmin`).
- Admin-entered content is rendered as React text (no `dangerouslySetInnerHTML`); links are limited to `http(s)`/`mailto`.

## Notes
- Imports are relative, not `@/…`: Next's server-action bundler mis-resolves the alias when the project path contains `@` (this machine's does).
