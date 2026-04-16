import { beforeEach, describe, expect, it } from "vitest";
import {
  __setAuthResolverForTests,
  auth,
  handlers,
  signIn,
  signOut
} from "@/auth";
import {
  getUserTier,
  resetUserTierOverridesForTests,
  setUserTierForTests
} from "@/server/services/subscription-service";
import { GET } from "@/app/api/me/route";

describe("GET /api/me", () => {
  beforeEach(() => {
    __setAuthResolverForTests(null);
    resetUserTierOverridesForTests();
  });

  it("returns 401 for unauthenticated requests", async () => {
    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "UNAUTHORIZED" });
  });

  it("returns session user and current tier for authenticated requests", async () => {
    __setAuthResolverForTests(() => ({
      user: {
        id: "u_1",
        email: "u1@test.local"
      }
    }));

    setUserTierForTests("u_1", "PREMIUM");

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      user: { id: "u_1", email: "u1@test.local" },
      tier: "PREMIUM"
    });
  });
});

describe("auth module", () => {
  it("returns null auth session when no resolver is configured", async () => {
    __setAuthResolverForTests(null);

    await expect(auth()).resolves.toBeNull();
  });

  it("exposes no-op auth wiring helpers", async () => {
    expect(handlers).toEqual({});
    await expect(signIn()).resolves.toBeNull();
    await expect(signOut()).resolves.toBeNull();
  });
});

describe("subscription service", () => {
  beforeEach(() => {
    resetUserTierOverridesForTests();
  });

  it("returns FREE by default", async () => {
    await expect(getUserTier("unknown-user")).resolves.toBe("FREE");
  });

  it("returns overridden tier for known user", async () => {
    setUserTierForTests("u-2", "PREMIUM");

    await expect(getUserTier("u-2")).resolves.toBe("PREMIUM");
  });
});
