import { canCreateActiveDream, canCreateActiveTask } from "@/domain/limits";
import type { PlanTier } from "@/domain/types";

type CreateDreamInput = {
  userId: string;
  tier: PlanTier;
  title: string;
  activeDreamCount?: number;
};

type CreateTaskInput = {
  dreamId: string;
  tier: PlanTier;
  title: string;
  activeTaskCount?: number;
};

type CreateStageInput = {
  dreamId: string;
  title: string;
  order?: number;
};

let dreamSequence = 0;
let taskSequence = 0;
const activeDreamCountByUser = new Map<string, number>();
const activeTaskCountByDream = new Map<string, number>();

export function resetDreamServiceStateForTests() {
  dreamSequence = 0;
  taskSequence = 0;
  activeDreamCountByUser.clear();
  activeTaskCountByDream.clear();
}

export function setActiveDreamCountForTests(userId: string, count: number) {
  activeDreamCountByUser.set(userId, count);
}

export function setActiveTaskCountForTests(dreamId: string, count: number) {
  activeTaskCountByDream.set(dreamId, count);
}

export async function createDream(input: CreateDreamInput) {
  const currentActiveDreams =
    input.activeDreamCount ?? activeDreamCountByUser.get(input.userId) ?? 0;

  if (!canCreateActiveDream(input.tier, currentActiveDreams)) {
    throw new Error("FREE_DREAM_LIMIT_REACHED");
  }

  activeDreamCountByUser.set(input.userId, currentActiveDreams + 1);
  dreamSequence += 1;

  return {
    id: `dream_${dreamSequence}`,
    ownerId: input.userId,
    title: input.title
  };
}

export async function createStage(input: CreateStageInput) {
  const title = input.title.trim();

  if (!title) {
    throw new Error("INVALID_STAGE");
  }

  const order = input.order ?? 1;

  return {
    id: `stage_${input.dreamId}_${order}`,
    dreamId: input.dreamId,
    title,
    order
  };
}

export async function createTask(input: CreateTaskInput) {
  const currentActiveTasks =
    input.activeTaskCount ?? activeTaskCountByDream.get(input.dreamId) ?? 0;

  if (!canCreateActiveTask(input.tier, currentActiveTasks)) {
    throw new Error("FREE_TASK_LIMIT_REACHED");
  }

  activeTaskCountByDream.set(input.dreamId, currentActiveTasks + 1);
  taskSequence += 1;

  return {
    id: `task_${taskSequence}`,
    dreamId: input.dreamId,
    title: input.title
  };
}
