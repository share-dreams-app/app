import { describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { createDreamRepository } from "@/server/repositories/dream-repository";

describe("dream repository", () => {
  it("creates a dream and counts active dreams for the owner", async () => {
    const repo = createDreamRepository();
    const owner = await db.user.create({
      data: {
        email: `owner_${Date.now()}@test.local`
      }
    });

    await repo.createDream({ ownerId: owner.id, title: "Novo emprego" });

    await expect(repo.countActiveDreams(owner.id)).resolves.toBe(1);
  });
});
