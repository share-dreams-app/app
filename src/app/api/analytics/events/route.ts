import { NextResponse } from "next/server";
import type { AnalyticsEventPayload } from "@/domain/analytics-events";
import { isMvpAnalyticsEventType, trackEvent } from "@/server/services/analytics-service";

type AnalyticsBody = {
  userId: unknown;
  type: unknown;
  occurredAt?: unknown;
  payload?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function parsePayload(payload: unknown): AnalyticsEventPayload | undefined {
  if (payload === undefined) {
    return undefined;
  }

  if (!isRecord(payload)) {
    throw new Error("INVALID_ANALYTICS_EVENT");
  }

  return payload as AnalyticsEventPayload;
}

function parseAnalyticsBody(body: unknown) {
  if (!isRecord(body)) {
    throw new Error("INVALID_ANALYTICS_EVENT");
  }

  const data = body as AnalyticsBody;

  if (typeof data.userId !== "string" || !isMvpAnalyticsEventType(data.type)) {
    throw new Error("INVALID_ANALYTICS_EVENT");
  }

  if (data.occurredAt !== undefined && typeof data.occurredAt !== "string") {
    throw new Error("INVALID_ANALYTICS_EVENT");
  }

  return {
    userId: data.userId,
    type: data.type,
    occurredAt: data.occurredAt,
    payload: parsePayload(data.payload)
  };
}

export async function POST(request: Request) {
  try {
    const event = parseAnalyticsBody(await request.json());
    const trackedEvent = await trackEvent(event);
    return NextResponse.json(trackedEvent, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_ANALYTICS_EVENT") {
      return NextResponse.json({ error: "INVALID_ANALYTICS_EVENT" }, { status: 422 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_ANALYTICS_EVENT" }, { status: 422 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
