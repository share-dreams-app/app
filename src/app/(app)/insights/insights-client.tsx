"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { PaywallBanner } from "@/components/paywall-banner";
import { Card } from "@/components/ui/card";
import { MetricTile } from "@/components/ui/metric-tile";
import { SectionHeader } from "@/components/ui/section-header";
import type { EngagementSummary } from "@/server/services/insights-service";

type InsightsClientProps = {
  isPremium: boolean;
  summary: EngagementSummary;
};

export function InsightsClient({ isPremium, summary }: InsightsClientProps) {
  const { copy } = useLocale();

  return (
    <main className="sd-page-shell">
      <div className="sd-content-width">
        <header className="sd-top-bar" aria-label="Insights navigation">
          <Link href="/" className="sd-brand">
            {copy.common.appName}
          </Link>
          <nav className="sd-nav-links">
            <Link href="/dashboard" className="sd-nav-link">
              {copy.insights.backDashboard}
            </Link>
          </nav>
          <div className="sd-top-actions">
            <LanguageToggle />
          </div>
        </header>

        <section className="sd-insights-hero">
          <SectionHeader
            eyebrow={copy.insights.eyebrow}
            title={copy.insights.title}
            description={copy.insights.subtitle}
          />
          {isPremium ? <span className="sd-premium-pill">{copy.insights.premiumActive}</span> : null}
        </section>

        {!isPremium ? <PaywallBanner /> : null}

        <section className="sd-metric-grid" aria-label="Engagement indicators">
          <MetricTile value={summary.weeklyActiveUsers} label={copy.insights.weeklyUsers} />
          <MetricTile value={`${summary.retentionRate}%`} label={copy.insights.weeklyRetention} />
          <MetricTile value={summary.engagementScore} label={copy.insights.engagementScore} />
        </section>

        <Card className="sd-events-card">
          <h2 className="sd-panel-title">{copy.insights.topEvents}</h2>
          <ul className="sd-list">
            {summary.topEventTypes.map((event) => (
              <li key={event.type} className="sd-list-item sd-event-item">
                <span>{event.type}</span>
                <strong>{event.count}</strong>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </main>
  );
}
