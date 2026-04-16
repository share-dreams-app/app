import type { PermissionMode } from "@/domain/types";

export function canSupporterSuggest(mode: PermissionMode) {
  return mode === "SUGGEST_ONLY" || mode === "FULL_EDIT";
}

export function canSupporterEdit(mode: PermissionMode) {
  return mode === "FULL_EDIT";
}
