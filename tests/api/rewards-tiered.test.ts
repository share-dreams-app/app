import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/dreams/[dreamId]/rewards/route";
import * as rewardOrchestrator from "@/server/services/reward-orchestrator";
import {
  getAiRewardSuggestions,
  rewardServiceDeps,
  suggestReward
} from "@/server/services/reward-orchestrator";
import { getTemplateRewards } from "@/server/services/reward-template-service";

const authHeaders = {
  "x-user-id": "owner_1",
  "x-user-email": "owner@test.local"
};

function expectRewardItems(items: Array<{ title?: string }>, expectedTitlePart: string) {
  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBeGreaterThan(0);
  expect(typeof items[0].title).toBe("string");
  expect(items[0].title).toContain(expectedTitlePart);
}

describe("reward-template-service", () => {
  it("throws INVALID_REWARD for a blank dream title", () => {
    expect(() => getTemplateRewards("   ")).toThrow("INVALID_REWARD");
  });
});

describe("suggestReward", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns template reward items for free users", async () => {
    const result = await suggestReward({
      tier: "FREE",
      dreamTitle: "Mudar de emprego"
    });

    expect(result.source).toBe("TEMPLATE");
    expectRewardItems(result.items, "Mudar de emprego");
  });

  it("returns AI reward items for premium users when AI succeeds", async () => {
    const result = await suggestReward({
      tier: "PREMIUM",
      dreamTitle: "Mudar de emprego",
      profile: {
        relationType: "COUPLE",
        yearsKnown: 8
      }
    });

    expect(result.source).toBe("AI");
    expectRewardItems(result.items, "Mudar de emprego");
    expect(result.items[0].title).toContain("COUPLE");
  });

  it("falls back to template reward items when AI rejects with a runtime failure", async () => {
    vi.spyOn(rewardServiceDeps, "getAiRewardSuggestions").mockRejectedValueOnce(
      new Error("AI down")
    );

    const result = await suggestReward({
      tier: "PREMIUM",
      dreamTitle: "Mudar de emprego",
      profile: {
        relationType: "COUPLE",
        yearsKnown: 8
      }
    });

    expect(result.source).toBe("TEMPLATE");
    expectRewardItems(result.items, "Mudar de emprego");
  });

  it("throws INVALID_REWARD for a blank dream title", async () => {
    await expect(
      suggestReward({
        tier: "FREE",
        dreamTitle: "   "
      })
    ).rejects.toThrow("INVALID_REWARD");
  });

  it("throws INVALID_REWARD for an invalid premium profile", async () => {
    await expect(
      suggestReward({
        tier: "PREMIUM",
        dreamTitle: "Mudar de emprego",
        profile: {
          relationType: "   ",
          yearsKnown: 8
        }
      })
    ).rejects.toThrow("INVALID_REWARD");
  });

  it("rethrows INVALID_REWARD when the AI dependency reports invalid input", async () => {
    vi.spyOn(rewardServiceDeps, "getAiRewardSuggestions").mockRejectedValueOnce(
      new Error("INVALID_REWARD")
    );

    await expect(
      suggestReward({
        tier: "PREMIUM",
        dreamTitle: "Mudar de emprego",
        profile: {
          relationType: "COUPLE",
          yearsKnown: 8
        }
      })
    ).rejects.toThrow("INVALID_REWARD");
  });
});

describe("getAiRewardSuggestions", () => {
  it("throws INVALID_REWARD for a blank dream title", async () => {
    await expect(
      getAiRewardSuggestions({
        tier: "PREMIUM",
        dreamTitle: "   "
      })
    ).rejects.toThrow("INVALID_REWARD");
  });

  it("throws INVALID_REWARD for an invalid premium profile", async () => {
    await expect(
      getAiRewardSuggestions({
        tier: "PREMIUM",
        dreamTitle: "Mudar de emprego",
        profile: {
          relationType: "   ",
          yearsKnown: 8
        }
      })
    ).rejects.toThrow("INVALID_REWARD");
  });

  it("returns a generic AI suggestion when no profile is provided", async () => {
    const result = await getAiRewardSuggestions({
      tier: "PREMIUM",
      dreamTitle: "Mudar de emprego"
    });

    expectRewardItems(result, "Mudar de emprego");
    expect(result[0].title).toContain("thoughtful celebration");
  });
});

describe("POST /api/dreams/:dreamId/rewards", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 401 for unauthenticated requests", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        body: JSON.stringify({
          mode: "MANUAL",
          title: "Spa night"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 201 with a trimmed manual reward payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "MANUAL",
          title: "  Spa night  "
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      dreamId: "dream_1",
      source: "MANUAL",
      title: "Spa night"
    });
  });

  it("returns 201 with template suggestions for free users", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "FREE",
          dreamTitle: "Mudar de emprego"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      dreamId: "dream_1",
      source: "TEMPLATE",
      items: [
        {
          title: "Celebrate Mudar de emprego with a simple at-home reward"
        },
        {
          title: "Plan a thoughtful surprise tied to Mudar de emprego"
        }
      ]
    });
  });

  it("returns 201 with AI suggestions for premium users", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "PREMIUM",
          dreamTitle: "Mudar de emprego",
          profile: {
            relationType: "COUPLE",
            yearsKnown: 8
          }
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      dreamId: "dream_1",
      source: "AI",
      items: [
        {
          title: "Personalize a reward for Mudar de emprego with your COUPLE relationship"
        },
        {
          title: "Choose a celebration that fits 8 years together"
        }
      ]
    });
  });

  it("returns 422 for blank dreamId", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams//rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "MANUAL",
          title: "Spa night"
        })
      }),
      { params: { dreamId: "   " } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for unknown mode", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "OTHER",
          title: "Spa night"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for invalid reward payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "MANUAL",
          title: "   "
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for manual mode with non-string title", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "MANUAL",
          title: 123
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for suggest mode with invalid tier", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "BASIC",
          dreamTitle: "Mudar de emprego"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for suggest mode with non-string dreamTitle", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "FREE",
          dreamTitle: 123
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for premium suggestions with blank relationType", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "PREMIUM",
          dreamTitle: "Mudar de emprego",
          profile: {
            relationType: "   ",
            yearsKnown: 8
          }
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 422 for premium suggestions with malformed profile", async () => {
    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "PREMIUM",
          dreamTitle: "Mudar de emprego",
          profile: "invalid"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_REWARD" });
  });

  it("returns 500 for unexpected runtime errors in manual creation", async () => {
    vi.spyOn(rewardOrchestrator, "createManualReward").mockImplementationOnce(() => {
      throw new Error("boom");
    });

    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "MANUAL",
          title: "Spa night"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "INTERNAL_SERVER_ERROR"
    });
  });

  it("returns 500 for unexpected runtime errors in suggestion creation", async () => {
    vi.spyOn(rewardOrchestrator, "suggestReward").mockRejectedValueOnce(
      new Error("boom")
    );

    const response = await POST(
      new Request("http://localhost/api/dreams/dream_1/rewards", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mode: "SUGGEST",
          tier: "FREE",
          dreamTitle: "Mudar de emprego"
        })
      }),
      { params: { dreamId: "dream_1" } }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "INTERNAL_SERVER_ERROR"
    });
  });
});
