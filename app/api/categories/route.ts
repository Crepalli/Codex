import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await requireUser();
    const categories = await prisma.category.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        color: body.color,
        icon: body.icon,
        userId: user.id
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erro ao criar categoria" }, { status: 400 });
  }
}
