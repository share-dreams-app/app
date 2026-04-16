import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { saveRelationshipProfile } from "@/server/services/profile-service";

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("INVALID_RELATIONSHIP_PROFILE");
    }
    const profile = await saveRelationshipProfile({
      userId: user.id,
      relationType:
        typeof body.relationType === "string" ? body.relationType : "",
      yearsKnown: Number(body.yearsKnown),
      ageRange: typeof body.ageRange === "string" ? body.ageRange : undefined,
      objectiveContext:
        typeof body.objectiveContext === "string" ? body.objectiveContext : undefined
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "INVALID_RELATIONSHIP_PROFILE") {
      return NextResponse.json(
        { error: "INVALID_RELATIONSHIP_PROFILE" },
        { status: 422 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "INVALID_RELATIONSHIP_PROFILE" },
        { status: 422 }
      );
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
