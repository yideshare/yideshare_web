import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserFromCookies } from "@/lib/user";

export async function GET() {
  const cookieStore = await cookies();
  const authResult = getUserFromCookies(cookieStore);

  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  } else {
    return NextResponse.json(authResult.user);
  }
}
