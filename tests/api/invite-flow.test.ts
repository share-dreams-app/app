import { beforeEach, describe, expect, it } from "vitest";
import {
  acceptInvite,
  createInvite,
  resetInviteStateForTests
} from "@/server/services/invite-service";
import { POST as postInvite } from "@/app/api/dreams/[dreamId]/invite/route";
import { POST as postInviteAccept } from "@/app/api/invites/[token]/accept/route";

const authHeaders = {
  "x-user-id": "owner_1",
  "x-user-email": "owner@test.local"
};

describe("invite flow", () => {
  beforeEach(() => {
    resetInviteStateForTests();
  });

  it("fails when invite is expired", async () => {
    const invite = await createInvite({
      dreamId: "d1",
      invitedEmail: "friend@test.local",
      now: new Date("2026-04-01")
    });

    await expect(
      acceptInvite({ token: invite.token, now: new Date("2026-04-15") })
    ).rejects.toThrow("INVITE_EXPIRED");
  });

  it("accepts valid invite token", async () => {
    const invite = await createInvite({
      dreamId: "d1",
      invitedEmail: "friend@test.local",
      now: new Date("2026-04-15")
    });

    await expect(
      acceptInvite({ token: invite.token, now: new Date("2026-04-15") })
    ).resolves.toMatchObject({ status: "ACCEPTED", dreamId: "d1" });
  });

  it("fails when invite token is blank", async () => {
    await expect(acceptInvite({ token: " ", now: new Date("2026-04-15") })).rejects.toThrow(
      "INVALID_INVITE"
    );
  });

  it("fails when invite token is unknown", async () => {
    await expect(
      acceptInvite({ token: "invite_token_unknown", now: new Date("2026-04-15") })
    ).rejects.toThrow("INVALID_INVITE");
  });

  it("fails when invite has expired by date", async () => {
    const invite = await createInvite({
      dreamId: "d1",
      invitedEmail: "friend@test.local",
      now: new Date("2026-04-01")
    });

    await expect(
      acceptInvite({ token: invite.token, now: new Date("2026-04-15") })
    ).rejects.toThrow("INVITE_EXPIRED");
  });

  it("enforces one-supporter-per-dream cap", async () => {
    await createInvite({ dreamId: "d1", invitedEmail: "first@test.local" });

    await expect(
      createInvite({ dreamId: "d1", invitedEmail: "second@test.local" })
    ).rejects.toThrow("SUPPORTER_LIMIT_REACHED");
  });

  it("blocks accepting invite after supporter already accepted for dream", async () => {
    const firstInvite = await createInvite({ dreamId: "d1", invitedEmail: "first@test.local" });
    await acceptInvite({ token: firstInvite.token, now: new Date("2026-04-15") });

    await expect(
      createInvite({ dreamId: "d1", invitedEmail: "second@test.local" })
    ).rejects.toThrow("SUPPORTER_LIMIT_REACHED");
  });
});

describe("invite routes", () => {
  beforeEach(() => {
    resetInviteStateForTests();
  });

  it("returns 401 when owner endpoint is unauthenticated", async () => {
    const response = await postInvite(
      new Request("http://localhost/api/dreams/d1/invite", {
        method: "POST",
        body: JSON.stringify({ invitedEmail: "friend@test.local" })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("creates invite token", async () => {
    const response = await postInvite(
      new Request("http://localhost/api/dreams/d1/invite", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ invitedEmail: "friend@test.local" })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      dreamId: "d1",
      invitedEmail: "friend@test.local",
      token: expect.any(String)
    });
  });

  it("returns 409 when dream already has pending/accepted supporter", async () => {
    await createInvite({ dreamId: "d1", invitedEmail: "first@test.local" });

    const response = await postInvite(
      new Request("http://localhost/api/dreams/d1/invite", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ invitedEmail: "second@test.local" })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: "SUPPORTER_LIMIT_REACHED" });
  });

  it("returns 410 when invite token is expired", async () => {
    const invite = await createInvite({
      dreamId: "d1",
      invitedEmail: "friend@test.local",
      now: new Date("2026-04-01")
    });

    const response = await postInviteAccept(
      new Request(`http://localhost/api/invites/${invite.token}/accept`, {
        method: "POST"
      }),
      { params: { token: invite.token } }
    );

    expect(response.status).toBe(410);
    await expect(response.json()).resolves.toEqual({ error: "INVITE_EXPIRED" });
  });

  it("returns 400 for invalid invite payload", async () => {
    const response = await postInvite(
      new Request("http://localhost/api/dreams/d1/invite", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ invitedEmail: "invalid-email" })
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_INVITE" });
  });

  it("returns 400 for malformed invite payload", async () => {
    const response = await postInvite(
      new Request("http://localhost/api/dreams/d1/invite", {
        method: "POST",
        headers: authHeaders,
        body: "{bad json"
      }),
      { params: { dreamId: "d1" } }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_INVITE" });
  });

  it("returns 400 when invite token is blank", async () => {
    const response = await postInviteAccept(
      new Request("http://localhost/api/invites/ /accept", {
        method: "POST"
      }),
      { params: { token: " " } }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "INVALID_INVITE" });
  });
});
