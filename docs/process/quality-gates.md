# Quality Gates

## Mandatory Gates Per Task

1. Tests added or updated for each behavior change.
2. Failing tests first, then minimal implementation.
3. Green relevant test suite before commit.
4. Spec-compliance review approved.
5. Code-quality review approved.

## Coverage Policy

### Minimum Coverage Target

- Target: at least 90% coverage.
- Metrics: statements, branches, functions, lines.

### Enforcement Strategy

- Phase 1: configure coverage reporting and baseline thresholds.
- Phase 2 onward: hard fail if global coverage drops below 90%.
- Any changed domain/service file should have >=90% file-level coverage.

## Required Validation by Phase

- Follow phase exit checks from:
  - `docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md`
- Include command outputs summary in handoff and PR body.

## CI Expectation

Before merge to `main`, CI must validate:

1. Lint
2. Unit + integration tests
3. E2E tests when phase includes UI/flow impact
4. Coverage threshold gates
5. Build/deploy preview checks for release phase
