import type { PlanTier } from "@/domain/types";

export type AuthSession = {
  user?: {
    id?: string | null;
    email?: string | null;
    tier?: PlanTier;
  };
} | null;

type AuthResolver = (() => Promise<AuthSession> | AuthSession) | null;

let authResolver: AuthResolver = null;

export function __setAuthResolverForTests(resolver: AuthResolver) {
  authResolver = resolver;
}

export async function auth(): Promise<AuthSession> {
  if (!authResolver) {
    return null;
  }

  return await authResolver();
}

export const handlers = {};

export async function signIn() {
  return null;
}

export async function signOut() {
  return null;
}
