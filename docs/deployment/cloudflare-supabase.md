# Cloudflare and Supabase Preview Deployment

This MVP targets Cloudflare for the web runtime and Supabase PostgreSQL for persistence, matching the platform decision in `docs/process/kb/product/source-of-truth.md` and `docs/process/kb/architecture/adr-0001-stack-and-platform.md`.

## Preview Check

Run the non-destructive preview gate before opening the Phase 4 PR:

```bash
npm run deploy:preview
```

The script builds the Next.js app and verifies that the Cloudflare adapter files are present. It does not publish or mutate Cloudflare resources.

## Required Runtime Variables

Configure these values as Cloudflare environment variables or secrets for a real preview deployment:

- `DATABASE_URL`: Supabase pooled PostgreSQL connection string.
- `DIRECT_URL`: Supabase direct PostgreSQL connection string for Prisma migrations.
- `AUTH_SECRET`: Auth.js signing secret.
- `NEXT_PUBLIC_APP_ENV`: `preview` or `production`.

## Deployment Notes

- `wrangler.jsonc` defines the Cloudflare project name, compatibility date, and static output directory for preview validation.
- `open-next.config.ts` keeps the adapter configuration local to the repository without wiring any external provider during MVP validation.
- Apply database migrations against Supabase before publishing a preview that exercises persisted API flows.
- Roll back by promoting the previous Cloudflare Pages/Workers deployment and keeping Supabase migrations backward compatible.
