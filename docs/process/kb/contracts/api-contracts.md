# API Contracts Register

This file is the contract index for backend endpoints.

## Contract Rules

1. Add or update contract entries before implementation.
2. Include request schema, response schema, and error codes.
3. Keep tests aligned with contract entries.

## Endpoints Planned for MVP

- `POST /api/dreams`
- `POST /api/dreams/{dreamId}/stages`
- `POST /api/dreams/{dreamId}/tasks`
- `POST /api/dreams/{dreamId}/invite`
- `POST /api/invites/{token}/accept`
- `POST /api/dreams/{dreamId}/collaboration`
- `POST /api/dreams/{dreamId}/checkins`
- `POST /api/dreams/{dreamId}/rewards`
- `GET /api/me`

## Contract Entry Template

- Endpoint:
- Auth required:
- Request schema:
- Success response:
- Error responses:
- Events emitted:
