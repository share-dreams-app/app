# Contributing

## Branching and PR Premise

This repository uses a strict phase-based branching workflow.

- `main` is protected and stable.
- Direct pushes to `main` are not allowed.
- Every implementation phase must be developed in its own branch.
- Every phase branch must open a Pull Request into `main`.
- A phase is only considered complete after PR approval and merge.

## Branch Naming Convention

Use one branch per phase:

- `phase/1-foundation-persistence`
- `phase/2-core-product-loop`
- `phase/3-personalization-rewards`
- `phase/4-ux-analytics-release-gate`

If a phase needs a second iteration, use suffixes:

- `phase/2-core-product-loop-v2`

## Mandatory Workflow Per Phase

1. Start from updated `main`.
2. Create the phase branch.
3. Implement only the scoped tasks for that phase.
4. Run all phase exit checks from the implementation plan.
5. Write handoff note in `docs/superpowers/handoffs/`.
6. Open PR to `main` using the project PR template.
7. Merge only after review and green checks.

## Pull Request Requirements

Every PR must include:

- Phase number and scope
- Linked plan path:
  - `docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md`
- Test evidence (commands and pass/fail status)
- Risks and follow-ups

Also required:

- Follow `AGENTS.md` and `docs/process/guardrails.md`.
- Respect coverage policy from `docs/process/quality-gates.md` (target >=90%).

## Suggested Git Commands

```bash
git checkout main
git pull
git checkout -b phase/<N>-<short-scope>

# ... work, commits, tests

git push -u origin phase/<N>-<short-scope>
```

## Merge Strategy

Use **Squash and merge** by default to keep `main` history clean and phase-oriented.
