import DashboardClient from "@/app/(app)/dashboard/dashboard-client";

type DashboardPageProps = {
  searchParams?: Promise<{
    plan?: string;
    limit?: string;
  }>;
};

function normalizePlan(plan: string | undefined): "free" | "premium" {
  return plan === "premium" ? "premium" : "free";
}

function normalizeLimit(limit: string | undefined): "open" | "reached" {
  return limit === "reached" ? "reached" : "open";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;

  return (
    <DashboardClient
      initialPlan={normalizePlan(resolvedParams?.plan)}
      initialLimit={normalizeLimit(resolvedParams?.limit)}
    />
  );
}
