# Testing Policy

## Objectives

- Catch regressions early.
- Validate behavior from contract to UI.
- Maintain confidence with >=90% coverage target.

## Test Layers

1. Unit tests for pure rules (`src/domain/*`).
2. Integration tests for services and repositories (`src/server/*`).
3. Route-level tests for API contracts (`src/app/api/*`).
4. E2E tests for core user journeys.

## Coverage Targets

- Global minimum: 90%
- Changed files expectation: 90% or higher
- Regressions: do not allow global coverage decrease below threshold

## Required Evidence in PR

- Commands executed
- Pass/fail summary
- Coverage summary
