import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { id } = params;
    await prisma.transaction.updateMany({
      where: { id, userId: user.id },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erro ao atualizar transação" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const { id } = params;
    await prisma.transaction.deleteMany({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erro ao excluir transação" }, { status: 400 });
  }
}
