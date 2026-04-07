"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);

  const load = async () => {
    const res = await fetch("/api/categories");
    setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  async function create(formData: FormData) {
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categorias</h1>
      <form action={create} className="card p-4 grid md:grid-cols-4 gap-2">
        <input name="name" placeholder="Nome" className="border rounded-xl p-2" required />
        <select name="type" className="border rounded-xl p-2"><option value="INCOME">Entrada</option><option value="EXPENSE">Saída</option></select>
        <input name="color" placeholder="#06b6d4" className="border rounded-xl p-2" />
        <button className="bg-cyan-600 text-white rounded-xl p-2">Criar categoria</button>
      </form>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.id} className="card p-4 flex items-center justify-between">
            <div><p className="font-semibold">{c.name}</p><p className="text-sm text-slate-500">{c.type}</p></div>
            <button onClick={async () => { if (confirm("Excluir categoria?")) { await fetch(`/api/categories/${c.id}`, { method: "DELETE" }); load(); } }} className="text-red-500">Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
