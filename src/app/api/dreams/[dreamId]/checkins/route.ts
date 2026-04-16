import { NextResponse } from "next/server";
import { submitCheckin } from "@/server/services/checkin-service";
import { requireUser } from "@/server/auth/require-user";

export async function POST(
  request: Request,
  context: { params: { dreamId: string } }
) {
  try {
    await requireUser(request);
    const body = await request.json();
    const checkin = await submitCheckin({
      dreamId: context.params.dreamId,
      progress: Number(body.progress),
      nextSteps: String(body.nextSteps ?? ""),
      blockers:
        typeof body.blockers === "string" && body.blockers.trim().length > 0
          ? body.blockers
          : undefined
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
