# Guard Rails (Anti-Hallucination)

## Source-of-Truth Hierarchy

1. User explicit instruction in current conversation
2. Repository policy files (`AGENTS.md`, `CONTRIBUTING.md`)
3. Product spec (`docs/superpowers/specs/...`)
4. Implementation plan (`docs/superpowers/plans/...`)
5. Knowledge base files (`docs/process/kb/...`)
6. Existing code and tests

If higher-level sources conflict with lower-level sources, follow the higher-level source and log the decision in the phase handoff.

## Evidence Rule

Any implementation claim must cite repository evidence.

Examples:
- Requirement evidence: spec section path
- Technical decision evidence: ADR path
- Validation evidence: executed command + result

## Unknown Handling Rule

When information is missing:

1. Search repository KB and docs.
2. If unresolved, stop and ask one precise question.
3. Do not invent API contracts, data fields, or behavior.

## Contract-First Rule

Before implementing API behavior:

1. Define/confirm contract in `docs/process/kb/contracts/api-contracts.md`.
2. Write failing tests from contract.
3. Implement minimal passing behavior.

## Scope Lock Rule

Task work must stay inside the phase scope in
`docs/process/phase-execution-matrix.md`.
Out-of-scope issues go to handoff as follow-up, not inline implementation.
