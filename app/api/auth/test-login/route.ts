import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function GET() {
  // Set the same cookie as in cas-validate
  const response = NextResponse.redirect(`${BASE_URL}/feed`);
  response.cookies.set(
    "user",
    JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email: "test.user@yale.edu",
      netId: "testuser",
    }),
    { httpOnly: false, path: "/" }
  );
  return response;
}
