# Release and Rollback Guidance

## Release Preconditions

1. Phase PR approved and merged.
2. Required CI checks green.
3. Coverage gates satisfied.
4. Handoff note completed.

## Deployment Model

- Preview deployments for PR validation.
- Controlled production deploy from `main`.

## Rollback Principle

- Prefer fast rollback to last known-good deployment.
- Document incident and corrective action in next handoff.
