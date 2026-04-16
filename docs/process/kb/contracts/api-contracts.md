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
- `POST /api/profile/relationship`
- `POST /api/dreams/{dreamId}/suggestions/tasks`
- `POST /api/dreams/{dreamId}/rewards`
- `GET /api/me`

## Contract Entry Template

- Endpoint:
- Auth required:
- Request schema:
- Success response:
- Error responses:
- Events emitted:

## Active Contract Entries (Phase 2 and 3)

- Endpoint: `GET /api/me`
- Auth required: Yes
- Request schema: no body
- Success response: `200` with `{ user: { id: string, email: string }, tier: "FREE" | "PREMIUM" }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`
- Events emitted: none

- Endpoint: `POST /api/dreams`
- Auth required: Yes
- Request schema: `{ title: string }` (tier and active counts are resolved server-side)
- Success response: `201` with `{ id: string, ownerId: string, title: string }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `403` with `{ error: "FREE_DREAM_LIMIT_REACHED" }`
- Events emitted: `dream_created`

- Endpoint: `POST /api/dreams/{dreamId}/stages`
- Auth required: Yes
- Request schema: `{ title: string, order?: number }`
- Success response: `201` with `{ id: string, dreamId: string, title: string, order: number }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `400` with `{ error: "INVALID_STAGE" }`
- Events emitted: none

- Endpoint: `POST /api/dreams/{dreamId}/tasks`
- Auth required: Yes
- Request schema: `{ title: string }` (tier and active counts are resolved server-side)
- Success response: `201` with `{ id: string, dreamId: string, title: string }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `403` with `{ error: "FREE_TASK_LIMIT_REACHED" }`
- Events emitted: `task_created`

- Endpoint: `POST /api/dreams/{dreamId}/invite`
- Auth required: Yes
- Request schema: `{ invitedEmail: string }`
- Success response: `201` with `{ id: string, dreamId: string, invitedEmail: string, token: string, status: "PENDING" }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `400` with `{ error: "INVALID_INVITE" }`, `409` with `{ error: "SUPPORTER_LIMIT_REACHED" }`
- Events emitted: `supporter_invited`

- Endpoint: `POST /api/invites/{token}/accept`
- Auth required: no (MVP test harness phase)
- Request schema: no body
- Success response: `200` with `{ dreamId: string, supporterId: string, status: "ACCEPTED" }`
- Error responses: `400` with `{ error: "INVALID_INVITE" }`, `410` with `{ error: "INVITE_EXPIRED" }`
- Events emitted: none

- Endpoint: `POST /api/dreams/{dreamId}/collaboration`
- Auth required: Yes
- Request schema: `{ mode: "COMMENT_ONLY" | "SUGGEST_ONLY" | "FULL_EDIT", content: string }`
- Success response: `201` with `{ id: string, dreamId: string, type: "SUGGESTION", content: string, approvalStatus: "PENDING_OWNER_APPROVAL" | "APPROVED", approvedAt: string | null }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `403` with `{ error: "PERMISSION_DENIED" }`
- Events emitted: `support_interaction`

- Endpoint: `POST /api/dreams/{dreamId}/checkins`
- Auth required: Yes
- Request schema: `{ progress: number, nextSteps: string, blockers?: string }`
- Success response: `201` with `{ id: string, dreamId: string, progress: number, nextSteps: string, blockers?: string }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `422` with `{ error: "INVALID_CHECKIN" }`
- Events emitted: `checkin_submitted`

- Endpoint: `POST /api/profile/relationship`
- Auth required: Yes
- Request schema: `{ relationType: string, yearsKnown: number, ageRange?: string, objectiveContext?: string }`
- Success response: `200` with `{ userId: string, relationType: string, yearsKnown: number, ageRange?: string, objectiveContext?: string }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `422` with `{ error: "INVALID_RELATIONSHIP_PROFILE" }`
- Events emitted: none

- Endpoint: `POST /api/dreams/{dreamId}/suggestions/tasks`
- Auth required: Yes
- Request schema: `{ dreamTitle: string, relationshipProfile: { relationType: string, yearsKnown: number } }`
- Success response: `200` with `{ source: "AI" | "TEMPLATE", items: Array<{ title: string, reason?: string }> }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `422` with `{ error: "INVALID_SUGGESTION_REQUEST" }`
- Events emitted: none

- Endpoint: `POST /api/dreams/{dreamId}/rewards`
- Auth required: Yes
- Request schema: `{ mode: "MANUAL", title: string } | { mode: "SUGGEST", tier: "FREE" | "PREMIUM", dreamTitle: string, profile?: { relationType: string, yearsKnown: number } }`
- Success response: `201` with `{ dreamId: string, source: "MANUAL" | "AI" | "TEMPLATE", items?: Array<{ title: string }>, title?: string }`
- Error responses: `401` with `{ error: "UNAUTHORIZED" }`, `422` with `{ error: "INVALID_REWARD" }`
- Events emitted: none
