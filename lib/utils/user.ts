import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
    console.log("DB USER Alert: User already exists in the database:", user);
    // otherwise
  } else {
    user = await prisma.user.create({
      data: { netId, name: `${firstName} ${lastName}`, email },
    });
    console.log("DB USER Alert: New user added to the database:", user);
  }
  return user;
}

export function getUserFromCookies(cookieStore: any) {
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

export async function getUserNetIdFromCookies() {
  // retrieve cookies
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user");
  // check that cookies exist
  if (!userCookie) return null;
  return JSON.parse(userCookie.value).netId;
}
