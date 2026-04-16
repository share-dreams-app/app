"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { trackClientEvent } from "@/lib/analytics-client";

type TaskItem = {
  id: string;
  title: string;
};

type CheckIn = {
  progress: string;
  nextSteps: string;
};

function readDreamTitle() {
  if (typeof window === "undefined") {
    return "Sonho compartilhado";
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("title") ?? "Sonho compartilhado";
}

const ANALYTICS_USER_ID = "owner_1";

export default function DreamDetailPage() {
  const [dreamTitle, setDreamTitle] = useState("Sonho compartilhado");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "task_seed", title: "Definir primeiro marco semanal" }
  ]);
  const [progress, setProgress] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [rewardTitle, setRewardTitle] = useState("");
  const [reward, setReward] = useState("Jantar simples para celebrar o marco");

  useEffect(() => {
    setDreamTitle(readDreamTitle());
  }, []);

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: `task_${currentTasks.length + 1}`, title: trimmedTitle }
    ]);
    void trackClientEvent({
      userId: ANALYTICS_USER_ID,
      type: "task_created",
      payload: { source: "dream_detail", title: trimmedTitle, dreamTitle }
    });
    setTaskTitle("");
    setShowTaskForm(false);
  }

  function submitCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedProgress = progress.trim();
    const trimmedNextSteps = nextSteps.trim();

    if (!trimmedProgress || !trimmedNextSteps) {
      return;
    }

    setCheckIn({ progress: trimmedProgress, nextSteps: trimmedNextSteps });
    void trackClientEvent({
      userId: ANALYTICS_USER_ID,
      type: "checkin_submitted",
      payload: {
        source: "dream_detail",
        dreamTitle,
        progress: Number(trimmedProgress) || 0
      }
    });
  }

  function saveReward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedReward = rewardTitle.trim();

    if (!trimmedReward) {
      return;
    }

    setReward(trimmedReward);
    void trackClientEvent({
      userId: ANALYTICS_USER_ID,
      type: "reward_defined",
      payload: { source: "dream_detail", title: trimmedReward, dreamTitle }
    });
    setRewardTitle("");
    setShowRewardForm(false);
  }

  return (
    <main style={styles.shell}>
      <nav style={styles.nav} aria-label="Navegação do sonho">
        <Link href="/dashboard" style={styles.navLink}>Voltar ao painel</Link>
        <Link href="/insights?plan=premium" style={styles.navLink}>Ver insights</Link>
      </nav>

      <section style={styles.hero}>
        <p style={styles.eyebrow}>Plano de execução</p>
        <h1 style={styles.title}>{dreamTitle}</h1>
        <p style={styles.subtitle}>
          Uma visão simples para transformar o sonho em tarefas, check-ins e recompensas verificáveis.
        </p>
      </section>

      <section style={styles.grid}>
        <article style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.eyebrow}>Etapas e tarefas</p>
              <h2 style={styles.panelTitle}>Próximas ações</h2>
            </div>
            <button type="button" onClick={() => setShowTaskForm((value) => !value)} style={styles.smallButton}>
              Nova tarefa
            </button>
          </div>

          {showTaskForm ? (
            <form onSubmit={createTask} style={styles.formCard}>
              <label htmlFor="task-title" style={styles.label}>Título da tarefa</label>
              <input
                id="task-title"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.primaryButton}>Salvar tarefa</button>
            </form>
          ) : null}

          <ul style={styles.list}>
            {tasks.map((task) => (
              <li key={task.id} style={styles.listItem}>{task.title}</li>
            ))}
          </ul>
        </article>

        <article style={styles.panel}>
          <p style={styles.eyebrow}>Check-in semanal</p>
          <h2 style={styles.panelTitle}>Registrar avanço</h2>
          <form onSubmit={submitCheckIn} style={styles.stack}>
            <label htmlFor="progress" style={styles.label}>Progresso (%)</label>
            <input
              id="progress"
              inputMode="numeric"
              value={progress}
              onChange={(event) => setProgress(event.target.value)}
              style={styles.input}
            />
            <label htmlFor="next-steps" style={styles.label}>Próximos passos</label>
            <textarea
              id="next-steps"
              value={nextSteps}
              onChange={(event) => setNextSteps(event.target.value)}
              style={styles.textarea}
            />
            <button type="submit" style={styles.primaryButton}>Registrar check-in</button>
          </form>

          {checkIn ? (
            <div style={styles.successCard}>
              <strong>Check-in registrado</strong>
              <span>{checkIn.progress}%</span>
              <p>{checkIn.nextSteps}</p>
            </div>
          ) : null}
        </article>

        <article style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.eyebrow}>Recompensa</p>
              <h2 style={styles.panelTitle}>Marco de motivação</h2>
            </div>
            <button type="button" onClick={() => setShowRewardForm((value) => !value)} style={styles.smallButton}>
              Definir recompensa
            </button>
          </div>

          {showRewardForm ? (
            <form onSubmit={saveReward} style={styles.formCard}>
              <label htmlFor="manual-reward" style={styles.label}>Recompensa manual</label>
              <input
                id="manual-reward"
                value={rewardTitle}
                onChange={(event) => setRewardTitle(event.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.primaryButton}>Salvar recompensa</button>
            </form>
          ) : null}

          <p style={styles.reward}>{reward}</p>
        </article>
      </section>
    </main>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    padding: "28px clamp(18px, 5vw, 64px)",
    background: "linear-gradient(150deg, #f0fdfa 0%, #fff7ed 52%, #f8fafc 100%)",
    color: "#0f172a",
    fontFamily: "Georgia, 'Times New Roman', serif"
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginBottom: "26px"
  },
  navLink: {
    color: "#0f766e",
    fontWeight: 700
  },
  hero: {
    maxWidth: "820px",
    marginBottom: "28px"
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
    fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
    lineHeight: 1
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px"
  },
  panel: {
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "26px",
    background: "rgba(255, 255, 255, 0.82)",
    padding: "22px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)"
  },
  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px"
  },
  panelTitle: {
    margin: "8px 0 16px",
    fontSize: "1.45rem"
  },
  smallButton: {
    border: "1px solid #0f766e",
    borderRadius: "999px",
    background: "#ecfeff",
    color: "#0f766e",
    cursor: "pointer",
    fontWeight: 700,
    padding: "10px 14px"
  },
  primaryButton: {
    border: 0,
    borderRadius: "14px",
    background: "#0f766e",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    padding: "12px 16px"
  },
  formCard: {
    display: "grid",
    gap: "10px",
    marginBottom: "16px"
  },
  stack: {
    display: "grid",
    gap: "10px"
  },
  label: {
    color: "#0f172a",
    fontWeight: 700
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    color: "#0f172a",
    font: "inherit",
    padding: "12px 14px"
  },
  textarea: {
    minHeight: "96px",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    color: "#0f172a",
    font: "inherit",
    padding: "12px 14px",
    resize: "vertical" as const
  },
  list: {
    display: "grid",
    gap: "10px",
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  listItem: {
    borderRadius: "16px",
    background: "#f8fafc",
    padding: "12px 14px"
  },
  successCard: {
    display: "grid",
    gap: "6px",
    marginTop: "16px",
    borderRadius: "18px",
    background: "#ecfdf5",
    color: "#065f46",
    padding: "14px"
  },
  reward: {
    borderRadius: "18px",
    background: "#fff7ed",
    color: "#9a3412",
    fontWeight: 700,
    padding: "16px"
  }
};
