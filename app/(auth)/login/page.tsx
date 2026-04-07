"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) return setError("Credenciais inválidas");
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-8 space-y-4">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <input name="email" placeholder="E-mail" className="w-full border rounded-xl p-3" required />
        <input name="password" type="password" placeholder="Senha" className="w-full border rounded-xl p-3" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-cyan-600 text-white rounded-xl p-3 font-semibold">Acessar</button>
        <p className="text-sm text-center">Não tem conta? <Link href="/register" className="text-cyan-700">Cadastre-se</Link></p>
      </form>
    </main>
  );
}
