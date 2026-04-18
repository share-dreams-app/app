"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { trackClientEvent } from "@/lib/analytics-client";

type TaskItem = {
  id: string;
  title: string;
};

type CheckIn = {
  progress: string;
  nextSteps: string;
};

function readDreamTitle(fallbackTitle: string) {
  if (typeof window === "undefined") {
    return fallbackTitle;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("title") ?? fallbackTitle;
}

const ANALYTICS_USER_ID = "owner_1";

export default function DreamDetailPage() {
  const { copy } = useLocale();
  const [dreamTitle, setDreamTitle] = useState(copy.dream.defaultTitle);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([{ id: "task_seed", title: copy.dream.seedTask }]);
  const [progress, setProgress] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [rewardTitle, setRewardTitle] = useState("");
  const [reward, setReward] = useState(copy.dream.defaultReward);

  useEffect(() => {
    setDreamTitle(readDreamTitle(copy.dream.defaultTitle));
  }, [copy.dream.defaultTitle]);

  useEffect(() => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === "task_seed" ? { ...task, title: copy.dream.seedTask } : task
      )
    );
  }, [copy.dream.seedTask]);

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
    <main className="sd-page-shell">
      <div className="sd-content-width">
        <header className="sd-top-bar" aria-label="Dream navigation">
          <Link href="/" className="sd-brand">
            {copy.common.appName}
          </Link>
          <nav className="sd-nav-links">
            <Link href="/dashboard" className="sd-nav-link">
              {copy.dream.backDashboard}
            </Link>
            <Link href="/insights?plan=premium" className="sd-nav-link">
              {copy.dream.viewInsights}
            </Link>
          </nav>
          <div className="sd-top-actions">
            <LanguageToggle />
          </div>
        </header>

        <section className="sd-dream-hero">
          <SectionHeader
            eyebrow={copy.dream.eyebrow}
            title={dreamTitle}
            description={copy.dream.subtitle}
          />
        </section>

        <section className="sd-panel-grid">
          <Card>
            <div className="sd-panel-header">
              <div>
                <p className="sd-eyebrow">{copy.dream.tasksEyebrow}</p>
                <h2 className="sd-panel-title">{copy.dream.tasksTitle}</h2>
              </div>
              <Button variant="secondary" onClick={() => setShowTaskForm((value) => !value)}>
                {copy.dream.newTask}
              </Button>
            </div>

            {showTaskForm ? (
              <form onSubmit={createTask} className="sd-form-stack">
                <label htmlFor="task-title" className="sd-label">
                  {copy.dream.taskLabel}
                </label>
                <input
                  id="task-title"
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  className="sd-input"
                />
                <Button type="submit">{copy.dream.saveTask}</Button>
              </form>
            ) : null}

            <ul className="sd-list">
              {tasks.map((task) => (
                <li key={task.id} className="sd-list-item">
                  {task.title}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <p className="sd-eyebrow">{copy.dream.checkinEyebrow}</p>
            <h2 className="sd-panel-title">{copy.dream.checkinTitle}</h2>
            <form onSubmit={submitCheckIn} className="sd-form-stack">
              <label htmlFor="progress" className="sd-label">
                {copy.dream.progressLabel}
              </label>
              <input
                id="progress"
                inputMode="numeric"
                value={progress}
                onChange={(event) => setProgress(event.target.value)}
                className="sd-input"
              />
              <label htmlFor="next-steps" className="sd-label">
                {copy.dream.nextStepsLabel}
              </label>
              <textarea
                id="next-steps"
                value={nextSteps}
                onChange={(event) => setNextSteps(event.target.value)}
                className="sd-textarea"
              />
              <Button type="submit">{copy.dream.saveCheckin}</Button>
            </form>

            {checkIn ? (
              <div className="sd-success-card">
                <strong>{copy.dream.checkinSaved}</strong>
                <span>{checkIn.progress}%</span>
                <p>{checkIn.nextSteps}</p>
              </div>
            ) : null}
          </Card>

          <Card>
            <div className="sd-panel-header">
              <div>
                <p className="sd-eyebrow">{copy.dream.rewardEyebrow}</p>
                <h2 className="sd-panel-title">{copy.dream.rewardTitle}</h2>
              </div>
              <Button variant="secondary" onClick={() => setShowRewardForm((value) => !value)}>
                {copy.dream.setReward}
              </Button>
            </div>

            {showRewardForm ? (
              <form onSubmit={saveReward} className="sd-form-stack">
                <label htmlFor="manual-reward" className="sd-label">
                  {copy.dream.rewardLabel}
                </label>
                <input
                  id="manual-reward"
                  value={rewardTitle}
                  onChange={(event) => setRewardTitle(event.target.value)}
                  className="sd-input"
                />
                <Button type="submit">{copy.dream.saveReward}</Button>
              </form>
            ) : null}

            <p className="sd-reward-card">{reward}</p>
          </Card>
        </section>
      </div>
    </main>
  );
}
