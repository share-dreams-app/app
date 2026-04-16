"use client";

import type {
  AnalyticsEventPayload,
  MvpAnalyticsEventType
} from "@/domain/analytics-events";

type ClientAnalyticsEvent = {
  userId: string;
  type: MvpAnalyticsEventType;
  occurredAt?: string;
  payload?: AnalyticsEventPayload;
};

export async function trackClientEvent(event: ClientAnalyticsEvent) {
  try {
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(event),
      keepalive: true
    });
  } catch {
    // Client analytics must never block product interactions.
  }
}
