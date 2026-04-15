# Phase Execution Matrix

## Phase 1 - Foundation and Persistence

- Plan tasks: 1, 2, 3
- Branch: `phase/1-foundation-persistence`
- Primary agents:
  - Backend Implementer
  - Data/DB Implementer
  - Test and Quality Implementer
- Reviewer agents:
  - Spec Compliance Reviewer
  - Code Quality Reviewer
  - Security and Guard-Rail Reviewer
- Required skills:
  - `test-driven-development`
  - `subagent-driven-development`
  - `verification-before-completion`
- Required KB pack:
  - `kb/product/source-of-truth.md`
  - `kb/architecture/adr-0001-stack-and-platform.md`
  - `kb/testing/testing-policy.md`
- Exit gates:
  - Phase 1 checks from implementation plan
  - Coverage reporting configured

## Phase 2 - Core Product Loop

- Plan tasks: 4, 5, 6, 7
- Branch: `phase/2-core-product-loop`
- Primary agents:
  - Backend Implementer
  - Data/DB Implementer
  - Test and Quality Implementer
- Reviewer agents:
  - Spec Compliance Reviewer
  - Code Quality Reviewer
  - Security and Guard-Rail Reviewer
- Required skills:
  - `test-driven-development`
  - `systematic-debugging`
  - `subagent-driven-development`
  - `verification-before-completion`
- Required KB pack:
  - `kb/product/source-of-truth.md`
  - `kb/contracts/api-contracts.md`
  - `kb/testing/testing-policy.md`
- Exit gates:
  - Phase 2 checks from implementation plan
  - Global coverage >=90%

## Phase 3 - Personalization and Rewards

- Plan tasks: 8, 9
- Branch: `phase/3-personalization-rewards`
- Primary agents:
  - Backend Implementer
  - Test and Quality Implementer
- Reviewer agents:
  - Spec Compliance Reviewer
  - Code Quality Reviewer
  - Security and Guard-Rail Reviewer
- Required skills:
  - `test-driven-development`
  - `subagent-driven-development`
  - `verification-before-completion`
- Required KB pack:
  - `kb/product/source-of-truth.md`
  - `kb/contracts/api-contracts.md`
  - `kb/testing/testing-policy.md`
- Exit gates:
  - Phase 3 checks from implementation plan
  - Global coverage >=90%

## Phase 4 - UX, Analytics, Release Gate

- Plan tasks: 10
- Branch: `phase/4-ux-analytics-release-gate`
- Primary agents:
  - Frontend Implementer
  - Backend Implementer
  - Test and Quality Implementer
- Reviewer agents:
  - Spec Compliance Reviewer
  - Code Quality Reviewer
  - Security and Guard-Rail Reviewer
- Required skills:
  - `test-driven-development`
  - `subagent-driven-development`
  - `verification-before-completion`
  - `requesting-code-review`
- Required KB pack:
  - `kb/product/source-of-truth.md`
  - `kb/testing/testing-policy.md`
  - `kb/operations/release-and-rollback.md`
- Exit gates:
  - Phase 4 checks from implementation plan
  - Global coverage >=90%
  - Release readiness documented
