import { NextResponse } from "next/server";
import { createInvite } from "@/server/services/invite-service";
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
    const invite = await createInvite({
      dreamId,
      invitedEmail: String(body.invitedEmail ?? "")
    });
    await trackEvent({
      userId: user.id,
      type: "supporter_invited",
      payload: {
        source: "api",
        dreamId,
        invitedEmail: invite.invitedEmail
      }
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
