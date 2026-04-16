import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { suggestTaskRecommendations } from "@/server/services/suggestion-orchestrator";

export async function POST(
  request: Request,
  context: { params: Promise<{ dreamId: string }> }
) {
  try {
    const { dreamId } = await context.params;
    await requireUser(request);
    if (!dreamId.trim()) {
      throw new Error("INVALID_SUGGESTION_REQUEST");
    }
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("INVALID_SUGGESTION_REQUEST");
    }
    const suggestion = await suggestTaskRecommendations({
      dreamTitle: typeof body.dreamTitle === "string" ? body.dreamTitle : "",
      relationshipProfile: {
        relationType:
          typeof body.relationshipProfile?.relationType === "string"
            ? body.relationshipProfile.relationType
            : "",
        yearsKnown: Number(body.relationshipProfile?.yearsKnown)
      }
    });

    return NextResponse.json(suggestion, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "INVALID_SUGGESTION_REQUEST") {
      return NextResponse.json(
        { error: "INVALID_SUGGESTION_REQUEST" },
        { status: 422 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "INVALID_SUGGESTION_REQUEST" },
        { status: 422 }
      );
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
