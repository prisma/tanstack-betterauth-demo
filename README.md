# Todo App (Next.js)

A Next.js todo app with authentication (better-auth) and Prisma (PostgreSQL). Built for deployment on Deno Deploy.

## Environment variables

Create a `.env` file in the project root with:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
BETTER_AUTH_SECRET=replace-with-strong-secret
BETTER_AUTH_URL=http://localhost:3000
```

For production (e.g. Deno Deploy), set these in your deployment dashboard. Use your production URL for `BETTER_AUTH_URL` (e.g. `https://your-app.deno.dev`).

## Commands

- Install deps: `pnpm install`
- Generate Prisma client: `pnpm run db:generate`
- Apply migrations: `pnpm run db:migrate`
- Dev server: `pnpm run dev`
- Build: `pnpm run build`
- Start (production): `pnpm run start`

## Deploying to Deno Deploy

This app uses Next.js with `output: "standalone"` for Deno Deploy.

1. **GitHub integration**: Connect your repo at [dash.deno.com](https://dash.deno.com). Deno Deploy will detect the Next.js app and configure the build. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in the project Environment Variables.

2. **Pre-deploy**: Ensure the build runs `prisma generate` so the Prisma client (under `src/generated/prisma`) is available. The `prebuild` script in `package.json` runs `db:generate` before `next build`.

3. **CLI deploy** (optional):
   ```bash
   pnpm run build
   deployctl deploy --include=.next --include=public jsr:@deno/nextjs-start/v15
   ```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) v4 with PostCSS.
