type RelationshipProfileInput = {
  userId: string;
  relationType: string;
  yearsKnown: number;
  ageRange?: string;
  objectiveContext?: string;
};

type RelationshipProfile = {
  userId: string;
  relationType: string;
  yearsKnown: number;
  ageRange?: string;
  objectiveContext?: string;
};

const relationshipProfiles = new Map<string, RelationshipProfile>();

function trimOrUndefined(value?: string) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export async function saveRelationshipProfile(input: RelationshipProfileInput) {
  const relationType = input.relationType.trim();

  if (!relationType || !Number.isFinite(input.yearsKnown) || input.yearsKnown <= 0) {
    throw new Error("INVALID_RELATIONSHIP_PROFILE");
  }

  const profile: RelationshipProfile = {
    userId: input.userId,
    relationType,
    yearsKnown: input.yearsKnown,
    ageRange: trimOrUndefined(input.ageRange),
    objectiveContext: trimOrUndefined(input.objectiveContext)
  };

  relationshipProfiles.set(input.userId, profile);

  return profile;
}

export function getRelationshipProfileForTests(userId: string) {
  return relationshipProfiles.get(userId);
}

export function resetRelationshipProfileServiceStateForTests() {
  relationshipProfiles.clear();
}
