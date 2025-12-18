import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../lib/db";
import { User } from "../../../models/User";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { email, password, name } = parsed.data;

  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });
  return NextResponse.json({ id: user._id, email: user.email, name: user.name });
}
