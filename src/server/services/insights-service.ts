import type { MvpAnalyticsEventType } from "@/domain/analytics-events";
import type { AnalyticsEvent } from "@/server/services/analytics-service";
import { listTrackedEvents } from "@/server/services/analytics-service";

type EventCount = {
  type: MvpAnalyticsEventType;
  count: number;
};

export type EngagementSummary = {
  weeklyActiveUsers: number;
  retainedUsers: number;
  retentionRate: number;
  engagementScore: number;
  topEventTypes: EventCount[];
};

const ENGAGEMENT_EVENT_TYPES = new Set<MvpAnalyticsEventType>([
  "task_created",
  "checkin_submitted",
  "support_interaction",
  "task_completed",
  "dream_completed",
  "reward_completed",
  "reward_ai_accepted"
]);

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function eventTime(event: AnalyticsEvent, fallback: Date) {
  if (!event.occurredAt) {
    return fallback.getTime();
  }

  const time = Date.parse(event.occurredAt);
  return Number.isFinite(time) ? time : fallback.getTime();
}

function roundPercent(value: number) {
  return Math.round(value * 100) / 100;
}

export function computeEngagementSummary(
  events: AnalyticsEvent[],
  now: Date = new Date()
): EngagementSummary {
  const nowTime = now.getTime();
  const currentStart = nowTime - WEEK_MS;
  const previousStart = nowTime - WEEK_MS * 2;
  const currentUsers = new Set<string>();
  const previousUsers = new Set<string>();
  const eventCounts = new Map<MvpAnalyticsEventType, number>();
  let engagementEvents = 0;

  for (const event of events) {
    const time = eventTime(event, now);
    eventCounts.set(event.type, (eventCounts.get(event.type) ?? 0) + 1);

    if (time >= currentStart && time <= nowTime) {
      currentUsers.add(event.userId);

      if (ENGAGEMENT_EVENT_TYPES.has(event.type)) {
        engagementEvents += 1;
      }
    }

    if (time >= previousStart && time < currentStart) {
      previousUsers.add(event.userId);
    }
  }

  let retainedUsers = 0;
  for (const userId of previousUsers) {
    if (currentUsers.has(userId)) {
      retainedUsers += 1;
    }
  }

  const retentionRate = previousUsers.size === 0 ? 0 : (retainedUsers / previousUsers.size) * 100;
  const engagementScore = Math.min(100, currentUsers.size * 20 + engagementEvents * 10);

  return {
    weeklyActiveUsers: currentUsers.size,
    retainedUsers,
    retentionRate: roundPercent(retentionRate),
    engagementScore,
    topEventTypes: Array.from(eventCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((left, right) => right.count - left.count || left.type.localeCompare(right.type))
      .slice(0, 5)
  };
}

export async function getEngagementSummaryFromTrackedEvents(
  now: Date = new Date(),
  userId?: string
) {
  const events = await listTrackedEvents();
  const filteredEvents = userId ? events.filter((event) => event.userId === userId) : events;
  return computeEngagementSummary(filteredEvents, now);
}
