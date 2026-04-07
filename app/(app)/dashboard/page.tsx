"use client";

import { useEffect, useState } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { OverviewChart } from "@/components/charts/overview-chart";

type Dash = { balance: number; income: number; expense: number; monthlyExpense: number; latest: Array<{ id: string; description: string; amount: string; date: string; category: { name: string } }> };

export default function DashboardPage() {
  const [data, setData] = useState<Dash | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <p>Carregando dashboard...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
      <section className="grid md:grid-cols-4 gap-4">
        <KpiCard title="Saldo atual" value={`R$ ${data.balance.toFixed(2)}`} />
        <KpiCard title="Entradas" value={`R$ ${data.income.toFixed(2)}`} />
        <KpiCard title="Saídas" value={`R$ ${data.expense.toFixed(2)}`} />
        <KpiCard title="Gastos no mês" value={`R$ ${data.monthlyExpense.toFixed(2)}`} />
      </section>
      <OverviewChart income={data.income} expense={data.expense} />
      <section className="card p-5">
        <h3 className="font-semibold mb-4">Últimas transações</h3>
        <div className="space-y-3">
          {data.latest.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.description} · {item.category.name}</span>
              <span>R$ {Number(item.amount).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
