# FinTrack Pro

Aplicação web completa de controle financeiro pessoal com autenticação, dashboard analítico, CRUD de transações/categorias e relatórios.

## Stack
- Next.js 15 + React 19
- NextAuth (credenciais)
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- Recharts

## Funcionalidades
- Cadastro e login com hash de senha (bcrypt).
- Isolamento total de dados por usuário.
- Dashboard com KPIs de saldo, entradas, saídas e gastos do mês.
- CRUD de transações com exclusão confirmada.
- CRUD de categorias.
- Relatórios por período e gráfico por categoria.
- Estrutura escalável (componentes, APIs, Prisma, serviços).

## Estrutura

```bash
app/
  (auth)/login, register
  (app)/dashboard, transactions, categories, reports
  api/
components/
lib/
prisma/
```

## Como rodar localmente

1. Instale dependências:
```bash
npm install
```

2. Configure variáveis:
```bash
cp .env.example .env
```

3. Suba um PostgreSQL local (ex: Docker):
```bash
docker run --name fintrack-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fintrack -p 5432:5432 -d postgres:16
```

4. Rode migration e generate:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. (Opcional) Popular base com dados de demonstração:
```bash
npm run prisma:seed
```

6. Inicie o projeto:
```bash
npm run dev
```

## Usuário demo (seed)
- email: `demo@fintrack.com`
- senha: `123456`

## Próximos passos sugeridos
- Tema dark/light
- Upload de avatar e perfil
- Metas e contas com telas próprias
- Exportação PDF/CSV
- Testes E2E com Playwright


## Deploy na Vercel
- Este projeto está configurado com ESLint 8 + `.eslintrc.json` para compatibilidade com o pipeline de build da Vercel/Next.
- Com isso, evita-se o erro: `Failed to patch ESLint because the calling module was not recognized`.
