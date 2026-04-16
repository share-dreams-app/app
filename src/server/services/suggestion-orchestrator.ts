import { getAiTaskSuggestions } from "@/server/services/ai-suggestion-service";
import { getTemplateTaskSuggestions } from "@/server/services/template-suggestion-service";

type SuggestTaskRecommendationsInput = {
  dreamTitle: string;
  relationshipProfile: {
    relationType: string;
    yearsKnown: number;
  };
};

export async function suggestTaskRecommendations(input: SuggestTaskRecommendationsInput) {
  const dreamTitle = input.dreamTitle.trim();
  const relationType = input.relationshipProfile.relationType.trim();

  if (!dreamTitle || !relationType || !Number.isFinite(input.relationshipProfile.yearsKnown) || input.relationshipProfile.yearsKnown <= 0) {
    throw new Error("INVALID_SUGGESTION_REQUEST");
  }

  try {
    return {
      source: "AI" as const,
      items: await getAiTaskSuggestions({
        dreamTitle,
        relationshipProfile: {
          relationType,
          yearsKnown: input.relationshipProfile.yearsKnown
        }
      })
    };
  } catch {
    // Intentional fallback: template suggestions are the safe default when AI is unavailable.
    return {
      source: "TEMPLATE" as const,
      items: getTemplateTaskSuggestions({
        dreamTitle,
        relationType,
        yearsKnown: input.relationshipProfile.yearsKnown
      })
    };
  }
}
