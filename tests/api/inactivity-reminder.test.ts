import { describe, expect, it } from "vitest";
import { buildInactivityReminder } from "@/server/jobs/inactivity-reminder";
import { createNotification } from "@/server/services/notification-service";

describe("buildInactivityReminder", () => {
  it("returns next-best-action message", () => {
    const message = buildInactivityReminder({ dreamTitle: "Mudar de emprego" });

    expect(message).toContain("próxima ação");
    expect(message).toContain("Mudar de emprego");
  });
});

describe("createNotification", () => {
  it("creates in-memory reminder notification payload", async () => {
    await expect(
      createNotification({
        userId: "u1",
        title: "Lembrete",
        body: "Qual é a próxima ação de 10 minutos?"
      })
    ).resolves.toMatchObject({
      id: expect.any(String),
      userId: "u1",
      title: "Lembrete"
    });
  });
});
