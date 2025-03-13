import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { bookmarkRide } from "@/lib/utils/ride";
import { validateRequestPayload } from "@/lib/utils/validate";
import { getAuthenticatedUser } from "@/lib/utils/user";

export async function POST(req: Request) {
  try {
    // get cookies
    const cookieStore = await cookies();
    // get authenticated user
    const authResult = await getAuthenticatedUser(cookieStore);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // validate request payload
    const payloadResult = await validateRequestPayload(req);
    if ("error" in payloadResult) {
      return NextResponse.json(
        { error: payloadResult.error },
        { status: payloadResult.status }
      );
    }

    // toggle the bookmark
    const { netID } = authResult.user;
    const { rideId } = payloadResult;
    const result = await bookmarkRide(netID, rideId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("DB BOOKMARK Error:", error);
    return NextResponse.json(
      { error: `Error bookmarking ride: ${error}` },
      { status: 500 }
    );
  }
}
