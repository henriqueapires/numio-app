import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type GoalBody = {
  title: string;
  targetAmount: number;
  dueDate: string;      
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const userId = session.user.id;

  const { title, targetAmount, dueDate } = (await request.json()) as GoalBody;

  if (
    !title ||
    typeof targetAmount !== "number" ||
    isNaN(targetAmount) ||
    targetAmount <= 0 ||
    !Date.parse(dueDate)
  ) {
    return NextResponse.json(
      { error: "Campos inválidos: cheque title, targetAmount e dueDate." },
      { status: 400 }
    );
  }

  const goal = await prisma.goal.create({
    data: {
      title,
      targetAmount,
      currentAmount: 0,
      dueDate: new Date(dueDate),
      user: { connect: { id: userId } },
    },
  });

  return NextResponse.json(goal, { status: 201 });
}
