import { beforeEach, describe, expect, it } from "vitest";
import {
  createDream,
  resetDreamServiceStateForTests,
  setActiveDreamCountForTests
} from "@/server/services/dream-service";
import { POST as postDream } from "@/app/api/dreams/route";

const authHeaders = {
  "x-user-id": "owner_1",
  "x-user-email": "owner@test.local"
};

describe("createDream", () => {
  beforeEach(() => {
    resetDreamServiceStateForTests();
  });

  it("throws limit error on fourth active dream for free users", async () => {
    await expect(
      createDream({
        userId: "u1",
        tier: "FREE",
        title: "Dream 4",
        activeDreamCount: 3
      })
    ).rejects.toThrow("FREE_DREAM_LIMIT_REACHED");
  });

  it("creates dream when user is below free limit", async () => {
    await expect(
      createDream({
        userId: "u1",
        tier: "FREE",
        title: "Dream 3",
        activeDreamCount: 2
      })
    ).resolves.toMatchObject({ title: "Dream 3", ownerId: "u1" });
  });
});

describe("POST /api/dreams", () => {
  beforeEach(() => {
    resetDreamServiceStateForTests();
  });

  it("returns 401 when request is unauthenticated", async () => {
    const response = await postDream(
      new Request("http://localhost/api/dreams", {
        method: "POST",
        body: JSON.stringify({
          tier: "FREE",
          title: "Dream OK",
          activeDreamCount: 1
        })
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 201 for valid creation", async () => {
    const response = await postDream(
      new Request("http://localhost/api/dreams", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          tier: "FREE",
          title: "Dream OK",
          activeDreamCount: 1
        })
      })
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      title: "Dream OK",
      ownerId: "owner_1"
    });
  });

  it("returns 403 when free limit is reached", async () => {
    setActiveDreamCountForTests("owner_1", 3);

    const response = await postDream(
      new Request("http://localhost/api/dreams", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: "Dream blocked"
        })
      })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "FREE_DREAM_LIMIT_REACHED" });
  });

  it("ignores client tier tampering and still enforces server-side FREE tier", async () => {
    setActiveDreamCountForTests("owner_1", 3);

    const response = await postDream(
      new Request("http://localhost/api/dreams", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          tier: "PREMIUM",
          title: "Tampered Dream"
        })
      })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "FREE_DREAM_LIMIT_REACHED" });
  });

  it("returns 400 for malformed payload", async () => {
    const response = await postDream(
      new Request("http://localhost/api/dreams", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_DREAM" });
  });
});
