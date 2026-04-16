import { NextResponse } from "next/server";
import { createStage } from "@/server/services/dream-service";
import { requireUser } from "@/server/auth/require-user";

export async function POST(
  request: Request,
  context: { params: Promise<{ dreamId: string }> }
) {
  try {
    const { dreamId } = await context.params;
    await requireUser(request);
    const body = await request.json();
    const stage = await createStage({
      dreamId,
      title: String(body.title ?? ""),
      order: typeof body.order === "number" ? body.order : undefined
    });

    return NextResponse.json(stage, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "INVALID_STAGE") {
      return NextResponse.json({ error: "INVALID_STAGE" }, { status: 400 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_STAGE" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
