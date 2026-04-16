import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  email: string;
};

export async function requireUser(request?: Request): Promise<SessionUser> {
  const headerUserId = request?.headers.get("x-user-id");
  const headerUserEmail = request?.headers.get("x-user-email");

  if (process.env.NODE_ENV === "test" && headerUserId && headerUserEmail) {
    return {
      id: headerUserId,
      email: headerUserEmail
    };
  }

  const session = await auth();
  const id = session?.user?.id;
  const email = session?.user?.email;

  if (!id || !email) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id,
    email
  };
}
