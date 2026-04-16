import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/analytics/events/route";
import {
  analyticsServiceDeps,
  listTrackedEvents,
  resetAnalyticsStateForTests
} from "@/server/services/analytics-service";

describe("POST /api/analytics/events", () => {
  beforeEach(() => {
    resetAnalyticsStateForTests();
    vi.restoreAllMocks();
  });

  it("returns 201 and stores a valid analytics event", async () => {
    vi.spyOn(analyticsServiceDeps, "persistEvent").mockRejectedValueOnce(new Error("DB_DOWN"));
    vi.spyOn(analyticsServiceDeps, "readRecentEvents").mockRejectedValueOnce(
      new Error("DB_DOWN")
    );

    const response = await POST(
      new Request("http://localhost/api/analytics/events", {
        method: "POST",
        body: JSON.stringify({
          userId: "owner_1",
          type: "dream_created",
          payload: { source: "dashboard" }
        })
      })
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      userId: "owner_1",
      type: "dream_created",
      occurredAt: undefined,
      payload: { source: "dashboard" }
    });

    await expect(listTrackedEvents(5)).resolves.toEqual([
      {
        userId: "owner_1",
        type: "dream_created",
        occurredAt: undefined,
        payload: { source: "dashboard" }
      }
    ]);
  });

  it("returns 422 for invalid event payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/analytics/events", {
        method: "POST",
        body: JSON.stringify({
          userId: "owner_1",
          type: "not_an_event"
        })
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_ANALYTICS_EVENT" });
  });

  it("returns 422 when payload is not an object", async () => {
    const response = await POST(
      new Request("http://localhost/api/analytics/events", {
        method: "POST",
        body: JSON.stringify({
          userId: "owner_1",
          type: "dream_created",
          payload: "not-an-object"
        })
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_ANALYTICS_EVENT" });
  });

  it("returns 422 when occurredAt is not a string", async () => {
    const response = await POST(
      new Request("http://localhost/api/analytics/events", {
        method: "POST",
        body: JSON.stringify({
          userId: "owner_1",
          type: "dream_created",
          occurredAt: 1710000000
        })
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_ANALYTICS_EVENT" });
  });

  it("returns 422 when body is not an object", async () => {
    const response = await POST(
      new Request("http://localhost/api/analytics/events", {
        method: "POST",
        body: JSON.stringify(["bad-body"])
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_ANALYTICS_EVENT" });
  });

  it("returns 422 for malformed JSON payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/analytics/events", {
        method: "POST",
        body: "{invalid"
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_ANALYTICS_EVENT" });
  });

  it("returns 500 for unexpected runtime errors", async () => {
    const request = {
      async json() {
        throw new Error("UNEXPECTED");
      }
    } as Request;

    const response = await POST(request);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "INTERNAL_SERVER_ERROR" });
  });
});
