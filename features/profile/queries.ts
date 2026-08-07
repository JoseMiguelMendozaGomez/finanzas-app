import { prisma } from "@/lib/prisma/client";

export async function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true },
  });
}
