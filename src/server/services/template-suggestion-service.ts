type TemplateSuggestionInput = {
  dreamTitle: string;
  relationType: string;
  yearsKnown: number;
};

export function getTemplateTaskSuggestions(input: TemplateSuggestionInput) {
  const dreamTitle = input.dreamTitle.trim();

  return [
    {
      title: `Define the next concrete step for ${dreamTitle}`,
      reason: `Keep the plan focused for ${input.relationType.toLowerCase()} partners of ${input.yearsKnown} years`
    },
    {
      title: `Break ${dreamTitle} into a 7-day action plan`,
      reason: "Template-based planning fallback"
    },
    {
      title: `Share progress on ${dreamTitle} with your partner`,
      reason: "Template-based accountability fallback"
    }
  ];
}
