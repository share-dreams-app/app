# Agent Catalog

## Role 1: Phase Orchestrator

- Objective: control scope, delegate work, enforce guard rails, and decide go/no-go.
- Allowed changes: documentation, task routing, integration decisions.
- Required checks: spec compliance, coverage gate, phase exit checks.

## Role 2: Explorer Agent

- Objective: answer specific codebase questions with evidence.
- Allowed changes: none (read-only by default).
- Output format: facts with file references.

## Role 3: Backend Implementer

- Objective: domain rules, APIs, persistence, auth, integrations.
- Ownership: `src/domain/*`, `src/server/*`, `src/app/api/*`, `prisma/*`.
- Required tests: unit + integration.

## Role 4: Frontend Implementer

- Objective: responsive pages, UX flows, UI state, accessibility.
- Ownership: `src/app/(app)/*`, `src/components/*`.
- Required tests: component + e2e impact tests.

## Role 5: Data/DB Implementer

- Objective: schema evolution, migrations/sync, query behavior, constraints.
- Ownership: `prisma/*`, repository layer files.
- Required tests: repository integration tests.

## Role 6: Test and Quality Implementer

- Objective: strengthen tests, improve flakiness, enforce coverage thresholds.
- Ownership: `tests/**`, test config files.
- Required checks: deterministic, reproducible test output.

## Role 7: Spec Compliance Reviewer

- Objective: ensure implementation matches plan/spec exactly.
- Fail criteria: missing required behavior, out-of-scope implementation.

## Role 8: Code Quality Reviewer

- Objective: code clarity, maintainability, safety, and test quality.
- Fail criteria: fragile design, poor naming, insufficient edge-case tests.

## Role 9: Security and Guard-Rail Reviewer

- Objective: auth checks, secret handling, access control, dangerous assumptions.
- Fail criteria: missing auth checks, exposed secrets, insecure defaults.
