import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("SESSION NA ROTA /api/categories:", session);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const userId = session.user.id;

  const { name, type } = (await request.json()) as {
    name: string;
    type: CategoryType;
  };

  if (!name || ![CategoryType.INCOME, CategoryType.EXPENSE].includes(type)) {
    return NextResponse.json(
      { error: "Nome e tipo (INCOME ou EXPENSE) são obrigatórios" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
      type,
      userId,     
    },
  });

  return NextResponse.json(category, { status: 201 });
}
