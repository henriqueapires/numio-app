import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CategoryType } from "@prisma/client";

type RouteParams = { id: string };

export async function PUT(
  request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { name, type } = (await request.json()) as {
    name?: string;
    type?: CategoryType;
  };

  if (type && ![CategoryType.INCOME, CategoryType.EXPENSE].includes(type)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const result = await prisma.category.updateMany({
    where: { id, userId: session.user.id },
    data: { name, type },
  });

  if (result.count === 0)
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.category.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
