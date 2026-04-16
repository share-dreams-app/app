import { beforeEach, describe, expect, it, vi } from "vitest";
import * as aiSuggestionService from "@/server/services/ai-suggestion-service";
import {
  getRelationshipProfileForTests,
  resetRelationshipProfileServiceStateForTests,
  saveRelationshipProfile
} from "@/server/services/profile-service";
import * as profileService from "@/server/services/profile-service";
import * as suggestionOrchestrator from "@/server/services/suggestion-orchestrator";
import { suggestTaskRecommendations } from "@/server/services/suggestion-orchestrator";
import { POST as postRelationship } from "@/app/api/profile/relationship/route";
import { POST as postTaskSuggestions } from "@/app/api/dreams/[dreamId]/suggestions/tasks/route";

const authHeaders = {
  "x-user-id": "owner_1",
  "x-user-email": "owner@test.local"
};

function expectItemsWithTitles(items: Array<{ title?: string }>) {
  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBeGreaterThan(0);

  for (const item of items) {
    expect(typeof item.title).toBe("string");
    expect(item.title?.trim()).not.toBe("");
  }
}

describe("profile service", () => {
  beforeEach(() => {
    resetRelationshipProfileServiceStateForTests();
  });

  it("stores trimmed profile data and exposes it for tests", async () => {
    const saved = await saveRelationshipProfile({
      userId: "user_1",
      relationType: "  COUPLE  ",
      yearsKnown: 8,
      ageRange: " 25-34 ",
      objectiveContext: "  plan a move together  "
    });

    expect(saved).toEqual({
      userId: "user_1",
      relationType: "COUPLE",
      yearsKnown: 8,
      ageRange: "25-34",
      objectiveContext: "plan a move together"
    });
    expect(getRelationshipProfileForTests("user_1")).toEqual(saved);
  });

  it("resets stored profiles for test isolation", async () => {
    await saveRelationshipProfile({
      userId: "user_1",
      relationType: "COUPLE",
      yearsKnown: 8
    });

    expect(getRelationshipProfileForTests("user_1")).toBeDefined();

    resetRelationshipProfileServiceStateForTests();

    expect(getRelationshipProfileForTests("user_1")).toBeUndefined();
  });

  it("rejects invalid trimmed relationship profiles", async () => {
    await expect(
      saveRelationshipProfile({
        userId: "user_1",
        relationType: "   ",
        yearsKnown: 0
      })
    ).rejects.toThrow("INVALID_RELATIONSHIP_PROFILE");
  });
});

describe("suggestTaskRecommendations", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to template suggestions when AI fails", async () => {
    vi.spyOn(aiSuggestionService, "getAiTaskSuggestions").mockRejectedValueOnce(
      new Error("AI down")
    );

    const result = await suggestTaskRecommendations({
      dreamTitle: "Mudar de emprego",
      relationshipProfile: {
        relationType: "COUPLE",
        yearsKnown: 5
      }
    });

    expect(result.source).toBe("TEMPLATE");
    expectItemsWithTitles(result.items);
  });
});

describe("POST /api/profile/relationship", () => {
  beforeEach(() => {
    resetRelationshipProfileServiceStateForTests();
    vi.restoreAllMocks();
  });

  it("returns 401 for unauthenticated requests", async () => {
    const response = await postRelationship(
      new Request("http://localhost/api/profile/relationship", {
        method: "POST",
        body: JSON.stringify({
          relationType: "COUPLE",
          yearsKnown: 8
        })
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 200 with the saved profile", async () => {
    const response = await postRelationship(
      new Request("http://localhost/api/profile/relationship", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          relationType: "  COUPLE  ",
          yearsKnown: 8,
          ageRange: " 25-34 ",
          objectiveContext: "  plan a move together  "
        })
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      userId: "owner_1",
      relationType: "COUPLE",
      yearsKnown: 8,
      ageRange: "25-34",
      objectiveContext: "plan a move together"
    });
  });

  it("returns 422 for JSON null profile payload", async () => {
    const response = await postRelationship(
      new Request("http://localhost/api/profile/relationship", {
        method: "POST",
        headers: authHeaders,
        body: "null"
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_RELATIONSHIP_PROFILE"
    });
  });

  it("returns 422 for malformed JSON profile payload", async () => {
    const response = await postRelationship(
      new Request("http://localhost/api/profile/relationship", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_RELATIONSHIP_PROFILE"
    });
  });

  it("returns 422 for invalid profile payload", async () => {
    const response = await postRelationship(
      new Request("http://localhost/api/profile/relationship", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          relationType: "   ",
          yearsKnown: 0
        })
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_RELATIONSHIP_PROFILE"
    });
  });

  it("returns 500 for unexpected profile service failures", async () => {
    vi.spyOn(profileService, "saveRelationshipProfile").mockRejectedValueOnce(
      new Error("boom")
    );

    const response = await postRelationship(
      new Request("http://localhost/api/profile/relationship", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          relationType: "COUPLE",
          yearsKnown: 8
        })
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "INTERNAL_SERVER_ERROR"
    });
  });
});

describe("POST /api/dreams/:dreamId/suggestions/tasks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 401 for unauthenticated requests", async () => {
    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        body: JSON.stringify({
          dreamTitle: "Mudar de emprego",
          relationshipProfile: {
            relationType: "COUPLE",
            yearsKnown: 5
          }
        })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 422 for blank dreamId", async () => {
    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams//suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          dreamTitle: "Mudar de emprego",
          relationshipProfile: {
            relationType: "COUPLE",
            yearsKnown: 5
          }
        })
      }),
      { params: { dreamId: "   " } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_SUGGESTION_REQUEST"
    });
  });

  it("returns 422 for JSON null suggestion payload", async () => {
    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: "null"
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_SUGGESTION_REQUEST"
    });
  });

  it("returns 422 for malformed JSON suggestion payload", async () => {
    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_SUGGESTION_REQUEST"
    });
  });

  it("returns 200 with AI suggestions when available", async () => {
    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          dreamTitle: "Mudar de emprego",
          relationshipProfile: {
            relationType: "COUPLE",
            yearsKnown: 5
          }
        })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.source).toBe("AI");
    expectItemsWithTitles(body.items);
  });

  it("returns 200 with template suggestions when AI fails", async () => {
    vi.spyOn(aiSuggestionService, "getAiTaskSuggestions").mockRejectedValueOnce(
      new Error("AI down")
    );

    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          dreamTitle: "Mudar de emprego",
          relationshipProfile: {
            relationType: "COUPLE",
            yearsKnown: 5
          }
        })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.source).toBe("TEMPLATE");
    expectItemsWithTitles(body.items);
  });

  it("returns 422 for invalid suggestion payload", async () => {
    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          dreamTitle: "   ",
          relationshipProfile: {
            relationType: "COUPLE",
            yearsKnown: 5
          }
        })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "INVALID_SUGGESTION_REQUEST"
    });
  });

  it("returns 500 for unexpected suggestion orchestrator failures", async () => {
    vi.spyOn(suggestionOrchestrator, "suggestTaskRecommendations").mockRejectedValueOnce(
      new Error("boom")
    );

    const response = await postTaskSuggestions(
      new Request("http://localhost/api/dreams/d1/suggestions/tasks", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          dreamTitle: "Mudar de emprego",
          relationshipProfile: {
            relationType: "COUPLE",
            yearsKnown: 5
          }
        })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "INTERNAL_SERVER_ERROR"
    });
  });
});
