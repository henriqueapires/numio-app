import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { monthlyLimit: true },
  });
  return NextResponse.json({ monthlyLimit: user?.monthlyLimit ?? null });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { monthlyLimit } = (await request.json()) as { monthlyLimit: number };
  if (monthlyLimit < 0) {
    return NextResponse.json({ error: "Limite deve ser ≥ 0" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { monthlyLimit },
  });
  return NextResponse.json({ monthlyLimit: user.monthlyLimit });
}
