import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { bookmarkRide } from "@/lib/utils/ride";
import { validateRequestPayload } from "@/lib/utils/validate";
import { getAuthUserFromCookies } from "@/lib/utils/user";

export async function POST(req: Request) {
  try {
    // get authenticated user
    const cookieStore = await cookies();
    const authResult = await getAuthUserFromCookies(cookieStore);

    if ("error" in authResult)
      throw new Error(`${authResult.error}, status code ${authResult.status}`);

    // validate request payload
    const payloadResult = await validateRequestPayload(req);
    if ("error" in payloadResult)
      throw new Error(
        `${payloadResult.error}, status code ${payloadResult.status}`
      );

    // toggle the bookmark
    const { netId } = authResult.user;
    const { rideId } = payloadResult;
    const result = await bookmarkRide(netId, rideId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Bookmark Error:", error);
    return NextResponse.json(
      { error: `Failed to bookmark ride: ${error}` },
      { status: 500 }
    );
  }
}
