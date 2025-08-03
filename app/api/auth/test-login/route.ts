import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function testLoginHandler() {
  if (process.env.NODE_ENV === "production") {
    throw new ApiError("Not allowed", 403);
  }
  await prisma.user.upsert({
    where: { netId: "testuser" },
    update: {},
    create: {
      netId: "testuser",
      name: "Test User",
      email: "test.user@yale.edu",
    },
  });

  const response = NextResponse.redirect(`${BASE_URL}/feed`);
  response.cookies.set(
    "user",
    JSON.stringify({
      name: "Test User",
      email: "test.user@yale.edu",
      netId: "testuser",
    }),
    { httpOnly: false, path: "/" }
  );
  return response;
}

export async function GET() {
  return testLoginHandler();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
