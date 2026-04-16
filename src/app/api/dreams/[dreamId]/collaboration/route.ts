import { NextResponse } from "next/server";
import { createSupportSuggestion } from "@/server/services/collaboration-service";
import { requireUser } from "@/server/auth/require-user";

export async function POST(
  request: Request,
  context: { params: { dreamId: string } }
) {
  try {
    await requireUser(request);
    const body = await request.json();
    const suggestion = await createSupportSuggestion({
      mode: body.mode,
      content: body.content
    });

    return NextResponse.json(
      {
        ...suggestion,
        dreamId: context.params.dreamId
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
