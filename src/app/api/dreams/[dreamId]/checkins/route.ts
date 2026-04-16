import { NextResponse } from "next/server";
import { submitCheckin } from "@/server/services/checkin-service";
import { requireUser } from "@/server/auth/require-user";
import { trackEvent } from "@/server/services/analytics-service";

export async function POST(
  request: Request,
  context: { params: Promise<{ dreamId: string }> }
) {
  try {
    const { dreamId } = await context.params;
    const user = await requireUser(request);
    const body = await request.json();
    const checkin = await submitCheckin({
      dreamId,
      progress: Number(body.progress),
      nextSteps: String(body.nextSteps ?? ""),
      blockers:
        typeof body.blockers === "string" && body.blockers.trim().length > 0
          ? body.blockers
          : undefined
    });
    await trackEvent({
      userId: user.id,
      type: "checkin_submitted",
      payload: {
        source: "api",
        dreamId,
        progress: Number(body.progress)
      }
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "INVALID_CHECKIN") {
      return NextResponse.json({ error: "INVALID_CHECKIN" }, { status: 422 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_CHECKIN" }, { status: 422 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
