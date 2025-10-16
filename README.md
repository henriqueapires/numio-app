# Numio — controle de gastos e finanças pessoais

Aplicação web para gestão de finanças pessoais. Cadastre **transações**, **categorias** (receitas e despesas), **metas**, visualize **gráficos**, ative **dark mode** e defina **limite mensal** com alerta quando passar do teto.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-336791)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth-000)
![TanStack Query](https://img.shields.io/badge/Data-TanStack%20Query-FF4154)
![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-111827)
![License](https://img.shields.io/badge/license-MIT-green)

Deploy link: https://numioapp.vercel.app

---

## ✨ Funcionalidades

- **Autenticação** (NextAuth) via credenciais
- **Transações**: criar, listar, editar e excluir (com categoria e data)
- **Categorias** (INCOME/EXPENSE) com validações
- **Metas** (goals) com progresso e data-alvo
- **Limite mensal** de gastos com barra de progresso e **alerta de estouro**
- **Gráficos**: fluxo de saldo e despesas por categoria
- **Dark mode** (next-themes)
- UI com **shadcn/ui** + Tailwind
- Data-fetching com **TanStack Query**

---

## 🧱 Stack

- **Frontend/SSR**: Next.js 15 (App Router) + TypeScript  
- **UI**: TailwindCSS + shadcn/ui + lucide-react  
- **Auth**: NextAuth (JWT)  
- **Data**: Prisma ORM + PostgreSQL  
- **State/Data**: TanStack Query  

---

## 🗂️ Estrutura (resumo)

```
src/
  app/
    api/
      auth/[...nextauth]/
      categories/ (GET, POST)
      categories/[id]/ (PUT, DELETE)
      transactions/ (GET, POST)
      transactions/[id]/ (PUT, DELETE)
      goals/ (GET, POST)
      goals/[id]/ (PUT, DELETE)
      user/limit/ (GET, PUT)
    dashboard/
  components/
    (UI shadcn, modais e gráficos)
  hooks/
    useCategories.ts, useTransactions.ts, useGoals.ts, ...
prisma/
  schema.prisma
  migrations/
```

---

## ⚙️ Requisitos

- Node 18+  
- PostgreSQL (local **ou** remoto)  
- Prisma CLI (`npx prisma -v`)  

---

## 🔐 Variáveis de ambiente

Crie `.env.local` (ou `.env`) com:

```env
# Banco (use o pooled quando for serverless)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require&pgbouncer=true"

# NextAuth
NEXTAUTH_SECRET="gere_um_hash_forte_aqui"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

> Em produção (Vercel), defina as mesmas variáveis em *Project → Settings → Environment Variables*.

---

## 🗃️ Banco de dados

Gerar client e aplicar migrations:

```bash
npx prisma generate
npx prisma migrate dev -n init
```

(Usando banco **remoto**? Rode em vez disso:)

```bash
npx prisma migrate deploy
```

Visualizar dados:

```bash
npx prisma studio
```

**Seed (opcional)**: crie `prisma/seed.ts` e rode `npx prisma db seed`.

> **Usuário inicial**: como a auth é por credenciais, você pode criar o usuário via *Prisma Studio* (tabela `User`), definindo `email`, `name` e `passwordHash` (gerado por `bcryptjs`).  

---

## ▶️ Executar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

---

## 🚀 Deploy (Vercel + Neon)

1. Crie um Postgres **remoto** no [Neon](https://neon.tech) (free).  
   - Copie a **pooled connection string** e use como `DATABASE_URL`.
2. No seu projeto:
   ```bash
   npx prisma migrate deploy   # aplica migrations no banco remoto
   ```
3. Suba o código no GitHub e importe na [Vercel](https://vercel.com/import).  
4. Em **Environment Variables (Production)** defina:
   - `DATABASE_URL` (pooled do Neon)  
   - `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)  
   - `NEXTAUTH_URL=https://seu-dominio.vercel.app`  
   - `AUTH_TRUST_HOST=true`
5. Confirme que seu `package.json` tem:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "postinstall": "prisma generate"
     }
   }
   ```
6. Deploy 🎉

> Se adicionar novas migrations no futuro, rode **novamente** `npx prisma migrate deploy` apontando para o mesmo banco remoto.

---

## 🧭 Rotas de API (resumo)

- **Auth**  
  `POST /api/auth/callback/credentials` (NextAuth)
- **Categorias**  
  `GET /api/categories` — lista  
  `POST /api/categories` — cria  
  `PUT /api/categories/:id` — atualiza  
  `DELETE /api/categories/:id` — remove
- **Transações**  
  `GET /api/transactions` — lista  
  `POST /api/transactions` — cria  
  `PUT /api/transactions/:id` — atualiza  
  `DELETE /api/transactions/:id` — remove
- **Metas**  
  `GET /api/goals` — lista  
  `POST /api/goals` — cria  
  `PUT /api/goals/:id` — atualiza  
  `DELETE /api/goals/:id` — remove
- **Limite mensal**  
  `GET /api/user/limit` — retorna `{ monthlyLimit }`  
  `PUT /api/user/limit` — atualiza `{ monthlyLimit }`

> Todas as rotas (exceto auth) exigem sessão válida.

---

## 🔒 Notas de produção

- Use **connection pooling** (PgBouncer) no Postgres serverless.  
- Mantenha `NEXTAUTH_URL` e `NEXTAUTH_SECRET` definidos.  
- Evite `edge` runtime nas rotas que usam Prisma.  
- Prefira `migrate deploy` (nunca `migrate dev`) no banco remoto.

---

## 📌 Roadmap

- [ ] Multi-carteiras/contas  
- [ ] Transações recorrentes  
- [ ] Upload de comprovantes (storage)  
- [ ] Exportar CSV/OFX  
- [ ] PWA/Offline first

---

## 🤝 Contribuição

1. Faça um fork  
2. Crie um branch: `feat/minha-ideia`  
3. Commit: `feat: descrição curta`  
4. PR com print/descrição do que mudou

---

## 📄 Licença

MIT — sinta-se livre para usar e melhorar.

---

## 👤 Autor

**Henrique Alves Pires**  
Site: https://henriquepires.vercel.app  
Email: henrique.apires@outlook.com

