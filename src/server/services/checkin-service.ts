type SubmitCheckinInput = {
  dreamId: string;
  progress: number;
  nextSteps: string;
  blockers?: string;
};

let checkinSequence = 0;

export async function submitCheckin(input: SubmitCheckinInput) {
  const nextSteps = input.nextSteps.trim();

  if (!nextSteps || !Number.isFinite(input.progress) || input.progress <= 0) {
    throw new Error("INVALID_CHECKIN");
  }

  checkinSequence += 1;

  return {
    id: `checkin_${checkinSequence}`,
    dreamId: input.dreamId,
    progress: input.progress,
    nextSteps,
    blockers: input.blockers
  };
}
