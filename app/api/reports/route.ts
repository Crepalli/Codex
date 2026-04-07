import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined
        }
      },
      include: { category: true }
    });

    const grouped = Object.values(
      transactions.reduce<Record<string, { category: string; total: number }>>((acc, item) => {
        const key = item.category.name;
        acc[key] = acc[key] || { category: key, total: 0 };
        if (item.type === "EXPENSE") acc[key].total += Number(item.amount);
        return acc;
      }, {})
    ).sort((a, b) => b.total - a.total);

    const income = transactions.filter((t) => t.type === "INCOME").reduce((a, t) => a + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((a, t) => a + Number(t.amount), 0);

    return NextResponse.json({ income, expense, balance: income - expense, categories: grouped.slice(0, 8) });
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }
}
