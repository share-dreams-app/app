import { NextResponse } from "next/server";
import { acceptInvite } from "@/server/services/invite-service";

export async function POST(
  _request: Request,
  context: { params: { token: string } }
) {
  try {
    const result = await acceptInvite({
      token: context.params.token,
      now: new Date()
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "INVITE_EXPIRED") {
      return NextResponse.json({ error: "INVITE_EXPIRED" }, { status: 410 });
    }

    if (error instanceof Error && error.message === "INVALID_INVITE") {
      return NextResponse.json({ error: "INVALID_INVITE" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
