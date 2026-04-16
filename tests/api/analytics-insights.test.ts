import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/lib/db";
import {
  analyticsServiceDeps,
  isMvpAnalyticsEventType,
  listTrackedEvents,
  resetAnalyticsStateForTests,
  trackEvent
} from "@/server/services/analytics-service";
import {
  computeEngagementSummary,
  getEngagementSummaryFromTrackedEvents
} from "@/server/services/insights-service";

describe("trackEvent and tracked events storage", () => {
  beforeEach(() => {
    resetAnalyticsStateForTests();
    vi.restoreAllMocks();
  });

  it("normalizes payload and calls persistence dependency", async () => {
    const persistSpy = vi
      .spyOn(analyticsServiceDeps, "persistEvent")
      .mockResolvedValueOnce(undefined);

    await expect(
      trackEvent({
        userId: "  owner_1  ",
        type: "dream_created",
        occurredAt: "2026-04-14T10:00:00.000Z",
        payload: { source: "dashboard", count: 1 }
      })
    ).resolves.toEqual({
      userId: "owner_1",
      type: "dream_created",
      occurredAt: "2026-04-14T10:00:00.000Z",
      payload: { source: "dashboard", count: 1 }
    });

    expect(persistSpy).toHaveBeenCalledWith({
      userId: "owner_1",
      type: "dream_created",
      occurredAt: "2026-04-14T10:00:00.000Z",
      payload: { source: "dashboard", count: 1 }
    });
  });

  it("keeps only scalar payload entries", async () => {
    vi.spyOn(analyticsServiceDeps, "persistEvent").mockResolvedValueOnce(undefined);

    await expect(
      trackEvent({
        userId: "owner_1",
        type: "dream_created",
        payload: {
          source: "dashboard",
          keepNumber: 2,
          dropObject: { nested: true } as unknown as number,
          dropArray: ["bad"] as unknown as string
        }
      })
    ).resolves.toEqual({
      userId: "owner_1",
      type: "dream_created",
      occurredAt: undefined,
      payload: {
        source: "dashboard",
        keepNumber: 2
      }
    });
  });

  it("falls back to in-memory events when persistence/reads fail", async () => {
    vi.spyOn(analyticsServiceDeps, "persistEvent").mockRejectedValueOnce(new Error("DB_DOWN"));

    await trackEvent({
      userId: "owner_1",
      type: "weekly_active_user"
    });

    vi.spyOn(analyticsServiceDeps, "readRecentEvents").mockRejectedValueOnce(
      new Error("DB_DOWN")
    );

    await expect(listTrackedEvents(10)).resolves.toEqual([
      {
        userId: "owner_1",
        type: "weekly_active_user",
        occurredAt: undefined,
        payload: {}
      }
    ]);
  });

  it("uses default read limit for invalid numeric inputs", async () => {
    vi.spyOn(analyticsServiceDeps, "persistEvent").mockRejectedValue(new Error("DB_DOWN"));

    await trackEvent({ userId: "owner_1", type: "dream_created" });
    await trackEvent({ userId: "owner_1", type: "task_created" });

    const readSpy = vi
      .spyOn(analyticsServiceDeps, "readRecentEvents")
      .mockResolvedValueOnce([]);

    const events = await listTrackedEvents(Number.NaN);

    expect(readSpy).toHaveBeenCalledWith(200);
    expect(events.map((event) => event.type)).toEqual(["task_created", "dream_created"]);
  });

  it("reads recent events from persistence when available", async () => {
    vi.spyOn(analyticsServiceDeps, "readRecentEvents").mockResolvedValueOnce([
      {
        userId: "owner_2",
        type: "task_created",
        occurredAt: "2026-04-14T11:00:00.000Z",
        payload: { source: "dream_page" }
      }
    ]);

    await expect(listTrackedEvents(5)).resolves.toEqual([
      {
        userId: "owner_2",
        type: "task_created",
        occurredAt: "2026-04-14T11:00:00.000Z",
        payload: { source: "dream_page" }
      }
    ]);
  });

  it("rejects blank user id", async () => {
    await expect(
      trackEvent({
        userId: "   ",
        type: "task_created"
      })
    ).rejects.toThrow("INVALID_ANALYTICS_EVENT");
  });

  it("validates supported analytics event names", () => {
    expect(isMvpAnalyticsEventType("dream_created")).toBe(true);
    expect(isMvpAnalyticsEventType("unknown_event")).toBe(false);
    expect(isMvpAnalyticsEventType(42)).toBe(false);
  });

  it("persists events with normalized db payload and timestamp", async () => {
    const createManySpy = vi
      .spyOn(db.user, "createMany")
      .mockResolvedValueOnce({ count: 1 });
    const usageCreateSpy = vi
      .spyOn(db.usageEvent, "create")
      .mockResolvedValueOnce({} as never);

    await analyticsServiceDeps.persistEvent({
      userId: "owner_db",
      type: "task_created",
      occurredAt: "invalid-date",
      payload: { source: "api" }
    });

    expect(createManySpy).toHaveBeenCalledTimes(1);
    expect(usageCreateSpy).toHaveBeenCalledTimes(1);

    const createData = usageCreateSpy.mock.calls[0][0].data;
    expect(createData.userId).toBe("owner_db");
    expect(createData.type).toBe("task_created");
    expect(createData.payload).toEqual({ source: "api" });
    expect(createData.createdAt).toBeInstanceOf(Date);
  });

  it("maps persisted rows back to analytics events", async () => {
    const findManySpy = vi.spyOn(db.usageEvent, "findMany").mockResolvedValueOnce([
      {
        userId: "owner_db",
        type: "dream_created",
        createdAt: new Date("2026-04-15T10:00:00.000Z"),
        payload: "invalid-payload"
      } as never
    ]);

    const events = await analyticsServiceDeps.readRecentEvents(Number.POSITIVE_INFINITY);

    expect(findManySpy).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      take: 200
    });
    expect(events).toEqual([
      {
        userId: "owner_db",
        type: "dream_created",
        occurredAt: "2026-04-15T10:00:00.000Z",
        payload: {}
      }
    ]);
  });
});

describe("insights summary", () => {
  beforeEach(() => {
    resetAnalyticsStateForTests();
    vi.restoreAllMocks();
  });

  it("returns zeroed summary when there are no events", () => {
    expect(computeEngagementSummary([], new Date("2026-04-15T00:00:00.000Z"))).toEqual({
      weeklyActiveUsers: 0,
      retainedUsers: 0,
      retentionRate: 0,
      engagementScore: 0,
      topEventTypes: []
    });
  });

  it("computes retention and top events across previous/current windows", () => {
    const now = new Date("2026-04-15T00:00:00.000Z");
    const result = computeEngagementSummary(
      [
        {
          userId: "user_1",
          type: "weekly_active_user",
          occurredAt: "2026-04-14T10:00:00.000Z"
        },
        {
          userId: "user_1",
          type: "checkin_submitted",
          occurredAt: "2026-04-14T10:10:00.000Z"
        },
        {
          userId: "user_2",
          type: "support_interaction",
          occurredAt: "invalid-date"
        },
        {
          userId: "user_1",
          type: "weekly_active_user",
          occurredAt: "2026-04-03T12:00:00.000Z"
        },
        {
          userId: "user_3",
          type: "dream_completed",
          occurredAt: "2026-04-02T08:00:00.000Z"
        }
      ],
      now
    );

    expect(result.weeklyActiveUsers).toBe(2);
    expect(result.retainedUsers).toBe(1);
    expect(result.retentionRate).toBe(50);
    expect(result.engagementScore).toBe(60);
    expect(result.topEventTypes[0]).toEqual({
      type: "weekly_active_user",
      count: 2
    });
  });

  it("builds summary from tracked events service", async () => {
    vi.spyOn(analyticsServiceDeps, "readRecentEvents").mockResolvedValueOnce([
      {
        userId: "owner_1",
        type: "weekly_active_user",
        occurredAt: "2026-04-14T10:00:00.000Z",
        payload: {}
      },
      {
        userId: "owner_1",
        type: "checkin_submitted",
        occurredAt: "2026-04-14T10:05:00.000Z",
        payload: {}
      },
      {
        userId: "owner_1",
        type: "weekly_active_user",
        occurredAt: "2026-04-03T10:00:00.000Z",
        payload: {}
      }
    ]);

    const summary = await getEngagementSummaryFromTrackedEvents(
      new Date("2026-04-15T00:00:00.000Z")
    );

    expect(summary.weeklyActiveUsers).toBe(1);
    expect(summary.retainedUsers).toBe(1);
    expect(summary.retentionRate).toBe(100);
    expect(summary.engagementScore).toBe(30);
  });
});
