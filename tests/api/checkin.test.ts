import { describe, expect, it } from "vitest";
import { submitCheckin } from "@/server/services/checkin-service";
import { POST as postCheckin } from "@/app/api/dreams/[dreamId]/checkins/route";

const authHeaders = {
  "x-user-id": "owner_1",
  "x-user-email": "owner@test.local"
};

describe("submitCheckin", () => {
  it("requires progress and next steps", async () => {
    await expect(
      submitCheckin({ dreamId: "d1", progress: 0, nextSteps: "" })
    ).rejects.toThrow("INVALID_CHECKIN");
  });

  it("accepts valid check-in payload", async () => {
    await expect(
      submitCheckin({ dreamId: "d1", progress: 40, nextSteps: "Apply to 2 roles" })
    ).resolves.toMatchObject({ dreamId: "d1", progress: 40, nextSteps: "Apply to 2 roles" });
  });
});

describe("POST /api/dreams/:dreamId/checkins", () => {
  it("returns 401 for unauthenticated requests", async () => {
    const response = await postCheckin(
      new Request("http://localhost/api/dreams/d1/checkins", {
        method: "POST",
        body: JSON.stringify({ progress: 50, nextSteps: "Prepare portfolio" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 201 for valid check-in payload", async () => {
    const response = await postCheckin(
      new Request("http://localhost/api/dreams/d1/checkins", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ progress: 50, nextSteps: "Prepare portfolio" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      dreamId: "d1",
      progress: 50,
      nextSteps: "Prepare portfolio"
    });
  });

  it("returns 422 for invalid check-in payload", async () => {
    const response = await postCheckin(
      new Request("http://localhost/api/dreams/d1/checkins", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ progress: 0, nextSteps: "   " })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_CHECKIN" });
  });

  it("returns 422 for non-numeric progress", async () => {
    const response = await postCheckin(
      new Request("http://localhost/api/dreams/d1/checkins", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ progress: "abc", nextSteps: "Review board" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_CHECKIN" });
  });

  it("returns 422 for malformed payload", async () => {
    const response = await postCheckin(
      new Request("http://localhost/api/dreams/d1/checkins", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_CHECKIN" });
  });
});
