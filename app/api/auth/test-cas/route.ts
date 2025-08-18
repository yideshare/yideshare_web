import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const SERVICE_URL = `${BASE_URL}/api/auth/cas-validate`;

export async function GET() {
  return NextResponse.json({
    message: "CAS Test Route",
    baseUrl: BASE_URL,
    serviceURL: SERVICE_URL,
    casLoginUrl: `/api/auth/cas-login`,
    casValidateUrl: `/api/auth/cas-validate`,
    fullServiceURL: SERVICE_URL,
    encodedServiceURL: encodeURIComponent(SERVICE_URL)
  });
}
