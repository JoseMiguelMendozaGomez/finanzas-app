import { prisma } from "@/lib/prisma/client";

export async function getReminders(userId: string) {
  return prisma.reminder.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
}

export async function getPendingRemindersSummary(userId: string) {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const pending = await prisma.reminder.findMany({
    where: { userId, status: "PENDING" },
    select: { dueDate: true },
  });

  const overdue = pending.filter((r) => r.dueDate < now).length;
  const upcoming = pending.filter(
    (r) => r.dueDate >= now && r.dueDate <= in7Days
  ).length;

  return { pendingCount: pending.length, overdue, upcoming };
}
