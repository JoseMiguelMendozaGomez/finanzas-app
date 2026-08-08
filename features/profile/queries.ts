import { prisma } from "@/lib/prisma/client";

export async function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      avatar: { select: { updatedAt: true } },
    },
  });
}

export async function getAvatar(userId: string) {
  return prisma.userAvatar.findUnique({
    where: { userId },
    select: { data: true, mimeType: true },
  });
}
