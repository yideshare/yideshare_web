import { prisma } from "@/lib/prisma";

export async function findOrCreateUser(
  netID: string,
  firstName: string,
  lastName: string
) {
  // try to find user
  let user = await prisma.user.findUnique({ where: { netId: netID } });

  // if user found
  if (user) {
    console.log("DB USER Alert: User already exists in the database:", user);
  // otherwise
  } else {
    user = await prisma.user.create({
      data: { netId: netID, name: `${firstName} ${lastName}` },
    });
    console.log("DB USER Alert: New user added to the database:", user);
  }

  return user;
}

export async function getAuthenticatedUser(cookieStore: any) {
  // retrieve cookies
  const userCookie = cookieStore.get("user");

  // if no user cookie
  if (!userCookie) {
    return { error: "Cookie Error: User not authenticated", status: 401 };
  }

  try {
    // parse user data into an object
    const parsedUser = JSON.parse(userCookie.value);
    return { user: parsedUser };
  } catch {
    return { error: "Cookie Error: Invalid cookie format", status: 400 };
  }
}