import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/user=([^;]*)/);

  if (!match) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const userData = JSON.parse(decodeURIComponent(match[1]));
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: "Invalid user data" }, { status: 500 });
  }
}
