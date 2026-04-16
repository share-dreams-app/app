import { NextResponse } from "next/server";
import { createInvite } from "@/server/services/invite-service";
import { requireUser } from "@/server/auth/require-user";

export async function POST(
  request: Request,
  context: { params: { dreamId: string } }
) {
  try {
    await requireUser(request);
    const body = await request.json();
    const invite = await createInvite({
      dreamId: context.params.dreamId,
      invitedEmail: String(body.invitedEmail ?? "")
    });

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "SUPPORTER_LIMIT_REACHED") {
      return NextResponse.json({ error: "SUPPORTER_LIMIT_REACHED" }, { status: 409 });
    }

    if (error instanceof Error && error.message === "INVALID_INVITE") {
      return NextResponse.json({ error: "INVALID_INVITE" }, { status: 400 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_INVITE" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
