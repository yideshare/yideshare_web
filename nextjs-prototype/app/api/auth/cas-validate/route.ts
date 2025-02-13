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
    const response = await fetch(casValidateUrl);
    if (!response.ok) {
      console.error("CAS Request Failed:", response.status, response.statusText);
      return NextResponse.redirect(baseUrl);
    }

    const text = await response.text();
    console.log("CAS Response:", text); // debug CAS response

    // extract NetID
    const match = text.match(/<cas:user>(.*?)<\/cas:user>/);
    if (!match) {
      console.error("CAS Validation Failed: No valid user found");
      return NextResponse.redirect(baseUrl);
    }

    const netID = match[1];
    console.log("Authenticated User:", netID);

    const res = NextResponse.redirect(`${baseUrl}/feed`);
    res.cookies.set("session", netID, { httpOnly: true, path: "/" });

    return res;
  } catch (error) {
    console.error("Unexpected CAS Validation Error:", error);
    return NextResponse.redirect(process.env.NEXTAUTH_URL || "http://localhost:3000"); 
  }
}