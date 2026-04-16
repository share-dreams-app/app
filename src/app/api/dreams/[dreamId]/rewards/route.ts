import { NextResponse } from "next/server";
import type { PlanTier } from "@/domain/types";
import { requireUser } from "@/server/auth/require-user";
import {
  createManualReward,
  suggestReward
} from "@/server/services/reward-orchestrator";

type RewardProfileBody = {
  relationType: string;
  yearsKnown: number;
};

type RewardRequestBody = {
  mode?: unknown;
  title?: unknown;
  tier?: unknown;
  dreamTitle?: unknown;
  profile?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function parseRewardRequest(body: unknown, dreamId: string) {
  if (!dreamId.trim()) {
    throw new Error("INVALID_REWARD");
  }

  if (!isRecord(body)) {
    throw new Error("INVALID_REWARD");
  }

  const data = body as RewardRequestBody;

  if (data.mode === "MANUAL") {
    if (typeof data.title !== "string") {
      throw new Error("INVALID_REWARD");
    }

    return {
      mode: "MANUAL" as const,
      title: data.title
    };
  }

  if (data.mode === "SUGGEST") {
    if (data.tier !== "FREE" && data.tier !== "PREMIUM") {
      throw new Error("INVALID_REWARD");
    }

    if (typeof data.dreamTitle !== "string") {
      throw new Error("INVALID_REWARD");
    }

    if (data.profile !== undefined) {
      if (!isRecord(data.profile)) {
        throw new Error("INVALID_REWARD");
      }

      const profile = data.profile as Record<string, unknown>;
      if (
        typeof profile.relationType !== "string" ||
        profile.relationType.trim() === "" ||
        typeof profile.yearsKnown !== "number" ||
        !Number.isFinite(profile.yearsKnown) ||
        profile.yearsKnown <= 0
      ) {
        throw new Error("INVALID_REWARD");
      }
    }

    return {
      mode: "SUGGEST" as const,
      tier: data.tier as PlanTier,
      dreamTitle: data.dreamTitle,
      profile:
        data.profile !== undefined
          ? (data.profile as RewardProfileBody)
          : undefined
    };
  }

  throw new Error("INVALID_REWARD");
}

export async function POST(
  request: Request,
  context: { params: { dreamId: string } }
) {
  try {
    await requireUser(request);

    const body = parseRewardRequest(await request.json(), context.params.dreamId);

    if (body.mode === "MANUAL") {
      const reward = createManualReward({ title: body.title });

      return NextResponse.json(
        {
          dreamId: context.params.dreamId,
          ...reward
        },
        { status: 201 }
      );
    }

    const reward = await suggestReward({
      tier: body.tier,
      dreamTitle: body.dreamTitle,
      profile: body.profile
    });

    return NextResponse.json(
      {
        dreamId: context.params.dreamId,
        ...reward
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "INVALID_REWARD") {
      return NextResponse.json({ error: "INVALID_REWARD" }, { status: 422 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "INVALID_REWARD" }, { status: 422 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
