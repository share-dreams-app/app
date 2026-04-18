import { getEngagementSummaryFromTrackedEvents } from "@/server/services/insights-service";
import { InsightsClient } from "@/app/(app)/insights/insights-client";

type InsightsPageProps = {
  searchParams?: Promise<{ plan?: string; userId?: string }>;
};

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const plan = resolvedParams?.plan ?? "free";
  const isPremium = plan === "premium";
  const userIdFilter = resolvedParams?.userId?.trim();
  const summary = await getEngagementSummaryFromTrackedEvents(
    new Date(),
    userIdFilter ? userIdFilter : undefined
  );

  return <InsightsClient isPremium={isPremium} summary={summary} />;
}
