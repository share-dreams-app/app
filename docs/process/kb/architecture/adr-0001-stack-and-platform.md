# ADR-0001: Stack and Platform

## Status

Accepted (2026-04-15)

## Context

The project needs low-cost initial operation, fast iteration, and type-safe full-stack development.

## Decision

- App framework: Next.js 15 + TypeScript
- Data layer: Prisma + Supabase PostgreSQL
- Auth: Auth.js
- Deployment target: Cloudflare
- Testing: Vitest + Testing Library + Playwright

## Consequences

- Fast MVP setup in one codebase.
- Strong type safety across API and domain layers.
- Requires Cloudflare-compatible deployment configuration.
- Requires disciplined DB schema sync and secret management.
