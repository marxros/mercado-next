import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  await req.text(); // payload for future signature validation
  // TODO: validate signature
  // TODO: enqueue/process event
  return NextResponse.json({ ok: true });
}


