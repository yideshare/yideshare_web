import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";
import { prisma } from "@/lib/prisma";

// Resolve the current user's netId from CAS cookie, x-user-netid header, or body fallback
async function resolveNetId(req: Request, body?: any): Promise<string> {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(/;\s*/)
      .filter(Boolean)
      .map((p) => {
        const idx = p.indexOf("=");
        if (idx === -1) return [p, ""] as const;
        return [p.substring(0, idx), p.substring(idx + 1)] as const;
      })
  );

  const userRaw = cookies["user"];
  const sigRaw = cookies["user_sig"];
  if (userRaw && sigRaw) {
    try {
      const decoded = decodeURIComponent(userRaw);
      const secret = process.env.COOKIE_SECRET || "dev-cookie-secret";
      const expected = createHmac("sha256", secret).update(decoded).digest("hex");
      if (expected === sigRaw) {
        const parsed = JSON.parse(decoded);
        if (parsed?.netId && typeof parsed.netId === "string") {
          return parsed.netId as string;
        }
      }
    } catch {}
  }

  if (process.env.NODE_ENV !== "production") {
    const headerNetId = req.headers.get("x-user-netid");
    if (headerNetId) return headerNetId;
    if (body?.senderNetId) return body.senderNetId;
  }

  throw new ApiError("Unauthorized: netId not found or signature invalid", 401);
}

export const GET = withApiErrorHandler(async (req: Request) => {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const peerNetId = decodeURIComponent(parts[parts.length - 1]);
  const rideId = decodeURIComponent(parts[parts.length - 2]);

  const netId = await resolveNetId(req);

  const search = url.searchParams;
  const take = Math.min(Math.max(Number(search.get("take") ?? 50), 1), 100);
  const before = search.get("before");

  const baseWhere: any = {
    rideId,
    OR: [
      { senderNetId: netId, receiverNetId: peerNetId },
      { senderNetId: peerNetId, receiverNetId: netId },
    ],
  };

  const where: any = before && !Number.isNaN(Date.parse(before))
    ? { ...baseWhere, timestamp: { lt: new Date(before) } }
    : baseWhere;

  const rows = await prisma.message.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take,
  });

  const messages = rows.slice().reverse();
  const nextCursor = rows.length === take ? rows[rows.length - 1].timestamp.toISOString() : null;

  return NextResponse.json({ messages, nextCursor });
});

export const POST = withApiErrorHandler(async (req: Request) => {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const peerNetId = decodeURIComponent(parts[parts.length - 1]);
  const rideId = decodeURIComponent(parts[parts.length - 2]);

  const body = await req.json().catch(() => ({}));
  const senderNetId = await resolveNetId(req, body);
  const payload = String(body?.payload ?? "").trim();

  if (!payload) throw new ApiError("payload is required", 400);
  if (!rideId) throw new ApiError("rideId is required", 400);
  if (peerNetId === senderNetId) throw new ApiError("Cannot message yourself", 400);

  const ride = await prisma.ride.findUnique({ where: { rideId } });
  if (!ride) throw new ApiError("rideId not found", 404);

  const receiver = await prisma.user.findUnique({ where: { netId: peerNetId } });
  if (!receiver) throw new ApiError("receiverNetId not found", 404);

  const message = await prisma.message.create({
    data: {
      senderNetId,
      receiverNetId: peerNetId,
      rideId,
      payload,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
});
