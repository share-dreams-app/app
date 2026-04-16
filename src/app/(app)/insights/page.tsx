import Link from "next/link";
import { getEngagementSummaryFromTrackedEvents } from "@/server/services/insights-service";
import { PaywallBanner } from "@/components/paywall-banner";

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

  return (
    <main style={styles.shell}>
      <nav style={styles.nav} aria-label="Navegação de insights">
        <Link href="/dashboard" style={styles.navLink}>Voltar ao painel</Link>
      </nav>

      <section style={styles.hero}>
        <p style={styles.eyebrow}>Analytics MVP</p>
        <h1 style={styles.title}>Resumo de engajamento</h1>
        <p style={styles.subtitle}>
          Uma leitura simples de retenção e atividade para orientar a próxima iteração do Share Dreams.
        </p>
        {isPremium ? <span style={styles.badge}>Premium ativo</span> : null}
      </section>

      {!isPremium ? <PaywallBanner /> : null}

      <section style={styles.metricGrid} aria-label="Indicadores de engajamento">
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Usuários ativos semanais</span>
          <strong style={styles.metricValue}>{summary.weeklyActiveUsers}</strong>
        </article>
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Retenção semanal</span>
          <strong style={styles.metricValue}>{summary.retentionRate}%</strong>
        </article>
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Pontuação de engajamento</span>
          <strong style={styles.metricValue}>{summary.engagementScore}</strong>
        </article>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>Eventos principais</h2>
        <ul style={styles.eventList}>
          {summary.topEventTypes.map((event) => (
            <li key={event.type} style={styles.eventItem}>
              <span>{event.type}</span>
              <strong>{event.count}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    padding: "32px clamp(18px, 5vw, 64px)",
    background: "radial-gradient(circle at top left, #ccfbf1 0, transparent 34%), linear-gradient(135deg, #f8fafc 0%, #fff7ed 100%)",
    color: "#0f172a",
    fontFamily: "Georgia, 'Times New Roman', serif"
  },
  nav: {
    marginBottom: "24px"
  },
  navLink: {
    color: "#0f766e",
    fontWeight: 700
  },
  hero: {
    maxWidth: "760px",
    marginBottom: "24px"
  },
  eyebrow: {
    margin: 0,
    color: "#0f766e",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const
  },
  title: {
    margin: "8px 0",
    fontSize: "clamp(2.3rem, 7vw, 4.8rem)",
    lineHeight: 0.95
  },
  subtitle: {
    margin: "0 0 16px",
    color: "#475569",
    lineHeight: 1.6
  },
  badge: {
    display: "inline-flex",
    borderRadius: "999px",
    background: "#0f766e",
    color: "white",
    fontWeight: 700,
    padding: "8px 12px"
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
    margin: "24px 0"
  },
  metricCard: {
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.84)",
    padding: "22px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.10)"
  },
  metricLabel: {
    display: "block",
    color: "#475569",
    marginBottom: "8px"
  },
  metricValue: {
    fontSize: "2.4rem"
  },
  panel: {
    borderRadius: "26px",
    background: "rgba(255, 255, 255, 0.86)",
    padding: "22px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.10)"
  },
  panelTitle: {
    marginTop: 0
  },
  eventList: {
    display: "grid",
    gap: "10px",
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  eventItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    borderRadius: "16px",
    background: "#f8fafc",
    padding: "12px 14px"
  }
};
