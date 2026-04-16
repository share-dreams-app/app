import { beforeEach, describe, expect, it } from "vitest";
import {
  createStage,
  createTask,
  resetDreamServiceStateForTests,
  setActiveTaskCountForTests
} from "@/server/services/dream-service";
import { POST as postTask } from "@/app/api/dreams/[dreamId]/tasks/route";
import { POST as postStage } from "@/app/api/dreams/[dreamId]/stages/route";

const authHeaders = {
  "x-user-id": "owner_1",
  "x-user-email": "owner@test.local"
};

describe("createTask", () => {
  beforeEach(() => {
    resetDreamServiceStateForTests();
  });

  it("throws limit error on sixth active task for free users", async () => {
    await expect(
      createTask({
        dreamId: "d1",
        tier: "FREE",
        title: "Task 6",
        activeTaskCount: 5
      })
    ).rejects.toThrow("FREE_TASK_LIMIT_REACHED");
  });

  it("creates task below free limit", async () => {
    await expect(
      createTask({
        dreamId: "d1",
        tier: "FREE",
        title: "Task 3",
        activeTaskCount: 2
      })
    ).resolves.toMatchObject({ dreamId: "d1", title: "Task 3" });
  });
});

describe("createStage", () => {
  beforeEach(() => {
    resetDreamServiceStateForTests();
  });

  it("defaults stage order to 1 when not provided", async () => {
    await expect(
      createStage({
        dreamId: "d1",
        title: "Without order"
      })
    ).resolves.toMatchObject({
      dreamId: "d1",
      title: "Without order",
      order: 1
    });
  });
});

describe("POST /api/dreams/:dreamId/tasks", () => {
  beforeEach(() => {
    resetDreamServiceStateForTests();
  });

  it("returns 401 for unauthenticated requests", async () => {
    const response = await postTask(
      new Request("http://localhost/api/dreams/d1/tasks", {
        method: "POST",
        body: JSON.stringify({
          tier: "FREE",
          title: "Task OK",
          activeTaskCount: 1
        })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 201 for valid task creation", async () => {
    const response = await postTask(
      new Request("http://localhost/api/dreams/d1/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          tier: "FREE",
          title: "Task OK",
          activeTaskCount: 1
        })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({ title: "Task OK", dreamId: "d1" });
  });

  it("returns 403 when free task limit is reached", async () => {
    setActiveTaskCountForTests("d1", 5);

    const response = await postTask(
      new Request("http://localhost/api/dreams/d1/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: "Task blocked"
        })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "FREE_TASK_LIMIT_REACHED" });
  });

  it("ignores client tier tampering and still enforces server-side FREE tier", async () => {
    setActiveTaskCountForTests("d1", 5);

    const response = await postTask(
      new Request("http://localhost/api/dreams/d1/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          tier: "PREMIUM",
          title: "Task Tampered"
        })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "FREE_TASK_LIMIT_REACHED" });
  });

  it("returns 400 for malformed payload", async () => {
    const response = await postTask(
      new Request("http://localhost/api/dreams/d1/tasks", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_TASK" });
  });
});

describe("POST /api/dreams/:dreamId/stages", () => {
  beforeEach(() => {
    resetDreamServiceStateForTests();
  });

  it("returns 401 for unauthenticated requests", async () => {
    const response = await postStage(
      new Request("http://localhost/api/dreams/d1/stages", {
        method: "POST",
        body: JSON.stringify({ title: "Planning", order: 1 })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("creates stage for dream", async () => {
    const response = await postStage(
      new Request("http://localhost/api/dreams/d1/stages", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ title: "Planning", order: 1 })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      id: "stage_d1_1",
      dreamId: "d1",
      title: "Planning",
      order: 1
    });
  });

  it("returns 400 when stage payload is invalid", async () => {
    const response = await postStage(
      new Request("http://localhost/api/dreams/d1/stages", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ title: "   " })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_STAGE" });
  });

  it("returns 400 for malformed payload", async () => {
    const response = await postStage(
      new Request("http://localhost/api/dreams/d1/stages", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_STAGE" });
  });
});
