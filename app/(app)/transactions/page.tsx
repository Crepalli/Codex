"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };
type Tx = { id: string; description: string; amount: string; type: "INCOME" | "EXPENSE"; date: string; category: Category };

export default function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => {
    const [txRes, catRes] = await Promise.all([fetch("/api/transactions"), fetch("/api/categories")]);
    setItems(await txRes.json());
    setCategories(await catRes.json());
  };

  useEffect(() => { load(); }, []);

  async function create(formData: FormData) {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: formData.get("description"),
        amount: Number(formData.get("amount")),
        type: formData.get("type"),
        date: formData.get("date"),
        paymentMethod: formData.get("paymentMethod"),
        categoryId: formData.get("categoryId")
      })
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transações</h1>
      <form action={create} className="card p-4 grid md:grid-cols-6 gap-2">
        <input name="description" placeholder="Descrição" className="border rounded-xl p-2" required />
        <input name="amount" type="number" step="0.01" placeholder="Valor" className="border rounded-xl p-2" required />
        <select name="type" className="border rounded-xl p-2"><option value="INCOME">Entrada</option><option value="EXPENSE">Saída</option></select>
        <input name="date" type="date" className="border rounded-xl p-2" required />
        <select name="paymentMethod" className="border rounded-xl p-2"><option value="PIX">PIX</option><option value="CREDIT_CARD">Cartão crédito</option><option value="DEBIT_CARD">Cartão débito</option><option value="CASH">Dinheiro</option><option value="BANK_TRANSFER">Transferência</option><option value="OTHER">Outro</option></select>
        <select name="categoryId" className="border rounded-xl p-2" required>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button className="md:col-span-6 bg-cyan-600 text-white p-2 rounded-xl">Salvar transação</button>
      </form>
      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th>Descrição</th><th>Tipo</th><th>Categoria</th><th>Data</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t">
                <td>{t.description}</td><td>{t.type === "INCOME" ? "Entrada" : "Saída"}</td><td>{t.category.name}</td><td>{new Date(t.date).toLocaleDateString("pt-BR")}</td><td>R$ {Number(t.amount).toFixed(2)}</td>
                <td><button onClick={async () => { if (confirm("Excluir transação?")) { await fetch(`/api/transactions/${t.id}`, { method: "DELETE" }); load(); } }} className="text-red-500">Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
