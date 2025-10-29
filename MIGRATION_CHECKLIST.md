## Vite → Next.js Migration Checklist (connect-alagoas → mercado-next)

### 0. Preparação
- [x] Conferir Node/PNPM/NPM/Yarn compatíveis e instalar deps do `mercado-next`.
- [ ] Atualizar `README.md` com comandos de dev/build.
- [ ] Criar branch de migração.

### 1. Dependências e Stack
- [x] Instalar libs usadas no Vite que seguiremos usando: `@tanstack/react-query`, `zod`, `clsx`, `tailwind-merge`, `next-themes`, `lucide-react`, `tailwindcss-animate`.
- [x] Remover/evitar `react-router-dom` (será substituído por filesystem router do Next).
- [x] Validar Tailwind v4 (postcss + globals).

### 2. Public Assets e Env
- [x] Copiar `connect-alagoas/public/**` → `mercado-next/public/**`.
- [x] Revisar caminhos de assets (root-relative `/...`).
- [x] Migrar `.env` → `.env.local` e prefixar variáveis cliente com `NEXT_PUBLIC_`.
- [x] Atualizar `.env.example`.

### 3. Estrutura e Providers
- [x] Criar `src/shared/providers/Providers.tsx` (client) com `next-themes` + React Query.
- [x] Registrar `Providers` em `app/layout.tsx`.
- [x] Extrair utilitários para `src/shared` e módulos para `src/modules` quando aplicável.

### 4. Rotas e Páginas
- [x] Mapear `connect-alagoas/src/pages/**` → `app/**/page.tsx` (index, nested, dinâmicas `[id]`, catch-all `[...slug]`).
- [x] Criar `loading.tsx` e `error.tsx` por rota onde necessário.
- [x] Converter `App.tsx` responsabilidades para `app/layout.tsx`.
- [x] Trocar `Link`/`useNavigate` por `next/link` e `next/navigation`.
 - [x] Implementar Meus Pedidos, Pedido e Rastrear.

### 5. Componentes e Contextos
- [x] Mover `src/components/**` mantendo separação Server/Client (adicionar `"use client"` onde houver hooks/efeitos/eventos).
- [x] Migrar `src/contexts/**` para Providers client-side ou contextos locais aos módulos.
- [x] Validar hooks (`src/hooks/**`) usados apenas em Client Components.
 - [x] Aplicar guardas de rota client-side (`RequireAuth`) para páginas protegidas.

### 6. Data Fetching e API
- [x] Mover chamadas HTTP para Server Components ou Route Handlers (`app/api/**`).
- [x] Definir revalidação: `export const revalidate` ou `fetch(..., { next: { revalidate } })`.
- [x] Marcar rotas dinâmicas conforme necessário: `export const dynamic = "force-dynamic"`.
- [x] Considerar `runtime = "edge"` para leituras simples.
- [ ] Formular validação de entrada/saída com `zod` (implementar conforme integração API).

### 7. UI Stack
- [x] Configurar `src/components/ui` (shadcn/ui) alinhado ao Tailwind v4.
- [x] Garantir Radix UI como base de acessibilidade quando necessário.
- [x] Padronizar ícones com `lucide-react`.
 - [x] Home/Catálogo/Produto com UI mínima e `next/image`.
 - [x] Mapa de Produtores (Leaflet) como Client Component.

### 8. Limpeza e Ajustes
- [x] Remover `main.tsx`, `App.tsx` e arquivos Vite obsoletos no contexto Next (não aplicável — projeto novo).
- [x] Revisar imports absolutos via `tsconfig.json` paths.
- [x] Corrigir referências a browser-only APIs em Server Components (mover para Client ou `use client` — Leaflet fixado).

### 11. Alinhamento ao NEXT_GUIDE
- [x] Mover estrutura para `src/*` (inclui `src/app`, `src/components`, `src/components-client`, `src/lib`, `src/styles`).
- [x] Configurar alias `@/*` no `tsconfig.json` e ajustar imports.
- [x] Atualizar `next.config.ts` com `experimental.serverActions` e `images.remotePatterns` (conforme guia).
- [ ] Minimizar providers globais (apenas os necessários no `app/layout.tsx`).

### 11. Formulários e Validação
- [x] Ajustar formulários com `react-hook-form` + `zod` (login, checkout).

### 9. Qualidade, Segurança e Observabilidade
- [x] Rodar lint e typecheck — fixar erros.
- [x] Tratar erros com `error.tsx` e logging estruturado (sem vazar dados sensíveis).
- [ ] Revisar CORS, rate limiting e sanitização (se houver rotas API).
- [x] Criar webhook mínimo em `app/api/webhooks/payments`.
- [x] Adicionar `react-hook-form` e validar formulários no server com zod.
- [x] Testar builds de produção (`npm run build`).
- [x] Configurar edge runtime em API routes onde aplicável.

### 10. QA e Entrega
- [ ] Rodar app, validar UX principal, navegação e temas.
- [ ] Verificar métricas básicas (CWV) e regressões visuais relevantes.
- [x] Atualizar `README.md` com mudanças de execução e variáveis de ambiente.
- [ ] Conectar à API real do backend e testar fluxos completos (login, carrinho, checkout).
- [ ] Implementar autenticação real no AuthProvider (substituir mocks).
- [ ] Testar funcionalidades admin (dashboard, produtos, pedidos) com dados reais.


