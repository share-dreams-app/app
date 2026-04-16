export function getTemplateRewards(dreamTitle: string) {
  const title = dreamTitle.trim();

  if (!title) {
    throw new Error("INVALID_REWARD");
  }

  return [
    {
      title: `Celebrate ${title} with a simple at-home reward`
    },
    {
      title: `Plan a thoughtful surprise tied to ${title}`
    }
  ];
}
