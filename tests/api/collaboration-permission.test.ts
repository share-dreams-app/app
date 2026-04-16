import { describe, expect, it, vi } from "vitest";
import * as collaborationService from "@/server/services/collaboration-service";
import { createSupportSuggestion } from "@/server/services/collaboration-service";
import { POST as postCollaboration } from "@/app/api/dreams/[dreamId]/collaboration/route";

const authHeaders = {
  "x-user-id": "supporter_1",
  "x-user-email": "supporter@test.local"
};

describe("collaboration permissions", () => {
  it("blocks suggestion on comment-only mode", async () => {
    await expect(
      createSupportSuggestion({ mode: "COMMENT_ONLY", content: "Try networking" })
    ).rejects.toThrow("PERMISSION_DENIED");
  });

  it("returns pending owner approval on suggest-only mode", async () => {
    await expect(
      createSupportSuggestion({ mode: "SUGGEST_ONLY", content: "Try networking" })
    ).resolves.toMatchObject({
      type: "SUGGESTION",
      content: "Try networking",
      approvalStatus: "PENDING_OWNER_APPROVAL",
      approvedAt: null
    });
  });

  it("auto-approves on full-edit mode", async () => {
    await expect(
      createSupportSuggestion({ mode: "FULL_EDIT", content: "Try networking" })
    ).resolves.toMatchObject({
      type: "SUGGESTION",
      content: "Try networking",
      approvalStatus: "APPROVED",
      approvedAt: expect.any(Date)
    });
  });

  it("blocks empty suggestion content", async () => {
    await expect(
      createSupportSuggestion({ mode: "SUGGEST_ONLY", content: "   " })
    ).rejects.toThrow("INVALID_CONTENT");
  });
});

describe("POST /api/dreams/:dreamId/collaboration", () => {
  it("returns 401 when unauthenticated", async () => {
    const response = await postCollaboration(
      new Request("http://localhost/api/dreams/d1/collaboration", {
        method: "POST",
        body: JSON.stringify({ mode: "SUGGEST_ONLY", content: "Draft CV update" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns 201 when mode allows suggestions", async () => {
    const response = await postCollaboration(
      new Request("http://localhost/api/dreams/d1/collaboration", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mode: "SUGGEST_ONLY", content: "Draft CV update" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      dreamId: "d1",
      content: "Draft CV update",
      approvalStatus: "PENDING_OWNER_APPROVAL",
      approvedAt: null
    });
  });

  it("returns 403 when mode denies suggestions", async () => {
    const response = await postCollaboration(
      new Request("http://localhost/api/dreams/d1/collaboration", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mode: "COMMENT_ONLY", content: "Draft CV update" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "PERMISSION_DENIED" });
  });

  it("returns 400 for invalid collaboration payload", async () => {
    const response = await postCollaboration(
      new Request("http://localhost/api/dreams/d1/collaboration", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mode: "SUGGEST_ONLY", content: "   " })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_COLLABORATION" });
  });

  it("returns 500 for unexpected service failures", async () => {
    const spy = vi
      .spyOn(collaborationService, "createSupportSuggestion")
      .mockRejectedValueOnce(new Error("UNEXPECTED_FAILURE"));

    const response = await postCollaboration(
      new Request("http://localhost/api/dreams/d1/collaboration", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mode: "SUGGEST_ONLY", content: "Draft CV update" })
      }),
      { params: Promise.resolve({ dreamId: "d1" }) }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "INTERNAL_SERVER_ERROR" });

    spy.mockRestore();
  });
});
