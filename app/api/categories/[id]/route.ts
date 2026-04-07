import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { id } = await params;
    const updated = await prisma.category.updateMany({
      where: { id, userId: user.id },
      data: body
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Erro ao atualizar categoria" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await prisma.category.deleteMany({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erro ao excluir categoria" }, { status: 400 });
  }
}
