import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "E-mail já cadastrado" }, { status: 409 });
  }

  const hashed = await hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });

  await prisma.category.createMany({
    data: [
      { name: "Salário", type: "INCOME", color: "#10b981", userId: user.id },
      { name: "Alimentação", type: "EXPENSE", color: "#f97316", userId: user.id },
      { name: "Transporte", type: "EXPENSE", color: "#3b82f6", userId: user.id }
    ]
  });

  return NextResponse.json({ message: "Conta criada com sucesso" }, { status: 201 });
}
