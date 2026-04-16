import { describe, expect, it } from "vitest";
import { canSupporterEdit, canSupporterSuggest } from "@/domain/permissions";

describe("permissions", () => {
  it("comment-only cannot suggest or edit", () => {
    expect(canSupporterSuggest("COMMENT_ONLY")).toBe(false);
    expect(canSupporterEdit("COMMENT_ONLY")).toBe(false);
  });

  it("suggest-only can suggest but cannot edit", () => {
    expect(canSupporterSuggest("SUGGEST_ONLY")).toBe(true);
    expect(canSupporterEdit("SUGGEST_ONLY")).toBe(false);
  });

  it("full-edit can suggest and edit", () => {
    expect(canSupporterSuggest("FULL_EDIT")).toBe(true);
    expect(canSupporterEdit("FULL_EDIT")).toBe(true);
  });
});
