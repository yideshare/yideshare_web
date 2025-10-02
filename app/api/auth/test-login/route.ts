import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createJWT } from "@/lib/validate";

async function testLoginHandler(req: Request) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not allowed", { status: 403 });
  }
  // Require explicit enable flag
  if (process.env.DEV_TEST_LOGIN_ENABLED !== "true") {
    return new NextResponse("Not Found", { status: 404 });
  }
  // Verify dev test login secret (header or query param)
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-dev-login-secret") || url.searchParams.get("token") || "";
  if (process.env.DEV_TEST_LOGIN_SECRET && provided !== process.env.DEV_TEST_LOGIN_SECRET) {
    return new NextResponse("Not Found", { status: 404 });
  }
  await prisma.user.upsert({
    where: { netId: "testuser" },
    update: {},
    create: { netId: "testuser", name: "Test User", email: "test.user@yale.edu" },
  });

  // Mint existing JWT with createJWT and set the same cookie name used by getUserNetIdFromCookies ("auth")
  const jwt = await createJWT("Test", "User", "test.user@yale.edu", "testuser");

  const res = NextResponse.redirect(`${baseUrl}/feed`);
  res.cookies.set("auth", jwt, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: baseUrl.startsWith("https"),
    maxAge: 60 * 60, //for nikita
  });

  return res;
}

export async function GET(req: Request) {
  return testLoginHandler(req);
}

export const config = {
  api: { bodyParser: false },
};
