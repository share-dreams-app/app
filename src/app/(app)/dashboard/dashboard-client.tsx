"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PaywallBanner } from "@/components/paywall-banner";
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
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dreams, setDreams] = useState<DreamCard[]>([
    {
      id: "dream_seed",
      title: "Planejar o primeiro sonho compartilhado",
      createdLabel: "Exemplo MVP"
    }
  ]);

  const activeDreams = useMemo(() => dreams.length, [dreams]);
  const showPaywall = initialPlan !== "premium" && initialLimit === "reached";

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
        createdLabel: "Criado agora"
      },
      ...currentDreams
    ]);
    setTitle("");
    setShowForm(false);
  }

  return (
    <main style={styles.shell}>
      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Share Dreams MVP</p>
          <h1 style={styles.title}>Seu painel de sonhos</h1>
          <p style={styles.subtitle}>
            Transforme sonhos em etapas pequenas, combine check-ins e mantenha uma recompensa clara para o próximo marco.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          style={styles.primaryButton}
          disabled={showPaywall}
        >
          Novo sonho
        </button>
      </section>

      {showPaywall ? <PaywallBanner /> : null}

      {showForm ? (
        <form onSubmit={createDream} style={styles.formCard}>
          <label htmlFor="dream-title" style={styles.label}>
            Título do sonho
          </label>
          <div style={styles.formRow}>
            <input
              id="dream-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Mudar de emprego em 6 meses"
              style={styles.input}
            />
            <button type="submit" style={styles.secondaryButton} disabled={showPaywall}>
              Salvar sonho
            </button>
          </div>
        </form>
      ) : null}

      <section style={styles.metricGrid} aria-label="Resumo do painel">
        <article style={styles.metricCard}>
          <span style={styles.metricValue}>{activeDreams}</span>
          <span style={styles.metricLabel}>sonhos ativos</span>
        </article>
        <article style={styles.metricCard}>
          <span style={styles.metricValue}>5</span>
          <span style={styles.metricLabel}>tarefas Free por sonho</span>
        </article>
        <article style={styles.metricCard}>
          <span style={styles.metricValue}>
            {initialLimit === "reached" ? "atingido" : "disponível"}
          </span>
          <span style={styles.metricLabel}>limite atual do plano</span>
        </article>
      </section>

      <section style={styles.cardGrid} aria-label="Sonhos ativos">
        {dreams.map((dream) => (
          <article key={dream.id} style={styles.dreamCard}>
            <p style={styles.cardMeta}>{dream.createdLabel}</p>
            <h2 style={styles.cardTitle}>{dream.title}</h2>
            <p style={styles.cardCopy}>Próxima ação sugerida: escolha uma tarefa de 10 minutos e registre o avanço semanal.</p>
            <Link
              href={`/dreams/${dream.id}?title=${encodeURIComponent(dream.title)}`}
              aria-label={`Abrir sonho ${dream.title}`}
              style={styles.cardLink}
            >
              Abrir sonho
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    padding: "32px clamp(18px, 5vw, 64px)",
    background: "linear-gradient(135deg, #fff7ed 0%, #ecfeff 48%, #f8fafc 100%)",
    color: "#172554",
    fontFamily: "Georgia, 'Times New Roman', serif"
  },
  hero: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap" as const,
    marginBottom: "24px"
  },
  eyebrow: {
    margin: 0,
    color: "#0f766e",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const
  },
  title: {
    margin: "8px 0",
    fontSize: "clamp(2.3rem, 7vw, 5rem)",
    lineHeight: 0.95
  },
  subtitle: {
    maxWidth: "680px",
    margin: 0,
    color: "#334155",
    fontSize: "1.08rem",
    lineHeight: 1.6
  },
  primaryButton: {
    border: 0,
    borderRadius: "999px",
    background: "#0f766e",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    padding: "14px 22px",
    boxShadow: "0 16px 32px rgba(15, 118, 110, 0.24)"
  },
  secondaryButton: {
    border: 0,
    borderRadius: "14px",
    background: "#172554",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    padding: "13px 18px"
  },
  formCard: {
    marginTop: "18px",
    borderRadius: "22px",
    background: "rgba(255, 255, 255, 0.86)",
    padding: "18px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.10)"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#0f172a",
    fontWeight: 700
  },
  formRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const
  },
  input: {
    flex: "1 1 260px",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    color: "#0f172a",
    font: "inherit",
    padding: "12px 14px"
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    margin: "24px 0"
  },
  metricCard: {
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.72)",
    padding: "18px"
  },
  metricValue: {
    display: "block",
    fontSize: "2rem",
    fontWeight: 700
  },
  metricLabel: {
    color: "#475569"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px"
  },
  dreamCard: {
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "26px",
    background: "rgba(255, 255, 255, 0.82)",
    padding: "22px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)"
  },
  cardMeta: {
    margin: 0,
    color: "#0f766e",
    fontSize: "0.85rem",
    fontWeight: 700
  },
  cardTitle: {
    margin: "10px 0",
    fontSize: "1.5rem"
  },
  cardCopy: {
    color: "#475569",
    lineHeight: 1.55
  },
  cardLink: {
    color: "#0f766e",
    fontWeight: 700
  }
};
