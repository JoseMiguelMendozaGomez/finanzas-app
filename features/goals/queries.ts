import { prisma } from "@/lib/prisma/client";

export async function getGoals(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return goals.map((g) => ({
    ...g,
    targetAmount: g.targetAmount.toNumber(),
    currentAmount: g.currentAmount.toNumber(),
  }));
}

export async function getGoalsSummary(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    select: { targetAmount: true, currentAmount: true },
  });

  const achieved = goals.filter((g) =>
    g.currentAmount.gte(g.targetAmount)
  ).length;

  return { count: goals.length, achieved };
}
