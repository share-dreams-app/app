import type {
  AnalyticsEventPayload,
  MvpAnalyticsEventType
} from "@/domain/analytics-events";
import { MVP_ANALYTICS_EVENT_TYPES } from "@/domain/analytics-events";
import { db } from "@/lib/db";

export type AnalyticsEvent = {
  userId: string;
  type: MvpAnalyticsEventType;
  occurredAt?: string;
  payload?: AnalyticsEventPayload;
};

const DEFAULT_READ_LIMIT = 200;
const DB_OPERATION_TIMEOUT_MS = 800;
const inMemoryEvents: AnalyticsEvent[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizePayload(payload: unknown): AnalyticsEventPayload {
  if (!isRecord(payload)) {
    return {};
  }

  const normalizedEntries = Object.entries(payload).filter((entry) => {
    const value = entry[1];
    return (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    );
  });

  return Object.fromEntries(normalizedEntries) as AnalyticsEventPayload;
}

function parseOccurredAt(occurredAt: string | undefined): Date | null {
  if (!occurredAt) {
    return null;
  }

  const timestamp = Date.parse(occurredAt);
  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Date(timestamp);
}

function normalizeLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return DEFAULT_READ_LIMIT;
  }

  return Math.max(1, Math.floor(limit));
}

function buildSyntheticEmail(userId: string): string {
  const encoded = Buffer.from(userId).toString("hex").slice(0, 48) || "user";
  return `event_${encoded}@analytics.local`;
}

async function withDbTimeout<T>(operation: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("ANALYTICS_DB_TIMEOUT"));
    }, DB_OPERATION_TIMEOUT_MS);

    operation
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export function isMvpAnalyticsEventType(value: unknown): value is MvpAnalyticsEventType {
  return (
    typeof value === "string" &&
    (MVP_ANALYTICS_EVENT_TYPES as readonly string[]).includes(value)
  );
}

function normalizeEvent(event: AnalyticsEvent): AnalyticsEvent {
  const userId = event.userId.trim();
  if (!userId || !isMvpAnalyticsEventType(event.type)) {
    throw new Error("INVALID_ANALYTICS_EVENT");
  }

  return {
    userId,
    type: event.type,
    occurredAt: event.occurredAt,
    payload: normalizePayload(event.payload)
  };
}

export const analyticsServiceDeps = {
  async persistEvent(event: AnalyticsEvent) {
    const occurredAt = parseOccurredAt(event.occurredAt) ?? new Date();

    await withDbTimeout(
      db.user.createMany({
        data: [
          {
            id: event.userId,
            email: buildSyntheticEmail(event.userId)
          }
        ],
        skipDuplicates: true
      })
    );

    await withDbTimeout(
      db.usageEvent.create({
        data: {
          userId: event.userId,
          type: event.type,
          payload: event.payload ?? {},
          createdAt: occurredAt
        }
      })
    );
  },
  async readRecentEvents(limit: number): Promise<AnalyticsEvent[]> {
    const rows = await withDbTimeout(
      db.usageEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: normalizeLimit(limit)
      })
    );

    return rows.map((row) => ({
      userId: row.userId,
      type: row.type as MvpAnalyticsEventType,
      occurredAt: row.createdAt.toISOString(),
      payload: normalizePayload(row.payload)
    }));
  }
};

export function resetAnalyticsStateForTests() {
  inMemoryEvents.length = 0;
}

export async function trackEvent(event: AnalyticsEvent) {
  const normalized = normalizeEvent(event);
  inMemoryEvents.push(normalized);

  try {
    await analyticsServiceDeps.persistEvent(normalized);
  } catch {
    // Keep analytics tracking non-blocking for product flows.
  }

  return normalized;
}

export async function listTrackedEvents(limit: number = DEFAULT_READ_LIMIT) {
  const safeLimit = normalizeLimit(limit);

  try {
    const persistedEvents = await analyticsServiceDeps.readRecentEvents(safeLimit);
    if (persistedEvents.length > 0) {
      return persistedEvents;
    }
  } catch {
    // Fall back to local volatile events when persistence is unavailable.
  }

  return inMemoryEvents.slice(-safeLimit).reverse();
}
