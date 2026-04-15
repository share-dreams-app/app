import type { PlanTier } from "@/domain/types";

export const FREE_MAX_ACTIVE_DREAMS = 3;
export const FREE_MAX_ACTIVE_TASKS_PER_DREAM = 5;

export function canCreateActiveDream(
  tier: PlanTier,
  currentActiveDreams: number
) {
  if (tier === "PREMIUM") {
    return true;
  }

  return currentActiveDreams < FREE_MAX_ACTIVE_DREAMS;
}

export function canCreateActiveTask(
  tier: PlanTier,
  currentActiveTasks: number
) {
  if (tier === "PREMIUM") {
    return true;
  }

  return currentActiveTasks < FREE_MAX_ACTIVE_TASKS_PER_DREAM;
}
