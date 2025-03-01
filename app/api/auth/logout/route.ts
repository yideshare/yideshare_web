import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.redirect(`http://localhost:3000`);
}