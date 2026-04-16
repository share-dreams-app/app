import { expect, test } from "@playwright/test";

test("free user sees upgrade prompt at the active dream limit", async ({ request }) => {
  const dashboard = await request.get("/dashboard?plan=free&limit=reached");
  expect(dashboard.status()).toBe(200);
  const html = await dashboard.text();

  expect(html).toContain("Você atingiu o limite do plano Free");
  expect(html).toContain("Fazer upgrade para Premium");
});

test("free user below the limit does not see the upgrade prompt", async ({ request }) => {
  const dashboard = await request.get("/dashboard?plan=free&limit=open");
  expect(dashboard.status()).toBe(200);
  const html = await dashboard.text();

  expect(html).not.toContain("Você atingiu o limite do plano Free");
});

test("premium user sees unlocked insights without the free plan prompt", async ({ request }) => {
  const insights = await request.get("/insights?plan=premium");
  expect(insights.status()).toBe(200);
  const html = await insights.text();

  expect(html).toContain("Resumo de engajamento");
  expect(html).toContain("Premium ativo");
  expect(html).not.toContain("Você atingiu o limite do plano Free");
});
