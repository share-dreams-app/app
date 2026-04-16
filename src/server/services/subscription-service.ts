import type { PlanTier } from "@/domain/types";

const tierOverrides = new Map<string, PlanTier>();

export function setUserTierForTests(userId: string, tier: PlanTier) {
  tierOverrides.set(userId, tier);
}

export function resetUserTierOverridesForTests() {
  tierOverrides.clear();
}

export async function getUserTier(userId: string): Promise<PlanTier> {
  return tierOverrides.get(userId) ?? "FREE";
}
