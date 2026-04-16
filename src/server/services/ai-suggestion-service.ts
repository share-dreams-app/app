type AiSuggestionInput = {
  dreamTitle: string;
  relationshipProfile: {
    relationType: string;
    yearsKnown: number;
  };
};

export async function getAiTaskSuggestions(input: AiSuggestionInput) {
  const dreamTitle = input.dreamTitle.trim();
  const relationType = input.relationshipProfile.relationType.trim();

  return [
    {
      title: `Plan a collaborative first step for ${dreamTitle}`,
      reason: `${relationType} relationship with ${input.relationshipProfile.yearsKnown} years known`
    },
    {
      title: `Schedule a check-in about ${dreamTitle}`,
      reason: "AI-personalized task suggestion"
    }
  ];
}
