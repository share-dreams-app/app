import { NextResponse } from "next/server";
import { createTask } from "@/server/services/dream-service";
import { requireUser } from "@/server/auth/require-user";
import { trackEvent } from "@/server/services/analytics-service";
import { getUserTier } from "@/server/services/subscription-service";

export async function POST(
  request: Request,
  context: { params: Promise<{ dreamId: string }> }
) {
  try {
    const { dreamId } = await context.params;
    const user = await requireUser(request);
    const tier = await getUserTier(user.id);
    const body = await request.json();
    const task = await createTask({
      dreamId,
      tier,
      title: body.title
    });
    await trackEvent({
      userId: user.id,
      type: "task_created",
      payload: { source: "api", dreamId, taskId: task.id }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FREE_TASK_LIMIT_REACHED") {
      return NextResponse.json({ error: "FREE_TASK_LIMIT_REACHED" }, { status: 403 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_TASK" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
