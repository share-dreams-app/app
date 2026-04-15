# Share Dreams AI Delivery Protocol

This file defines mandatory execution rules for AI-assisted delivery in this repository.

## 1) Scope and Goal

The goal is predictable delivery with low hallucination risk, strict traceability, and strong test confidence.

## 2) Non-Negotiable Rules

1. Use one branch per phase and open one PR per phase into `main`.
2. Never implement directly on `main`.
3. Follow the source-of-truth hierarchy in `docs/process/guardrails.md`.
4. Any requirement claim must reference at least one repository source path.
5. If information is missing or conflicting, stop and resolve before coding.
6. Every code task must include tests, and all defined quality gates must pass.
7. Coverage target is at least 90% as defined in `docs/process/quality-gates.md`.

## 3) Required Workflow Skills

- `using-superpowers` at session start.
- `brainstorming` before feature/design changes.
- `writing-plans` before implementation changes.
- `subagent-driven-development` for phase execution.
- `verification-before-completion` before claiming completion.
- `requesting-code-review` before merge readiness.

## 4) Agent System

Use the catalog in `docs/process/agent-catalog.md`.

Minimum required roles per task:
- 1 implementer agent
- 1 spec-compliance reviewer agent
- 1 code-quality reviewer agent

## 5) Knowledge Base Policy

Use only repository KB and approved docs as primary references.

KB index:
- `docs/process/kb/product/source-of-truth.md`
- `docs/process/kb/architecture/adr-0001-stack-and-platform.md`
- `docs/process/kb/contracts/api-contracts.md`
- `docs/process/kb/testing/testing-policy.md`
- `docs/process/kb/operations/release-and-rollback.md`

## 6) Phase Execution Contract

Execute phases using `docs/process/phase-execution-matrix.md` and
`docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md`.

Each phase must produce:
1. Green phase exit checks.
2. Handoff note in `docs/superpowers/handoffs/`.
3. PR to `main` using `.github/pull_request_template.md`.
