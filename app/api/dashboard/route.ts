import { startOfMonth } from "date-fns";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await requireUser();
    const monthStart = startOfMonth(new Date());

    const [transactions, latest] = await Promise.all([
      prisma.transaction.findMany({ where: { userId: user.id } }),
      prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 5, include: { category: true } })
    ]);

    const income = transactions.filter((t) => t.type === "INCOME").reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((acc, t) => acc + Number(t.amount), 0);
    const monthlyExpense = transactions
      .filter((t) => t.type === "EXPENSE" && t.date >= monthStart)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    return NextResponse.json({
      balance: income - expense,
      income,
      expense,
      monthlyExpense,
      latest
    });
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }
}
