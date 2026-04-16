import { canSupporterSuggest } from "@/domain/permissions";
import type { PermissionMode } from "@/domain/types";

export async function createSupportSuggestion(input: {
  mode: PermissionMode;
  content: string;
}) {
  if (!canSupporterSuggest(input.mode)) {
    throw new Error("PERMISSION_DENIED");
  }

  const content = input.content.trim();

  if (!content) {
    throw new Error("INVALID_CONTENT");
  }

  if (input.mode === "SUGGEST_ONLY") {
    return {
      id: "collab_1",
      type: "SUGGESTION" as const,
      content,
      approvalStatus: "PENDING_OWNER_APPROVAL" as const,
      approvedAt: null
    };
  }

  return {
    id: "collab_1",
    type: "SUGGESTION" as const,
    content,
    approvalStatus: "APPROVED" as const,
    approvedAt: new Date()
  };
}
