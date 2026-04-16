import type { PlanTier } from "@/domain/types";
import { getTemplateRewards } from "@/server/services/reward-template-service";

type RewardProfile = {
  relationType: string;
  yearsKnown: number;
};

type SuggestRewardInput = {
  tier: PlanTier;
  dreamTitle: string;
  profile?: RewardProfile;
};

type ManualRewardInput = {
  title: string;
};

export const rewardServiceDeps = {
  getAiRewardSuggestions
};

export function createManualReward(input: ManualRewardInput) {
  const title = input.title.trim();

  if (!title) {
    throw new Error("INVALID_REWARD");
  }

  return {
    source: "MANUAL" as const,
    title
  };
}

export async function getAiRewardSuggestions(input: SuggestRewardInput) {
  const dreamTitle = input.dreamTitle.trim();

  if (!dreamTitle) {
    throw new Error("INVALID_REWARD");
  }

  if (input.profile) {
    const relationType = input.profile.relationType.trim();
    const yearsKnown = input.profile.yearsKnown;

    if (!relationType || !Number.isFinite(yearsKnown) || yearsKnown <= 0) {
      throw new Error("INVALID_REWARD");
    }

    return [
      {
        title: `Personalize a reward for ${dreamTitle} with your ${relationType} relationship`
      },
      {
        title: `Choose a celebration that fits ${yearsKnown} years together`
      }
    ];
  }

  return [
    {
      title: `Personalize a reward for ${dreamTitle} with a thoughtful celebration`
    },
    {
      title: `Choose a celebration that fits the moment`
    }
  ];
}

export async function suggestReward(input: SuggestRewardInput) {
  const dreamTitle = input.dreamTitle.trim();

  if (!dreamTitle) {
    throw new Error("INVALID_REWARD");
  }

  if (
    input.profile &&
    (!input.profile.relationType.trim() ||
      !Number.isFinite(input.profile.yearsKnown) ||
      input.profile.yearsKnown <= 0)
  ) {
    throw new Error("INVALID_REWARD");
  }

  if (input.tier === "FREE") {
    return {
      source: "TEMPLATE" as const,
      items: getTemplateRewards(dreamTitle)
    };
  }

  try {
    return {
      source: "AI" as const,
      items: await rewardServiceDeps.getAiRewardSuggestions({
        tier: input.tier,
        dreamTitle,
        profile: input.profile
      })
    };
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_REWARD") {
      throw error;
    }

    return {
      source: "TEMPLATE" as const,
      items: getTemplateRewards(dreamTitle)
    };
  }
}
