import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { dbConnect } from "../../../../lib/db";
import { Task } from "../../../../models/Task";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  await Task.deleteOne({ _id: params.id, userId: session.user.id });
  return NextResponse.json({ ok: true });
}
