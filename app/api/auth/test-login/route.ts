import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not allowed", { status: 403 }); //TODO: replace with error handler (wait on Nikita to answer my PR :| )
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
