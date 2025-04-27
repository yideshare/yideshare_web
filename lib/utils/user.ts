import { cookies } from "next/headers";

export async function getUserNetIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const netId = cookieStore.get("netId")?.value;
  return netId || null;
} 