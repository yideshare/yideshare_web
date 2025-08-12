import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Environment Variables Debug",
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDirectUrl: !!process.env.DIRECT_URL,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + "..." : "NOT SET",
    directUrlPrefix: process.env.DIRECT_URL ? process.env.DIRECT_URL.substring(0, 20) + "..." : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
  });
}


