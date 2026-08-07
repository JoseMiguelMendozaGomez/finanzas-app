import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getAvatar } from "@/features/profile/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { userId } = await params;
  const avatar = await getAvatar(userId);
  if (!avatar) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  return new NextResponse(new Uint8Array(avatar.data), {
    headers: {
      "Content-Type": avatar.mimeType,
      "Cache-Control": "private, max-age=86400",
    },
  });
}
