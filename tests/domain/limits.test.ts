import { describe, expect, it } from "vitest";
import { canCreateActiveDream, canCreateActiveTask } from "@/domain/limits";

describe("limits", () => {
  it("blocks creating fourth active dream on free", () => {
    expect(canCreateActiveDream("FREE", 3)).toBe(false);
  });

  it("allows creating tasks below free limit", () => {
    expect(canCreateActiveTask("FREE", 4)).toBe(true);
  });
});
