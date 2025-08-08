import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const serviceURL = `${baseUrl}/api/auth/cas-validate`;
  
  return NextResponse.json({
    message: "CAS Test Route",
    baseUrl,
    serviceURL,
    casLoginUrl: `/api/auth/cas-login`,
    casValidateUrl: `/api/auth/cas-validate`,
    fullServiceURL: serviceURL,
    encodedServiceURL: encodeURIComponent(serviceURL)
  });
}
