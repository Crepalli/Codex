import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-white p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-slate-900">FinTrack Pro</h1>
        <p className="text-slate-600 text-lg">Controle financeiro pessoal com visual profissional, relatórios inteligentes e segurança.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-semibold">Entrar</Link>
          <Link href="/register" className="px-6 py-3 rounded-xl border border-slate-300 bg-white font-semibold">Criar conta</Link>
        </div>
      </div>
    </main>
  );
}
