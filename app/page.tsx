import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import { dbConnect } from "../lib/db";
import { Task } from "../models/Task";
import { Dashboard } from "../components/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  await dbConnect();
  const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(30).lean();
  const serialised = tasks.map((t) => ({
    ...t,
    _id: t._id.toString(),
    createdAt: t.createdAt?.toISOString?.() || "",
    completedAt: t.completedAt?.toISOString?.() || "",
  }));
  return <Dashboard initialTasks={serialised} userName={session.user?.name || "friend"} />;
}
