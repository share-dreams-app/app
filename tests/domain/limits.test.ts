import { describe, expect, it } from "vitest";
import { canCreateActiveDream, canCreateActiveTask } from "@/domain/limits";

describe("limits", () => {
  it("blocks creating fourth active dream on free", () => {
    expect(canCreateActiveDream("FREE", 3)).toBe(false);
  });

  it("allows creating a free dream below the limit", () => {
    expect(canCreateActiveDream("FREE", 2)).toBe(true);
  });

  it("allows creating tasks below free limit", () => {
    expect(canCreateActiveTask("FREE", 4)).toBe(true);
  });

  it("blocks creating a fifth active task on free", () => {
    expect(canCreateActiveTask("FREE", 5)).toBe(false);
  });

  it("allows premium to create dreams and tasks regardless of count", () => {
    expect(canCreateActiveDream("PREMIUM", 999)).toBe(true);
    expect(canCreateActiveTask("PREMIUM", 999)).toBe(true);
  });
});
