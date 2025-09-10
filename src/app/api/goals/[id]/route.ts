import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const { title, targetAmount, currentAmount, dueDate } =
    (await request.json()) as {
      title?: string;
      targetAmount?: number;
      currentAmount?: number;
      dueDate?: string;
    };

  const data: Partial<{
    title: string;
    targetAmount: number;
    currentAmount: number;
    dueDate: Date;
  }> = {};
  if (title) data.title = title;
  if (typeof targetAmount === "number") data.targetAmount = targetAmount;
  if (typeof currentAmount === "number") data.currentAmount = currentAmount;
  if (dueDate && !isNaN(Date.parse(dueDate))) data.dueDate = new Date(dueDate);

  const result = await prisma.goal.updateMany({
    where: { id, userId: session.user.id },
    data,
  });
  if (result.count === 0) {
    return NextResponse.json(
      { error: "Meta não encontrada ou não pertence ao usuário." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await prisma.goal.deleteMany({
    where: { id, userId: session.user.id },
  });
  if (result.count === 0) {
    return NextResponse.json(
      { error: "Meta não encontrada ou não pertence ao usuário." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
