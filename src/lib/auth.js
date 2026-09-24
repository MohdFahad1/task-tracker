import { auth } from "@clerk/nextjs/server";

export async function getCurrentUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}