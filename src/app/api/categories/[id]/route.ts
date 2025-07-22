import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { CategoryType } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { name, type } = await request.json() as { name?: string; type?: CategoryType };
  if (type && ![CategoryType.INCOME, CategoryType.EXPENSE].includes(type)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const result = await prisma.category.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: { name, type },
  });
  if (result.count === 0) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.category.deleteMany({
    where: { id: params.id, userId: session.user.id },
  });
  return NextResponse.json({ success: true });
}
