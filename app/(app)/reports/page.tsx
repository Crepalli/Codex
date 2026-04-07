"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

type Report = { income: number; expense: number; balance: number; categories: Array<{ category: string; total: number }> };

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = async () => {
    const q = new URLSearchParams();
    if (from) q.append("from", from);
    if (to) q.append("to", to);
    const res = await fetch(`/api/reports?${q.toString()}`);
    setReport(await res.json());
  };

  useEffect(() => { load(); }, []);

  if (!report) return <p>Carregando relatório...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Relatórios</h1>
      <div className="card p-4 flex gap-2 items-end">
        <div><label className="text-sm">De</label><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-xl p-2 block" /></div>
        <div><label className="text-sm">Até</label><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded-xl p-2 block" /></div>
        <button onClick={load} className="bg-cyan-600 text-white rounded-xl px-4 py-2">Filtrar</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4"><p>Entradas</p><p className="font-bold text-2xl">R$ {report.income.toFixed(2)}</p></div>
        <div className="card p-4"><p>Saídas</p><p className="font-bold text-2xl">R$ {report.expense.toFixed(2)}</p></div>
        <div className="card p-4"><p>Saldo</p><p className="font-bold text-2xl">R$ {report.balance.toFixed(2)}</p></div>
      </div>
      <div className="card p-4 h-80">
        <h3 className="font-semibold mb-4">Gastos por categoria</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={report.categories} dataKey="total" nameKey="category" outerRadius={110}>
              {report.categories.map((_, i) => <Cell key={i} fill={["#06b6d4", "#0ea5e9", "#14b8a6", "#f97316", "#a855f7", "#e11d48"][i % 6]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
