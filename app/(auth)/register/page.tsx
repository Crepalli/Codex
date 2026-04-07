"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message);
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-8 space-y-4">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <input name="name" placeholder="Nome" className="w-full border rounded-xl p-3" required />
        <input name="email" placeholder="E-mail" className="w-full border rounded-xl p-3" required />
        <input name="password" type="password" placeholder="Senha" className="w-full border rounded-xl p-3" required minLength={6} />
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <button className="w-full bg-cyan-600 text-white rounded-xl p-3 font-semibold">Cadastrar</button>
        <p className="text-sm text-center">Já tem conta? <Link href="/login" className="text-cyan-700">Entrar</Link></p>
      </form>
    </main>
  );
}
