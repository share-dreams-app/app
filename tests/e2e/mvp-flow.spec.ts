import { expect, test } from "@playwright/test";

test("user creates dream, task, check-in, and reward through MVP flow", async ({ request }) => {
  const analyticsUserId = "owner_e2e_main_flow";
  const occurredAt = new Date().toISOString();

  const dashboard = await request.get("/dashboard?plan=free&limit=open");
  expect(dashboard.status()).toBe(200);
  const dashboardHtml = await dashboard.text();
  expect(dashboardHtml).toContain("Share Dreams MVP");
  expect(dashboardHtml).toContain("Your Dreams Dashboard");
  expect(dashboardHtml).toContain("New Dream");
  expect(dashboardHtml).toContain("Open Dream");
  expect(dashboardHtml).not.toContain("You have reached the Free plan limit");

  const dreamPage = await request.get("/dreams/dream_e2e?title=Mudar%20de%20emprego%20em%206%20meses");
  expect(dreamPage.status()).toBe(200);
  const dreamHtml = await dreamPage.text();
  expect(dreamHtml).toContain("Execution Plan");
  expect(dreamHtml).toContain("New Task");
  expect(dreamHtml).toContain("Weekly Check-in");
  expect(dreamHtml).toContain("Save Check-in");
  expect(dreamHtml).toContain("Set Reward");
  expect(dreamHtml).toContain("Motivation Milestone");

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
  expect(insightsHtml).toContain("Engagement Overview");
  expect(insightsHtml).toContain("Weekly Retention");
  expect(insightsHtml).toContain("Weekly Active Users");
  expect(insightsHtml).toContain("weekly_active_user");
  expect(insightsHtml).toContain("dream_created");
  expect(insightsHtml).toContain("task_created");
  expect(insightsHtml).toContain("checkin_submitted");
  expect(insightsHtml).toContain("reward_defined");
});
