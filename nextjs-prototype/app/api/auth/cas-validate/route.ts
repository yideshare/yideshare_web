import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get("ticket");

    if (!ticket) {
      console.error("CAS Error: No ticket provided");
      return NextResponse.redirect(baseUrl); 
    }

    // validate CAS ticket
    const casValidateUrl = `https://secure.its.yale.edu/cas/serviceValidate?service=${encodeURIComponent(baseUrl + "/api/auth/cas-validate")}&ticket=${ticket}`;

    // mode no-cors must be replaced before deployment!
    const CASResponse = await fetch(casValidateUrl, { "mode": "no-cors" });
    if (!CASResponse.ok) {
      console.error("CAS Request Failed:", CASResponse.status, CASResponse.statusText);
      return NextResponse.redirect(baseUrl);
    }

    const text = await CASResponse.text();
    // debug CAS response
    // console.log("CAS Response:", text);

    // extract NetID
    const match = text.match(/<cas:user>(.*?)<\/cas:user>/);
    if (!match) {
      console.error("CAS Validation Failed: No valid user found");
      return NextResponse.redirect(baseUrl);
    }

    const netID = match[1];
    console.log("Authenticated User:", netID);

    const authorizationToken = `Bearer ${process.env.YALIES_API_KEY}`;
    console.log("Authorization Token:", authorizationToken);

    const YaliesResponse = await fetch("https://api.yalies.io/v2/people", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authorizationToken,
      },
      body: JSON.stringify({
        query: "",
        filters: {
          netid: netID
        },
      }),
    });

    const YaliesData = await YaliesResponse.json();
    console.log("Yalies Data:", YaliesData[0].first_name, YaliesData[0].last_name);

    const successResponse = NextResponse.redirect(`${baseUrl}/feed`);
    successResponse.cookies.set("session", netID, { httpOnly: true, path: "/" });

    return successResponse;
  } catch (error) {
    console.error("Unexpected CAS Validation Error:", error);
    return NextResponse.redirect(process.env.NEXTAUTH_URL || "http://localhost:3000"); 
  }
}