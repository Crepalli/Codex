import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("123456", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@fintrack.com" },
    update: {},
    create: { name: "Demo User", email: "demo@fintrack.com", password }
  });

  const salary = await prisma.category.upsert({
    where: { id: "seed-salary" },
    update: {},
    create: { id: "seed-salary", name: "Salário", type: "INCOME", color: "#10b981", userId: user.id }
  });

  const food = await prisma.category.upsert({
    where: { id: "seed-food" },
    update: {},
    create: { id: "seed-food", name: "Alimentação", type: "EXPENSE", color: "#f97316", userId: user.id }
  });

  await prisma.transaction.createMany({
    data: [
      { description: "Salário mensal", amount: 5000, type: "INCOME", date: new Date(), paymentMethod: "BANK_TRANSFER", categoryId: salary.id, userId: user.id },
      { description: "Supermercado", amount: 420, type: "EXPENSE", date: new Date(), paymentMethod: "CREDIT_CARD", categoryId: food.id, userId: user.id }
    ]
  });
}

main().finally(async () => prisma.$disconnect());
