import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { getUserTier } from "@/server/services/subscription-service";

export async function GET() {
  try {
    const user = await requireUser();
    const tier = await getUserTier(user.id);

    return NextResponse.json({ user, tier });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
