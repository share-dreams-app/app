import { expect, test } from "@playwright/test";

test("user creates dream, task, check-in, and reward through MVP flow", async ({ request }) => {
  const analyticsUserId = "owner_e2e_main_flow";
  const occurredAt = new Date().toISOString();

  const dashboard = await request.get("/dashboard?plan=free&limit=open");
  expect(dashboard.status()).toBe(200);
  const dashboardHtml = await dashboard.text();
  expect(dashboardHtml).toContain("Share Dreams MVP");
  expect(dashboardHtml).toContain("Seu painel de sonhos");
  expect(dashboardHtml).toContain("Novo sonho");
  expect(dashboardHtml).toContain("Abrir sonho");
  expect(dashboardHtml).not.toContain("Você atingiu o limite do plano Free");

  const dreamPage = await request.get("/dreams/dream_e2e?title=Mudar%20de%20emprego%20em%206%20meses");
  expect(dreamPage.status()).toBe(200);
  const dreamHtml = await dreamPage.text();
  expect(dreamHtml).toContain("Plano de execução");
  expect(dreamHtml).toContain("Nova tarefa");
  expect(dreamHtml).toContain("Check-in semanal");
  expect(dreamHtml).toContain("Registrar check-in");
  expect(dreamHtml).toContain("Definir recompensa");
  expect(dreamHtml).toContain("Marco de motivação");

  const eventPayloads = [
    {
      userId: analyticsUserId,
      type: "weekly_active_user",
      occurredAt,
      payload: { source: "dashboard" }
    },
    { userId: analyticsUserId, type: "dream_created", occurredAt, payload: { source: "dashboard" } },
    { userId: analyticsUserId, type: "task_created", occurredAt, payload: { source: "dream_detail" } },
    {
      userId: analyticsUserId,
      type: "checkin_submitted",
      occurredAt,
      payload: { source: "dream_detail" }
    },
    { userId: analyticsUserId, type: "reward_defined", occurredAt, payload: { source: "dream_detail" } }
  ];

  for (const event of eventPayloads) {
    const response = await request.post("/api/analytics/events", {
      data: event
    });

    expect(response.status()).toBe(201);
  }

  const insightsPage = await request.get(
    `/insights?plan=premium&userId=${encodeURIComponent(analyticsUserId)}`
  );
  expect(insightsPage.status()).toBe(200);
  const insightsHtml = await insightsPage.text();
  expect(insightsHtml).toContain("Resumo de engajamento");
  expect(insightsHtml).toContain("Retenção semanal");
  expect(insightsHtml).toContain("Usuários ativos semanais");
  expect(insightsHtml).toContain("weekly_active_user");
  expect(insightsHtml).toContain("dream_created");
  expect(insightsHtml).toContain("task_created");
  expect(insightsHtml).toContain("checkin_submitted");
  expect(insightsHtml).toContain("reward_defined");
});
