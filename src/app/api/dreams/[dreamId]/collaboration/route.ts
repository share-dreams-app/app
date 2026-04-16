import { NextResponse } from "next/server";
import { createSupportSuggestion } from "@/server/services/collaboration-service";
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
    const suggestion = await createSupportSuggestion({
      mode: body.mode,
      content: body.content
    });
    await trackEvent({
      userId: user.id,
      type: "support_interaction",
      payload: {
        source: "api",
        dreamId,
        interactionType: suggestion.type
      }
    });

    return NextResponse.json(
      {
        ...suggestion,
        dreamId
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "PERMISSION_DENIED") {
      return NextResponse.json({ error: "PERMISSION_DENIED" }, { status: 403 });
    }

    if (error instanceof Error && error.message === "INVALID_CONTENT") {
      return NextResponse.json({ error: "INVALID_COLLABORATION" }, { status: 400 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_COLLABORATION" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
