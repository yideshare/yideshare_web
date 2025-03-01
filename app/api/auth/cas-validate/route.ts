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
    const casResponse = await fetch(casValidateUrl);
    if (!casResponse.ok) {
      console.error("CAS Request Failed:", casResponse.status, casResponse.statusText);
      return NextResponse.redirect(baseUrl);
    }

    // extract NetID
    const text = await casResponse.text();
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
    if (!YaliesData || YaliesData.length === 0) {
      console.error("Yalies API Error: No data returned for NetID", netID);
      return NextResponse.redirect(baseUrl);
    }

    const FirstName = YaliesData[0].first_name;
    const LastName = YaliesData[0].last_name;
    const Email = YaliesData[0].email;

    console.log("Authenticated User:", FirstName, LastName, Email);

    const successResponse = NextResponse.redirect(`${baseUrl}/feed`);
    successResponse.cookies.set("user", JSON.stringify({ firstName: FirstName, lastName: LastName, email: Email }), {
      httpOnly: false, // Make it accessible from the frontend
      path: "/",
    });

    return successResponse;
  } catch (error) {
    console.error("Unexpected CAS Validation Error:", error);
    return NextResponse.redirect(process.env.NEXTAUTH_URL || "http://localhost:3000"); 
  }
}