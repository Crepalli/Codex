"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function OverviewChart({ income, expense }: { income: number; expense: number }) {
  const data = [
    { name: "Entradas", valor: income },
    { name: "Saídas", valor: expense }
  ];

  return (
    <div className="card p-4 h-80">
      <h3 className="font-semibold mb-4">Entradas x Saídas</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valor" fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
