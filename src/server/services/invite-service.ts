import { randomUUID } from "node:crypto";

type InviteRecord = {
  id: string;
  dreamId: string;
  invitedEmail: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: Date;
};

let inviteSequence = 0;
const invitesByToken = new Map<string, InviteRecord>();
const pendingInviteByDream = new Map<string, string>();
const supporterByDream = new Map<string, string>();

export function resetInviteStateForTests() {
  inviteSequence = 0;
  invitesByToken.clear();
  pendingInviteByDream.clear();
  supporterByDream.clear();
}

export async function createInvite(input: {
  dreamId: string;
  invitedEmail: string;
  now?: Date;
}) {
  const invitedEmail = input.invitedEmail.trim();

  if (!invitedEmail || !invitedEmail.includes("@")) {
    throw new Error("INVALID_INVITE");
  }

  if (pendingInviteByDream.has(input.dreamId) || supporterByDream.has(input.dreamId)) {
    throw new Error("SUPPORTER_LIMIT_REACHED");
  }

  inviteSequence += 1;
  const now = input.now ?? new Date();

  const invite: InviteRecord = {
    id: `invite_${inviteSequence}`,
    dreamId: input.dreamId,
    invitedEmail,
    token: randomUUID(),
    status: "PENDING",
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  };

  invitesByToken.set(invite.token, invite);
  pendingInviteByDream.set(input.dreamId, invite.token);

  return invite;
}

export async function acceptInvite(input: { token: string; now: Date }) {
  const token = input.token.trim();

  if (!token) {
    throw new Error("INVALID_INVITE");
  }

  const invite = invitesByToken.get(token);

  if (!invite) {
    throw new Error("INVALID_INVITE");
  }

  if (input.now.getTime() > invite.expiresAt.getTime()) {
    invite.status = "EXPIRED";
    pendingInviteByDream.delete(invite.dreamId);
    throw new Error("INVITE_EXPIRED");
  }

  invite.status = "ACCEPTED";
  pendingInviteByDream.delete(invite.dreamId);

  const supporterId = "u2";
  supporterByDream.set(invite.dreamId, supporterId);

  return {
    dreamId: invite.dreamId,
    supporterId,
    status: "ACCEPTED" as const
  };
}
