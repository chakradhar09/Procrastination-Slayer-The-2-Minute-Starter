import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { dbConnect } from "../../../lib/db";
import { Task } from "../../../models/Task";
import { z } from "zod";

const createSchema = z.object({
  text: z.string().min(3),
  starter: z.string().min(3),
  steps: z.array(z.string()).max(3),
  sprintLength: z.number().min(5).max(30),
  mode: z.string().default("Normal"),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(40);
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await req.json();
  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await dbConnect();
  const created = await Task.create({
    userId: session.user.id,
    ...parsed.data,
    status: "done",
    completedAt: new Date(),
  });
  return NextResponse.json({ task: created });
}
