import { describe, expect, it } from "vitest";
import { createDreamRepository } from "@/server/repositories/dream-repository";

describe("dream repository", () => {
  it("counts active dreams and enforces one supporter per dream", async () => {
    const repo = createDreamRepository();
    const ownerId = `user_owner_${Date.now()}`;

    await repo.createDream({ ownerId, title: "Novo emprego" });

    await expect(repo.countActiveDreams(ownerId)).resolves.toBe(1);
  });
});
