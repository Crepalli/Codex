import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? undefined;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const query = searchParams.get("q") ?? undefined;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: type as "INCOME" | "EXPENSE" | undefined,
        categoryId,
        description: query ? { contains: query, mode: "insensitive" } : undefined
      },
      include: { category: true },
      orderBy: { date: "desc" }
    });
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const transaction = await prisma.transaction.create({
      data: {
        description: body.description,
        amount: body.amount,
        type: body.type,
        date: new Date(body.date),
        notes: body.notes,
        paymentMethod: body.paymentMethod,
        categoryId: body.categoryId,
        userId: user.id
      }
    });
    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erro ao criar transação" }, { status: 400 });
  }
}
