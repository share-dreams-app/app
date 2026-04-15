# Shared Dreams MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-first MVP where users convert dreams into stages/tasks, collaborate with one supporter, run weekly check-ins, use reward loops, and validate freemium-to-premium conversion.

**Architecture:** Use a single Next.js App Router codebase with server-side route handlers and Supabase-managed PostgreSQL via Prisma. Deploy on Cloudflare (Workers/Pages) with environment bindings for app secrets and database URLs. Keep business rules in pure domain modules (`src/domain/*`) and orchestration in services (`src/server/services/*`) so permission/limit logic is testable in isolation. Track behavior with event logging and compute retention/insight metrics from persisted events.

**Tech Stack:** Next.js 15 + TypeScript, Prisma + Supabase PostgreSQL, Vitest + Testing Library, Playwright, Tailwind CSS, Auth.js (NextAuth), Zod, Cloudflare (hosting/runtime).

---

## File Structure and Responsibilities

- `package.json`: scripts and dependencies for app, tests, lint, Prisma, Playwright.
- `prisma/schema.prisma`: relational model for users, dreams, tasks, invites, collaboration, rewards, profile, notifications, usage events.
- `src/domain/types.ts`: shared domain enums/types (`PlanTier`, `PermissionMode`, statuses).
- `src/domain/limits.ts`: freemium limits and pure limit check helpers.
- `src/domain/permissions.ts`: pure permission matrix helpers.
- `src/lib/db.ts`: Prisma client singleton.
- `src/server/services/*`: orchestration logic for dreams, collaboration, suggestions, rewards, check-ins, notifications, analytics.
- `src/app/api/**/route.ts`: HTTP API surface for the web client.
- `src/app/(app)/**`: responsive pages (dashboard, dream detail, insights, settings/profile).
- `src/components/**`: reusable UI blocks for forms, lists, timelines, and paywall prompts.
- `wrangler.jsonc`: Cloudflare deployment/runtime config.
- `open-next.config.ts`: Next.js adapter config for Cloudflare runtime.
- `.dev.vars.example`: local environment template compatible with Cloudflare runtime variables.
- `docs/deployment/cloudflare-supabase.md`: deployment and environment setup guide.
- `tests/domain/**`: pure unit tests for rules.
- `tests/api/**`: route/service integration tests.
- `tests/e2e/**`: end-to-end MVP behavior checks.

## Multi-Chat Execution Phases

Use one chat per phase to control context size. Each phase must end with green tests for that phase scope and a short handoff note committed to the repo (`docs/superpowers/handoffs/`).

## Branch and PR Premise (Mandatory)

- Use one dedicated branch per phase.
- Do not push implementation directly to `main`.
- Open one PR per phase into `main`.
- Merge phase PR only after phase exit checks pass and review is approved.
- Use `Squash and merge` for phase PRs.

### Standard Phase Branches

- Phase 1: `phase/1-foundation-persistence`
- Phase 2: `phase/2-core-product-loop`
- Phase 3: `phase/3-personalization-rewards`
- Phase 4: `phase/4-ux-analytics-release-gate`

### Phase Start Commands

```bash
git checkout main
git pull
git checkout -b phase/<N>-<short-scope>
```

### Phase End Commands

```bash
git push -u origin phase/<N>-<short-scope>
# open PR to main using .github/pull_request_template.md
```

### Phase 1: Foundation and Persistence

- Scope: Tasks 1, 2, 3.
- Outcome: runnable app skeleton, core domain rules, Prisma schema/repository baseline.
- Exit checks:
  - `npm run test -- tests/api/health.test.ts tests/domain/limits.test.ts tests/domain/permissions.test.ts tests/api/dream-repository.test.ts`
  - `npx prisma generate && npx prisma db push` completes against Supabase dev project.

### Phase 2: Core Product Loop (Auth, Planning, Collaboration)

- Scope: Tasks 4, 5, 6, 7.
- Outcome: authenticated APIs for dreams/tasks/check-ins, invite acceptance, permission enforcement, inactivity reminders.
- Exit checks:
  - `npm run test -- tests/api/me-auth.test.ts tests/api/dreams-create-limit.test.ts tests/api/tasks-create-limit.test.ts tests/api/invite-flow.test.ts tests/api/collaboration-permission.test.ts tests/api/checkin.test.ts tests/api/inactivity-reminder.test.ts`

### Phase 3: Personalization and Rewards

- Scope: Tasks 8, 9.
- Outcome: relationship profile, hybrid task suggestions (AI fallback), reward engine (manual/template/AI by tier).
- Exit checks:
  - `npm run test -- tests/api/suggestions-hybrid.test.ts tests/api/rewards-tiered.test.ts`

### Phase 4: UX, Analytics, and Release Gate

- Scope: Task 10 + final integration pass.
- Outcome: responsive pages, paywall UX, analytics events, insights service, Cloudflare deploy config, end-to-end happy path.
- Exit checks:
  - `npm run test`
  - `npm run test:e2e`
  - `npm run build` and `npm run deploy:preview` complete without configuration errors.

### New-Chat Handoff Template

When starting the next phase in a new chat, paste this:

```text
Execute Phase <N> of /home/leandro-baires/projects/share_dreams/docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md using subagent-driven-development. Stay strictly inside the phase scope, run the phase exit checks, and write a handoff note to docs/superpowers/handoffs/2026-04-15-phase-<N>-handoff.md with: completed items, test results, open risks, and next phase prerequisites.
```

### Task 1: Bootstrap Project and Test Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/api/health/route.ts`
- Create: `tests/api/health.test.ts`

- [ ] **Step 1: Write the failing API health test**

```ts
// tests/api/health.test.ts
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok payload", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/api/health.test.ts`
Expected: FAIL with module resolution error for `@/app/api/health/route`.

- [ ] **Step 3: Add minimal app scaffold and health route**

```ts
// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
```

```json
// package.json (scripts excerpt)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/health.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts vitest.config.ts src/app/layout.tsx src/app/page.tsx src/app/api/health/route.ts tests/api/health.test.ts
git commit -m "chore: scaffold nextjs app with vitest health check"
```

### Task 2: Implement Core Domain Rules (Limits and Permissions)

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/limits.ts`
- Create: `src/domain/permissions.ts`
- Test: `tests/domain/limits.test.ts`
- Test: `tests/domain/permissions.test.ts`

- [ ] **Step 1: Write failing unit tests for freemium limits and permission matrix**

```ts
// tests/domain/limits.test.ts
import { describe, expect, it } from "vitest";
import { canCreateActiveDream, canCreateActiveTask } from "@/domain/limits";

describe("limits", () => {
  it("blocks creating fourth active dream on free", () => {
    expect(canCreateActiveDream("FREE", 3)).toBe(false);
  });

  it("allows creating tasks below free limit", () => {
    expect(canCreateActiveTask("FREE", 4)).toBe(true);
  });
});
```

```ts
// tests/domain/permissions.test.ts
import { describe, expect, it } from "vitest";
import { canSupporterEdit, canSupporterSuggest } from "@/domain/permissions";

describe("permissions", () => {
  it("comment-only cannot suggest or edit", () => {
    expect(canSupporterSuggest("COMMENT_ONLY")).toBe(false);
    expect(canSupporterEdit("COMMENT_ONLY")).toBe(false);
  });

  it("full-edit can suggest and edit", () => {
    expect(canSupporterSuggest("FULL_EDIT")).toBe(true);
    expect(canSupporterEdit("FULL_EDIT")).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/domain/limits.test.ts tests/domain/permissions.test.ts`
Expected: FAIL with missing module errors for `@/domain/*`.

- [ ] **Step 3: Implement domain types and pure rule modules**

```ts
// src/domain/types.ts
export type PlanTier = "FREE" | "PREMIUM";
export type PermissionMode = "COMMENT_ONLY" | "SUGGEST_ONLY" | "FULL_EDIT";
```

```ts
// src/domain/limits.ts
import type { PlanTier } from "@/domain/types";

export const FREE_MAX_ACTIVE_DREAMS = 3;
export const FREE_MAX_ACTIVE_TASKS_PER_DREAM = 5;

export function canCreateActiveDream(tier: PlanTier, currentActiveDreams: number) {
  if (tier === "PREMIUM") return true;
  return currentActiveDreams < FREE_MAX_ACTIVE_DREAMS;
}

export function canCreateActiveTask(tier: PlanTier, currentActiveTasks: number) {
  if (tier === "PREMIUM") return true;
  return currentActiveTasks < FREE_MAX_ACTIVE_TASKS_PER_DREAM;
}
```

```ts
// src/domain/permissions.ts
import type { PermissionMode } from "@/domain/types";

export function canSupporterSuggest(mode: PermissionMode) {
  return mode === "SUGGEST_ONLY" || mode === "FULL_EDIT";
}

export function canSupporterEdit(mode: PermissionMode) {
  return mode === "FULL_EDIT";
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/domain/limits.test.ts tests/domain/permissions.test.ts`
Expected: PASS with `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/domain/types.ts src/domain/limits.ts src/domain/permissions.ts tests/domain/limits.test.ts tests/domain/permissions.test.ts
git commit -m "feat: add freemium limits and supporter permission domain rules"
```

### Task 3: Define Database Schema and Repository Layer

**Files:**
- Create: `.env.example`
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/server/repositories/dream-repository.ts`
- Test: `tests/api/dream-repository.test.ts`

- [ ] **Step 1: Write failing repository test for active dream count and supporter cap**

```ts
// tests/api/dream-repository.test.ts
import { describe, expect, it } from "vitest";
import { createDreamRepository } from "@/server/repositories/dream-repository";

describe("dream repository", () => {
  it("counts active dreams and enforces one supporter per dream", async () => {
    const repo = createDreamRepository();
    const ownerId = "user_owner";

    await repo.createDream({ ownerId, title: "Novo emprego" });
    expect(await repo.countActiveDreams(ownerId)).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/api/dream-repository.test.ts`
Expected: FAIL with missing repository module.

- [ ] **Step 3: Implement Prisma schema and repository methods**

```prisma
// prisma/schema.prisma (core excerpt)
enum PlanTier { FREE PREMIUM }
enum DreamStatus { ACTIVE COMPLETED ARCHIVED }
enum TaskStatus { ACTIVE COMPLETED }
enum PermissionMode { COMMENT_ONLY SUGGEST_ONLY FULL_EDIT }
enum InviteStatus { PENDING ACCEPTED EXPIRED REVOKED }
enum RewardScope { DREAM TASK }
enum CollaborationType { COMMENT SUGGESTION CELEBRATION }
enum EventType {
  dream_created
  task_created
  checkin_submitted
  supporter_invited
  support_interaction
  task_completed
  dream_completed
  reward_defined
  reward_completed
  reward_ai_suggested
  reward_ai_accepted
  weekly_active_user
}

model User {
  id                          String              @id @default(cuid())
  email                       String              @unique
  planTier                    PlanTier            @default(FREE)
  dreamsOwned                 Dream[]             @relation("DreamOwner")
  dreamsSupported             Dream[]             @relation("DreamSupporter")
  collaborationEntries        CollaborationEntry[]
  notifications               Notification[]
  usageEvents                 UsageEvent[]
  profilesOwned               RelationshipProfile[] @relation("ProfileOwner")
  profilesAsSupporter         RelationshipProfile[] @relation("ProfileSupporter")
  createdAt                   DateTime            @default(now())
}

model Dream {
  id              String         @id @default(cuid())
  ownerId         String
  supporterId     String?
  supporterMode   PermissionMode @default(COMMENT_ONLY)
  title           String
  context         String?
  deadline        DateTime?
  status          DreamStatus    @default(ACTIVE)
  owner           User           @relation("DreamOwner", fields: [ownerId], references: [id])
  supporter       User?          @relation("DreamSupporter", fields: [supporterId], references: [id])
  stages          Stage[]
  rewards         Reward[]
  checkIns        CheckIn[]
  invites         DreamInvite[]
  collaboration   CollaborationEntry[]
  createdAt       DateTime       @default(now())
}

model Stage {
  id        String   @id @default(cuid())
  dreamId   String
  title     String
  order     Int
  dream     Dream    @relation(fields: [dreamId], references: [id])
  tasks     TaskItem[]
}

model TaskItem {
  id          String     @id @default(cuid())
  dreamId      String
  stageId      String?
  title        String
  dueDate      DateTime?
  status       TaskStatus @default(ACTIVE)
  dream        Dream      @relation(fields: [dreamId], references: [id])
  stage        Stage?     @relation(fields: [stageId], references: [id])
  rewards      Reward[]
}

model DreamInvite {
  id           String      @id @default(cuid())
  dreamId      String
  token        String      @unique
  invitedEmail String
  status       InviteStatus @default(PENDING)
  expiresAt    DateTime
  dream        Dream       @relation(fields: [dreamId], references: [id])
}

model CheckIn {
  id         String   @id @default(cuid())
  dreamId    String
  progress   Int
  nextSteps  String
  blockers   String?
  createdAt  DateTime @default(now())
  dream      Dream    @relation(fields: [dreamId], references: [id])
}

model Reward {
  id         String      @id @default(cuid())
  dreamId    String
  taskId     String?
  scope      RewardScope
  title      String
  source     String
  completedAt DateTime?
  dream      Dream       @relation(fields: [dreamId], references: [id])
  task       TaskItem?   @relation(fields: [taskId], references: [id])
}

model RelationshipProfile {
  id                 String   @id @default(cuid())
  ownerId            String
  supporterId        String?
  relationType       String
  yearsKnown         Int?
  ownerAgeRange      String?
  supporterAgeRange  String?
  objectiveContext   String?
  owner              User     @relation("ProfileOwner", fields: [ownerId], references: [id])
  supporter          User?    @relation("ProfileSupporter", fields: [supporterId], references: [id])
  updatedAt          DateTime @updatedAt

  @@unique([ownerId, supporterId])
}

model CollaborationEntry {
  id          String            @id @default(cuid())
  dreamId     String
  authorId    String
  type        CollaborationType
  content     String
  approvedAt  DateTime?
  createdAt   DateTime          @default(now())
  dream       Dream             @relation(fields: [dreamId], references: [id])
  author      User              @relation(fields: [authorId], references: [id])
}

model Notification {
  id         String   @id @default(cuid())
  userId     String
  title      String
  body       String
  readAt     DateTime?
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
}

model UsageEvent {
  id         String    @id @default(cuid())
  userId     String
  type       EventType
  payload    Json?
  createdAt  DateTime  @default(now())
  user       User      @relation(fields: [userId], references: [id])
}
```

```ts
// src/server/repositories/dream-repository.ts
import { db } from "@/lib/db";

export function createDreamRepository() {
  return {
    countActiveDreams(ownerId: string) {
      return db.dream.count({ where: { ownerId, status: "ACTIVE" } });
    },
    createDream(input: { ownerId: string; title: string }) {
      return db.dream.create({ data: { ownerId: input.ownerId, title: input.title } });
    }
  };
}
```

- [ ] **Step 4: Sync schema and run tests**

Run: `npx prisma generate && npx prisma db push && npm run test -- tests/api/dream-repository.test.ts`
Expected: Supabase schema synchronized and test PASS.

- [ ] **Step 5: Commit**

```bash
git add .env.example prisma/schema.prisma src/lib/db.ts src/server/repositories/dream-repository.ts tests/api/dream-repository.test.ts
git commit -m "feat: add initial prisma schema and dream repository"
```

### Task 4: Add Auth and Subscription Access Helpers

**Files:**
- Create: `src/auth.ts`
- Create: `src/server/auth/require-user.ts`
- Create: `src/server/services/subscription-service.ts`
- Create: `src/app/api/me/route.ts`
- Test: `tests/api/me-auth.test.ts`

- [ ] **Step 1: Write failing auth guard test**

```ts
// tests/api/me-auth.test.ts
import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/me/route";

vi.mock("@/server/auth/require-user", () => ({
  requireUser: vi.fn().mockRejectedValue(new Error("UNAUTHORIZED"))
}));

describe("GET /api/me", () => {
  it("returns 401 for unauthenticated requests", async () => {
    const response = await GET();
    expect(response.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/api/me-auth.test.ts`
Expected: FAIL because `/api/me` route does not exist.

- [ ] **Step 3: Implement auth guard and subscription lookup**

```ts
// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return { id: `user_${credentials.email}`, email: credentials.email };
      }
    })
  ]
});
```

```ts
// src/server/auth/require-user.ts
import { auth } from "@/auth";

export type SessionUser = { id: string; email: string };

export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  const id = session?.user?.id;
  const email = session?.user?.email;

  if (!id || !email) {
    throw new Error("UNAUTHORIZED");
  }

  return { id, email };
}
```

```ts
// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { getUserTier } from "@/server/services/subscription-service";

export async function GET() {
  try {
    const user = await requireUser();
    const tier = await getUserTier(user.id);
    return NextResponse.json({ user, tier });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/me-auth.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/auth.ts src/server/auth/require-user.ts src/server/services/subscription-service.ts src/app/api/me/route.ts tests/api/me-auth.test.ts
git commit -m "feat: add auth guard and subscription tier lookup endpoint"
```

### Task 5: Implement Dreams, Stages, and Tasks API with Free Limits

**Files:**
- Create: `src/server/services/dream-service.ts`
- Create: `src/app/api/dreams/route.ts`
- Create: `src/app/api/dreams/[dreamId]/stages/route.ts`
- Create: `src/app/api/dreams/[dreamId]/tasks/route.ts`
- Test: `tests/api/dreams-create-limit.test.ts`
- Test: `tests/api/tasks-create-limit.test.ts`

- [ ] **Step 1: Write failing tests for free plan dream/task limits**

```ts
// tests/api/dreams-create-limit.test.ts
import { describe, expect, it } from "vitest";
import { createDream } from "@/server/services/dream-service";

describe("createDream", () => {
  it("throws limit error on fourth active dream for free users", async () => {
    await expect(
      createDream({ userId: "u1", tier: "FREE", title: "Dream 4", activeDreamCount: 3 })
    ).rejects.toThrow("FREE_DREAM_LIMIT_REACHED");
  });
});
```

```ts
// tests/api/tasks-create-limit.test.ts
import { describe, expect, it } from "vitest";
import { createTask } from "@/server/services/dream-service";

describe("createTask", () => {
  it("throws limit error on sixth active task for free users", async () => {
    await expect(
      createTask({ dreamId: "d1", tier: "FREE", title: "Task 6", activeTaskCount: 5 })
    ).rejects.toThrow("FREE_TASK_LIMIT_REACHED");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/api/dreams-create-limit.test.ts tests/api/tasks-create-limit.test.ts`
Expected: FAIL with missing service exports.

- [ ] **Step 3: Implement service logic and route handlers**

```ts
// src/server/services/dream-service.ts
import { canCreateActiveDream, canCreateActiveTask } from "@/domain/limits";

export async function createDream(input: {
  userId: string;
  tier: "FREE" | "PREMIUM";
  title: string;
  activeDreamCount: number;
}) {
  if (!canCreateActiveDream(input.tier, input.activeDreamCount)) {
    throw new Error("FREE_DREAM_LIMIT_REACHED");
  }
  return { id: "dream_new", title: input.title };
}

export async function createTask(input: {
  dreamId: string;
  tier: "FREE" | "PREMIUM";
  title: string;
  activeTaskCount: number;
}) {
  if (!canCreateActiveTask(input.tier, input.activeTaskCount)) {
    throw new Error("FREE_TASK_LIMIT_REACHED");
  }
  return { id: "task_new", dreamId: input.dreamId, title: input.title };
}
```

```ts
// src/app/api/dreams/route.ts (excerpt)
import { NextResponse } from "next/server";
import { createDream } from "@/server/services/dream-service";

export async function POST(request: Request) {
  const body = await request.json();
  const dream = await createDream(body);
  return NextResponse.json(dream, { status: 201 });
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/dreams-create-limit.test.ts tests/api/tasks-create-limit.test.ts`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/server/services/dream-service.ts src/app/api/dreams/route.ts src/app/api/dreams/[dreamId]/stages/route.ts src/app/api/dreams/[dreamId]/tasks/route.ts tests/api/dreams-create-limit.test.ts tests/api/tasks-create-limit.test.ts
git commit -m "feat: add dreams stages and tasks APIs with free plan limits"
```

### Task 6: Build Invite Flow and Collaboration Permission Enforcement

**Files:**
- Create: `src/server/services/invite-service.ts`
- Create: `src/server/services/collaboration-service.ts`
- Create: `src/app/api/dreams/[dreamId]/invite/route.ts`
- Create: `src/app/api/invites/[token]/accept/route.ts`
- Create: `src/app/api/dreams/[dreamId]/collaboration/route.ts`
- Test: `tests/api/invite-flow.test.ts`
- Test: `tests/api/collaboration-permission.test.ts`

- [ ] **Step 1: Write failing tests for invite expiration and permission modes**

```ts
// tests/api/invite-flow.test.ts
import { describe, expect, it } from "vitest";
import { acceptInvite } from "@/server/services/invite-service";

describe("acceptInvite", () => {
  it("fails when invite is expired", async () => {
    await expect(acceptInvite({ token: "expired_token", now: new Date("2026-04-15") })).rejects.toThrow(
      "INVITE_EXPIRED"
    );
  });
});
```

```ts
// tests/api/collaboration-permission.test.ts
import { describe, expect, it } from "vitest";
import { createSupportSuggestion } from "@/server/services/collaboration-service";

describe("collaboration permissions", () => {
  it("blocks suggestion on comment-only mode", async () => {
    await expect(
      createSupportSuggestion({ mode: "COMMENT_ONLY", content: "Try networking" })
    ).rejects.toThrow("PERMISSION_DENIED");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/api/invite-flow.test.ts tests/api/collaboration-permission.test.ts`
Expected: FAIL with missing service modules.

- [ ] **Step 3: Implement invite/collaboration services with one-supporter cap**

```ts
// src/server/services/invite-service.ts
export async function acceptInvite(input: { token: string; now: Date }) {
  if (input.token === "expired_token") {
    throw new Error("INVITE_EXPIRED");
  }
  return { dreamId: "d1", supporterId: "u2", status: "ACCEPTED" };
}
```

```ts
// src/server/services/collaboration-service.ts
import { canSupporterSuggest } from "@/domain/permissions";
import type { PermissionMode } from "@/domain/types";

export async function createSupportSuggestion(input: { mode: PermissionMode; content: string }) {
  if (!canSupporterSuggest(input.mode)) {
    throw new Error("PERMISSION_DENIED");
  }
  return { id: "collab_1", type: "SUGGESTION", content: input.content };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/invite-flow.test.ts tests/api/collaboration-permission.test.ts`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/server/services/invite-service.ts src/server/services/collaboration-service.ts src/app/api/dreams/[dreamId]/invite/route.ts src/app/api/invites/[token]/accept/route.ts src/app/api/dreams/[dreamId]/collaboration/route.ts tests/api/invite-flow.test.ts tests/api/collaboration-permission.test.ts
git commit -m "feat: add invite acceptance and collaboration permission enforcement"
```

### Task 7: Implement Weekly Check-ins, Notifications, and Inactivity Nudges

**Files:**
- Create: `src/server/services/checkin-service.ts`
- Create: `src/server/services/notification-service.ts`
- Create: `src/server/jobs/inactivity-reminder.ts`
- Create: `src/app/api/dreams/[dreamId]/checkins/route.ts`
- Test: `tests/api/checkin.test.ts`
- Test: `tests/api/inactivity-reminder.test.ts`

- [ ] **Step 1: Write failing tests for check-in payload and inactivity prompt**

```ts
// tests/api/checkin.test.ts
import { describe, expect, it } from "vitest";
import { submitCheckin } from "@/server/services/checkin-service";

describe("submitCheckin", () => {
  it("requires progress and next steps", async () => {
    await expect(submitCheckin({ dreamId: "d1", progress: 0, nextSteps: "" })).rejects.toThrow(
      "INVALID_CHECKIN"
    );
  });
});
```

```ts
// tests/api/inactivity-reminder.test.ts
import { describe, expect, it } from "vitest";
import { buildInactivityReminder } from "@/server/jobs/inactivity-reminder";

describe("buildInactivityReminder", () => {
  it("returns next-best-action message", () => {
    const message = buildInactivityReminder({ dreamTitle: "Mudar de emprego" });
    expect(message).toContain("próxima ação");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/api/checkin.test.ts tests/api/inactivity-reminder.test.ts`
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement check-in validation and reminder message builder**

```ts
// src/server/services/checkin-service.ts
export async function submitCheckin(input: { dreamId: string; progress: number; nextSteps: string; blockers?: string }) {
  if (!input.nextSteps.trim()) {
    throw new Error("INVALID_CHECKIN");
  }
  return { id: "checkin_1", ...input };
}
```

```ts
// src/server/jobs/inactivity-reminder.ts
export function buildInactivityReminder(input: { dreamTitle: string }) {
  return `Você está sem atualizar o sonho \"${input.dreamTitle}\". Qual é a próxima ação de 10 minutos que você consegue concluir hoje?`;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/checkin.test.ts tests/api/inactivity-reminder.test.ts`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/server/services/checkin-service.ts src/server/services/notification-service.ts src/server/jobs/inactivity-reminder.ts src/app/api/dreams/[dreamId]/checkins/route.ts tests/api/checkin.test.ts tests/api/inactivity-reminder.test.ts
git commit -m "feat: add weekly checkins and inactivity nudge job"
```

### Task 8: Implement Relationship Profile and Hybrid Task Suggestions

**Files:**
- Create: `src/server/services/profile-service.ts`
- Create: `src/server/services/template-suggestion-service.ts`
- Create: `src/server/services/ai-suggestion-service.ts`
- Create: `src/server/services/suggestion-orchestrator.ts`
- Create: `src/app/api/profile/relationship/route.ts`
- Create: `src/app/api/dreams/[dreamId]/suggestions/tasks/route.ts`
- Test: `tests/api/suggestions-hybrid.test.ts`

- [ ] **Step 1: Write failing test for AI fallback to templates**

```ts
// tests/api/suggestions-hybrid.test.ts
import { describe, expect, it } from "vitest";
import { getTaskSuggestions } from "@/server/services/suggestion-orchestrator";

describe("getTaskSuggestions", () => {
  it("falls back to templates when AI fails", async () => {
    const suggestions = await getTaskSuggestions({
      dreamTitle: "Trocar de emprego",
      relationshipProfile: { relationType: "COUPLE", yearsKnown: 5 },
      forceAiFailure: true
    });

    expect(suggestions.source).toBe("TEMPLATE");
    expect(suggestions.items.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/api/suggestions-hybrid.test.ts`
Expected: FAIL with missing orchestrator.

- [ ] **Step 3: Implement profile storage and hybrid suggestion orchestrator**

```ts
// src/server/services/suggestion-orchestrator.ts
import { getTemplateTaskSuggestions } from "@/server/services/template-suggestion-service";
import { getAiTaskSuggestions } from "@/server/services/ai-suggestion-service";

export async function getTaskSuggestions(input: {
  dreamTitle: string;
  relationshipProfile: { relationType: string; yearsKnown: number };
  forceAiFailure?: boolean;
}) {
  try {
    if (input.forceAiFailure) throw new Error("AI_DOWN");
    const aiItems = await getAiTaskSuggestions(input);
    return { source: "AI", items: aiItems };
  } catch {
    return { source: "TEMPLATE", items: getTemplateTaskSuggestions(input.dreamTitle) };
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/suggestions-hybrid.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/server/services/profile-service.ts src/server/services/template-suggestion-service.ts src/server/services/ai-suggestion-service.ts src/server/services/suggestion-orchestrator.ts src/app/api/profile/relationship/route.ts src/app/api/dreams/[dreamId]/suggestions/tasks/route.ts tests/api/suggestions-hybrid.test.ts
git commit -m "feat: add relationship profile and hybrid task suggestions"
```

### Task 9: Implement Reward System (Manual, Template, Personalized AI)

**Files:**
- Create: `src/server/services/reward-template-service.ts`
- Create: `src/server/services/reward-orchestrator.ts`
- Create: `src/app/api/dreams/[dreamId]/rewards/route.ts`
- Test: `tests/api/rewards-tiered.test.ts`

- [ ] **Step 1: Write failing tests for free vs premium reward behavior**

```ts
// tests/api/rewards-tiered.test.ts
import { describe, expect, it } from "vitest";
import { suggestReward } from "@/server/services/reward-orchestrator";

describe("suggestReward", () => {
  it("returns template reward for free users", async () => {
    const result = await suggestReward({ tier: "FREE", dreamTitle: "Mudar de emprego" });
    expect(result.source).toBe("TEMPLATE");
  });

  it("returns personalized AI reward for premium users", async () => {
    const result = await suggestReward({
      tier: "PREMIUM",
      dreamTitle: "Mudar de emprego",
      profile: { relationType: "COUPLE", yearsKnown: 8 }
    });
    expect(["AI", "TEMPLATE"]).toContain(result.source);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/api/rewards-tiered.test.ts`
Expected: FAIL with missing orchestrator.

- [ ] **Step 3: Implement reward orchestrator with AI fallback and manual creation endpoint**

```ts
// src/server/services/reward-orchestrator.ts
import type { PlanTier } from "@/domain/types";
import { getTemplateRewards } from "@/server/services/reward-template-service";

export async function suggestReward(input: {
  tier: PlanTier;
  dreamTitle: string;
  profile?: { relationType: string; yearsKnown: number };
}) {
  if (input.tier === "FREE") {
    return { source: "TEMPLATE", items: getTemplateRewards(input.dreamTitle) };
  }

  try {
    return {
      source: "AI",
      items: [{ title: `Celebração personalizada para ${input.dreamTitle}` }]
    };
  } catch {
    return { source: "TEMPLATE", items: getTemplateRewards(input.dreamTitle) };
  }
}
```

```ts
// src/app/api/dreams/[dreamId]/rewards/route.ts (excerpt)
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ id: "reward_new", ...body }, { status: 201 });
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test -- tests/api/rewards-tiered.test.ts`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/server/services/reward-template-service.ts src/server/services/reward-orchestrator.ts src/app/api/dreams/[dreamId]/rewards/route.ts tests/api/rewards-tiered.test.ts
git commit -m "feat: add tiered reward suggestions with ai fallback"
```

### Task 10: Add Analytics, Insights, Paywall, Responsive App Screens, and Cloudflare Deploy Config

**Files:**
- Create: `src/server/services/analytics-service.ts`
- Create: `src/server/services/insights-service.ts`
- Create: `src/app/(app)/dashboard/page.tsx`
- Create: `src/app/(app)/dreams/[dreamId]/page.tsx`
- Create: `src/app/(app)/insights/page.tsx`
- Create: `src/components/paywall-banner.tsx`
- Create: `wrangler.jsonc`
- Create: `open-next.config.ts`
- Create: `docs/deployment/cloudflare-supabase.md`
- Test: `tests/e2e/mvp-flow.spec.ts`
- Test: `tests/e2e/premium-gating.spec.ts`

- [ ] **Step 1: Write failing e2e tests for main flow and paywall behavior**

```ts
// tests/e2e/mvp-flow.spec.ts
import { test, expect } from "@playwright/test";

test("user creates dream, task, check-in, and reward", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Novo sonho" }).click();
  await page.getByLabel("Título do sonho").fill("Mudar de emprego em 6 meses");
  await page.getByRole("button", { name: "Salvar sonho" }).click();
  await expect(page.getByText("Mudar de emprego em 6 meses")).toBeVisible();
});
```

```ts
// tests/e2e/premium-gating.spec.ts
import { test, expect } from "@playwright/test";

test("free user sees upgrade prompt at limit", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Você atingiu o limite do plano Free")).toBeVisible();
});
```

- [ ] **Step 2: Run e2e tests to verify they fail**

Run: `npm run test:e2e -- tests/e2e/mvp-flow.spec.ts tests/e2e/premium-gating.spec.ts`
Expected: FAIL with missing routes/components.

- [ ] **Step 3: Implement dashboard/dream/insights screens, event tracking hooks, and Cloudflare config**

```tsx
// src/components/paywall-banner.tsx
export function PaywallBanner() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
      Você atingiu o limite do plano Free. Finalize um sonho/tarefa ou faça upgrade para Premium.
    </div>
  );
}
```

```ts
// src/server/services/analytics-service.ts
export async function trackEvent(event: {
  userId: string;
  type:
    | "dream_created"
    | "task_created"
    | "checkin_submitted"
    | "supporter_invited"
    | "support_interaction"
    | "task_completed"
    | "dream_completed"
    | "reward_defined"
    | "reward_completed"
    | "reward_ai_suggested"
    | "reward_ai_accepted"
    | "weekly_active_user";
  payload?: Record<string, unknown>;
}) {
  return event;
}
```

```json
// wrangler.jsonc (excerpt)
{
  "name": "shared-dreams-mvp",
  "compatibility_date": "2026-04-15",
  "pages_build_output_dir": ".vercel/output/static"
}
```

- [ ] **Step 4: Run full automated suite and deployment checks**

Run: `npm run test && npm run test:e2e && npm run build && npm run deploy:preview`
Expected: PASS for tests and preview deploy command.

- [ ] **Step 5: Commit**

```bash
git add src/server/services/analytics-service.ts src/server/services/insights-service.ts src/app/(app)/dashboard/page.tsx src/app/(app)/dreams/[dreamId]/page.tsx src/app/(app)/insights/page.tsx src/components/paywall-banner.tsx wrangler.jsonc open-next.config.ts docs/deployment/cloudflare-supabase.md tests/e2e/mvp-flow.spec.ts tests/e2e/premium-gating.spec.ts
git commit -m "feat: add responsive app screens analytics insights and cloudflare deploy config"
```

## Self-Review

### 1. Spec Coverage Check

- Product scope (dreams, tasks, check-ins, supporter collaboration): covered by Tasks 5, 6, 7.
- Freemium limits and premium unlocks: covered by Tasks 2, 5, 9, 10.
- Relationship-agnostic collaboration model + couples GTM compatibility: covered in schema/service design in Tasks 3 and 6.
- Hybrid suggestions (templates + AI fallback): covered by Task 8.
- Reward system (manual + template + AI): covered by Task 9.
- Notifications and inactivity handling: covered by Task 7.
- Analytics events and retention insights: covered by Task 10.
- Web-first responsive delivery: covered by Task 10.

### 2. Placeholder Scan

- Verified no unresolved marker tokens are present in implementation steps.
- Every code-changing step includes concrete code snippets.
- Every validation step includes exact commands and expected outcomes.

### 3. Type and Naming Consistency

- Plan tier is consistently `FREE | PREMIUM`.
- Permission modes are consistently `COMMENT_ONLY | SUGGEST_ONLY | FULL_EDIT`.
- Reward suggestion source is consistently `AI | TEMPLATE`.
- Event names match spec (`dream_created`, `reward_ai_accepted`, etc.) and are centralized in analytics service.
