import { NextResponse } from "next/server";
import { createDream } from "@/server/services/dream-service";
import { requireUser } from "@/server/auth/require-user";
import { getUserTier } from "@/server/services/subscription-service";

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const tier = await getUserTier(user.id);
    const body = await request.json();
    const dream = await createDream({
      userId: user.id,
      tier,
      title: body.title
    });

    return NextResponse.json(dream, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FREE_DREAM_LIMIT_REACHED") {
      return NextResponse.json({ error: "FREE_DREAM_LIMIT_REACHED" }, { status: 403 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_DREAM" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
