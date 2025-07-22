import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";

type TransactionBody = {
  amount: number;
  date: string;         
  description?: string;
  categoryId: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { amount, date, description, categoryId } = (await request.json()) as {
    amount: number;
    date: string;
    description?: string;
    categoryId: string;
  };

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { type: true },
  });
  if (!category) {
    return NextResponse.json({ error: "Categoria não encontrada" }, { status: 400 });
  }

  const finalAmount =
    category.type === CategoryType.EXPENSE ? -Math.abs(amount) : Math.abs(amount);

  const tx = await prisma.transaction.create({
    data: {
      amount: finalAmount,
      date: new Date(date),
      description,
      category: { connect: { id: categoryId } },
      user: { connect: { id: session.user.id } },
    },
    include: {
      category: true,
    },
  });

  return NextResponse.json(tx, { status: 201 });
}