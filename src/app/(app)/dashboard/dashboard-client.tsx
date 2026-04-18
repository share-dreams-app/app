"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { PaywallBanner } from "@/components/paywall-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricTile } from "@/components/ui/metric-tile";
import { SectionHeader } from "@/components/ui/section-header";
import { trackClientEvent } from "@/lib/analytics-client";

type DreamCard = {
  id: string;
  title: string;
  createdLabel: string;
};

type DashboardClientProps = {
  initialPlan: "free" | "premium";
  initialLimit: "open" | "reached";
};

const ANALYTICS_USER_ID = "owner_1";

export default function DashboardClient({
  initialPlan,
  initialLimit
}: DashboardClientProps) {
  const { copy } = useLocale();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dreams, setDreams] = useState<DreamCard[]>([
    {
      id: "dream_seed",
      title: copy.dashboard.seedDreamTitle,
      createdLabel: copy.dashboard.cardMeta
    }
  ]);

  const activeDreams = useMemo(() => dreams.length, [dreams]);
  const showPaywall = initialPlan !== "premium" && initialLimit === "reached";

  useEffect(() => {
    setDreams((currentDreams) =>
      currentDreams.map((dream) =>
        dream.id === "dream_seed"
          ? {
              ...dream,
              title: copy.dashboard.seedDreamTitle,
              createdLabel: copy.dashboard.cardMeta
            }
          : dream
      )
    );
  }, [copy.dashboard.seedDreamTitle, copy.dashboard.cardMeta]);

  useEffect(() => {
    void trackClientEvent({
      userId: ANALYTICS_USER_ID,
      type: "weekly_active_user",
      payload: { source: "dashboard" }
    });
  }, []);

  function createDream(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle || showPaywall) {
      return;
    }

    void trackClientEvent({
      userId: ANALYTICS_USER_ID,
      type: "dream_created",
      payload: { source: "dashboard", title: trimmedTitle }
    });

    setDreams((currentDreams) => [
      {
        id: `dream_${currentDreams.length + 1}`,
        title: trimmedTitle,
        createdLabel: copy.dashboard.createdNow
      },
      ...currentDreams
    ]);
    setTitle("");
    setShowForm(false);
  }

  return (
    <main className="sd-page-shell">
      <div className="sd-content-width">
        <header className="sd-top-bar" aria-label="Dashboard navigation">
          <Link href="/" className="sd-brand">
            {copy.common.appName}
          </Link>
          <nav className="sd-nav-links">
            <Link href="/dashboard?plan=free&limit=open" className="sd-nav-link">
              Dashboard
            </Link>
            <Link href="/insights?plan=premium" className="sd-nav-link">
              {copy.dashboard.navInsights}
            </Link>
          </nav>
          <div className="sd-top-actions">
            <LanguageToggle />
          </div>
        </header>

        <section className="sd-dashboard-hero">
          <SectionHeader
            eyebrow={copy.dashboard.eyebrow}
            title={copy.dashboard.title}
            description={copy.dashboard.subtitle}
          />
          <div className="sd-hero-actions">
            <Button onClick={() => setShowForm((value) => !value)} disabled={showPaywall}>
              {copy.dashboard.newDream}
            </Button>
          </div>
        </section>

        {showPaywall ? <PaywallBanner /> : null}

        {showForm ? (
          <Card as="section" className="sd-form-card">
            <form onSubmit={createDream} className="sd-form-stack">
              <label htmlFor="dream-title" className="sd-label">
                {copy.dashboard.formTitle}
              </label>
              <div className="sd-form-row">
                <input
                  id="dream-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={copy.dashboard.formPlaceholder}
                  className="sd-input"
                />
                <Button type="submit" variant="secondary" disabled={showPaywall}>
                  {copy.dashboard.saveDream}
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        <section className="sd-metric-grid" aria-label="Dashboard summary">
          <MetricTile value={activeDreams} label={copy.dashboard.metricDreams} />
          <MetricTile value={5} label={copy.dashboard.metricTasks} />
          <MetricTile
            value={initialLimit === "reached" ? copy.dashboard.limitReached : copy.dashboard.limitOpen}
            label={copy.dashboard.metricLimit}
          />
        </section>

        <section className="sd-card-grid" aria-label="Active dreams">
          {dreams.map((dream) => (
            <Card key={dream.id}>
              <p className="sd-card-meta">{dream.createdLabel}</p>
              <h2 className="sd-card-title">{dream.title}</h2>
              <p className="sd-card-copy">{copy.dashboard.cardCopy}</p>
              <Link
                href={`/dreams/${dream.id}?title=${encodeURIComponent(dream.title)}`}
                aria-label={`${copy.dashboard.openDream} ${dream.title}`}
                className="sd-card-link"
              >
                {copy.dashboard.openDream}
              </Link>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
