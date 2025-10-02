import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { jwtVerify } from "jose";
import logger from "@/lib/logger";

export async function findOrCreateUser(
  netId: string,
  firstName: string,
  lastName: string,
  email: string
) {
  // try to find user
  let user = await prisma.user.findUnique({ where: { netId } });

  // if user found
  if (user) {
    logger.info("DB USER: User found in the database:", user);
    // otherwise
  } else {
    user = await prisma.user.create({
      data: { netId, name: `${firstName} ${lastName}`, email },
    });
    logger.info("DB USER: New user added to the database:", user);
  }
  return user;
}

export function getUserFromCookies(cookieStore: ReadonlyRequestCookies) {
  // retrieve cookies
  const userCookie = cookieStore.get("user");

  // if no user cookie
  if (!userCookie) {
    return {
      error: "Cannot fetch cookies, user not authenticated",
      status: 401,
    };
  }

  try {
    // parse user data into an object
    const parsedUser = JSON.parse(userCookie.value);
    return { user: parsedUser };
  } catch {
    return { error: "Invalid cookie format", status: 400 };
  }
}

// chat helped here, check
export async function getUserNetIdFromCookies() {

  // retrieve cookies
  const cookieStore = await cookies();
  // parse value
  const token = cookieStore.get("auth")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return (payload as any).netId ?? null;
  } catch {
    return null;
  }
}
