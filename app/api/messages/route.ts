import { NextResponse } from "next/server";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";
import { prisma } from "@/lib/prisma"; 

async function resolveNetId(req: Request, body?: any): Promise<string> {
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const parts = cookieHeader.split(/;\s*/);
    for (const p of parts) {
      const [k, ...rest] = p.split("=");
      if (k === "user") {
        const raw = rest.join("=");
        try {
          const decoded = decodeURIComponent(raw);
          const parsed = JSON.parse(decoded);
          if (parsed?.netId && typeof parsed.netId === "string") {
            return parsed.netId as string;
          }
        } catch {
        }
      }
    }
  }

  const headerNetId = req.headers.get("x-user-netid");
  if (headerNetId) return headerNetId;

  if (body?.senderNetId) return body.senderNetId;

  throw new Error("Unauthorized: netId not found");
}

export const GET = withApiErrorHandler(async (req: Request) => {
  const netId = await resolveNetId(req);

  const latest = await prisma.message.findMany({
    where: {
      OR: [{ senderNetId: netId }, { receiverNetId: netId }],
    },
    orderBy: { timestamp: "desc" },
    take: 400, 
  });

  const summariesMap = new Map<
    string,
    {
      rideId: string;
      peerNetId: string;
      lastMessage: string;
      timestamp: string;
    }
  >();

  for (const m of latest) {
    const peer = m.senderNetId === netId ? m.receiverNetId : m.senderNetId;
    const key = `${m.rideId}::${peer}`;
    if (!summariesMap.has(key)) {
      summariesMap.set(key, {
        rideId: m.rideId,
        peerNetId: peer,
        lastMessage: m.payload,
        timestamp: m.timestamp.toISOString(),
      });
    }
  }

  const summaries = Array.from(summariesMap.values());
  return NextResponse.json({ conversations: summaries });
});

// Send a message
export const POST = withApiErrorHandler(async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  const senderNetId = await resolveNetId(req, body);

  const receiverNetId = String(body.receiverNetId ?? "").trim();
  const payload = String(body.payload ?? "").trim();
  const rideId = String(body.rideId ?? "").trim();

  if (!receiverNetId) {
    return NextResponse.json(
      { error: "receiverNetId is required" },
      { status: 400 }
    );
  }
  if (!payload) {
    return NextResponse.json({ error: "payload is required" }, { status: 400 });
  }
  if (!rideId) {
    return NextResponse.json({ error: "rideId is required" }, { status: 400 });
  }
  if (receiverNetId === senderNetId) {
    return NextResponse.json(
      { error: "Cannot send a message to yourself" },
      { status: 400 }
    );
  }

  const ride = await prisma.ride.findUnique({ where: { rideId } });
  if (!ride) {
    return NextResponse.json({ error: "rideId not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      senderNetId,
      receiverNetId,
      payload,
      rideId,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
});
